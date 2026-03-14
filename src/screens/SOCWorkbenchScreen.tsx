import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert as RNAlert } from 'react-native';
import { ArrowLeft, Play, CheckCircle, Clock, User, FileText, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { brandColors } from '../theme/colors';
import { socQueue, auditLog } from '../data/mockData';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MoreStackParamList } from '../navigation/types';

type Props = {
    navigation: NativeStackNavigationProp<MoreStackParamList, 'SOCWorkbenchScreen'>;
};

type SOCTab = 'queue' | 'audit';

// Playbook steps per incident
const playbookSteps: Record<string, { id: string; label: string; status: 'done' | 'active' | 'pending' }[]> = {
    'INC-001': [
        { id: '1', label: 'Confirm anomaly via UEBA drift check', status: 'done' },
        { id: '2', label: 'Isolate device to VLAN 99', status: 'active' },
        { id: '3', label: 'Notify NOC team lead', status: 'pending' },
        { id: '4', label: 'File incident report', status: 'pending' },
    ],
    'INC-002': [
        { id: '1', label: 'Verify beaconing pattern', status: 'done' },
        { id: '2', label: 'Block outbound C2 traffic', status: 'done' },
        { id: '3', label: 'Segment medical device subnet', status: 'active' },
        { id: '4', label: 'Run deep packet inspection', status: 'pending' },
    ],
    'INC-003': [
        { id: '1', label: 'Confirm unauthorized firmware', status: 'done' },
        { id: '2', label: 'Isolate infusion pump', status: 'active' },
        { id: '3', label: 'Factory reset device', status: 'pending' },
        { id: '4', label: 'Re-flash approved firmware', status: 'pending' },
    ],
};

export default function SOCWorkbenchScreen({ navigation }: Props) {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState<SOCTab>('queue');
    const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
    const [noteText, setNoteText] = useState('');

    const severityColors: Record<string, string> = {
        critical: '#FF4C4C',
        high: '#E8478C',
        medium: '#FF6B35',
        low: '#F59E0B',
    };

    const handleExecuteStep = (incidentId: string, stepId: string) => {
        RNAlert.alert('Execute Step', `Execute playbook step ${stepId} for ${incidentId}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Execute', onPress: () => RNAlert.alert('Success', 'Step executed successfully') },
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={20} color={colors.text} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerLabel, { color: '#10B981' }]}>SOC ANALYST</Text>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>SOC Workbench</Text>
                </View>
                <View style={styles.analystBadge}>
                    <User size={12} color="#10B981" />
                    <Text style={styles.analystText}>jitraj</Text>
                </View>
            </View>

            {/* Tab Toggle */}
            <View style={[styles.tabBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {([
                    { id: 'queue' as SOCTab, label: 'My Queue', count: socQueue.filter(q => q.status !== 'resolved').length },
                    { id: 'audit' as SOCTab, label: 'Audit Log', count: auditLog.length },
                ]).map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Text style={[styles.tabText, { color: activeTab === tab.id ? '#FFFFFF' : colors.muted }]}>{tab.label}</Text>
                        <View style={[styles.tabBadge, { backgroundColor: activeTab === tab.id ? '#10B98130' : colors.border + '30' }]}>
                            <Text style={[styles.tabBadgeText, { color: activeTab === tab.id ? '#10B981' : colors.muted }]}>{tab.count}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {activeTab === 'queue' ? (
                    <>
                        {socQueue.map(item => {
                            const sevColor = severityColors[item.severity] || '#8B8FA3';
                            const isSelected = selectedIncident === item.incidentId;
                            const steps = playbookSteps[item.incidentId] || [];

                            return (
                                <TouchableOpacity
                                    key={item.incidentId}
                                    style={[styles.queueCard, {
                                        backgroundColor: colors.card,
                                        borderColor: isSelected ? sevColor + '50' : colors.border,
                                        borderLeftColor: sevColor,
                                        borderLeftWidth: 3,
                                    }]}
                                    onPress={() => setSelectedIncident(isSelected ? null : item.incidentId)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.queueHeader}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <Text style={[styles.queueId, { color: colors.text }]}>{item.incidentId}</Text>
                                                <View style={[styles.sevPill, { backgroundColor: sevColor + '15', borderColor: sevColor + '30' }]}>
                                                    <Text style={[styles.sevPillText, { color: sevColor }]}>{item.severity.toUpperCase()}</Text>
                                                </View>
                                            </View>
                                            <Text style={[styles.queueDevice, { color: colors.muted }]}>{item.deviceId} · {item.deviceName}</Text>
                                        </View>
                                        <View style={[styles.statusBadge, {
                                            backgroundColor: item.status === 'in_progress' ? '#F59E0B15' : '#8B8FA315',
                                        }]}>
                                            <Text style={[styles.statusText, { color: item.status === 'in_progress' ? '#F59E0B' : '#8B8FA3' }]}>
                                                {item.status === 'in_progress' ? 'IN PROGRESS' : 'QUEUED'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.queueSummary, { color: colors.muted }]} numberOfLines={2}>{item.summary}</Text>

                                    {/* Expanded: Playbook Steps */}
                                    {isSelected && steps.length > 0 && (
                                        <View style={[styles.playbookSection, { borderColor: colors.border }]}>
                                            <Text style={[styles.playbookLabel, { color: colors.muted }]}>PLAYBOOK STEPS</Text>
                                            {steps.map(step => (
                                                <View key={step.id} style={[styles.stepRow, { borderColor: colors.border }]}>
                                                    <View style={[styles.stepDot, {
                                                        backgroundColor: step.status === 'done' ? '#10B981' : step.status === 'active' ? '#F59E0B' : colors.border,
                                                    }]}>
                                                        {step.status === 'done' && <CheckCircle size={10} color="#fff" />}
                                                    </View>
                                                    <Text style={[styles.stepLabel, {
                                                        color: step.status === 'done' ? '#4BDE80' : step.status === 'active' ? '#F59E0B' : colors.muted,
                                                        textDecorationLine: step.status === 'done' ? 'line-through' : 'none',
                                                    }]}>{step.label}</Text>
                                                    {step.status === 'active' && (
                                                        <TouchableOpacity
                                                            style={styles.executeBtn}
                                                            onPress={() => handleExecuteStep(item.incidentId, step.id)}
                                                        >
                                                            <Play size={10} color="#fff" />
                                                            <Text style={styles.executeBtnText}>Execute</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            ))}
                                            {/* Note Input */}
                                            <View style={styles.noteRow}>
                                                <TextInput
                                                    style={[styles.noteInput, { color: colors.text, borderColor: colors.border }]}
                                                    placeholder="Add analyst note..."
                                                    placeholderTextColor={colors.muted}
                                                    value={noteText}
                                                    onChangeText={setNoteText}
                                                />
                                                <TouchableOpacity style={styles.noteBtn} onPress={() => { setNoteText(''); }}>
                                                    <Text style={styles.noteBtnText}>Add</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}

                        {/* Take Next Button */}
                        <TouchableOpacity style={styles.takeNextBtn}>
                            <ChevronRight size={16} color="#FFFFFF" />
                            <Text style={styles.takeNextText}>Take Next Queued Incident</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {/* Audit Log */}
                        {auditLog.map(entry => (
                            <View key={entry.id} style={[styles.auditRow, { borderColor: colors.border }]}>
                                <Text style={[styles.auditTime, { color: brandColors.orange }]}>{entry.timestamp}</Text>
                                <View style={styles.auditContent}>
                                    <Text style={[styles.auditAnalyst, { color: colors.text }]}>{entry.analyst}</Text>
                                    <Text style={[styles.auditAction, { color: colors.muted }]}>{entry.action} <Text style={{ color: brandColors.orange, fontWeight: '600' }}>{entry.target}</Text></Text>
                                </View>
                            </View>
                        ))}

                        {auditLog.length === 0 && (
                            <View style={styles.empty}>
                                <FileText size={32} color={colors.muted} />
                                <Text style={[styles.emptyText, { color: colors.muted }]}>No audit entries</Text>
                            </View>
                        )}
                    </>
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
    analystBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#10B98115', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
    analystText: { fontSize: 11, fontWeight: '600', color: '#10B981' },
    tabBar: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 8 },
    tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabItemActive: { borderBottomColor: '#10B981' },
    tabText: { fontSize: 13, fontWeight: '600' },
    tabBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
    tabBadgeText: { fontSize: 10, fontWeight: '700' },
    scroll: { padding: 16, paddingBottom: 100 },
    queueCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10 },
    queueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    queueId: { fontSize: 15, fontWeight: '700' },
    queueDevice: { fontSize: 11, marginTop: 2 },
    sevPill: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, borderWidth: 1 },
    sevPillText: { fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    statusText: { fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
    queueSummary: { fontSize: 12, lineHeight: 16 },
    playbookSection: { borderTopWidth: 1, marginTop: 12, paddingTop: 12 },
    playbookLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
    stepRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10, borderBottomWidth: 1 },
    stepDot: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    stepLabel: { flex: 1, fontSize: 12 },
    executeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
    executeBtnText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
    noteRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    noteInput: { flex: 1, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 12 },
    noteBtn: { backgroundColor: '#10B981', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
    noteBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
    takeNextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 12, marginTop: 8 },
    takeNextText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    auditRow: { flexDirection: 'row', paddingVertical: 12, gap: 12, borderBottomWidth: 1 },
    auditTime: { fontSize: 12, fontWeight: '700', width: 40 },
    auditContent: { flex: 1 },
    auditAnalyst: { fontSize: 13, fontWeight: '600' },
    auditAction: { fontSize: 12, marginTop: 2 },
    empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
    emptyText: { fontSize: 14 },
});
