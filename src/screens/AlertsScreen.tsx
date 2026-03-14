import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { TrendingDown, Shield, Cpu, Network, AlertTriangle, Pause, Play, Trash2, X } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { initialAlerts, generateNewAlert } from '../data/mockData';
import { alertTypeConfig, severityColors, brandColors } from '../theme/colors';
import { sendAlertNotification } from '../services/notifications';
import type { Alert as AlertType } from '../types';

const iconMap: Record<string, any> = {
    trust_update: TrendingDown,
    policy_violation: Shield,
    status_change: Cpu,
    graph_anomaly: Network,
    new_incident: AlertTriangle,
};

// Source layer mapping for filtering
const alertSourceMap: Record<string, string> = {
    trust_update: 'L1',
    graph_anomaly: 'L1',
    policy_violation: 'L2',
    status_change: 'L3',
    new_incident: 'IOC',
};

type SourceFilter = 'All' | 'L1' | 'L2' | 'L3' | 'IOC';

export default function AlertsScreen() {
    const { colors } = useTheme();
    const [alerts, setAlerts] = useState<AlertType[]>(initialAlerts);
    const [paused, setPaused] = useState(false);
    const [sourceFilter, setSourceFilter] = useState<SourceFilter>('All');
    const [contextAlert, setContextAlert] = useState<AlertType | null>(null);
    const [suppressedTypes, setSuppressedTypes] = useState<Set<string>>(new Set());
    const flatListRef = useRef<FlatList>(null);

    // Auto-generate alerts (simulates WebSocket stream)
    useEffect(() => {
        if (paused) return;
        const interval = setInterval(() => {
            const newAlert = generateNewAlert();
            // Don't add suppressed alerts
            if (suppressedTypes.has(`${newAlert.type}_${newAlert.deviceId}`)) return;
            setAlerts(prev => [newAlert, ...prev].slice(0, 100));
            if (newAlert.severity === 'critical' || newAlert.severity === 'warning') {
                sendAlertNotification(newAlert);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [paused, suppressedTypes]);

    const handleClear = () => setAlerts([]);

    const handleSuppress = (alert: AlertType) => {
        const key = `${alert.type}_${alert.deviceId}`;
        setSuppressedTypes(prev => new Set(prev).add(key));
        setContextAlert(null);
        // Auto-remove after 1 hour
        setTimeout(() => {
            setSuppressedTypes(prev => {
                const next = new Set(prev);
                next.delete(key);
                return next;
            });
        }, 3600000);
    };

    // Filter by source layer
    const filteredAlerts = sourceFilter === 'All'
        ? alerts
        : alerts.filter(a => alertSourceMap[a.type] === sourceFilter);

    const sourceFilters: { id: SourceFilter; label: string; color: string }[] = [
        { id: 'All', label: 'All', color: brandColors.orange },
        { id: 'L1', label: 'Network', color: '#1A56DB' },
        { id: 'L2', label: 'UEBA', color: '#7E3AF2' },
        { id: 'L3', label: 'Correlated', color: '#E02424' },
        { id: 'IOC', label: 'IOC', color: '#FF5A1F' },
    ];

    const renderAlert = ({ item }: { item: AlertType }) => {
        const typeConf = alertTypeConfig[item.type] || { color: '#8B8FA3', label: item.type };
        const sevConf = severityColors[item.severity] || severityColors.info;
        const Icon = iconMap[item.type] || AlertTriangle;

        return (
            <TouchableOpacity
                style={[styles.alertCard, { backgroundColor: sevConf.bg, borderColor: sevConf.border }]}
                onLongPress={() => setContextAlert(item)}
                activeOpacity={0.7}
                delayLongPress={400}
            >
                <View style={[styles.iconBox, { backgroundColor: typeConf.color + '20' }]}>
                    <Icon size={16} color={typeConf.color} />
                </View>
                <View style={styles.alertContent}>
                    <View style={styles.alertHeader}>
                        <Text style={[styles.alertType, { color: typeConf.color }]}>{typeConf.label}</Text>
                        <Text style={[styles.alertDeviceId, { color: colors.muted }]}>{item.deviceId}</Text>
                    </View>
                    <Text style={[styles.alertMessage, { color: colors.text }]} numberOfLines={2}>{item.message}</Text>
                    <View style={styles.alertFooter}>
                        <View style={[styles.severityPill, { backgroundColor: sevConf.color + '20', borderColor: sevConf.color + '40' }]}>
                            <Text style={[styles.severityText, { color: sevConf.color }]}>{item.severity.toUpperCase()}</Text>
                        </View>
                        <View style={[styles.sourcePill, { backgroundColor: (alertSourceMap[item.type] ? '#1A56DB' : '#8B8FA3') + '15' }]}>
                            <Text style={[styles.sourceText, { color: '#8B8FA3' }]}>{alertSourceMap[item.type] || '—'}</Text>
                        </View>
                        <Text style={[styles.alertTime, { color: colors.muted }]}>
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Controls */}
            <View style={[styles.controlBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.controlLeft}>
                    <View style={[styles.liveDot, { backgroundColor: paused ? '#8B8FA3' : '#4BDE80' }]} />
                    <Text style={[styles.liveText, { color: paused ? '#8B8FA3' : '#4BDE80' }]}>{paused ? 'Paused' : 'Live'}</Text>
                    <Text style={[styles.countBadge, { color: colors.muted }]}>{filteredAlerts.length}</Text>
                </View>
                <View style={styles.controlRight}>
                    <TouchableOpacity style={[styles.controlBtn, { backgroundColor: paused ? 'rgba(75,222,128,0.12)' : 'rgba(255,179,71,0.12)' }]} onPress={() => setPaused(!paused)}>
                        {paused ? <Play size={16} color="#4BDE80" /> : <Pause size={16} color="#FFB347" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.controlBtn, { backgroundColor: 'rgba(255,76,76,0.12)' }]} onPress={handleClear}>
                        <Trash2 size={16} color="#FF4C4C" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Source Filter Chips */}
            <View style={[styles.filterBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {sourceFilters.map(sf => (
                    <TouchableOpacity
                        key={sf.id}
                        style={[styles.filterChip, {
                            backgroundColor: sourceFilter === sf.id ? sf.color + '15' : 'transparent',
                            borderColor: sourceFilter === sf.id ? sf.color + '30' : colors.border,
                        }]}
                        onPress={() => setSourceFilter(sf.id)}
                    >
                        <Text style={[styles.filterChipText, {
                            color: sourceFilter === sf.id ? sf.color : colors.muted,
                        }]}>{sf.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Alert Stream */}
            <FlatList
                ref={flatListRef}
                data={filteredAlerts}
                keyExtractor={item => item.id}
                renderItem={renderAlert}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <AlertTriangle size={32} color={colors.muted} />
                        <Text style={[styles.emptyText, { color: colors.muted }]}>No alerts</Text>
                    </View>
                }
            />

            {/* Long-press Context Menu */}
            <Modal visible={contextAlert !== null} transparent animationType="fade" onRequestClose={() => setContextAlert(null)}>
                <Pressable style={styles.modalOverlay} onPress={() => setContextAlert(null)}>
                    <View style={[styles.contextMenu, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.contextHeader}>
                            <Text style={[styles.contextTitle, { color: colors.text }]}>Alert Actions</Text>
                            <TouchableOpacity onPress={() => setContextAlert(null)}>
                                <X size={18} color={colors.muted} />
                            </TouchableOpacity>
                        </View>
                        {contextAlert && (
                            <>
                                <Text style={[styles.contextAlertMsg, { color: colors.muted }]} numberOfLines={2}>{contextAlert.message}</Text>
                                <TouchableOpacity style={[styles.contextItem, { borderColor: colors.border }]} onPress={() => setContextAlert(null)}>
                                    <Text style={[styles.contextItemText, { color: colors.text }]}>View Device</Text>
                                    <Text style={[styles.contextItemSub, { color: colors.muted }]}>{contextAlert.deviceId}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.contextItem, { borderColor: colors.border }]} onPress={() => setContextAlert(null)}>
                                    <Text style={[styles.contextItemText, { color: colors.text }]}>View Incident</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.contextItem, { borderColor: colors.border }]} onPress={() => handleSuppress(contextAlert)}>
                                    <Text style={[styles.contextItemText, { color: '#FF4C4C' }]}>Suppress Similar (1h)</Text>
                                    <Text style={[styles.contextItemSub, { color: colors.muted }]}>Hides {contextAlert.type} from {contextAlert.deviceId}</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    controlBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    controlLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    liveDot: { width: 8, height: 8, borderRadius: 4 },
    liveText: { fontSize: 13, fontWeight: '700' },
    countBadge: { fontSize: 12 },
    controlRight: { flexDirection: 'row', gap: 8 },
    controlBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    filterBar: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 6, borderBottomWidth: 1 },
    filterChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
    filterChipText: { fontSize: 11, fontWeight: '600' },
    listContent: { padding: 16, paddingBottom: 100 },
    alertCard: { flexDirection: 'row', borderRadius: 12, padding: 12, borderWidth: 1, marginBottom: 8 },
    iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    alertContent: { flex: 1 },
    alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    alertType: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    alertDeviceId: { fontSize: 11 },
    alertMessage: { fontSize: 13, lineHeight: 18, marginBottom: 6 },
    alertFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    severityPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
    severityText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
    sourcePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    sourceText: { fontSize: 8, fontWeight: '600' },
    alertTime: { fontSize: 11, flex: 1, textAlign: 'right' },
    empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
    emptyText: { fontSize: 14 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    contextMenu: { borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderBottomWidth: 0, padding: 20, paddingBottom: 40 },
    contextHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    contextTitle: { fontSize: 16, fontWeight: '700' },
    contextAlertMsg: { fontSize: 12, marginBottom: 16, lineHeight: 16 },
    contextItem: { paddingVertical: 14, borderBottomWidth: 1 },
    contextItemText: { fontSize: 14, fontWeight: '600' },
    contextItemSub: { fontSize: 11, marginTop: 2 },
});
