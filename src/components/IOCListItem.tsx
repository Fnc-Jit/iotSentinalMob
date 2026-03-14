import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Globe, Hash, Shield, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { severityColors } from '../theme/colors';
import type { IOC } from '../types';

interface IOCListItemProps {
    ioc: IOC;
    onPress?: () => void;
}

const typeIcon: Record<string, any> = {
    ip: Globe,
    domain: Globe,
    hash: Hash,
    cve: Shield,
};

const typeLabel: Record<string, string> = {
    ip: 'IP',
    domain: 'DOMAIN',
    hash: 'HASH',
    cve: 'CVE',
};

export default function IOCListItem({ ioc, onPress }: IOCListItemProps) {
    const { colors } = useTheme();
    const sevConf = severityColors[ioc.severity] || severityColors.info;
    const Icon = typeIcon[ioc.type] || AlertTriangle;

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconBox, { backgroundColor: sevConf.bg }]}>
                <Icon size={16} color={sevConf.color} />
            </View>
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <View style={[styles.typeBadge, { backgroundColor: sevConf.color + '15' }]}>
                        <Text style={[styles.typeText, { color: sevConf.color }]}>{typeLabel[ioc.type]}</Text>
                    </View>
                    <Text style={[styles.source, { color: colors.muted }]}>{ioc.source}</Text>
                </View>
                <Text style={[styles.value, { color: colors.text }]} numberOfLines={1}>{ioc.value}</Text>
                <View style={styles.bottomRow}>
                    <View style={[styles.severityPill, { backgroundColor: sevConf.color + '20', borderColor: sevConf.color + '40' }]}>
                        <Text style={[styles.severityText, { color: sevConf.color }]}>{ioc.severity.toUpperCase()}</Text>
                    </View>
                    {ioc.hits > 0 && (
                        <Text style={[styles.hits, { color: '#FF4C4C' }]}>{ioc.hits} hit{ioc.hits > 1 ? 's' : ''}</Text>
                    )}
                    {ioc.country && (
                        <Text style={[styles.country, { color: colors.muted }]}>🌍 {ioc.country}</Text>
                    )}
                    {!ioc.active && (
                        <Text style={[styles.inactive, { color: colors.muted }]}>Inactive</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        marginBottom: 8,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    content: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 3,
    },
    typeBadge: {
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 4,
    },
    typeText: {
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    source: {
        fontSize: 10,
    },
    value: {
        fontSize: 13,
        fontFamily: 'monospace',
        marginBottom: 4,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    severityPill: {
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 4,
        borderWidth: 1,
    },
    severityText: {
        fontSize: 8,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    hits: {
        fontSize: 10,
        fontWeight: '700',
    },
    country: {
        fontSize: 10,
    },
    inactive: {
        fontSize: 10,
        fontStyle: 'italic',
    },
});
