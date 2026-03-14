import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Terminal, ChevronUp, Trash2 } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { devices, incidents, initialAlerts, uebaEntities, iocs, killChains, complianceFunctions, overallComplianceScore, socQueue, auditLog, siemLayerStatus } from '../data/mockData';

type OutputLine = { text: string; color?: string; bold?: boolean };

function handleCommand(input: string): OutputLine[] {
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0]?.toLowerCase();
    if (!cmd) return [{ text: 'Type a command. Use "help" to get started.', color: '#8B8FA3' }];

    if (cmd === 'help') {
        return [
            { text: 'Sentinel SIEM CLI — Commands', color: '#FF5A1F', bold: true },
            { text: '' },
            { text: '  sentinel status              System health', color: '#4BDE80' },
            { text: '  sentinel stats               System statistics', color: '#4BDE80' },
            { text: '  sentinel layers              Pipeline layer status', color: '#4BDE80' },
            { text: '  sentinel devices list         List all devices', color: '#3B82F6' },
            { text: '  sentinel devices get <id>     Device detail', color: '#3B82F6' },
            { text: '  sentinel incidents list       List incidents', color: '#F59E0B' },
            { text: '  sentinel incidents get <id>   Incident detail', color: '#F59E0B' },
            { text: '  sentinel alerts list          Recent alerts', color: '#E02424' },
            { text: '  sentinel ti list              IOC feed', color: '#FF5A1F' },
            { text: '  sentinel ti check <value>     Check IOC', color: '#FF5A1F' },
            { text: '  sentinel ueba list            Entity drift scores', color: '#7E3AF2' },
            { text: '  sentinel ueba get <id>        Entity detail', color: '#7E3AF2' },
            { text: '  sentinel killchain list       Active kill chains', color: '#E02424' },
            { text: '  sentinel compliance status    Compliance posture', color: '#8B5CF6' },
            { text: '  sentinel soc queue            Analyst queue', color: '#10B981' },
            { text: '  sentinel soc audit-log        Audit trail', color: '#10B981' },
            { text: '  sentinel model info           Model details', color: '#1A56DB' },
            { text: '  sentinel demo list            Available demos', color: '#FFB347' },
            { text: '  sentinel logs tail            Log tail preview', color: '#8B8FA3' },
            { text: '  clear                         Clear console', color: '#8B8FA3' },
        ];
    }

    // Allow "sentinel ..." prefix or direct command
    const effectiveCmd = cmd === 'sentinel' ? parts[1]?.toLowerCase() : cmd;
    const effectiveSub = cmd === 'sentinel' ? parts[2]?.toLowerCase() : parts[1]?.toLowerCase();
    const effectiveArg = cmd === 'sentinel' ? parts[3] : parts[2];

    if (!effectiveCmd) return [{ text: 'Usage: sentinel <command>. Type "help" for list.', color: '#F59E0B' }];

    // ── status ──
    if (effectiveCmd === 'status') {
        return [
            { text: '✅ API         : http://localhost:8000  [healthy]', color: '#4BDE80' },
            { text: '✅ Database    : PostgreSQL 16.x        [connected]', color: '#4BDE80' },
            { text: '✅ Redis Cache : 127.0.0.1:6379        [connected]', color: '#4BDE80' },
            { text: '✅ WebSocket   : ws://localhost:8000/ws [active]', color: '#4BDE80' },
            { text: '✅ ML Model    : Isolation Forest       [loaded]', color: '#4BDE80' },
        ];
    }

    // ── stats ──
    if (effectiveCmd === 'stats') {
        const critical = devices.filter(d => d.riskLevel === 'critical').length;
        const high = devices.filter(d => d.riskLevel === 'high').length;
        const open = incidents.filter(i => i.status === 'open').length;
        return [
            { text: '── System Statistics ──', color: '#FF5A1F', bold: true },
            { text: `  Total Devices     : ${devices.length}` },
            { text: `  Critical Risk     : ${critical}`, color: critical > 0 ? '#FF4C4C' : '#4BDE80' },
            { text: `  High Risk         : ${high}`, color: high > 0 ? '#FF6B35' : '#4BDE80' },
            { text: `  Open Incidents    : ${open}`, color: open > 0 ? '#F59E0B' : '#4BDE80' },
            { text: `  Active Alerts     : ${initialAlerts.length}` },
            { text: `  Active IOCs       : ${iocs.filter(i => i.active).length}` },
            { text: `  Kill Chains       : ${killChains.filter(k => k.status === 'active').length} active` },
            { text: `  Compliance Score  : ${overallComplianceScore}/100` },
        ];
    }

    // ── layers ──
    if (effectiveCmd === 'layers') {
        return [
            { text: '── Pipeline Layer Status ──', color: '#FF5A1F', bold: true },
            ...siemLayerStatus.map(l => {
                const icon = l.status === 'live' ? '✅' : l.status === 'warning' ? '⚠️' : '🚨';
                const clr = l.status === 'live' ? '#4BDE80' : l.status === 'warning' ? '#F59E0B' : '#FF4C4C';
                return { text: `  ${icon} ${l.layer.padEnd(16)} ${l.status.toUpperCase().padEnd(10)} ${l.detail}`, color: clr };
            }),
        ];
    }

    // ── devices ──
    if (effectiveCmd === 'devices') {
        if (!effectiveSub || effectiveSub === 'list') {
            const sorted = [...devices].sort((a, b) => a.trustScore - b.trustScore);
            return [
                { text: 'DEVICE ID    CLASS         IP               TRUST  RISK', color: '#8B8FA3', bold: true },
                { text: '─'.repeat(58), color: '#2A2A3A' },
                ...sorted.map(d => ({
                    text: `${d.id.padEnd(13)}${d.class.padEnd(14)}${d.ip.padEnd(17)}${String(d.trustScore).padEnd(7)}${d.riskLevel.toUpperCase()}`,
                    color: d.riskLevel === 'critical' ? '#FF4C4C' : d.riskLevel === 'high' ? '#FF6B35' : d.riskLevel === 'medium' ? '#FFB347' : '#4BDE80',
                })),
            ];
        }
        if (effectiveSub === 'get' && effectiveArg) {
            const dev = devices.find(d => d.id.toLowerCase() === effectiveArg.toLowerCase() || d.name.toLowerCase().includes(effectiveArg.toLowerCase()));
            if (!dev) return [{ text: `Device "${effectiveArg}" not found.`, color: '#FF4C4C' }];
            return [
                { text: `┌── DEVICE: ${dev.id} ──┐`, color: '#3B82F6', bold: true },
                { text: `  Name        : ${dev.name}` },
                { text: `  Class       : ${dev.class}` },
                { text: `  Vendor      : ${dev.vendor}` },
                { text: `  IP          : ${dev.ip}` },
                { text: `  MAC         : ${dev.mac}` },
                { text: `  Trust Score : ${dev.trustScore}`, color: dev.trustScore < 40 ? '#FF4C4C' : dev.trustScore < 65 ? '#FFB347' : '#4BDE80' },
                { text: `  Risk Level  : ${dev.riskLevel.toUpperCase()}` },
                { text: `  Status      : ${dev.status.toUpperCase()}` },
                { text: `  Last Seen   : ${new Date(dev.lastSeen).toLocaleString()}` },
                { text: `  Behavioral  : ${dev.behavioral}  Policy: ${dev.policy}  Drift: ${dev.drift}  Threat: ${dev.threat}` },
            ];
        }
        return [{ text: 'Usage: sentinel devices [list|get <id>]', color: '#F59E0B' }];
    }

    // ── incidents ──
    if (effectiveCmd === 'incidents') {
        if (!effectiveSub || effectiveSub === 'list') {
            return [
                { text: 'ID                STATUS        DEVICE     RISK       CONF', color: '#8B8FA3', bold: true },
                { text: '─'.repeat(60), color: '#2A2A3A' },
                ...incidents.map(i => ({
                    text: `${i.id.padEnd(18)}${i.status.toUpperCase().padEnd(14)}${i.deviceId.padEnd(11)}${i.riskLevel.toUpperCase().padEnd(11)}${i.confidence}%`,
                    color: i.riskLevel === 'critical' ? '#FF4C4C' : i.riskLevel === 'high' ? '#FF6B35' : '#FFB347',
                })),
            ];
        }
        if (effectiveSub === 'get' && effectiveArg) {
            const inc = incidents.find(i => i.id.toLowerCase() === effectiveArg.toLowerCase());
            if (!inc) return [{ text: `Incident "${effectiveArg}" not found.`, color: '#FF4C4C' }];
            return [
                { text: `┌── INCIDENT: ${inc.id}  [${inc.status.toUpperCase()}] ──┐`, color: '#F59E0B', bold: true },
                { text: `  Device      : ${inc.deviceId}` },
                { text: `  Risk Level  : ${inc.riskLevel.toUpperCase()}` },
                { text: `  Confidence  : ${inc.confidence}%` },
                { text: `  Created     : ${new Date(inc.createdAt).toLocaleString()}` },
                { text: '' },
                { text: '  NARRATIVE', color: '#8B8FA3', bold: true },
                { text: `  ${inc.narrative.slice(0, 200)}${inc.narrative.length > 200 ? '...' : ''}` },
            ];
        }
        if (effectiveSub === 'narrative' && effectiveArg) {
            const inc = incidents.find(i => i.id.toLowerCase() === effectiveArg.toLowerCase());
            if (!inc) return [{ text: `Incident "${effectiveArg}" not found.`, color: '#FF4C4C' }];
            return [{ text: inc.narrative }];
        }
        return [{ text: 'Usage: sentinel incidents [list|get <id>|narrative <id>]', color: '#F59E0B' }];
    }

    // ── alerts ──
    if (effectiveCmd === 'alerts') {
        return [
            { text: `── Recent Alerts (${initialAlerts.length}) ──`, color: '#E02424', bold: true },
            ...initialAlerts.slice(0, 10).map(a => ({
                text: `  [${a.severity.toUpperCase().padEnd(8)}] ${a.type.replace(/_/g, ' ').padEnd(20)} ${a.deviceId.padEnd(10)} ${new Date(a.timestamp).toLocaleTimeString()}`,
                color: a.severity === 'critical' ? '#FF4C4C' : a.severity === 'warning' ? '#FFB347' : '#3B82F6',
            })),
            ...(initialAlerts.length > 10 ? [{ text: `  ... and ${initialAlerts.length - 10} more`, color: '#8B8FA3' }] : []),
        ];
    }

    // ── ti ──
    if (effectiveCmd === 'ti') {
        if (effectiveSub === 'check' && effectiveArg) {
            const match = iocs.find(i => i.value.toLowerCase().includes(effectiveArg.toLowerCase()));
            if (match) return [
                { text: '🚨 MATCH FOUND', color: '#FF4C4C', bold: true },
                { text: `  Value    : ${match.value}` },
                { text: `  Type     : ${match.type}` },
                { text: `  Severity : ${match.severity.toUpperCase()}`, color: match.severity === 'critical' ? '#FF4C4C' : '#FF6B35' },
                { text: `  Source   : ${match.source}` },
                { text: `  Hits     : ${match.hits}` },
                { text: `  Active   : ${match.active ? 'YES' : 'NO'}` },
            ];
            return [{ text: `✅ No IOC match for "${effectiveArg}"`, color: '#4BDE80' }];
        }
        if (!effectiveSub || effectiveSub === 'list') {
            return [
                { text: `── IOC Feed (${iocs.length} indicators) ──`, color: '#FF5A1F', bold: true },
                ...iocs.map(i => ({
                    text: `  [${i.severity.toUpperCase().padEnd(8)}] ${i.type.padEnd(7)} ${i.value.padEnd(26)} ${i.source.padEnd(8)} ${i.active ? '●' : '○'} ${i.hits} hits`,
                    color: i.severity === 'critical' ? '#FF4C4C' : i.severity === 'high' ? '#FF6B35' : '#FFB347',
                })),
            ];
        }
        return [{ text: 'Usage: sentinel ti [list|check <ip/domain/hash>]', color: '#F59E0B' }];
    }

    // ── ueba ──
    if (effectiveCmd === 'ueba') {
        if (!effectiveSub || effectiveSub === 'list') {
            return [
                { text: 'ENTITY         DRIFT σ    STATUS     FEATURES', color: '#8B8FA3', bold: true },
                { text: '─'.repeat(55), color: '#2A2A3A' },
                ...uebaEntities.map(e => ({
                    text: `${e.deviceId.padEnd(15)}${e.driftSigma.toFixed(1).padEnd(11)}${e.status.toUpperCase().padEnd(11)}${e.features.length} features`,
                    color: e.status === 'alert' ? '#FF4C4C' : e.status === 'drift' ? '#FFB347' : '#4BDE80',
                })),
            ];
        }
        if (effectiveSub === 'get' && effectiveArg) {
            const entity = uebaEntities.find(e => e.deviceId.toLowerCase() === effectiveArg.toLowerCase());
            if (!entity) return [{ text: `Entity "${effectiveArg}" not found.`, color: '#FF4C4C' }];
            return [
                { text: `┌── UEBA: ${entity.deviceId} ──┐`, color: '#7E3AF2', bold: true },
                { text: `  Name        : ${entity.deviceName}` },
                { text: `  Drift σ     : ${entity.driftSigma.toFixed(2)}`, color: entity.driftSigma > 3 ? '#FF4C4C' : '#F59E0B' },
                { text: `  Status      : ${entity.status.toUpperCase()}` },
                { text: '' },
                { text: '  DRIFT FEATURES', color: '#8B8FA3', bold: true },
                ...entity.features.map(f => ({
                    text: `    ${f.name.padEnd(18)} baseline: ${f.baseline.toFixed(1).padEnd(6)} current: ${f.current.toFixed(1)} ${f.unit}`,
                    color: Math.abs(f.current - f.baseline) > f.baseline * 0.5 ? '#FF4C4C' : undefined,
                })),
            ];
        }
        return [{ text: 'Usage: sentinel ueba [list|get <entity_id>]', color: '#F59E0B' }];
    }

    // ── killchain ──
    if (effectiveCmd === 'killchain') {
        return [
            { text: `── Kill Chains (${killChains.length}) ──`, color: '#E02424', bold: true },
            ...killChains.map(k => ({
                text: `  ${k.id.padEnd(12)} ${k.status.toUpperCase().padEnd(10)} stages: ${k.stages.length}  devices: ${k.devices.join(', ')}`,
                color: k.status === 'active' ? '#FF4C4C' : '#4BDE80',
            })),
        ];
    }

    // ── compliance ──
    if (effectiveCmd === 'compliance') {
        return [
            { text: `── Compliance Posture ── Score: ${overallComplianceScore}/100`, color: '#8B5CF6', bold: true },
            { text: '' },
            ...complianceFunctions.map(f => ({
                text: `  ${f.name.padEnd(14)} ${String(f.score).padEnd(3)}/100  ${'█'.repeat(Math.round(f.score / 5))}${'░'.repeat(20 - Math.round(f.score / 5))}  ${f.controls.length} ctrl`,
                color: f.score >= 80 ? '#4BDE80' : f.score >= 60 ? '#FFB347' : '#FF4C4C',
            })),
        ];
    }

    // ── soc ──
    if (effectiveCmd === 'soc') {
        if (effectiveSub === 'audit-log') {
            return [
                { text: '── SOC Audit Log ──', color: '#10B981', bold: true },
                ...auditLog.map(e => ({
                    text: `  ${new Date(e.timestamp).toLocaleTimeString()} │ ${e.analyst.padEnd(10)} │ ${e.action}`,
                })),
            ];
        }
        return [
            { text: '── SOC Analyst Queue ──', color: '#10B981', bold: true },
            ...socQueue.map(q => ({
                text: `  ${q.incidentId.padEnd(16)} ${q.severity.toUpperCase().padEnd(10)} ${q.status.toUpperCase().padEnd(14)} ${q.assignedTo || 'unassigned'}`,
                color: q.severity === 'critical' ? '#FF4C4C' : q.severity === 'high' ? '#FF6B35' : '#FFB347',
            })),
        ];
    }

    // ── model ──
    if (effectiveCmd === 'model') {
        return [
            { text: '── ML Model Info ──', color: '#1A56DB', bold: true },
            { text: '  Algorithm    : Isolation Forest (scikit-learn)' },
            { text: '  Estimators   : 200' },
            { text: '  Contamination: 0.05' },
            { text: '  Threshold    : -0.3197' },
            { text: '  Training Set : CIC-IDS-2017 + CSE-CIC-IDS-2018 (benign)' },
            { text: '  Last Trained : 2026-03-12 02:30:00 IST' },
            { text: '  Status       : loaded ✅', color: '#4BDE80' },
        ];
    }

    // ── demo ──
    if (effectiveCmd === 'demo') {
        return [
            { text: '── Available Demo Scenarios ──', color: '#FFB347', bold: true },
            { text: '  hostel_attack     Full APT kill chain simulation' },
            { text: '  dns_exfil         DNS exfiltration detection' },
            { text: '  brute_force       Credential stuffing attack' },
            { text: '  insider_threat    Insider data theft scenario' },
            { text: '  normal            Normal benign traffic baseline' },
            { text: '' },
            { text: '  Usage: sentinel demo run <scenario> --watch', color: '#8B8FA3' },
        ];
    }

    // ── logs ──
    if (effectiveCmd === 'logs') {
        const now = new Date().toISOString();
        return [
            { text: '── Log Explorer ──', color: '#8B8FA3', bold: true },
            { text: `  ${now} [INFO]  syslog_receiver  started on :1514` },
            { text: `  ${now} [INFO]  kafka_producer   connected to broker` },
            { text: `  ${now} [WARN]  parser_engine    unknown format (2 logs)`, color: '#F59E0B' },
            { text: `  ${now} [INFO]  enrichment       geoip resolved 14 IPs` },
            { text: `  ${now} [ALERT] rule_engine      sigma match: brute_force`, color: '#FF4C4C' },
            { text: '' },
            { text: '  Backend required for live tail.', color: '#8B8FA3' },
        ];
    }

    if (effectiveCmd === 'clear') return [{ text: '__CLEAR__' }];

    return [{ text: `Unknown command: "${input}". Type "help".`, color: '#FF4C4C' }];
}

export default function CLIScreen() {
    const { colors } = useTheme();
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState<{ input: string; output: OutputLine[] }[]>([
        { input: '', output: [
            { text: '╔══════════════════════════════════════╗', color: '#FF5A1F' },
            { text: '║    Sentinel SIEM CLI v1.0.0          ║', color: '#FF5A1F', bold: true },
            { text: '║    Type "help" to get started        ║', color: '#FF5A1F' },
            { text: '╚══════════════════════════════════════╝', color: '#FF5A1F' },
        ]},
    ]);
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const scrollRef = useRef<ScrollView>(null);

    const submit = useCallback(() => {
        if (!command.trim()) return;
        const output = handleCommand(command);
        if (output.length === 1 && output[0].text === '__CLEAR__') {
            setHistory([]);
        } else {
            setHistory(prev => [...prev, { input: command, output }]);
        }
        setCmdHistory(prev => [command, ...prev].slice(0, 50));
        setHistoryIdx(-1);
        setCommand('');
        Keyboard.dismiss();
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, [command]);

    const prevCommand = () => {
        if (cmdHistory.length === 0) return;
        const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
        setHistoryIdx(next);
        setCommand(cmdHistory[next]);
    };

    return (
        <View style={[styles.container, { backgroundColor: '#0A0A0A' }]}>
            <View style={[styles.header, { borderBottomColor: '#1A1A2E' }]}>
                <View style={[styles.headerIcon, { backgroundColor: '#FF5A1F15' }]}>
                    <Terminal size={20} color="#FF5A1F" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Sentinel CLI</Text>
                    <Text style={styles.headerSub}>Interactive terminal · v1.0.0</Text>
                </View>
                <TouchableOpacity onPress={() => setHistory([])} style={styles.clearBtn}>
                    <Trash2 size={16} color="#8B8FA3" />
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollRef}
                style={styles.terminal}
                contentContainerStyle={{ paddingBottom: 20 }}
                onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
                {history.map((entry, idx) => (
                    <View key={idx} style={styles.entry}>
                        {entry.input !== '' && (
                            <Text style={styles.promptLine}>
                                <Text style={{ color: '#4BDE80' }}>sentinel</Text>
                                <Text style={{ color: '#8B8FA3' }}> ❯ </Text>
                                <Text style={{ color: '#E2E2E2' }}>{entry.input}</Text>
                            </Text>
                        )}
                        {entry.output.map((line, li) => (
                            <Text
                                key={li}
                                style={[styles.outputLine, { color: line.color || '#E2E2E2', fontWeight: line.bold ? '700' : '400' }]}
                            >
                                {line.text}
                            </Text>
                        ))}
                    </View>
                ))}
            </ScrollView>

            <View style={[styles.inputBar, { borderTopColor: '#1A1A2E' }]}>
                <Text style={styles.prompt}>❯</Text>
                <TextInput
                    value={command}
                    onChangeText={setCommand}
                    onSubmitEditing={submit}
                    placeholder="sentinel ..."
                    placeholderTextColor="#555"
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="send"
                    blurOnSubmit={false}
                />
                <TouchableOpacity onPress={prevCommand} style={styles.inputBtn}>
                    <ChevronUp size={18} color="#8B8FA3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={submit} style={[styles.inputBtn, { backgroundColor: '#FF5A1F' }]}>
                    <Terminal size={16} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, paddingTop: 50 },
    headerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    headerTitle: { fontSize: 16, fontWeight: '800', color: '#E2E2E2' },
    headerSub: { fontSize: 10, color: '#8B8FA3', marginTop: 1 },
    clearBtn: { padding: 8, borderRadius: 8 },
    terminal: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
    entry: { marginBottom: 12 },
    promptLine: { fontFamily: 'Courier', fontSize: 12, marginBottom: 2 },
    outputLine: { fontFamily: 'Courier', fontSize: 11, lineHeight: 17 },
    inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingBottom: 34, borderTopWidth: 1, backgroundColor: '#0E0E0E' },
    prompt: { color: '#4BDE80', fontSize: 16, fontWeight: '700', marginRight: 8 },
    input: { flex: 1, color: '#E2E2E2', fontFamily: 'Courier', fontSize: 13, padding: 8, borderRadius: 8, backgroundColor: '#1A1A2E' },
    inputBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
});
