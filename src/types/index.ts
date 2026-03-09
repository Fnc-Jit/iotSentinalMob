// IoT Sentinel Mobile — Shared Types
// Matches web app mockData.ts types exactly

export type RiskLevel = 'trusted' | 'low' | 'medium' | 'high' | 'critical';
export type DeviceStatus = 'active' | 'isolated' | 'maintenance';
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertType = 'trust_update' | 'policy_violation' | 'status_change' | 'graph_anomaly' | 'new_incident';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Evidence {
    id: string;
    type: string;
    severity: string;
    timestamp: string;
    details: string;
}

export interface Device {
    id: string;
    name: string;
    class: string;
    vendor: string;
    trustScore: number;
    riskLevel: RiskLevel;
    status: DeviceStatus;
    lastSeen: string;
    mac: string;
    ip: string;
    behavioral: number;
    policy: number;
    drift: number;
    threat: number;
    history: { date: string; score: number }[];
    evidence: Evidence[];
}

export interface Incident {
    id: string;
    deviceId: string;
    riskLevel: RiskLevel;
    severity: IncidentSeverity;
    status: IncidentStatus;
    recommendedAction: string;
    createdAt: string;
    narrative: string;
    evidence: string[];
    timeline: { time: string; event: string }[];
    adjacentDevices: string[];
    trustScore: number;
    confidence: number;
    vendor: string;
    ip: string;
}

export interface Alert {
    id: string;
    type: AlertType;
    deviceId: string;
    message: string;
    timestamp: string;
    severity: AlertSeverity;
}

// ============================================================
// DATABASE / API TYPES (for future backend connection)
// ============================================================

export interface DeviceRow {
    id: string;
    name: string;
    class: string;
    vendor: string;
    trust_score: number;
    risk_level: RiskLevel;
    status: DeviceStatus;
    last_seen: string;
    mac_address: string;
    ip_address: string;
    behavioral_score: number | null;
    policy_score: number | null;
    drift_score: number | null;
    threat_score: number | null;
    firmware_version: string | null;
    created_at: string;
    updated_at: string;
}

export interface IncidentRow {
    id: string;
    device_id: string;
    risk_level: RiskLevel;
    severity: IncidentSeverity;
    status: IncidentStatus;
    recommended_action: string;
    narrative: string;
    trust_score: number | null;
    confidence: number | null;
    vendor: string | null;
    ip_address: string | null;
    assigned_to: string | null;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
}

export interface AlertRow {
    id: string;
    type: AlertType;
    device_id: string;
    message: string;
    timestamp: string;
    severity: AlertSeverity;
    is_read: boolean;
    acknowledged_by: string | null;
    acknowledged_at: string | null;
    created_at: string;
}

export interface DashboardStats {
    totalDevices: number;
    trustedDevices: number;
    highRiskDevices: number;
    activeIncidents: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
