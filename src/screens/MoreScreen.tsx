import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Activity, Shield, ClipboardCheck, Globe, Wrench, ChevronRight, Network, Settings, Terminal } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { brandColors } from '../theme/colors';
import { uebaEntities, killChains, iocs, overallComplianceScore, socQueue } from '../data/mockData';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MoreStackParamList } from '../navigation/types';

type Props = {
    navigation: NativeStackNavigationProp<MoreStackParamList, 'MoreHub'>;
};

export default function MoreScreen({ navigation }: Props) {
    const { colors } = useTheme();

    const menuItems: { id: keyof MoreStackParamList; icon: any; label: string; subtitle: string; color: string; badge?: string; badgeColor?: string }[] = [
        {
            id: 'UEBAScreenNav', icon: Activity, label: 'UEBA Analytics', subtitle: 'User & Entity Behavior Analytics',
            color: '#7E3AF2', badge: `${uebaEntities.filter(e => e.status === 'alert').length} alerts`, badgeColor: '#FF4C4C',
        },
        {
            id: 'KillChainScreen', icon: Shield, label: 'Kill Chain', subtitle: 'ATT&CK kill chain correlation',
            color: '#E02424', badge: `${killChains.filter(k => k.status === 'active').length} active`, badgeColor: '#FF4C4C',
        },
        {
            id: 'ComplianceScreen', icon: ClipboardCheck, label: 'Compliance', subtitle: 'NIST CSF compliance posture',
            color: '#8B5CF6', badge: `${overallComplianceScore}/100`, badgeColor: overallComplianceScore >= 70 ? '#4BDE80' : '#F59E0B',
        },
        {
            id: 'ThreatFeedScreenNav', icon: Globe, label: 'Threat Intel', subtitle: 'IOC feed & threat indicators',
            color: '#FF5A1F', badge: `${iocs.filter(i => i.active).length} IOCs`, badgeColor: '#FF5A1F',
        },
        {
            id: 'SOCWorkbenchScreen', icon: Wrench, label: 'SOC Workbench', subtitle: 'Analyst triage & playbooks',
            color: '#10B981', badge: `${socQueue.filter(q => q.status !== 'resolved').length} queue`, badgeColor: '#10B981',
        },
        {
            id: 'CLIScreen', icon: Terminal, label: 'Sentinel CLI', subtitle: 'Interactive terminal & commands',
            color: '#4BDE80',
        },
        {
            id: 'TopologyScreenNav', icon: Network, label: 'Topology', subtitle: 'Network graph visualization',
            color: '#1A56DB',
        },
        {
            id: 'SettingsScreenNav', icon: Settings, label: 'Settings', subtitle: 'Appearance, notifications, data',
            color: '#8B8FA3',
        },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scroll}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerLabel, { color: brandColors.orange }]}>SIEM PLATFORM</Text>
                <Text style={[styles.headerTitle, { color: colors.text }]}>More</Text>
            </View>

            {/* SIEM Layers Section */}
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>SIEM LAYERS</Text>
            {menuItems.slice(0, 5).map(item => {
                const Icon = item.icon;
                return (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => navigation.navigate(item.id as any)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                            <Icon size={22} color={item.color} />
                        </View>
                        <View style={styles.menuInfo}>
                            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                            <Text style={[styles.menuSubtitle, { color: colors.muted }]}>{item.subtitle}</Text>
                        </View>
                        {item.badge && (
                            <View style={[styles.badge, { backgroundColor: (item.badgeColor || item.color) + '15' }]}>
                                <Text style={[styles.badgeText, { color: item.badgeColor || item.color }]}>{item.badge}</Text>
                            </View>
                        )}
                        <ChevronRight size={16} color={colors.muted} />
                    </TouchableOpacity>
                );
            })}

            {/* Tools Section */}
            <Text style={[styles.sectionLabel, { color: colors.muted, marginTop: 20 }]}>TOOLS</Text>
            {menuItems.slice(5, 6).map(item => {
                const Icon = item.icon;
                return (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => navigation.navigate(item.id as any)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                            <Icon size={22} color={item.color} />
                        </View>
                        <View style={styles.menuInfo}>
                            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                            <Text style={[styles.menuSubtitle, { color: colors.muted }]}>{item.subtitle}</Text>
                        </View>
                        <ChevronRight size={16} color={colors.muted} />
                    </TouchableOpacity>
                );
            })}

            {/* Other Section */}
            <Text style={[styles.sectionLabel, { color: colors.muted, marginTop: 20 }]}>OTHER</Text>
            {menuItems.slice(6).map(item => {
                const Icon = item.icon;
                return (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => navigation.navigate(item.id as any)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                            <Icon size={22} color={item.color} />
                        </View>
                        <View style={styles.menuInfo}>
                            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                            <Text style={[styles.menuSubtitle, { color: colors.muted }]}>{item.subtitle}</Text>
                        </View>
                        <ChevronRight size={16} color={colors.muted} />
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 16, paddingBottom: 100 },
    header: { marginBottom: 20 },
    headerLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
    headerTitle: { fontSize: 24, fontWeight: '800' },
    sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
    menuCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
    menuIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    menuInfo: { flex: 1 },
    menuLabel: { fontSize: 15, fontWeight: '700' },
    menuSubtitle: { fontSize: 11, marginTop: 2 },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 8 },
    badgeText: { fontSize: 10, fontWeight: '700' },
});
