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
    MoreTab: undefined;
};

export type DevicesStackParamList = {
    DevicesList: undefined;
    DeviceDetail: { deviceId: string };
};

export type IncidentsStackParamList = {
    IncidentsList: undefined;
    IncidentDetail: { incidentId: string };
};

export type MoreStackParamList = {
    MoreHub: undefined;
    UEBAScreenNav: undefined;
    KillChainScreen: undefined;
    ComplianceScreen: undefined;
    ThreatFeedScreenNav: undefined;
    SOCWorkbenchScreen: undefined;
    CLIScreen: undefined;
    TopologyScreenNav: undefined;
    SettingsScreenNav: undefined;
};
