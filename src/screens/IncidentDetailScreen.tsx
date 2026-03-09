import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { ArrowLeft, AlertTriangle, Shield, Clock, Users, FileText, MessageSquare } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { getIncidentById, getDeviceById } from '../data/mockData';
import { RiskBadge, StatusBadge } from '../components/RiskBadge';
import { brandColors, riskColors } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { IncidentsStackParamList } from '../navigation/types';

type Props = {
    navigation: NativeStackNavigationProp<IncidentsStackParamList, 'IncidentDetail'>;
    route: RouteProp<IncidentsStackParamList, 'IncidentDetail'>;
};

export default function IncidentDetailScreen({ navigation, route }: Props) {
    const { colors } = useTheme();
    const incident = getIncidentById(route.params.incidentId);
    const device = incident ? getDeviceById(incident.deviceId) : undefined;
    const [notes, setNotes] = useState<{ text: string; time: string }[]>([]);
    const [noteInput, setNoteInput] = useState('');
    const [status, setStatus] = useState(incident?.status || 'open');

    if (!incident) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: colors.text }}>Incident not found</Text>
            </View>
        );
    }

    const handleAddNote = () => {
        if (!noteInput.trim()) return;
        // TODO: POST /api/incidents/:id/notes
        setNotes(prev => [{ text: noteInput.trim(), time: new Date().toLocaleTimeString() }, ...prev]);
        setNoteInput('');
    };

    const handleStatusChange = (newStatus: string) => {
        // TODO: PATCH /api/incidents/:id/status
        setStatus(newStatus as any);
        Alert.alert('Status Updated', `Incident status changed to ${newStatus}`);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <ArrowLeft size={20} color={colors.text} />
                <Text style={[styles.backText, { color: colors.muted }]}>Back to Investigations</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Risk Summary */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.riskRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.incidentId, { color: colors.text }]}>{incident.id}</Text>
                            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                                <RiskBadge level={incident.riskLevel} size="md" />
                                <StatusBadge status={status} size="md" />
                            </View>
                        </View>
                        <View style={styles.scoreBadge}>
                            <Text style={[styles.trustVal, { color: riskColors[incident.riskLevel] }]}>{incident.trustScore}</Text>
                            <Text style={[styles.trustLabel, { color: colors.muted }]}>Trust</Text>
                        </View>
                        <View style={styles.scoreBadge}>
                            <Text style={[styles.confVal, { color: brandColors.orange }]}>{incident.confidence}%</Text>
                            <Text style={[styles.trustLabel, { color: colors.muted }]}>Confidence</Text>
                        </View>
                    </View>
                </View>

                {/* Device Context */}
                {device && (
                    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Device Context</Text>
                        {[
                            { label: 'Device', value: `${incident.deviceId} · ${device.name}` },
                            { label: 'Vendor', value: incident.vendor },
                            { label: 'IP', value: incident.ip },
                            { label: 'Class', value: device.class },
                        ].map(info => (
                            <View key={info.label} style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.muted }]}>{info.label}</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>{info.value}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Narrative */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.headerRow}>
                        <FileText size={16} color={brandColors.orange} />
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0, marginLeft: 8 }]}>Incident Narrative</Text>
                    </View>
                    <View style={[styles.narrativeBox, { borderColor: colors.border }]}>
                        <Text style={[styles.narrativeText, { color: colors.text }]}>{incident.narrative}</Text>
                    </View>
                </View>

                {/* Evidence */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Evidence ({incident.evidence.length})</Text>
                    {incident.evidence.map((ev, i) => (
                        <View key={i} style={[styles.evidenceItem, { borderColor: colors.border }]}>
                            <View style={[styles.evidenceNum, { backgroundColor: brandColors.red + '20' }]}>
                                <Text style={{ color: brandColors.red, fontSize: 11, fontWeight: '700' }}>{i + 1}</Text>
                            </View>
                            <Text style={[styles.evidenceText, { color: colors.text }]}>{ev}</Text>
                        </View>
                    ))}
                </View>

                {/* Recommended Action */}
                <View style={[styles.actionCard, { borderColor: brandColors.red + '40' }]}>
                    <AlertTriangle size={18} color={brandColors.red} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={[styles.actionLabel, { color: colors.muted }]}>Recommended Action</Text>
                        <Text style={[styles.actionValue, { color: '#FFFFFF' }]}>{incident.recommendedAction}</Text>
                    </View>
                </View>

                {/* Adjacent Devices */}
                {incident.adjacentDevices.length > 0 && (
                    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.headerRow}>
                            <Users size={16} color={brandColors.gold} />
                            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0, marginLeft: 8 }]}>Adjacent Devices at Risk</Text>
                        </View>
                        {incident.adjacentDevices.map(did => {
                            const d = getDeviceById(did);
                            return (
                                <View key={did} style={[styles.adjDevice, { borderColor: colors.border }]}>
                                    <Text style={[styles.adjId, { color: colors.text }]}>{did}</Text>
                                    <Text style={[styles.adjName, { color: colors.muted }]}>{d?.name || 'Unknown'}</Text>
                                    {d && <RiskBadge level={d.riskLevel} size="sm" />}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Timeline */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.headerRow}>
                        <Clock size={16} color={brandColors.pink} />
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0, marginLeft: 8 }]}>Timeline</Text>
                    </View>
                    {incident.timeline.map((t, i) => (
                        <View key={i} style={styles.timelineItem}>
                            <View style={styles.timelineDot}>
                                <View style={[styles.dot, { backgroundColor: i === 0 ? brandColors.red : brandColors.orange }]} />
                                {i < incident.timeline.length - 1 && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
                            </View>
                            <View style={styles.timelineContent}>
                                <Text style={[styles.timelineTime, { color: brandColors.orange }]}>{t.time}</Text>
                                <Text style={[styles.timelineEvent, { color: colors.text }]}>{t.event}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Status Control */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Change Status</Text>
                    <View style={styles.statusRow}>
                        {['open', 'investigating', 'resolved', 'closed'].map(s => (
                            <TouchableOpacity key={s} style={[styles.statusBtn, status === s && styles.statusBtnActive]} onPress={() => handleStatusChange(s)}>
                                <Text style={[styles.statusBtnText, status === s && styles.statusBtnTextActive]}>{s.charAt(0).toUpperCase() + s.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Analyst Notes */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.headerRow}>
                        <MessageSquare size={16} color={brandColors.green} />
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0, marginLeft: 8 }]}>Analyst Notes</Text>
                    </View>
                    <View style={styles.noteInputRow}>
                        <TextInput style={[styles.noteInput, { color: colors.text, borderColor: colors.border }]} placeholder="Add a note..." placeholderTextColor={colors.muted} value={noteInput} onChangeText={setNoteInput} multiline />
                        <TouchableOpacity style={styles.noteBtn} onPress={handleAddNote}>
                            <Text style={styles.noteBtnText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    {notes.map((n, i) => (
                        <View key={i} style={[styles.noteItem, { borderColor: colors.border }]}>
                            <Text style={[styles.noteText, { color: colors.text }]}>{n.text}</Text>
                            <Text style={[styles.noteTime, { color: colors.muted }]}>Analyst · {n.time}</Text>
                        </View>
                    ))}
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
    section: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 16 },
    sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    riskRow: { flexDirection: 'row', alignItems: 'center' },
    incidentId: { fontSize: 20, fontWeight: '800' },
    scoreBadge: { alignItems: 'center', marginLeft: 16 },
    trustVal: { fontSize: 24, fontWeight: '800' },
    confVal: { fontSize: 20, fontWeight: '700' },
    trustLabel: { fontSize: 10, marginTop: 2 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
    infoLabel: { fontSize: 13 },
    infoValue: { fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' },
    narrativeBox: { borderWidth: 1, borderRadius: 10, padding: 14, backgroundColor: 'rgba(255,107,53,0.04)' },
    narrativeText: { fontSize: 13, lineHeight: 20 },
    evidenceItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, gap: 10, borderBottomWidth: 1 },
    evidenceNum: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    evidenceText: { fontSize: 13, flex: 1, lineHeight: 18 },
    actionCard: { borderRadius: 12, padding: 16, borderWidth: 1, backgroundColor: 'rgba(255,76,76,0.08)', flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    actionLabel: { fontSize: 11, marginBottom: 2 },
    actionValue: { fontSize: 14, fontWeight: '700' },
    adjDevice: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 8, borderBottomWidth: 1 },
    adjId: { fontSize: 13, fontWeight: '700', width: 72 },
    adjName: { flex: 1, fontSize: 13 },
    timelineItem: { flexDirection: 'row', minHeight: 50 },
    timelineDot: { width: 20, alignItems: 'center' },
    dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
    timelineLine: { width: 2, flex: 1, marginTop: 2 },
    timelineContent: { flex: 1, paddingLeft: 10, paddingBottom: 16 },
    timelineTime: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
    timelineEvent: { fontSize: 13, lineHeight: 18 },
    statusRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    statusBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    statusBtnActive: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
    statusBtnText: { color: '#8B8FA3', fontSize: 12, fontWeight: '600' },
    statusBtnTextActive: { color: '#FFFFFF' },
    noteInputRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    noteInput: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, minHeight: 44 },
    noteBtn: { backgroundColor: '#FF6B35', paddingHorizontal: 20, borderRadius: 10, justifyContent: 'center' },
    noteBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
    noteItem: { paddingVertical: 10, borderBottomWidth: 1 },
    noteText: { fontSize: 13, lineHeight: 18 },
    noteTime: { fontSize: 11, marginTop: 4 },
});
