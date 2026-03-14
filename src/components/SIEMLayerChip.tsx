import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SIEMLayerChipProps {
    layer: string;
    color: string;
    status: 'live' | 'warning' | 'alert';
}

const statusDotColor: Record<string, string> = {
    live: '#4BDE80',
    warning: '#FFB347',
    alert: '#FF4C4C',
};

export default function SIEMLayerChip({ layer, color, status }: SIEMLayerChipProps) {
    return (
        <View style={[styles.chip, { borderColor: color + '30', backgroundColor: color + '08' }]}>
            <View style={[styles.dot, { backgroundColor: statusDotColor[status] }]} />
            <Text style={[styles.label, { color }]}>{layer}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
    },
});
