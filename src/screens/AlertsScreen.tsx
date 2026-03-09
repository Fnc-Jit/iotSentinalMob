import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { TrendingDown, Shield, Cpu, Network, AlertTriangle, Pause, Play, Trash2 } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { initialAlerts, generateNewAlert } from '../data/mockData';
import { alertTypeConfig, severityColors } from '../theme/colors';
import { sendAlertNotification } from '../services/notifications';
import type { Alert as AlertType } from '../types';

const iconMap: Record<string, any> = {
    trust_update: TrendingDown,
    policy_violation: Shield,
    status_change: Cpu,
    graph_anomaly: Network,
    new_incident: AlertTriangle,
};

export default function AlertsScreen() {
    const { colors } = useTheme();
    const [alerts, setAlerts] = useState<AlertType[]>(initialAlerts);
    const [paused, setPaused] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    // Auto-generate alerts (simulates WebSocket stream)
    // TODO: Replace with WebSocket subscription to /ws/events
    useEffect(() => {
        if (paused) return;
        const interval = setInterval(() => {
            const newAlert = generateNewAlert();
            setAlerts(prev => [newAlert, ...prev].slice(0, 100));
            // Send push notification for critical and warning alerts
            if (newAlert.severity === 'critical' || newAlert.severity === 'warning') {
                sendAlertNotification(newAlert);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [paused]);

    const handleClear = () => {
        // TODO: POST /api/alerts/clear
        setAlerts([]);
    };

    const renderAlert = ({ item }: { item: AlertType }) => {
        const typeConf = alertTypeConfig[item.type] || { color: '#8B8FA3', label: item.type };
        const sevConf = severityColors[item.severity] || severityColors.info;
        const Icon = iconMap[item.type] || AlertTriangle;

        return (
            <View style={[styles.alertCard, { backgroundColor: sevConf.bg, borderColor: sevConf.border }]}>
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
                        <Text style={[styles.alertTime, { color: colors.muted }]}>
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Controls */}
            <View style={[styles.controlBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.controlLeft}>
                    <View style={[styles.liveDot, { backgroundColor: paused ? '#8B8FA3' : '#4BDE80' }]} />
                    <Text style={[styles.liveText, { color: paused ? '#8B8FA3' : '#4BDE80' }]}>{paused ? 'Paused' : 'Live'}</Text>
                    <Text style={[styles.countBadge, { color: colors.muted }]}>{alerts.length}</Text>
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

            {/* Alert Stream */}
            <FlatList
                ref={flatListRef}
                data={alerts}
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
    listContent: { padding: 16, paddingBottom: 100 },
    alertCard: { flexDirection: 'row', borderRadius: 12, padding: 12, borderWidth: 1, marginBottom: 8 },
    iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    alertContent: { flex: 1 },
    alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    alertType: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    alertDeviceId: { fontSize: 11 },
    alertMessage: { fontSize: 13, lineHeight: 18, marginBottom: 6 },
    alertFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    severityPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
    severityText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
    alertTime: { fontSize: 11 },
    empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
    emptyText: { fontSize: 14 },
});
