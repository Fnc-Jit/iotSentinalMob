import { Platform } from 'react-native';
import type { Alert as AlertType } from '../types';
import { alertTypeConfig } from '../theme/colors';

// Dynamic import wrapper — expo-notifications crashes at module load in Expo Go SDK 53+
// This ensures the module is only loaded when actually calling a function
async function getNotifications() {
    try {
        return await import('expo-notifications');
    } catch {
        return null;
    }
}

let handlerSet = false;

// Configure how notifications appear when app is in foreground
async function ensureHandler() {
    if (handlerSet) return;
    try {
        const Notifications = await getNotifications();
        if (!Notifications) return;
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });
        handlerSet = true;
    } catch {
        // Not available
    }
}

// Set up Android notification channels
export async function setupNotificationChannels() {
    try {
        const Notifications = await getNotifications();
        if (!Notifications || Platform.OS !== 'android') return;

        await Notifications.setNotificationChannelAsync('critical-alerts', {
            name: 'Critical Alerts',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF4C4C',
            sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('security-alerts', {
            name: 'Security Alerts',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 200, 100, 200],
            lightColor: '#FF6B35',
            sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('general', {
            name: 'General Notifications',
            importance: Notifications.AndroidImportance.DEFAULT,
            sound: 'default',
        });
    } catch {
        console.log('Notification channels not available — use a dev build');
    }
}

// Request notification permissions
export async function registerForPushNotifications(): Promise<string | null> {
    try {
        const Notifications = await getNotifications();
        const Device = await import('expo-device');
        if (!Notifications || !Device.isDevice) return null;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') return null;

        // TODO: Send token to POST /api/devices/register-push
        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId: undefined,
        });
        return tokenData.data;
    } catch {
        console.log('Push registration not available (Expo Go limitation)');
        return null;
    }
}

// Send a local notification for a security alert
export async function sendAlertNotification(alert: AlertType) {
    try {
        await ensureHandler();
        const Notifications = await getNotifications();
        if (!Notifications) return;

        const typeConf = alertTypeConfig[alert.type] || { label: alert.type };
        const channelId = alert.severity === 'critical' ? 'critical-alerts' :
            alert.severity === 'warning' ? 'security-alerts' : 'general';

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `⚠️ ${typeConf.label} — ${alert.severity.toUpperCase()}`,
                body: `${alert.message}\nDevice: ${alert.deviceId}`,
                data: { alertId: alert.id, deviceId: alert.deviceId, type: alert.type },
                sound: 'default',
                ...(Platform.OS === 'android' && { channelId }),
            },
            trigger: null,
        });
    } catch {
        // Not available in Expo Go
    }
}

// Send notification for new incidents
export async function sendIncidentNotification(incidentId: string, deviceId: string, action: string) {
    try {
        await ensureHandler();
        const Notifications = await getNotifications();
        if (!Notifications) return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `🚨 New Incident: ${incidentId}`,
                body: `Device ${deviceId}: ${action}`,
                data: { incidentId, deviceId },
                sound: 'default',
                ...(Platform.OS === 'android' && { channelId: 'critical-alerts' }),
            },
            trigger: null,
        });
    } catch {
        // Not available in Expo Go
    }
}

// Send notification for trust score drops
export async function sendTrustScoreNotification(deviceId: string, deviceName: string, oldScore: number, newScore: number) {
    try {
        await ensureHandler();
        const Notifications = await getNotifications();
        if (!Notifications) return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `📉 Trust Score Drop: ${deviceName}`,
                body: `Trust score dropped from ${oldScore} to ${newScore} on device ${deviceId}`,
                data: { deviceId, type: 'trust_drop' },
                sound: 'default',
                ...(Platform.OS === 'android' && { channelId: 'security-alerts' }),
            },
            trigger: null,
        });
    } catch {
        // Not available in Expo Go
    }
}

// Get notification listeners (to be used in App.tsx)
export function addNotificationListeners(
    onReceived?: (notification: any) => void,
    onResponse?: (response: any) => void
) {
    let cleanup = () => { };

    (async () => {
        try {
            const Notifications = await getNotifications();
            if (!Notifications) return;

            const receivedSub = Notifications.addNotificationReceivedListener(notification => {
                onReceived?.(notification);
            });

            const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
                onResponse?.(response);
            });

            cleanup = () => {
                receivedSub.remove();
                responseSub.remove();
            };
        } catch {
            // Not available in Expo Go
        }
    })();

    return () => cleanup();
}
