// Sentinel Mobile — Color System
// Matches web dashboard CSS variables exactly

export const brandColors = {
    orange: '#FF6B35',
    pink: '#E8478C',
    gold: '#FFB347',
    green: '#4BDE80',
    red: '#FF4C4C',
};

export const riskColors: Record<string, string> = {
    trusted: '#4BDE80',
    low: '#FFB347',
    medium: '#FF6B35',
    high: '#E8478C',
    critical: '#FF4C4C',
};

export const riskLabels: Record<string, string> = {
    trusted: 'Trusted',
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical',
};

export const severityColors: Record<string, { color: string; bg: string; border: string }> = {
    critical: {
        color: '#FF4C4C',
        bg: 'rgba(255,76,76,0.1)',
        border: 'rgba(255,76,76,0.25)',
    },
    high: {
        color: '#E8478C',
        bg: 'rgba(232,71,140,0.1)',
        border: 'rgba(232,71,140,0.25)',
    },
    medium: {
        color: '#FF6B35',
        bg: 'rgba(255,107,53,0.1)',
        border: 'rgba(255,107,53,0.25)',
    },
    low: {
        color: '#FFB347',
        bg: 'rgba(255,179,71,0.1)',
        border: 'rgba(255,179,71,0.25)',
    },
    warning: {
        color: '#FF6B35',
        bg: 'rgba(255,107,53,0.06)',
        border: 'rgba(255,107,53,0.15)',
    },
    info: {
        color: '#8B8FA3',
        bg: 'rgba(139,143,163,0.04)',
        border: 'rgba(139,143,163,0.08)',
    },
};

export const alertTypeConfig: Record<string, { color: string; label: string }> = {
    trust_update: { color: '#FF6B35', label: 'Trust Update' },
    policy_violation: { color: '#E8478C', label: 'Policy Violation' },
    status_change: { color: '#FFB347', label: 'Status Change' },
    graph_anomaly: { color: '#FF4C4C', label: 'Graph Anomaly' },
    new_incident: { color: '#FF4C4C', label: 'New Incident' },
};

export interface ThemeColors {
    background: string;
    surface: string;
    card: string;
    border: string;
    muted: string;
    text: string;
    textSecondary: string;
}

export const darkTheme: ThemeColors = {
    background: '#0C0C0C',
    surface: '#111111',
    card: '#1A1A2E',
    border: '#2A2A3A',
    muted: '#8B8FA3',
    text: '#FFFFFF',
    textSecondary: '#8B8FA3',
};

export const lightTheme: ThemeColors = {
    background: '#F5F5F7',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E0E0E5',
    muted: '#6B6B7B',
    text: '#1A1A2E',
    textSecondary: '#6B6B7B',
};
