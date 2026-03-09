import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert, Linking } from 'react-native';
import { Shield, Bell, Database, Moon, Sun, Monitor, ChevronRight, Github, Info } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { brandColors } from '../theme/colors';

export default function SettingsScreen() {
    const { colors, themeMode, setThemeMode, resolvedTheme } = useTheme();

    // Settings state — TODO: Sync with GET/PATCH /api/settings
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [maintenanceDuration, setMaintenanceDuration] = useState('4h');
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [alertThreshold, setAlertThreshold] = useState('warning');

    const durations = ['1h', '4h', '8h', '24h'];
    const thresholds = ['info', 'warning', 'critical'];

    const handleExportData = () => {
        // TODO: GET /api/export/devices
        Alert.alert('Export', 'Data export functionality will be available when backend is connected.');
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scroll}>
            {/* Appearance */}
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
                <View style={styles.themeRow}>
                    {([
                        { mode: 'dark' as const, icon: Moon, label: 'Dark' },
                        { mode: 'light' as const, icon: Sun, label: 'Light' },
                        { mode: 'system' as const, icon: Monitor, label: 'System' },
                    ]).map(t => {
                        const Icon = t.icon;
                        const isActive = themeMode === t.mode;
                        return (
                            <TouchableOpacity
                                key={t.mode}
                                style={[styles.themeBtn, isActive && styles.themeBtnActive, { borderColor: isActive ? brandColors.orange : colors.border }]}
                                onPress={() => setThemeMode(t.mode)}
                            >
                                <Icon size={18} color={isActive ? brandColors.orange : colors.muted} />
                                <Text style={[styles.themeBtnText, { color: isActive ? brandColors.orange : colors.muted }]}>{t.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Maintenance Mode */}
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.headerRow}>
                    <Shield size={18} color={brandColors.gold} />
                    <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0, marginLeft: 8 }]}>Maintenance Mode</Text>
                </View>

                <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Enable Maintenance</Text>
                    <Switch
                        value={maintenanceMode}
                        onValueChange={setMaintenanceMode}
                        trackColor={{ false: colors.border, true: brandColors.orange + '60' }}
                        thumbColor={maintenanceMode ? brandColors.orange : '#8B8FA3'}
                    />
                </View>

                <Text style={[styles.settingLabel, { color: colors.text, marginTop: 12, marginBottom: 8 }]}>Duration</Text>
                <View style={styles.pillRow}>
                    {durations.map(d => (
                        <TouchableOpacity
                            key={d}
                            style={[styles.pill, maintenanceDuration === d && styles.pillActive]}
                            onPress={() => setMaintenanceDuration(d)}
                        >
                            <Text style={[styles.pillText, maintenanceDuration === d && styles.pillTextActive]}>{d}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Notification Settings */}
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.headerRow}>
                    <Bell size={18} color={brandColors.pink} />
                    <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0, marginLeft: 8 }]}>Notification Settings</Text>
                </View>

                <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Email Alerts</Text>
                    <Switch
                        value={emailAlerts}
                        onValueChange={setEmailAlerts}
                        trackColor={{ false: colors.border, true: brandColors.orange + '60' }}
                        thumbColor={emailAlerts ? brandColors.orange : '#8B8FA3'}
                    />
                </View>

                <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
                    <Switch
                        value={pushNotifications}
                        onValueChange={setPushNotifications}
                        trackColor={{ false: colors.border, true: brandColors.orange + '60' }}
                        thumbColor={pushNotifications ? brandColors.orange : '#8B8FA3'}
                    />
                </View>

                <Text style={[styles.settingLabel, { color: colors.text, marginTop: 12, marginBottom: 8 }]}>Alert Threshold</Text>
                <View style={styles.pillRow}>
                    {thresholds.map(t => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.pill, alertThreshold === t && styles.pillActive]}
                            onPress={() => setAlertThreshold(t)}
                        >
                            <Text style={[styles.pillText, alertThreshold === t && styles.pillTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Data Management */}
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.headerRow}>
                    <Database size={18} color={brandColors.green} />
                    <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0, marginLeft: 8 }]}>Data Management</Text>
                </View>

                <TouchableOpacity style={[styles.menuItem, { borderColor: colors.border }]}>
                    <Text style={[styles.menuItemText, { color: colors.text }]}>Data Retention (90 days)</Text>
                    <ChevronRight size={16} color={colors.muted} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, { borderColor: colors.border }]} onPress={handleExportData}>
                    <Text style={[styles.menuItemText, { color: colors.text }]}>Export Device Data</Text>
                    <ChevronRight size={16} color={colors.muted} />
                </TouchableOpacity>
            </View>

            {/* About Us */}
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.headerRow}>
                    <Info size={18} color={brandColors.pink} />
                    <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0, marginLeft: 8 }]}>About Us</Text>
                </View>

                <View style={[styles.aboutCard, { backgroundColor: 'rgba(255,255,255,0.02)', borderColor: colors.border }]}>
                    <Text style={[styles.aboutTitle, { color: colors.text }]}>IoT Sentinel Mobile</Text>
                    <Text style={[styles.aboutText, { color: colors.muted }]}>Created by <Text style={{ color: colors.text, fontWeight: '700' }}>JITRAJ</Text> and <Text style={{ color: colors.text, fontWeight: '700' }}>TEAM ARCH ECHO</Text></Text>

                    <TouchableOpacity
                        style={[styles.githubBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => Linking.openURL('https://github.com/Fnc-Jit')}
                    >
                        <Github size={18} color={colors.text} />
                        <Text style={[styles.githubBtnText, { color: colors.text }]}>View GitHub Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Version info */}
            <Text style={[styles.versionText, { color: colors.muted }]}>IoT Sentinel Mobile v1.0.0</Text>
            <Text style={[styles.versionText, { color: colors.muted, marginTop: 4 }]}>© 2026 IoT Sentinel Security Platform</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 16, paddingBottom: 100 },
    section: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 16 },
    sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    themeRow: { flexDirection: 'row', gap: 10 },
    themeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, backgroundColor: 'rgba(255,255,255,0.04)' },
    themeBtnActive: { backgroundColor: 'rgba(255,107,53,0.1)' },
    themeBtnText: { fontSize: 13, fontWeight: '600' },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
    settingLabel: { fontSize: 14 },
    pillRow: { flexDirection: 'row', gap: 8 },
    pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    pillActive: { backgroundColor: brandColors.orange, borderColor: brandColors.orange },
    pillText: { color: '#8B8FA3', fontSize: 12, fontWeight: '600' },
    pillTextActive: { color: '#FFFFFF' },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
    menuItemText: { fontSize: 14 },
    aboutCard: { borderRadius: 12, padding: 16, borderWidth: 1, marginTop: 4 },
    aboutTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
    aboutText: { fontSize: 13, lineHeight: 20, marginBottom: 16 },
    githubBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 10, borderWidth: 1 },
    githubBtnText: { fontSize: 13, fontWeight: '600' },
    versionText: { textAlign: 'center', fontSize: 12, marginTop: 8 },
});
