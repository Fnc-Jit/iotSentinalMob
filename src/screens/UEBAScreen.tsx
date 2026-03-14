import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Activity, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { brandColors, riskColors } from '../theme/colors';
import { uebaEntities, correlatedAlerts, siemLayerStatus } from '../data/mockData';
import DriftSparkline from '../components/DriftSparkline';
import SIEMLayerChip from '../components/SIEMLayerChip';
import CorrelatedAlertBanner from '../components/CorrelatedAlertBanner';
import type { UEBAEntity } from '../types';

type FilterStatus = 'all' | 'alert' | 'drift' | 'normal';

export default function UEBAScreen() {
    const { colors } = useTheme();
    const [filter, setFilter] = useState<FilterStatus>('all');

    const filtered = filter === 'all'
        ? uebaEntities
        : uebaEntities.filter(e => e.status === filter);

    const statusColors: Record<string, string> = {
        alert: '#FF4C4C',
        drift: '#FFB347',
        normal: '#4BDE80',
    };

    const renderEntity = ({ item }: { item: UEBAEntity }) => {
        const statusColor = statusColors[item.status] || '#8B8FA3';

        return (
            <View style={[styles.entityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {/* Header */}
                <View style={styles.entityHeader}>
                    <View style={styles.entityInfo}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <View>
                            <Text style={[styles.deviceName, { color: colors.text }]}>{item.deviceName}</Text>
                            <Text style={[styles.deviceId, { color: colors.muted }]}>{item.deviceId}</Text>
                        </View>
                    </View>
                    <View style={styles.entityRight}>
                        <Text style={[styles.sigma, { color: statusColor }]}>+{item.driftSigma.toFixed(1)}σ</Text>
                        <View style={[styles.statusPill, { backgroundColor: statusColor + '15', borderColor: statusColor + '30' }]}>
                            <Text style={[styles.statusText, { color: statusColor }]}>{item.status.toUpperCase()}</Text>
                        </View>
                    </View>
                </View>

                {/* CUSUM Sparkline */}
                <View style={styles.sparkContainer}>
                    <Text style={[styles.sparkLabel, { color: colors.muted }]}>CUSUM 7d</Text>
                    <DriftSparkline
                        data={item.cusumHistory}
                        color={statusColor}
                        width={140}
                        height={36}
                        showLabel={false}
                    />
                </View>

                {/* Top 3 features */}
                <View style={styles.featuresContainer}>
                    {item.features
                        .sort((a, b) => (b.current / b.baseline) - (a.current / a.baseline))
                        .slice(0, 3)
                        .map(f => {
                            const ratio = f.current / f.baseline;
                            const barWidth = Math.min(ratio / 10 * 100, 100);
                            return (
                                <View key={f.name} style={styles.featureRow}>
                                    <Text style={[styles.featureName, { color: colors.muted }]}>{f.name}</Text>
                                    <View style={styles.featureBarBg}>
                                        <View style={[styles.featureBar, { width: `${barWidth}%`, backgroundColor: ratio > 3 ? '#FF4C4C' : ratio > 2 ? '#FFB347' : '#4BDE80' }]} />
                                    </View>
                                    <Text style={[styles.featureValue, { color: colors.text }]}>
                                        {f.current}{f.unit}
                                    </Text>
                                </View>
                            );
                        })}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={[styles.headerLabel, { color: brandColors.pink }]}>SIEM · LAYER 2</Text>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>UEBA Analytics</Text>
                    </View>
                    <View style={styles.headerStats}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#FF4C4C' }]}>{uebaEntities.filter(e => e.status === 'alert').length}</Text>
                            <Text style={[styles.statLabel, { color: colors.muted }]}>Alert</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#FFB347' }]}>{uebaEntities.filter(e => e.status === 'drift').length}</Text>
                            <Text style={[styles.statLabel, { color: colors.muted }]}>Drift</Text>
                        </View>
                    </View>
                </View>

                {/* SIEM Layer chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
                    {siemLayerStatus.map(layer => (
                        <SIEMLayerChip key={layer.layer} layer={layer.name} color={layer.color} status={layer.status} />
                    ))}
                </ScrollView>

                {/* Filter pills */}
                <View style={styles.filterRow}>
                    {(['all', 'alert', 'drift', 'normal'] as FilterStatus[]).map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterPill, {
                                backgroundColor: filter === f ? (statusColors[f] || brandColors.orange) + '15' : 'transparent',
                                borderColor: filter === f ? (statusColors[f] || brandColors.orange) + '30' : colors.border,
                            }]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterText, {
                                color: filter === f ? (statusColors[f] || brandColors.orange) : colors.muted,
                            }]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Correlated Alerts */}
            {correlatedAlerts.length > 0 && (
                <View style={styles.correlatedSection}>
                    <Text style={[styles.sectionLabel, { color: brandColors.red }]}>⚡ CORRELATED ALERTS</Text>
                    {correlatedAlerts.map(ca => (
                        <CorrelatedAlertBanner key={ca.id} alert={ca} />
                    ))}
                </View>
            )}

            {/* Entity List */}
            <FlatList
                data={filtered}
                keyExtractor={item => item.deviceId}
                renderItem={renderEntity}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Activity size={32} color={colors.muted} />
                        <Text style={[styles.emptyText, { color: colors.muted }]}>No entities match this filter</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    headerLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    headerStats: { flexDirection: 'row', gap: 12 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: '700' },
    statLabel: { fontSize: 9, textTransform: 'uppercase' },
    chipsRow: { flexDirection: 'row', marginBottom: 10, gap: 6 },
    filterRow: { flexDirection: 'row', gap: 6 },
    filterPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
    filterText: { fontSize: 11, fontWeight: '600' },
    correlatedSection: { paddingHorizontal: 16, paddingTop: 12 },
    sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
    listContent: { padding: 16, paddingBottom: 100 },
    entityCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10 },
    entityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    entityInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    deviceName: { fontSize: 14, fontWeight: '600' },
    deviceId: { fontSize: 11 },
    entityRight: { alignItems: 'flex-end', gap: 4 },
    sigma: { fontSize: 16, fontWeight: '700' },
    statusPill: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, borderWidth: 1 },
    statusText: { fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
    sparkContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    sparkLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 0.5, width: 50 },
    featuresContainer: { gap: 4 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    featureName: { fontSize: 10, width: 65 },
    featureBarBg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.05)' },
    featureBar: { height: 4, borderRadius: 2 },
    featureValue: { fontSize: 10, fontWeight: '600', width: 50, textAlign: 'right' },
    empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
    emptyText: { fontSize: 14 },
});
