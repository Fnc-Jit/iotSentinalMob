import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { devices } from '../data/mockData';
import { RiskBadge, StatusBadge, TrustScoreBar } from '../components/RiskBadge';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DevicesStackParamList } from '../navigation/types';
import type { RiskLevel, Device } from '../types';

type Props = {
    navigation: NativeStackNavigationProp<DevicesStackParamList, 'DevicesList'>;
};

const RISK_FILTERS: { label: string; value: RiskLevel | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Trusted', value: 'trusted' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
];

export default function DevicesScreen({ navigation }: Props) {
    const { colors } = useTheme();
    const [search, setSearch] = useState('');
    const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
    const [refreshing, setRefreshing] = useState(false);

    // TODO: Replace with GET /api/devices when backend connected
    const filteredDevices = useMemo(() => {
        let result = [...devices];
        if (riskFilter !== 'all') result = result.filter(d => d.riskLevel === riskFilter);
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(d =>
                d.name.toLowerCase().includes(q) ||
                d.id.toLowerCase().includes(q) ||
                d.vendor.toLowerCase().includes(q) ||
                d.class.toLowerCase().includes(q)
            );
        }
        return result;
    }, [search, riskFilter]);

    const onRefresh = () => {
        setRefreshing(true);
        // TODO: Refetch from API
        setTimeout(() => setRefreshing(false), 800);
    };

    const renderDevice = ({ item }: { item: Device }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('DeviceDetail', { deviceId: item.id })}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.deviceName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.deviceMeta, { color: colors.muted }]}>{item.id} · {item.class} · {item.vendor}</Text>
                </View>
                <RiskBadge level={item.riskLevel} />
            </View>
            <View style={styles.cardBody}>
                <View style={styles.scoreRow}>
                    <Text style={[styles.scoreLabel, { color: colors.muted }]}>Trust Score</Text>
                    <TrustScoreBar score={item.trustScore} />
                </View>
                <View style={styles.cardFooter}>
                    <StatusBadge status={item.status} />
                    <Text style={[styles.lastSeen, { color: colors.muted }]}>
                        {new Date(item.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Search */}
            <View style={[styles.searchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Search size={18} color={colors.muted} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search devices..."
                    placeholderTextColor={colors.muted}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Risk Filter Pills */}
            <View style={styles.filterRow}>
                {RISK_FILTERS.map(f => (
                    <TouchableOpacity
                        key={f.value}
                        style={[styles.filterPill, riskFilter === f.value && styles.filterPillActive]}
                        onPress={() => setRiskFilter(f.value)}
                    >
                        <Text style={[styles.filterText, riskFilter === f.value && styles.filterTextActive]}>{f.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Device count */}
            <Text style={[styles.countText, { color: colors.muted }]}>{filteredDevices.length} devices</Text>

            {/* Device List */}
            <FlatList
                data={filteredDevices}
                keyExtractor={(item) => item.id}
                renderItem={renderDevice}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B35" />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, gap: 10 },
    searchInput: { flex: 1, fontSize: 15 },
    filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexWrap: 'wrap' },
    filterPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    filterPillActive: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
    filterText: { color: '#8B8FA3', fontSize: 12, fontWeight: '600' },
    filterTextActive: { color: '#FFFFFF' },
    countText: { paddingHorizontal: 16, fontSize: 12, marginBottom: 8 },
    listContent: { paddingHorizontal: 16, paddingBottom: 100 },
    card: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 10 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    deviceName: { fontSize: 15, fontWeight: '700' },
    deviceMeta: { fontSize: 12, marginTop: 3 },
    cardBody: { gap: 10 },
    scoreRow: { gap: 4 },
    scoreLabel: { fontSize: 11 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lastSeen: { fontSize: 11 },
});
