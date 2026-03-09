import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { ArrowLeft, Cpu, MapPin, Wifi, Clock, Shield, AlertTriangle, Lock, Wrench } from 'lucide-react-native';
import Svg, { Line, Circle, Path, G, Text as SvgText, Rect } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { getDeviceById } from '../data/mockData';
import { RiskBadge, StatusBadge, TrustScoreBar } from '../components/RiskBadge';
import { brandColors, riskColors } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { DevicesStackParamList } from '../navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_W = SCREEN_WIDTH - 64;

type Props = {
    navigation: NativeStackNavigationProp<DevicesStackParamList, 'DeviceDetail'>;
    route: RouteProp<DevicesStackParamList, 'DeviceDetail'>;
};

export default function DeviceDetailScreen({ navigation, route }: Props) {
    const { colors } = useTheme();
    const device = getDeviceById(route.params.deviceId);

    if (!device) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: colors.text }}>Device not found</Text>
            </View>
        );
    }

    const scoreBreakdown = [
        { label: 'Behavioral', value: device.behavioral, weight: '35%' },
        { label: 'Policy', value: device.policy, weight: '30%' },
        { label: 'Drift', value: device.drift, weight: '20%' },
        { label: 'Threat Intel', value: device.threat, weight: '15%' },
    ];

    // Trust history chart
    const history = device.history.slice(-14);
    const h = 160, padX = 36, padY = 16, padB = 24;
    const chartW = CHART_W - padX, chartH = h - padY - padB;

    const points = history.map((d, i) => ({
        x: padX + (i / (history.length - 1)) * chartW,
        y: padY + chartH - (d.score / 100) * chartH,
    }));
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const areaD = pathD + ` L${points[points.length - 1].x},${padY + chartH} L${points[0].x},${padY + chartH} Z`;

    // Device action handlers (stubs for API)
    const handleClearViolations = () => {
        // TODO: POST /api/devices/:id/clear
        Alert.alert('Clear Violations', 'Violations cleared for ' + device.name);
    };
    const handleToggleMaintenance = () => {
        // TODO: POST /api/devices/:id/maintenance
        Alert.alert('Maintenance', 'Maintenance mode toggled for ' + device.name);
    };
    const handleIsolate = () => {
        // TODO: POST /api/devices/:id/isolate
        Alert.alert('Isolate Device', 'Device isolated: ' + device.name);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <ArrowLeft size={20} color={colors.text} />
                <Text style={[styles.backText, { color: colors.muted }]}>Back to Devices</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Hero Trust Panel */}
                <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.trustCircle, { borderColor: riskColors[device.riskLevel] }]}>
                        <Text style={[styles.trustScore, { color: riskColors[device.riskLevel] }]}>{device.trustScore}</Text>
                    </View>
                    <Text style={[styles.deviceName, { color: colors.text }]}>{device.name}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                        <RiskBadge level={device.riskLevel} size="md" />
                        <StatusBadge status={device.status} size="md" />
                    </View>
                </View>

                {/* Device Info */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Device Information</Text>
                    {[
                        { label: 'Vendor', value: device.vendor },
                        { label: 'Class', value: device.class },
                        { label: 'MAC', value: device.mac },
                        { label: 'IP', value: device.ip },
                        { label: 'Last Seen', value: new Date(device.lastSeen).toLocaleString() },
                    ].map(info => (
                        <View key={info.label} style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: colors.muted }]}>{info.label}</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>{info.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Score Breakdown */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Score Breakdown</Text>
                    {scoreBreakdown.map(s => (
                        <View key={s.label} style={styles.scoreItem}>
                            <View style={styles.scoreLabelRow}>
                                <Text style={[styles.scoreLabel, { color: colors.muted }]}>{s.label}</Text>
                                <Text style={[styles.scoreWeight, { color: colors.muted }]}>{s.weight}</Text>
                            </View>
                            <TrustScoreBar score={s.value} height={8} />
                        </View>
                    ))}
                </View>

                {/* Trust History Chart */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Trust History (14 days)</Text>
                    <Svg width={CHART_W} height={h}>
                        {[20, 40, 60, 80].map(v => {
                            const y = padY + chartH - (v / 100) * chartH;
                            return (
                                <G key={v}>
                                    <Line x1={padX} y1={y} x2={CHART_W} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4,4" />
                                    <SvgText x={padX - 6} y={y + 4} textAnchor="end" fill="#8B8FA3" fontSize={9}>{v}</SvgText>
                                </G>
                            );
                        })}
                        {/* Risk boundary reference lines */}
                        <Line x1={padX} y1={padY + chartH - (80 / 100) * chartH} x2={CHART_W} y2={padY + chartH - (80 / 100) * chartH} stroke="#4BDE80" strokeWidth={1} strokeDasharray="6,3" opacity={0.4} />
                        <Line x1={padX} y1={padY + chartH - (40 / 100) * chartH} x2={CHART_W} y2={padY + chartH - (40 / 100) * chartH} stroke="#FF6B35" strokeWidth={1} strokeDasharray="6,3" opacity={0.4} />
                        <Line x1={padX} y1={padY + chartH - (20 / 100) * chartH} x2={CHART_W} y2={padY + chartH - (20 / 100) * chartH} stroke="#FF4C4C" strokeWidth={1} strokeDasharray="6,3" opacity={0.4} />
                        <Path d={areaD} fill="rgba(255,107,53,0.12)" />
                        <Path d={pathD} fill="none" stroke="#FF6B35" strokeWidth={2} />
                        {points.map((p, i) => (
                            <Circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#FF6B35" />
                        ))}
                    </Svg>
                </View>

                {/* Evidence */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Evidence ({device.evidence.length})</Text>
                    {device.evidence.map(ev => (
                        <View key={ev.id} style={[styles.evidenceCard, { borderColor: colors.border }]}>
                            <View style={styles.evidenceHeader}>
                                <Text style={[styles.evidenceType, { color: colors.text }]}>{ev.type}</Text>
                                <RiskBadge level={ev.severity as any} size="sm" />
                            </View>
                            <Text style={[styles.evidenceDetails, { color: colors.muted }]}>{ev.details}</Text>
                            <Text style={[styles.evidenceTime, { color: colors.muted }]}>
                                {new Date(ev.timestamp).toLocaleString()}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Actions */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Device Actions</Text>
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'rgba(75,222,128,0.12)', borderColor: 'rgba(75,222,128,0.3)' }]} onPress={handleClearViolations}>
                            <Shield size={16} color="#4BDE80" />
                            <Text style={[styles.actionText, { color: '#4BDE80' }]}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'rgba(255,179,71,0.12)', borderColor: 'rgba(255,179,71,0.3)' }]} onPress={handleToggleMaintenance}>
                            <Wrench size={16} color="#FFB347" />
                            <Text style={[styles.actionText, { color: '#FFB347' }]}>Maintenance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'rgba(255,76,76,0.12)', borderColor: 'rgba(255,76,76,0.3)' }]} onPress={handleIsolate}>
                            <Lock size={16} color="#FF4C4C" />
                            <Text style={[styles.actionText, { color: '#FF4C4C' }]}>Isolate</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    backBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    backText: { fontSize: 14 },
    scroll: { padding: 16, paddingBottom: 100 },
    heroCard: { borderRadius: 16, padding: 24, borderWidth: 1, alignItems: 'center', marginBottom: 16 },
    trustCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    trustScore: { fontSize: 28, fontWeight: '800' },
    deviceName: { fontSize: 20, fontWeight: '700' },
    section: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 16 },
    sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
    infoLabel: { fontSize: 13 },
    infoValue: { fontSize: 13, fontWeight: '600' },
    scoreItem: { marginBottom: 12 },
    scoreLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    scoreLabel: { fontSize: 13 },
    scoreWeight: { fontSize: 11 },
    evidenceCard: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 8 },
    evidenceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    evidenceType: { fontSize: 13, fontWeight: '600', flex: 1, marginRight: 8 },
    evidenceDetails: { fontSize: 12, lineHeight: 18 },
    evidenceTime: { fontSize: 11, marginTop: 6 },
    actionRow: { flexDirection: 'row', gap: 10 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 10, borderWidth: 1 },
    actionText: { fontSize: 12, fontWeight: '700' },
});
