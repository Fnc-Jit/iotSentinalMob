import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { ZoomIn, ZoomOut, Maximize2, X, ExternalLink } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { devices, getDeviceById } from '../data/mockData';
import { riskColors, brandColors } from '../theme/colors';
import { RiskBadge, StatusBadge } from '../components/RiskBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Network topology data (matching web app)
const nodes = [
    { id: 'GATEWAY', x: 200, y: 180, type: 'gateway' as const },
    { id: 'DEV-001', x: 100, y: 50 },
    { id: 'DEV-002', x: 175, y: 35 },
    { id: 'DEV-003', x: 260, y: 50 },
    { id: 'DEV-004', x: 320, y: 100 },
    { id: 'DEV-005', x: 340, y: 180 },
    { id: 'DEV-006', x: 320, y: 260 },
    { id: 'DEV-007', x: 260, y: 310 },
    { id: 'DEV-008', x: 175, y: 325 },
    { id: 'DEV-009', x: 100, y: 310 },
    { id: 'DEV-010', x: 60, y: 260 },
    { id: 'DEV-011', x: 40, y: 180 },
    { id: 'DEV-012', x: 60, y: 100 },
];

const edges = [
    ...devices.map(d => ({ source: 'GATEWAY', target: d.id, suspicious: false })),
    { source: 'DEV-004', target: 'DEV-012', suspicious: true, label: 'Lateral Movement' },
    { source: 'DEV-005', target: 'DEV-010', suspicious: true, label: 'Suspicious' },
];

// Get risk-based line color for an edge
function getEdgeColor(edge: typeof edges[0]): string {
    if (edge.suspicious) return '#FF4C4C';
    const targetDevice = getDeviceById(edge.target);
    if (!targetDevice) return '#4BDE80';
    const risk = targetDevice.riskLevel;
    if (risk === 'critical' || risk === 'high') return '#FF4C4C';
    if (risk === 'medium') return '#FFB347';
    return '#4BDE80';
}

// Animated edge component with moving dashed glow
function AnimatedEdge({ x1, y1, x2, y2, color, suspicious }: {
    x1: number; y1: number; x2: number; y2: number; color: string; suspicious: boolean;
}) {
    const [dashOffset, setDashOffset] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDashOffset(prev => (prev + 1) % 24);
        }, 60);
        return () => clearInterval(interval);
    }, []);

    const glowWidth = suspicious ? 6 : 4;
    const lineWidth = suspicious ? 2.5 : 1.5;
    const dashArray = suspicious ? '8,4' : '6,6';

    return (
        <G>
            <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={glowWidth} strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeLinecap="round" opacity={0.15} />
            <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={glowWidth * 0.6} strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeLinecap="round" opacity={0.35} />
            <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={lineWidth} strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeLinecap="round" opacity={0.9} />
        </G>
    );
}

const SVG_W = 400;
const SVG_H = 380;

export default function TopologyScreen() {
    const { colors } = useTheme();
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const selectedDevice = selectedNode ? getDeviceById(selectedNode) : null;
    const navigation = useNavigation<any>();

    // Pinch-to-zoom state
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    // Pan state
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = Math.min(Math.max(savedScale.value * e.scale, 0.5), 3);
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = savedTranslateX.value + e.translationX;
            translateY.value = savedTranslateY.value + e.translationY;
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const composed = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    const handleZoomIn = useCallback(() => {
        const newScale = Math.min(savedScale.value + 0.3, 3);
        scale.value = withSpring(newScale);
        savedScale.value = newScale;
    }, []);

    const handleZoomOut = useCallback(() => {
        const newScale = Math.max(savedScale.value - 0.3, 0.5);
        scale.value = withSpring(newScale);
        savedScale.value = newScale;
    }, []);

    const handleReset = useCallback(() => {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Controls */}
            <View style={[styles.controls, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.title, { color: colors.text }]}>Network Topology</Text>
                <View style={styles.zoomBtns}>
                    <TouchableOpacity style={[styles.zoomBtn, { backgroundColor: colors.card }]} onPress={handleZoomIn}>
                        <ZoomIn size={16} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.zoomBtn, { backgroundColor: colors.card }]} onPress={handleZoomOut}>
                        <ZoomOut size={16} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.zoomBtn, { backgroundColor: colors.card }]} onPress={handleReset}>
                        <Maximize2 size={16} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Pinch-to-Zoom Graph */}
            <GestureDetector gesture={composed}>
                <Animated.View style={[styles.graphArea, animatedStyle]}>
                    <Svg width={SVG_W} height={SVG_H}>
                        {/* Animated Edges */}
                        {edges.map((edge, i) => {
                            const src = nodes.find(n => n.id === edge.source);
                            const tgt = nodes.find(n => n.id === edge.target);
                            if (!src || !tgt) return null;
                            const edgeColor = getEdgeColor(edge);
                            return (
                                <AnimatedEdge
                                    key={i}
                                    x1={src.x} y1={src.y}
                                    x2={tgt.x} y2={tgt.y}
                                    color={edgeColor}
                                    suspicious={edge.suspicious}
                                />
                            );
                        })}

                        {/* Nodes */}
                        {nodes.map(node => {
                            const device = getDeviceById(node.id);
                            const isGateway = node.id === 'GATEWAY';
                            const riskLevel = isGateway ? 'trusted' : (device?.riskLevel || 'low');
                            const nodeColor = riskColors[riskLevel] || '#8B8FA3';
                            const nodeR = isGateway ? 18 : 14;
                            const isSelected = selectedNode === node.id;

                            return (
                                <G key={node.id} onPress={() => setSelectedNode(isSelected ? null : node.id)}>
                                    {(riskLevel === 'critical' || riskLevel === 'high') && (
                                        <>
                                            <Circle cx={node.x} cy={node.y} r={nodeR + 8} fill={nodeColor} opacity={0.08} />
                                            <Circle cx={node.x} cy={node.y} r={nodeR + 4} fill="none" stroke={nodeColor} strokeWidth={1.5} opacity={0.3} />
                                        </>
                                    )}
                                    {isSelected && <Circle cx={node.x} cy={node.y} r={nodeR + 6} fill="none" stroke="#FFFFFF" strokeWidth={2} />}
                                    <Circle cx={node.x} cy={node.y} r={nodeR} fill={nodeColor + '30'} stroke={nodeColor} strokeWidth={2} />
                                    <SvgText x={node.x} y={node.y + 4} textAnchor="middle" fill={nodeColor} fontWeight="700" fontSize={isGateway ? 8 : 7}>
                                        {isGateway ? 'GW' : node.id.replace('DEV-', '')}
                                    </SvgText>
                                    <SvgText x={node.x} y={node.y + (isGateway ? 26 : 22)} textAnchor="middle" fill="#8B8FA3" fontSize={7}>
                                        {isGateway ? 'Gateway' : (device?.name.split(' ')[0] || '')}
                                    </SvgText>
                                </G>
                            );
                        })}
                    </Svg>
                </Animated.View>
            </GestureDetector>

            {/* Legend */}
            <View style={[styles.legend, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#4BDE80', shadowColor: '#4BDE80', shadowOpacity: 0.6, shadowRadius: 4 }]} />
                    <Text style={[styles.legendText, { color: colors.muted }]}>Good</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FFB347', shadowColor: '#FFB347', shadowOpacity: 0.6, shadowRadius: 4 }]} />
                    <Text style={[styles.legendText, { color: colors.muted }]}>Moderate</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FF4C4C', shadowColor: '#FF4C4C', shadowOpacity: 0.6, shadowRadius: 4 }]} />
                    <Text style={[styles.legendText, { color: colors.muted }]}>Critical</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendLine, { backgroundColor: '#FF4C4C' }]} />
                    <Text style={[styles.legendText, { color: colors.muted }]}>Suspicious</Text>
                </View>
            </View>

            {/* Info Panel */}
            {selectedDevice && (
                <View style={[styles.infoPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.infoPanelHeader}>
                        <Text style={[styles.infoPanelTitle, { color: colors.text }]}>{selectedDevice.name}</Text>
                        <TouchableOpacity onPress={() => setSelectedNode(null)}>
                            <X size={18} color={colors.muted} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.infoPanelId, { color: colors.muted }]}>{selectedDevice.id} · {selectedDevice.vendor}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
                        <RiskBadge level={selectedDevice.riskLevel} />
                        <StatusBadge status={selectedDevice.status} />
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.muted }]}>Trust Score</Text>
                        <Text style={[styles.infoValue, { color: riskColors[selectedDevice.riskLevel] }]}>{selectedDevice.trustScore}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.muted }]}>IP</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{selectedDevice.ip}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.viewDetailBtn}
                        onPress={() => {
                            setSelectedNode(null);
                            navigation.navigate('DevicesTab', { screen: 'DeviceDetail', params: { deviceId: selectedDevice.id } });
                        }}
                    >
                        <ExternalLink size={14} color="#FFFFFF" />
                        <Text style={styles.viewDetailText}>View Device Details</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    title: { fontSize: 16, fontWeight: '700' },
    zoomBtns: { flexDirection: 'row', gap: 8 },
    zoomBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    graphArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    legend: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingVertical: 10, gap: 12, borderTopWidth: 1 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendLine: { width: 12, height: 2 },
    legendText: { fontSize: 10 },
    infoPanel: { position: 'absolute', bottom: 60, left: 16, right: 16, borderRadius: 14, padding: 16, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    infoPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    infoPanelTitle: { fontSize: 16, fontWeight: '700' },
    infoPanelId: { fontSize: 12, marginTop: 2 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
    infoLabel: { fontSize: 13 },
    infoValue: { fontSize: 13, fontWeight: '600' },
    viewDetailBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, paddingVertical: 12, borderRadius: 10, backgroundColor: '#FF6B35' },
    viewDetailText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
