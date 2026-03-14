import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Shield, AlertTriangle, Clock, Cpu } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { brandColors } from '../theme/colors';
import { killChains } from '../data/mockData';
import KillChainStepper from '../components/KillChainStepper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MoreStackParamList } from '../navigation/types';

type Props = {
    navigation: NativeStackNavigationProp<MoreStackParamList, 'KillChainScreen'>;
};

export default function KillChainScreen({ navigation }: Props) {
    const { colors } = useTheme();
    const [expandedChain, setExpandedChain] = useState<string | null>(killChains[0]?.id || null);

    const activeCount = killChains.filter(k => k.status === 'active').length;
    const totalDevices = [...new Set(killChains.flatMap(k => k.devices))].length;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={20} color={colors.text} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerLabel, { color: '#E02424' }]}>SIEM · LAYER 3</Text>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Kill Chain Correlation</Text>
                </View>
                <View style={styles.headerStats}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: '#FF4C4C' }]}>{activeCount}</Text>
                        <Text style={[styles.statLabel, { color: colors.muted }]}>Active</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: brandColors.orange }]}>{totalDevices}</Text>
                        <Text style={[styles.statLabel, { color: colors.muted }]}>Devices</Text>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* ATT&CK Summary */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>ATT&CK Tactics Detected</Text>
                    <View style={styles.tacticGrid}>
                        {Array.from(new Set(killChains.flatMap(k => k.stages.map(s => s.tactic)))).map(tactic => (
                            <View key={tactic} style={[styles.tacticChip, { backgroundColor: '#E0242415', borderColor: '#E0242430' }]}>
                                <Text style={[styles.tacticText, { color: '#E02424' }]}>{tactic}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Chain Cards */}
                {killChains.map(chain => {
                    const isExpanded = expandedChain === chain.id;
                    const severityColor = chain.severity === 'critical' ? '#FF4C4C' : '#FF6B35';
                    const statusColor = chain.status === 'active' ? '#FF4C4C' : chain.status === 'contained' ? '#F59E0B' : '#4BDE80';

                    return (
                        <View key={chain.id} style={[styles.chainCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <TouchableOpacity
                                style={styles.chainHeader}
                                onPress={() => setExpandedChain(isExpanded ? null : chain.id)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.chainIcon, { backgroundColor: severityColor + '15' }]}>
                                    <Shield size={20} color={severityColor} />
                                </View>
                                <View style={styles.chainInfo}>
                                    <Text style={[styles.chainName, { color: colors.text }]}>{chain.name}</Text>
                                    <View style={styles.chainMeta}>
                                        <View style={[styles.pill, { backgroundColor: severityColor + '15', borderColor: severityColor + '30' }]}>
                                            <Text style={[styles.pillText, { color: severityColor }]}>{chain.severity.toUpperCase()}</Text>
                                        </View>
                                        <View style={[styles.pill, { backgroundColor: statusColor + '15', borderColor: statusColor + '30' }]}>
                                            <Text style={[styles.pillText, { color: statusColor }]}>{chain.status.toUpperCase()}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.chainDetails}>
                                        <View style={styles.detailItem}>
                                            <Clock size={12} color={colors.muted} />
                                            <Text style={[styles.detailText, { color: colors.muted }]}>{chain.duration}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Cpu size={12} color={colors.muted} />
                                            <Text style={[styles.detailText, { color: colors.muted }]}>{chain.devices.length} devices</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <AlertTriangle size={12} color={colors.muted} />
                                            <Text style={[styles.detailText, { color: colors.muted }]}>{chain.stages.length} stages</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {isExpanded && (
                                <View style={[styles.chainBody, { borderColor: colors.border }]}>
                                    <Text style={[styles.bodyLabel, { color: colors.muted }]}>ATTACK PROGRESSION</Text>
                                    <KillChainStepper stages={chain.stages} />
                                    <View style={[styles.devicesRow, { borderColor: colors.border }]}>
                                        <Text style={[styles.bodyLabel, { color: colors.muted }]}>AFFECTED DEVICES</Text>
                                        <View style={styles.deviceChips}>
                                            {chain.devices.map(d => (
                                                <View key={d} style={[styles.deviceChip, { backgroundColor: colors.border + '40' }]}>
                                                    <Text style={[styles.deviceChipText, { color: colors.text }]}>{d}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                })}

                {killChains.length === 0 && (
                    <View style={styles.empty}>
                        <Shield size={40} color={colors.muted} />
                        <Text style={[styles.emptyText, { color: colors.muted }]}>No active kill chains</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, gap: 12 },
    backBtn: { padding: 4 },
    headerLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    headerStats: { flexDirection: 'row', gap: 16 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: '700' },
    statLabel: { fontSize: 9, textTransform: 'uppercase' },
    scroll: { padding: 16, paddingBottom: 100 },
    section: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 16 },
    sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
    tacticGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    tacticChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
    tacticText: { fontSize: 10, fontWeight: '600' },
    chainCard: { borderRadius: 14, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
    chainHeader: { flexDirection: 'row', padding: 14, alignItems: 'flex-start' },
    chainIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    chainInfo: { flex: 1 },
    chainName: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
    chainMeta: { flexDirection: 'row', gap: 6, marginBottom: 6 },
    pill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
    pillText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
    chainDetails: { flexDirection: 'row', gap: 12 },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    detailText: { fontSize: 11 },
    chainBody: { borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 14 },
    bodyLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10 },
    devicesRow: { borderTopWidth: 1, paddingTop: 12, marginTop: 12 },
    deviceChips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
    deviceChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    deviceChipText: { fontSize: 11, fontWeight: '600' },
    empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
    emptyText: { fontSize: 14 },
});
