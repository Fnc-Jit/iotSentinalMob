import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Cpu, Shield, AlertTriangle, Activity, TrendingDown } from 'lucide-react-native';
import Svg, { Circle, Path, Line, Text as SvgText, G, Rect } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { brandColors } from '../theme/colors';
import { dashboardStats, riskDistribution, trendData, devices, incidents, siemLayerStatus, correlatedAlerts } from '../data/mockData';
import { RiskBadge, StatusBadge } from '../components/RiskBadge';
import SIEMLayerChip from '../components/SIEMLayerChip';
import CorrelatedAlertBanner from '../components/CorrelatedAlertBanner';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48;

type Props = {
    navigation: BottomTabNavigationProp<MainTabParamList, 'DashboardTab'>;
};

// SVG-based Donut chart
function DonutChart({ data, size = 140 }: { data: { name: string; value: number; color: string }[]; size?: number }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    const cx = size / 2, cy = size / 2, r = size / 2 - 18;
    let cumulative = 0;

    const arcs = data.filter(d => d.value > 0).map((d) => {
        const start = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
        cumulative += d.value;
        const end = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
        const largeArc = end - start > Math.PI ? 1 : 0;
        const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
        const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
        const innerR = r * 0.6;
        const x3 = cx + innerR * Math.cos(end), y3 = cy + innerR * Math.sin(end);
        const x4 = cx + innerR * Math.cos(start), y4 = cy + innerR * Math.sin(start);
        return {
            path: `M${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} L${x3},${y3} A${innerR},${innerR} 0 ${largeArc} 0 ${x4},${y4} Z`,
            color: d.color,
            name: d.name,
            value: d.value,
        };
    });

    return (
        <View style={{ alignItems: 'center' }}>
            <Svg width={size} height={size}>
                {arcs.map((a, i) => (
                    <Path key={i} d={a.path} fill={a.color} stroke="#0C0C0C" strokeWidth={1} />
                ))}
                <SvgText x={cx} y={cy - 4} textAnchor="middle" fill="#FFFFFF" fontWeight="700" fontSize={22}>{total}</SvgText>
                <SvgText x={cx} y={cy + 14} textAnchor="middle" fill="#8B8FA3" fontSize={10}>Total</SvgText>
            </Svg>
            <View style={styles.legendContainer}>
                {data.map((d) => (
                    <View key={d.name} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                        <Text style={styles.legendText}>{d.name} ({d.value})</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

// SVG-based Line chart for trend
function TrendChart({ data }: { data: { day: string; score: number }[] }) {
    const w = CHART_WIDTH, h = 150, padX = 36, padY = 20, padB = 24;
    const maxScore = 100, minScore = 0;
    const chartW = w - padX * 2, chartH = h - padY - padB;

    const points = data.map((d, i) => ({
        x: padX + (i / (data.length - 1)) * chartW,
        y: padY + chartH - ((d.score - minScore) / (maxScore - minScore)) * chartH,
    }));
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const areaD = pathD + ` L${points[points.length - 1].x},${padY + chartH} L${points[0].x},${padY + chartH} Z`;

    return (
        <Svg width={w} height={h}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(v => {
                const y = padY + chartH - ((v - minScore) / (maxScore - minScore)) * chartH;
                return (
                    <G key={v}>
                        <Line x1={padX} y1={y} x2={w - padX} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                        <SvgText x={padX - 6} y={y + 4} textAnchor="end" fill="#8B8FA3" fontSize={9}>{v}</SvgText>
                    </G>
                );
            })}
            {/* Area fill */}
            <Path d={areaD} fill="rgba(255,107,53,0.15)" />
            {/* Line */}
            <Path d={pathD} fill="none" stroke="#FF6B35" strokeWidth={2} />
            {/* Dots & labels */}
            {points.map((p, i) => (
                <G key={i}>
                    <Circle cx={p.x} cy={p.y} r={3} fill="#FF6B35" stroke="#0C0C0C" strokeWidth={1.5} />
                    <SvgText x={p.x} y={h - 4} textAnchor="middle" fill="#8B8FA3" fontSize={8}>{data[i].day.replace('Mar ', '')}</SvgText>
                </G>
            ))}
        </Svg>
    );
}

export default function DashboardScreen({ navigation }: Props) {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState<'overview' | 'posture'>('posture');
    const [timeRange, setTimeRange] = useState('7d');

    // Simulated metrics based on time range
    const metricsByRange: Record<string, { mttTriageVal: string; mttTriageChange: string; mttResVal: string; mttResChange: string; investigations: string; invChange: string; chartLabel: string }> = {
        '24h': { mttTriageVal: '42 min', mttTriageChange: '-12', mttResVal: '78 min', mttResChange: '-8', investigations: '0', invChange: '0', chartLabel: 'Avg Trust Score (24h)' },
        '7d': { mttTriageVal: '106 min', mttTriageChange: '+106', mttResVal: '187 min', mttResChange: '+187', investigations: '1', invChange: '+1', chartLabel: 'Avg Trust Score (7d)' },
        '30d': { mttTriageVal: '94 min', mttTriageChange: '-6%', mttResVal: '162 min', mttResChange: '-12%', investigations: '4', invChange: '+3', chartLabel: 'Avg Trust Score (30d)' },
        '90d': { mttTriageVal: '118 min', mttTriageChange: '+8%', mttResVal: '201 min', mttResChange: '+22%', investigations: '11', invChange: '+7', chartLabel: 'Avg Trust Score (90d)' },
        '1y': { mttTriageVal: '135 min', mttTriageChange: '+15%', mttResVal: '224 min', mttResChange: '+35%', investigations: '28', invChange: '+17', chartLabel: 'Avg Trust Score (1y)' },
    };
    const currentMetrics = metricsByRange[timeRange] || metricsByRange['7d'];

    const kpis = [
        { label: 'Total Devices', value: dashboardStats.totalDevices, icon: Cpu, color: brandColors.orange },
        { label: 'Trusted', value: dashboardStats.trustedDevices, icon: Shield, color: brandColors.green },
        { label: 'High Risk', value: dashboardStats.highRiskDevices, icon: AlertTriangle, color: brandColors.orange },
        { label: 'Active Incidents', value: dashboardStats.activeIncidents, icon: Activity, color: brandColors.red },
    ];

    const highRiskDevices = devices.filter(d => d.riskLevel === 'high' || d.riskLevel === 'critical').slice(0, 5);
    const activeIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating').slice(0, 4);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Tab Toggle */}
            <View style={[styles.tabRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {(['posture', 'overview'] as const).map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab === 'posture' ? 'Security Posture' : 'Security Overview'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {activeTab === 'overview' ? (
                    <>
                        {/* KPI Cards */}
                        <View style={styles.kpiGrid}>
                            {kpis.map((kpi) => {
                                const Icon = kpi.icon;
                                return (
                                    <View key={kpi.label} style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                        <Icon size={20} color={kpi.color} />
                                        <Text style={[styles.kpiValue, { color: colors.text }]}>{kpi.value}</Text>
                                        <Text style={[styles.kpiLabel, { color: colors.muted }]}>{kpi.label}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Risk Distribution */}
                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Risk Distribution</Text>
                            <DonutChart data={riskDistribution} />
                        </View>

                        {/* Trust Score Trend */}
                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Avg Trust Score Trend</Text>
                            <TrendChart data={trendData} />
                        </View>

                        {/* High Risk Devices */}
                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>High Risk Devices</Text>
                                <TouchableOpacity onPress={() => (navigation as any).navigate('DevicesTab')}>
                                    <Text style={styles.viewAll}>View All →</Text>
                                </TouchableOpacity>
                            </View>
                            {highRiskDevices.map(d => (
                                <TouchableOpacity key={d.id} style={[styles.listItem, { borderColor: colors.border }]}
                                    onPress={() => (navigation as any).navigate('DevicesTab', { screen: 'DeviceDetail', params: { deviceId: d.id } })}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.listItemTitle, { color: colors.text }]}>{d.name}</Text>
                                        <Text style={[styles.listItemSub, { color: colors.muted }]}>{d.id} · {d.vendor}</Text>
                                    </View>
                                    <RiskBadge level={d.riskLevel} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Active Incidents */}
                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Incidents</Text>
                                <TouchableOpacity onPress={() => (navigation as any).navigate('IncidentsTab')}>
                                    <Text style={styles.viewAll}>View All →</Text>
                                </TouchableOpacity>
                            </View>
                            {activeIncidents.map(inc => (
                                <TouchableOpacity key={inc.id} style={[styles.listItem, { borderColor: colors.border }]}
                                    onPress={() => (navigation as any).navigate('IncidentsTab', { screen: 'IncidentDetail', params: { incidentId: inc.id } })}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.listItemTitle, { color: colors.text }]}>{inc.id}</Text>
                                        <Text style={[styles.listItemSub, { color: colors.muted }]}>{inc.deviceId} · {inc.recommendedAction}</Text>
                                    </View>
                                    <RiskBadge level={inc.riskLevel} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                        {/* SIEM Health Strip */}
                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>SIEM Layer Status</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    {siemLayerStatus.map(layer => (
                                        <SIEMLayerChip key={layer.layer} layer={`${layer.name} · ${layer.detail}`} color={layer.color} status={layer.status} />
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Correlated Alerts */}
                        {correlatedAlerts.length > 0 && (
                            <View style={{ marginBottom: 16 }}>
                                <Text style={[styles.sectionTitle, { color: brandColors.red, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 }]}>⚡ CORRELATED ALERTS</Text>
                                {correlatedAlerts.slice(0, 3).map(ca => (
                                    <CorrelatedAlertBanner key={ca.id} alert={ca} />
                                ))}
                            </View>
                        )}

                        {/* Security Posture Tab */}
                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Executive Summary</Text>
                            <View style={styles.postureTimeRow}>
                                {['24h', '7d', '30d', '90d', '1y'].map(t => (
                                    <TouchableOpacity key={t} style={[styles.timeBtn, t === timeRange && styles.timeBtnActive]} onPress={() => setTimeRange(t)}>
                                        <Text style={[styles.timeBtnText, t === timeRange && styles.timeBtnTextActive]}>{t}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Key Metrics */}
                        <View style={styles.metricsRow}>
                            {[
                                { label: 'Mean Time to Triage', value: currentMetrics.mttTriageVal, change: currentMetrics.mttTriageChange },
                                { label: 'Mean Time to Resolution', value: currentMetrics.mttResVal, change: currentMetrics.mttResChange },
                                { label: 'Investigations Created', value: currentMetrics.investigations, change: currentMetrics.invChange },
                            ].map(m => (
                                <View key={m.label} style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                    <Text style={[styles.metricValue, { color: colors.text }]}>{m.value}</Text>
                                    <Text style={[styles.metricLabel, { color: colors.muted }]}>{m.label}</Text>
                                    <Text style={styles.metricChange}>{m.change}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Risk Distribution Donut */}
                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Risk Distribution</Text>
                            <DonutChart data={riskDistribution} />
                        </View>

                        {/* Trust Score Trend */}
                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>{currentMetrics.chartLabel}</Text>
                            <TrendChart data={trendData} />
                        </View>

                        {/* Unread alerts summary */}
                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Untriaged Notables by Source</Text>
                            <DonutChart data={[
                                { name: 'Firewall', value: 4, color: '#FF6B35' },
                                { name: 'EDR', value: 3, color: '#E8478C' },
                                { name: 'Cloud', value: 2, color: '#4BDE80' },
                                { name: 'IAM', value: 2, color: '#FFB347' },
                                { name: 'Other', value: 1, color: '#8B8FA3' },
                            ]} />
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    tabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 0, borderBottomWidth: 1 },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabActive: { borderBottomColor: '#4BDE80' },
    tabText: { color: '#8B8FA3', fontSize: 14, fontWeight: '600' },
    tabTextActive: { color: '#FFFFFF' },
    scrollContent: { padding: 16, paddingBottom: 100 },
    kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
    kpiCard: { width: '48%', borderRadius: 14, padding: 16, borderWidth: 1, flexGrow: 1 },
    kpiValue: { fontSize: 28, fontWeight: '800', marginTop: 8 },
    kpiLabel: { fontSize: 12, marginTop: 2 },
    section: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 16 },
    sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    viewAll: { color: '#FF6B35', fontSize: 13, fontWeight: '600' },
    listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1 },
    listItemTitle: { fontSize: 14, fontWeight: '600' },
    listItemSub: { fontSize: 12, marginTop: 2 },
    legendContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { color: '#8B8FA3', fontSize: 10 },
    postureTimeRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
    timeBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.06)' },
    timeBtnActive: { backgroundColor: '#FF6B35' },
    timeBtnText: { color: '#8B8FA3', fontSize: 12, fontWeight: '600' },
    timeBtnTextActive: { color: '#FFFFFF' },
    metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    metricCard: { flex: 1, borderRadius: 12, padding: 14, borderWidth: 1, alignItems: 'center' },
    metricValue: { fontSize: 20, fontWeight: '800' },
    metricLabel: { fontSize: 10, marginTop: 4, textAlign: 'center' },
    metricChange: { color: '#FF6B35', fontSize: 11, fontWeight: '600', marginTop: 4 },
});
