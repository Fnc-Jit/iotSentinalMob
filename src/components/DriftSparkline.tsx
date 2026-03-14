import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

interface DriftSparklineProps {
    data: { day: string; value: number }[];
    color?: string;
    width?: number;
    height?: number;
    showLabel?: boolean;
}

export default function DriftSparkline({
    data,
    color = '#7E3AF2',
    width = 120,
    height = 40,
    showLabel = true,
}: DriftSparklineProps) {
    const { colors } = useTheme();
    const padding = 4;
    const w = width - padding * 2;
    const h = height - padding * 2;

    if (data.length < 2) return null;

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * w;
        const y = padding + h - (d.value / maxVal) * h;
        return `${x},${y}`;
    }).join(' ');

    const lastPoint = data[data.length - 1];
    const lastX = padding + ((data.length - 1) / (data.length - 1)) * w;
    const lastY = padding + h - (lastPoint.value / maxVal) * h;

    // Threshold line at 2σ
    const thresholdY = padding + h - (2 / maxVal) * h;

    return (
        <View style={styles.container}>
            <Svg width={width} height={height}>
                {/* Threshold line */}
                <Line
                    x1={padding} y1={thresholdY}
                    x2={width - padding} y2={thresholdY}
                    stroke="#FF4C4C"
                    strokeWidth={0.5}
                    strokeDasharray="3,2"
                    opacity={0.4}
                />
                {/* Line */}
                <Polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
                {/* End dot */}
                <Circle cx={lastX} cy={lastY} r={2.5} fill={color} />
            </Svg>
            {showLabel && (
                <Text style={[styles.label, { color: colors.muted }]}>
                    {lastPoint.value.toFixed(1)}σ
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
    },
});
