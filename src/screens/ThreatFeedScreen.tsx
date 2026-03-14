import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Shield, Globe, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { brandColors, severityColors } from '../theme/colors';
import { iocs, killChains } from '../data/mockData';
import IOCListItem from '../components/IOCListItem';
import KillChainStepper from '../components/KillChainStepper';
import type { IOC, IOCType } from '../types';

type ViewMode = 'iocs' | 'killchains';
type IOCFilter = 'all' | IOCType;

export default function ThreatFeedScreen() {
    const { colors } = useTheme();
    const [viewMode, setViewMode] = useState<ViewMode>('iocs');
    const [iocFilter, setIocFilter] = useState<IOCFilter>('all');
    const [expandedChain, setExpandedChain] = useState<string | null>(killChains[0]?.id || null);

    const filteredIOCs = iocFilter === 'all'
        ? iocs
        : iocs.filter(i => i.type === iocFilter);

    const activeIOCs = iocs.filter(i => i.active).length;
    const totalHits = iocs.reduce((sum, i) => sum + i.hits, 0);

    const renderIOC = ({ item }: { item: IOC }) => (
        <IOCListItem ioc={item} />
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={[styles.headerLabel, { color: '#FF5A1F' }]}>SIEM · THREAT INTEL</Text>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Threat Feed</Text>
                    </View>
                    <View style={styles.headerStats}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#FF4C4C' }]}>{activeIOCs}</Text>
                            <Text style={[styles.statLabel, { color: colors.muted }]}>Active IOCs</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: brandColors.orange }]}>{totalHits}</Text>
                            <Text style={[styles.statLabel, { color: colors.muted }]}>Total Hits</Text>
                        </View>
                    </View>
                </View>

                {/* View mode toggle */}
                <View style={styles.toggleRow}>
                    {([
                        { id: 'iocs' as ViewMode, label: 'IOC Feed', count: iocs.length },
                        { id: 'killchains' as ViewMode, label: 'Kill Chains', count: killChains.filter(k => k.status === 'active').length },
                    ]).map(tab => (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.toggleBtn, {
                                backgroundColor: viewMode === tab.id ? brandColors.orange + '15' : 'transparent',
                                borderColor: viewMode === tab.id ? brandColors.orange + '30' : colors.border,
                            }]}
                            onPress={() => setViewMode(tab.id)}
                        >
                            <Text style={[styles.toggleText, {
                                color: viewMode === tab.id ? brandColors.orange : colors.muted,
                            }]}>{tab.label}</Text>
                            <View style={[styles.countBadge, { backgroundColor: viewMode === tab.id ? brandColors.orange + '20' : colors.border + '30' }]}>
                                <Text style={[styles.countText, { color: viewMode === tab.id ? brandColors.orange : colors.muted }]}>{tab.count}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* IOC type filter (only in IOC view) */}
                {viewMode === 'iocs' && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                        <View style={styles.filterRow}>
                            {(['all', 'ip', 'domain', 'hash', 'cve'] as IOCFilter[]).map(f => (
                                <TouchableOpacity
                                    key={f}
                                    style={[styles.filterPill, {
                                        backgroundColor: iocFilter === f ? brandColors.orange + '15' : 'transparent',
                                        borderColor: iocFilter === f ? brandColors.orange + '30' : colors.border,
                                    }]}
                                    onPress={() => setIocFilter(f)}
                                >
                                    <Text style={[styles.filterText, {
                                        color: iocFilter === f ? brandColors.orange : colors.muted,
                                    }]}>{f === 'all' ? 'All' : f.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>

            {/* Content */}
            {viewMode === 'iocs' ? (
                <FlatList
                    data={filteredIOCs}
                    keyExtractor={item => item.id}
                    renderItem={renderIOC}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Globe size={32} color={colors.muted} />
                            <Text style={[styles.emptyText, { color: colors.muted }]}>No IOCs match this filter</Text>
                        </View>
                    }
                />
            ) : (
                <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                    {killChains.map(chain => {
                        const isExpanded = expandedChain === chain.id;
                        const severityColor = chain.severity === 'critical' ? '#FF4C4C' : '#FF6B35';

                        return (
                            <View key={chain.id} style={[styles.chainCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <TouchableOpacity
                                    style={styles.chainHeader}
                                    onPress={() => setExpandedChain(isExpanded ? null : chain.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.chainIcon, { backgroundColor: severityColor + '15' }]}>
                                        <Shield size={18} color={severityColor} />
                                    </View>
                                    <View style={styles.chainInfo}>
                                        <Text style={[styles.chainName, { color: colors.text }]}>{chain.name}</Text>
                                        <View style={styles.chainMeta}>
                                            <View style={[styles.severityPill, { backgroundColor: severityColor + '15', borderColor: severityColor + '30' }]}>
                                                <Text style={[styles.sevText, { color: severityColor }]}>{chain.severity.toUpperCase()}</Text>
                                            </View>
                                            <View style={[styles.statusPill, {
                                                backgroundColor: chain.status === 'active' ? '#FF4C4C15' : '#4BDE8015',
                                                borderColor: chain.status === 'active' ? '#FF4C4C30' : '#4BDE8030',
                                            }]}>
                                                <Text style={[styles.sevText, { color: chain.status === 'active' ? '#FF4C4C' : '#4BDE80' }]}>{chain.status.toUpperCase()}</Text>
                                            </View>
                                        </View>
                                        <Text style={[styles.chainDetail, { color: colors.muted }]}>
                                            {chain.stages.length} stages · {chain.devices.length} devices · {chain.duration}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={[styles.chainBody, { borderColor: colors.border }]}>
                                        <KillChainStepper stages={chain.stages} />
                                    </View>
                                )}
                            </View>
                        );
                    })}

                    {killChains.length === 0 && (
                        <View style={styles.empty}>
                            <Shield size={32} color={colors.muted} />
                            <Text style={[styles.emptyText, { color: colors.muted }]}>No active kill chains</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    headerLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    headerStats: { flexDirection: 'row', gap: 16 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: '700' },
    statLabel: { fontSize: 9, textTransform: 'uppercase' },
    toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
    toggleText: { fontSize: 12, fontWeight: '600' },
    countBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
    countText: { fontSize: 9, fontWeight: '700' },
    filterScroll: { marginTop: 4 },
    filterRow: { flexDirection: 'row', gap: 6 },
    filterPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
    filterText: { fontSize: 11, fontWeight: '600' },
    listContent: { padding: 16, paddingBottom: 100 },
    chainCard: { borderRadius: 14, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
    chainHeader: { flexDirection: 'row', padding: 14, alignItems: 'flex-start' },
    chainIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    chainInfo: { flex: 1 },
    chainName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
    chainMeta: { flexDirection: 'row', gap: 6, marginBottom: 3 },
    severityPill: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, borderWidth: 1 },
    statusPill: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, borderWidth: 1 },
    sevText: { fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
    chainDetail: { fontSize: 11 },
    chainBody: { borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
    empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
    emptyText: { fontSize: 14 },
});
