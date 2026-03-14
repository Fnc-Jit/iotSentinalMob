import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LayoutDashboard, Cpu, AlertTriangle, Bell, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { brandColors } from '../theme/colors';
import type { MainTabParamList, DevicesStackParamList, IncidentsStackParamList, MoreStackParamList } from './types';

import DashboardScreen from '../screens/DashboardScreen';
import DevicesScreen from '../screens/DevicesScreen';
import DeviceDetailScreen from '../screens/DeviceDetailScreen';
import IncidentsScreen from '../screens/IncidentsScreen';
import IncidentDetailScreen from '../screens/IncidentDetailScreen';
import AlertsScreen from '../screens/AlertsScreen';
import MoreScreen from '../screens/MoreScreen';
import UEBAScreen from '../screens/UEBAScreen';
import ThreatFeedScreen from '../screens/ThreatFeedScreen';
import KillChainScreen from '../screens/KillChainScreen';
import ComplianceScreen from '../screens/ComplianceScreen';
import SOCWorkbenchScreen from '../screens/SOCWorkbenchScreen';
import CLIScreen from '../screens/CLIScreen';
import TopologyScreen from '../screens/TopologyScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Device sub-stack (list → detail)
const DeviceStack = createNativeStackNavigator<DevicesStackParamList>();
function DevicesStackScreen() {
    return (
        <DeviceStack.Navigator screenOptions={{ headerShown: false }}>
            <DeviceStack.Screen name="DevicesList" component={DevicesScreen} />
            <DeviceStack.Screen name="DeviceDetail" component={DeviceDetailScreen} />
        </DeviceStack.Navigator>
    );
}

// Incident sub-stack (list → detail)
const IncidentStack = createNativeStackNavigator<IncidentsStackParamList>();
function IncidentsStackScreen() {
    return (
        <IncidentStack.Navigator screenOptions={{ headerShown: false }}>
            <IncidentStack.Screen name="IncidentsList" component={IncidentsScreen} />
            <IncidentStack.Screen name="IncidentDetail" component={IncidentDetailScreen} />
        </IncidentStack.Navigator>
    );
}

// More sub-stack (hub → SIEM screens)
const MoreStack = createNativeStackNavigator<MoreStackParamList>();
function MoreStackScreen() {
    return (
        <MoreStack.Navigator screenOptions={{ headerShown: false }}>
            <MoreStack.Screen name="MoreHub" component={MoreScreen} />
            <MoreStack.Screen name="UEBAScreenNav" component={UEBAScreen} />
            <MoreStack.Screen name="KillChainScreen" component={KillChainScreen} />
            <MoreStack.Screen name="ComplianceScreen" component={ComplianceScreen} />
            <MoreStack.Screen name="ThreatFeedScreenNav" component={ThreatFeedScreen} />
            <MoreStack.Screen name="SOCWorkbenchScreen" component={SOCWorkbenchScreen} />
            <MoreStack.Screen name="CLIScreen" component={CLIScreen} />
            <MoreStack.Screen name="TopologyScreenNav" component={TopologyScreen} />
            <MoreStack.Screen name="SettingsScreenNav" component={SettingsScreen} />
        </MoreStack.Navigator>
    );
}

// Bottom Tab Navigator — 5 main tabs
const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 85,
                    paddingBottom: 28,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: brandColors.orange,
                tabBarInactiveTintColor: colors.muted,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginTop: 2,
                },
            }}
        >
            <Tab.Screen
                name="DashboardTab"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="DevicesTab"
                component={DevicesStackScreen}
                options={{
                    tabBarLabel: 'Devices',
                    tabBarIcon: ({ color, size }) => <Cpu size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="IncidentsTab"
                component={IncidentsStackScreen}
                options={{
                    tabBarLabel: 'Incidents',
                    tabBarIcon: ({ color, size }) => <AlertTriangle size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="AlertsTab"
                component={AlertsScreen}
                options={{
                    tabBarLabel: 'Alerts',
                    tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="MoreTab"
                component={MoreStackScreen}
                options={{
                    tabBarLabel: 'More',
                    tabBarIcon: ({ color, size }) => <MoreHorizontal size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}
