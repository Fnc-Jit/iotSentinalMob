// Navigation type definitions
export type RootStackParamList = {
    Login: undefined;
    MainTabs: undefined;
};

export type MainTabParamList = {
    DashboardTab: undefined;
    DevicesTab: undefined;
    IncidentsTab: undefined;
    AlertsTab: undefined;
    TopologyTab: undefined;
    SettingsTab: undefined;
};

export type DevicesStackParamList = {
    DevicesList: undefined;
    DeviceDetail: { deviceId: string };
};

export type IncidentsStackParamList = {
    IncidentsList: undefined;
    IncidentDetail: { incidentId: string };
};
