import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LayoutDashboard, Cpu, AlertTriangle, Bell, Network, Settings } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { brandColors } from '../theme/colors';
import type { MainTabParamList, DevicesStackParamList, IncidentsStackParamList } from './types';

import DashboardScreen from '../screens/DashboardScreen';
import DevicesScreen from '../screens/DevicesScreen';
import DeviceDetailScreen from '../screens/DeviceDetailScreen';
import IncidentsScreen from '../screens/IncidentsScreen';
import IncidentDetailScreen from '../screens/IncidentDetailScreen';
import AlertsScreen from '../screens/AlertsScreen';
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

// Bottom Tab Navigator
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
                name="TopologyTab"
                component={TopologyScreen}
                options={{
                    tabBarLabel: 'Topology',
                    tabBarIcon: ({ color, size }) => <Network size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="SettingsTab"
                component={SettingsScreen}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}
