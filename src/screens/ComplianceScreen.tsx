import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { brandColors } from '../theme/colors';
import { complianceFunctions, overallComplianceScore } from '../data/mockData';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MoreStackParamList } from '../navigation/types';

type Props = {
    navigation: NativeStackNavigationProp<MoreStackParamList, 'ComplianceScreen'>;
};

// Simple donut for score
function ScoreDonut({ score, size = 120 }: { score: number; size?: number }) {
    const cx = size / 2, cy = size / 2, r = size / 2 - 12;
    const circumference = 2 * Math.PI * r;
    const progress = (score / 100) * circumference;
    const color = score >= 70 ? '#4BDE80' : score >= 50 ? '#F59E0B' : '#EF4444';

    return (
        <Svg width={size} height={size}>
            <Circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
            <Circle
                cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={10}
                strokeDasharray={`${progress} ${circumference - progress}`}
                strokeDashoffset={circumference / 4}
                strokeLinecap="round"
            />
            <SvgText x={cx} y={cy - 4} textAnchor="middle" fill="#FFFFFF" fontWeight="800" fontSize={28}>{score}</SvgText>
            <SvgText x={cx} y={cy + 14} textAnchor="middle" fill="#8B8FA3" fontSize={10}>/ 100</SvgText>
        </Svg>
    );
}

export default function ComplianceScreen({ navigation }: Props) {
    const { colors } = useTheme();
    const [expandedFn, setExpandedFn] = useState<string | null>(null);

    const totalControls = complianceFunctions.reduce((s, f) => s + f.controls.length, 0);
    const passControls = complianceFunctions.reduce((s, f) => s + f.controls.filter(c => c.status === 'pass').length, 0);
    const failControls = complianceFunctions.reduce((s, f) => s + f.controls.filter(c => c.status === 'fail').length, 0);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={20} color={colors.text} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerLabel, { color: '#8B5CF6' }]}>NIST CSF</Text>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Compliance</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Score Card */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.scoreRow}>
                        <ScoreDonut score={overallComplianceScore} />
                        <View style={styles.scoreStats}>
                            <View style={styles.scoreStat}>
                                <CheckCircle size={14} color="#4BDE80" />
                                <Text style={[styles.scoreStatValue, { color: '#4BDE80' }]}>{passControls}</Text>
                                <Text style={[styles.scoreStatLabel, { color: colors.muted }]}>Pass</Text>
                            </View>
                            <View style={styles.scoreStat}>
                                <XCircle size={14} color="#EF4444" />
                                <Text style={[styles.scoreStatValue, { color: '#EF4444' }]}>{failControls}</Text>
                                <Text style={[styles.scoreStatLabel, { color: colors.muted }]}>Fail</Text>
                            </View>
                            <View style={styles.scoreStat}>
                                <AlertTriangle size={14} color="#F59E0B" />
                                <Text style={[styles.scoreStatValue, { color: '#F59E0B' }]}>{totalControls - passControls - failControls}</Text>
                                <Text style={[styles.scoreStatLabel, { color: colors.muted }]}>Partial</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Function Breakdown */}
                {complianceFunctions.map(fn => {
                    const isExpanded = expandedFn === fn.name;
                    const barWidth = `${fn.score}%`;
                    return (
                        <TouchableOpacity
                            key={fn.name}
                            style={[styles.fnCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => setExpandedFn(isExpanded ? null : fn.name)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.fnHeader}>
                                <Text style={[styles.fnName, { color: colors.text }]}>{fn.name}</Text>
                                <Text style={[styles.fnScore, { color: fn.color }]}>{fn.score}%</Text>
                            </View>
                            <View style={styles.barBg}>
                                <View style={[styles.bar, { width: barWidth as any, backgroundColor: fn.color }]} />
                            </View>

                            {isExpanded && (
                                <View style={styles.controlsList}>
                                    {fn.controls.map(ctrl => (
                                        <View key={ctrl.id} style={[styles.controlRow, { borderColor: colors.border }]}>
                                            {ctrl.status === 'pass' ? (
                                                <CheckCircle size={14} color="#4BDE80" />
                                            ) : ctrl.status === 'fail' ? (
                                                <XCircle size={14} color="#EF4444" />
                                            ) : (
                                                <AlertTriangle size={14} color="#F59E0B" />
                                            )}
                                            <View style={styles.controlInfo}>
                                                <Text style={[styles.controlId, { color: fn.color }]}>{ctrl.id}</Text>
                                                <Text style={[styles.controlReq, { color: colors.text }]}>{ctrl.requirement}</Text>
                                                {ctrl.evidence && (
                                                    <Text style={[styles.controlEvidence, { color: colors.muted }]}>{ctrl.evidence}</Text>
                                                )}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}

                {/* Generate Report Button */}
                <TouchableOpacity style={styles.reportBtn}>
                    <FileText size={16} color="#FFFFFF" />
                    <Text style={styles.reportBtnText}>Generate PDF Report</Text>
                </TouchableOpacity>
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
    scroll: { padding: 16, paddingBottom: 100 },
    section: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 16 },
    scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
    scoreStats: { gap: 12 },
    scoreStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    scoreStatValue: { fontSize: 16, fontWeight: '700' },
    scoreStatLabel: { fontSize: 11 },
    fnCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10 },
    fnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    fnName: { fontSize: 15, fontWeight: '700' },
    fnScore: { fontSize: 16, fontWeight: '800' },
    barBg: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.06)' },
    bar: { height: 6, borderRadius: 3 },
    controlsList: { marginTop: 14 },
    controlRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, gap: 10, borderBottomWidth: 1 },
    controlInfo: { flex: 1 },
    controlId: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
    controlReq: { fontSize: 13 },
    controlEvidence: { fontSize: 11, marginTop: 3, fontStyle: 'italic' },
    reportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#8B5CF6', paddingVertical: 14, borderRadius: 12, marginTop: 8 },
    reportBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
