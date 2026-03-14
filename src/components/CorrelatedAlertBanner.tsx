import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import type { CorrelatedAlert } from '../types';

interface CorrelatedAlertBannerProps {
    alert: CorrelatedAlert;
    onPress?: () => void;
}

const layerColors: Record<string, string> = {
    L1: '#1A56DB',
    L2: '#7E3AF2',
    L3: '#E02424',
};

export default function CorrelatedAlertBanner({ alert, onPress }: CorrelatedAlertBannerProps) {
    const { colors } = useTheme();
    const bannerColor = alert.severity === 'critical' ? '#FF4C4C' : '#FF6B35';

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: bannerColor + '08', borderColor: bannerColor + '20' }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconBox, { backgroundColor: bannerColor + '15' }]}>
                <Zap size={16} color={bannerColor} />
            </View>
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <View style={styles.layers}>
                        {alert.layers.map(layer => (
                            <View key={layer} style={[styles.layerPill, { backgroundColor: (layerColors[layer] || '#8B8FA3') + '20' }]}>
                                <Text style={[styles.layerText, { color: layerColors[layer] || '#8B8FA3' }]}>{layer}</Text>
                            </View>
                        ))}
                    </View>
                    <Text style={[styles.deviceId, { color: colors.muted }]}>{alert.deviceId}</Text>
                </View>
                <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>{alert.message}</Text>
                <Text style={[styles.time, { color: colors.muted }]}>
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
            <ChevronRight size={16} color={colors.muted} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
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
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    layers: {
        flexDirection: 'row',
        gap: 4,
    },
    layerPill: {
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 3,
    },
    layerText: {
        fontSize: 8,
        fontWeight: '700',
    },
    deviceId: {
        fontSize: 10,
    },
    message: {
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 2,
    },
    time: {
        fontSize: 10,
    },
});
