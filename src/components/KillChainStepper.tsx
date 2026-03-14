import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import type { KillChainStage, ATTACKTactic } from '../types';

interface KillChainStepperProps {
    stages: KillChainStage[];
    highlightDeviceId?: string;
}

const tacticColors: Partial<Record<ATTACKTactic, string>> = {
    'Reconnaissance': '#3B82F6',
    'Initial Access': '#F59E0B',
    'Execution': '#EF4444',
    'Persistence': '#8B5CF6',
    'Credential Access': '#EC4899',
    'Lateral Movement': '#EC4899',
    'Command & Control': '#DC2626',
    'Exfiltration': '#DC2626',
    'Impact': '#991B1B',
    'Discovery': '#06B6D4',
    'Defense Evasion': '#6B7280',
    'Collection': '#F97316',
    'Privilege Escalation': '#7C3AED',
};

export default function KillChainStepper({ stages, highlightDeviceId }: KillChainStepperProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {stages.map((stage, i) => {
                const color = tacticColors[stage.tactic] || '#8B8FA3';
                const isHighlighted = highlightDeviceId && stage.deviceId === highlightDeviceId;
                const isLast = i === stages.length - 1;

                return (
                    <View key={i} style={styles.stepRow}>
                        {/* Timeline line + dot */}
                        <View style={styles.dotColumn}>
                            <View style={[
                                styles.dot,
                                {
                                    backgroundColor: stage.confirmed ? color : 'transparent',
                                    borderColor: stage.confirmed ? color : colors.border,
                                },
                            ]}>
                                {stage.confirmed && <CheckCircle size={10} color="#fff" />}
                            </View>
                            {!isLast && <View style={[styles.line, { backgroundColor: colors.border }]} />}
                        </View>

                        {/* Content */}
                        <View style={[
                            styles.stepContent,
                            {
                                backgroundColor: isHighlighted ? color + '08' : colors.card,
                                borderColor: isHighlighted ? color + '25' : colors.border,
                            },
                        ]}>
                            <View style={styles.stepHeader}>
                                <Text style={[styles.tactic, { color }]}>{stage.tactic}</Text>
                                {!stage.confirmed && (
                                    <View style={[styles.suspectedPill, { backgroundColor: '#FFB34720' }]}>
                                        <Text style={styles.suspectedText}>SUSPECTED</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={[styles.technique, { color: colors.text }]}>{stage.technique}</Text>
                            <View style={styles.stepMeta}>
                                <Text style={[styles.deviceChip, { color: colors.muted }]}>{stage.deviceId}</Text>
                                <Text style={[styles.time, { color: colors.muted }]}>
                                    {new Date(stage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 4,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    dotColumn: {
        width: 24,
        alignItems: 'center',
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    line: {
        width: 1.5,
        flex: 1,
        marginVertical: 2,
    },
    stepContent: {
        flex: 1,
        marginLeft: 8,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        marginBottom: 6,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    tactic: {
        fontSize: 11,
        fontWeight: '700',
    },
    suspectedPill: {
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 3,
    },
    suspectedText: {
        fontSize: 7,
        fontWeight: '700',
        color: '#FFB347',
        letterSpacing: 0.5,
    },
    technique: {
        fontSize: 12,
        marginBottom: 3,
    },
    stepMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    deviceChip: {
        fontSize: 10,
        fontFamily: 'monospace',
    },
    time: {
        fontSize: 10,
    },
});
