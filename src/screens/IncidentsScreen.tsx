import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Search } from 'lucide-react-native';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { incidents } from '../data/mockData';
import { RiskBadge, StatusBadge } from '../components/RiskBadge';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { IncidentsStackParamList } from '../navigation/types';
import type { Incident } from '../types';

type Props = {
    navigation: NativeStackNavigationProp<IncidentsStackParamList, 'IncidentsList'>;
};

function MiniDonut({ data, size = 100 }: { data: { name: string; value: number; color: string }[]; size?: number }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    const cx = size / 2, cy = size / 2, r = size / 2 - 12;
    let cumulative = 0;
    const arcs = data.filter(d => d.value > 0).map((d) => {
        const start = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
        cumulative += d.value;
        const end = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
        const largeArc = end - start > Math.PI ? 1 : 0;
        const innerR = r * 0.55;
        const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
        const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
        const x3 = cx + innerR * Math.cos(end), y3 = cy + innerR * Math.sin(end);
        const x4 = cx + innerR * Math.cos(start), y4 = cy + innerR * Math.sin(start);
        return { path: `M${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} L${x3},${y3} A${innerR},${innerR} 0 ${largeArc} 0 ${x4},${y4} Z`, color: d.color };
    });
    return (
        <Svg width={size} height={size}>
            {arcs.map((a, i) => <Path key={i} d={a.path} fill={a.color} stroke="#0C0C0C" strokeWidth={1} />)}
            <SvgText x={cx} y={cy + 5} textAnchor="middle" fill="#FFFFFF" fontWeight="700" fontSize={16}>{total}</SvgText>
        </Svg>
    );
}

export default function IncidentsScreen({ navigation }: Props) {
    const { colors } = useTheme();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [refreshing, setRefreshing] = useState(false);

    // TODO: Replace with GET /api/incidents
    const filtered = useMemo(() => {
        let result = [...incidents];
        if (statusFilter !== 'all') result = result.filter(i => i.status === statusFilter);
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(i => i.id.toLowerCase().includes(q) || i.deviceId.toLowerCase().includes(q) || i.recommendedAction.toLowerCase().includes(q));
        }
        return result;
    }, [search, statusFilter]);

    const urgencyData = [
        { name: 'Critical', value: incidents.filter(i => i.severity === 'critical').length, color: '#FF4C4C' },
        { name: 'High', value: incidents.filter(i => i.severity === 'high').length, color: '#E8478C' },
        { name: 'Medium', value: incidents.filter(i => i.severity === 'medium').length, color: '#FF6B35' },
        { name: 'Low', value: incidents.filter(i => i.severity === 'low').length, color: '#FFB347' },
    ];
    const statusData = [
        { name: 'Open', value: incidents.filter(i => i.status === 'open').length, color: '#FF6B35' },
        { name: 'Investigating', value: incidents.filter(i => i.status === 'investigating').length, color: '#E8478C' },
        { name: 'Resolved', value: incidents.filter(i => i.status === 'resolved').length, color: '#4BDE80' },
        { name: 'Closed', value: incidents.filter(i => i.status === 'closed').length, color: '#8B8FA3' },
    ];

    const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

    const renderIncident = ({ item }: { item: Incident }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('IncidentDetail', { incidentId: item.id })}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <Text style={[styles.incidentId, { color: colors.text }]}>{item.id}</Text>
                <RiskBadge level={item.riskLevel} />
            </View>
            <Text style={[styles.deviceRef, { color: colors.muted }]}>{item.deviceId} · {item.vendor}</Text>
            <Text style={[styles.action, { color: colors.text }]} numberOfLines={1}>{item.recommendedAction}</Text>
            <View style={styles.cardFooter}>
                <StatusBadge status={item.status} />
                <Text style={[styles.timestamp, { color: colors.muted }]}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={filtered}
                keyExtractor={i => i.id}
                renderItem={renderIncident}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B35" />}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        {/* Summary Charts */}
                        <View style={styles.chartsRow}>
                            <View style={[styles.chartBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <Text style={[styles.chartLabel, { color: colors.muted }]}>By Urgency</Text>
                                <MiniDonut data={urgencyData} />
                            </View>
                            <View style={[styles.chartBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <Text style={[styles.chartLabel, { color: colors.muted }]}>By Status</Text>
                                <MiniDonut data={statusData} />
                            </View>
                        </View>

                        {/* Search */}
                        <View style={[styles.searchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Search size={18} color={colors.muted} />
                            <TextInput style={[styles.searchInput, { color: colors.text }]} placeholder="Search incidents..." placeholderTextColor={colors.muted} value={search} onChangeText={setSearch} />
                        </View>

                        {/* Status Filters */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                            {['all', 'open', 'investigating', 'resolved', 'closed'].map(s => (
                                <TouchableOpacity key={s} style={[styles.filterPill, statusFilter === s && styles.filterActive]} onPress={() => setStatusFilter(s)}>
                                    <Text style={[styles.filterText, statusFilter === s && styles.filterTextActive]}>{s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={[styles.countText, { color: colors.muted }]}>{filtered.length} incidents</Text>
                    </>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContent: { padding: 16, paddingBottom: 100 },
    chartsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    chartBox: { flex: 1, borderRadius: 14, padding: 12, borderWidth: 1, alignItems: 'center' },
    chartLabel: { fontSize: 11, fontWeight: '600', marginBottom: 8 },
    searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, gap: 10, marginBottom: 12 },
    searchInput: { flex: 1, fontSize: 15 },
    filterScroll: { gap: 8, paddingBottom: 12 },
    filterPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    filterActive: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
    filterText: { color: '#8B8FA3', fontSize: 12, fontWeight: '600' },
    filterTextActive: { color: '#FFFFFF' },
    countText: { fontSize: 12, marginBottom: 8 },
    card: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 10 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    incidentId: { fontSize: 15, fontWeight: '700' },
    deviceRef: { fontSize: 12, marginBottom: 6 },
    action: { fontSize: 13, fontWeight: '500', marginBottom: 10 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    timestamp: { fontSize: 11 },
});
