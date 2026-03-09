import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { riskColors, riskLabels } from '../theme/colors';
import type { RiskLevel, DeviceStatus } from '../types';

interface RiskBadgeProps {
    level: RiskLevel;
    size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ level, size = 'sm' }: RiskBadgeProps) {
    const color = riskColors[level] || '#8B8FA3';
    const label = riskLabels[level] || level;
    const fontSize = size === 'lg' ? 13 : size === 'md' ? 11 : 10;
    const paddingH = size === 'lg' ? 12 : size === 'md' ? 10 : 8;
    const paddingV = size === 'lg' ? 6 : size === 'md' ? 4 : 3;

    return (
        <View style={[styles.badge, {
            backgroundColor: color + '18',
            borderColor: color + '40',
            paddingHorizontal: paddingH,
            paddingVertical: paddingV,
        }]}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={[styles.text, { color, fontSize }]}>{label}</Text>
        </View>
    );
}

interface StatusBadgeProps {
    status: DeviceStatus | string;
    size?: 'sm' | 'md';
}

const statusConfig: Record<string, { color: string; label: string }> = {
    active: { color: '#4BDE80', label: 'Active' },
    isolated: { color: '#FF4C4C', label: 'Isolated' },
    maintenance: { color: '#FFB347', label: 'Maintenance' },
    open: { color: '#FF6B35', label: 'Open' },
    investigating: { color: '#E8478C', label: 'Investigating' },
    resolved: { color: '#4BDE80', label: 'Resolved' },
    closed: { color: '#8B8FA3', label: 'Closed' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
    const config = statusConfig[status] || { color: '#8B8FA3', label: status };
    const fontSize = size === 'md' ? 11 : 10;

    return (
        <View style={[styles.badge, {
            backgroundColor: config.color + '18',
            borderColor: config.color + '40',
            paddingHorizontal: size === 'md' ? 10 : 8,
            paddingVertical: size === 'md' ? 4 : 3,
        }]}>
            <View style={[styles.dot, { backgroundColor: config.color }]} />
            <Text style={[styles.text, { color: config.color, fontSize }]}>{config.label}</Text>
        </View>
    );
}

interface TrustScoreBarProps {
    score: number;
    height?: number;
    showLabel?: boolean;
}

export function TrustScoreBar({ score, height = 6, showLabel = true }: TrustScoreBarProps) {
    const getColor = () => {
        if (score >= 80) return '#4BDE80';
        if (score >= 60) return '#FFB347';
        if (score >= 40) return '#FF6B35';
        if (score >= 20) return '#E8478C';
        return '#FF4C4C';
    };

    return (
        <View style={styles.barContainer}>
            {showLabel && <Text style={[styles.barLabel, { color: getColor() }]}>{score}</Text>}
            <View style={[styles.barTrack, { height }]}>
                <View style={[styles.barFill, { width: `${score}%`, backgroundColor: getColor(), height }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 5,
    },
    text: {
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    barLabel: {
        fontSize: 13,
        fontWeight: '700',
        width: 28,
        textAlign: 'right',
    },
    barTrack: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        borderRadius: 4,
    },
});
