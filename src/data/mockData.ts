// IoT Sentinel Mobile — Mock Data
// Ported from web app /src/app/data/mockData.ts
// This file will be replaced by API calls when backend is connected

import type { Device, Incident, Alert, DashboardStats, RiskLevel } from '../types';

// ============================================================
// HELPER: Generate 30-day trust score history
// ============================================================
function generateHistory(baseScore: number): { date: string; score: number }[] {
    const history: { date: string; score: number }[] = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const variance = Math.floor(Math.random() * 20) - 10;
        const score = Math.max(0, Math.min(100, baseScore + variance));
        history.push({ date: d.toISOString().split('T')[0], score });
    }
    return history;
}

// ============================================================
// DEVICES (12 total)
// ============================================================
export const devices: Device[] = [
    {
        id: 'DEV-001', name: 'Smart Thermostat', class: 'HVAC', vendor: 'Nest',
        trustScore: 94, riskLevel: 'trusted', status: 'active',
        lastSeen: '2026-03-09T14:32:00Z', mac: 'AA:BB:CC:11:22:33', ip: '192.168.1.101',
        behavioral: 96, policy: 98, drift: 90, threat: 92,
        history: generateHistory(94),
        evidence: [
            { id: 'EV-001', type: 'Routine Check', severity: 'low', timestamp: '2026-03-09T10:00:00Z', details: 'Regular traffic pattern confirmed. No anomalies detected.' },
        ],
    },
    {
        id: 'DEV-002', name: 'IP Camera - Lobby', class: 'Surveillance', vendor: 'Hikvision',
        trustScore: 71, riskLevel: 'low', status: 'active',
        lastSeen: '2026-03-09T14:30:00Z', mac: 'AA:BB:CC:22:33:44', ip: '192.168.1.102',
        behavioral: 68, policy: 80, drift: 65, threat: 72,
        history: generateHistory(71),
        evidence: [
            { id: 'EV-002', type: 'Elevated DNS Queries', severity: 'medium', timestamp: '2026-03-09T08:15:00Z', details: 'DNS query volume increased by 2.3x compared to 7-day baseline.' },
            { id: 'EV-003', type: 'New External IP Contact', severity: 'low', timestamp: '2026-03-08T22:45:00Z', details: 'First-time connection to CDN endpoint 13.107.42.14 (Microsoft).' },
        ],
    },
    {
        id: 'DEV-003', name: 'Industrial PLC #1', class: 'OT/ICS', vendor: 'Siemens',
        trustScore: 55, riskLevel: 'medium', status: 'active',
        lastSeen: '2026-03-09T14:28:00Z', mac: 'AA:BB:CC:33:44:55', ip: '192.168.1.103',
        behavioral: 50, policy: 60, drift: 48, threat: 62,
        history: generateHistory(55),
        evidence: [
            { id: 'EV-004', type: 'Firmware Drift', severity: 'medium', timestamp: '2026-03-09T06:00:00Z', details: 'Firmware version mismatch detected. Expected v3.2.1, found v3.1.8.' },
            { id: 'EV-005', type: 'Off-Hours Activity', severity: 'medium', timestamp: '2026-03-08T03:30:00Z', details: 'Network activity detected outside normal operating hours (02:00-04:00).' },
        ],
    },
    {
        id: 'DEV-004', name: 'Medical Monitor', class: 'Medical', vendor: 'Philips',
        trustScore: 28, riskLevel: 'high', status: 'active',
        lastSeen: '2026-03-09T14:25:00Z', mac: 'AA:BB:CC:44:55:66', ip: '192.168.1.104',
        behavioral: 22, policy: 35, drift: 25, threat: 30,
        history: generateHistory(28),
        evidence: [
            { id: 'EV-006', type: 'Unusual Outbound Traffic', severity: 'high', timestamp: '2026-03-09T12:00:00Z', details: 'Device initiated connections to 8 new external IPs within 30 minutes.' },
            { id: 'EV-007', type: 'Policy Violation', severity: 'high', timestamp: '2026-03-09T11:45:00Z', details: 'Medical device class policy violation: SSH connection attempt detected.' },
            { id: 'EV-008', type: 'Beaconing Detected', severity: 'critical', timestamp: '2026-03-09T11:30:00Z', details: 'Regular 30-second interval connections to external IP. Beaconing score: 0.87.' },
        ],
    },
    {
        id: 'DEV-005', name: 'Smart Lock - Server Room', class: 'Access Control', vendor: 'Schlage',
        trustScore: 11, riskLevel: 'critical', status: 'isolated',
        lastSeen: '2026-03-09T14:20:00Z', mac: 'AA:BB:CC:55:66:77', ip: '192.168.1.105',
        behavioral: 8, policy: 12, drift: 10, threat: 14,
        history: generateHistory(11),
        evidence: [
            { id: 'EV-009', type: 'Tor Exit Node Contact', severity: 'critical', timestamp: '2026-03-09T13:00:00Z', details: 'Connection to known Tor exit node 185.220.101.34:9001.' },
            { id: 'EV-010', type: 'Lateral Movement', severity: 'critical', timestamp: '2026-03-09T12:50:00Z', details: 'New device-to-device communication edge: DEV-005 → DEV-010.' },
            { id: 'EV-011', type: 'Port Scanning', severity: 'critical', timestamp: '2026-03-09T12:45:00Z', details: 'Sequential port scan detected targeting internal subnet 192.168.1.0/24.' },
        ],
    },
    {
        id: 'DEV-006', name: 'Conference Room Display', class: 'AV/Display', vendor: 'Samsung',
        trustScore: 88, riskLevel: 'trusted', status: 'active',
        lastSeen: '2026-03-09T14:15:00Z', mac: 'AA:BB:CC:66:77:88', ip: '192.168.1.106',
        behavioral: 90, policy: 92, drift: 85, threat: 86,
        history: generateHistory(88),
        evidence: [
            { id: 'EV-012', type: 'Routine Check', severity: 'low', timestamp: '2026-03-09T09:00:00Z', details: 'Standard streaming traffic to approved media endpoints.' },
        ],
    },
    {
        id: 'DEV-007', name: 'Industrial PLC #2', class: 'OT/ICS', vendor: 'Rockwell',
        trustScore: 47, riskLevel: 'medium', status: 'maintenance',
        lastSeen: '2026-03-09T14:10:00Z', mac: 'AA:BB:CC:77:88:99', ip: '192.168.1.107',
        behavioral: 42, policy: 55, drift: 40, threat: 52,
        history: generateHistory(47),
        evidence: [
            { id: 'EV-013', type: 'Configuration Change', severity: 'medium', timestamp: '2026-03-09T07:30:00Z', details: 'PLC configuration modified outside normal maintenance window.' },
        ],
    },
    {
        id: 'DEV-008', name: 'HVAC Controller', class: 'HVAC', vendor: 'Honeywell',
        trustScore: 79, riskLevel: 'low', status: 'active',
        lastSeen: '2026-03-09T14:05:00Z', mac: 'AA:BB:CC:88:99:AA', ip: '192.168.1.108',
        behavioral: 82, policy: 78, drift: 76, threat: 80,
        history: generateHistory(79),
        evidence: [
            { id: 'EV-014', type: 'Minor Traffic Anomaly', severity: 'low', timestamp: '2026-03-08T16:00:00Z', details: 'Slight increase in NTP requests. Within acceptable range.' },
        ],
    },
    {
        id: 'DEV-009', name: 'Network Printer', class: 'Peripheral', vendor: 'HP',
        trustScore: 63, riskLevel: 'low', status: 'active',
        lastSeen: '2026-03-09T14:00:00Z', mac: 'AA:BB:CC:99:AA:BB', ip: '192.168.1.109',
        behavioral: 60, policy: 70, drift: 58, threat: 65,
        history: generateHistory(63),
        evidence: [
            { id: 'EV-015', type: 'Elevated Print Queue', severity: 'low', timestamp: '2026-03-09T11:00:00Z', details: 'Print job volume 1.5x above weekly average. Likely end-of-quarter reports.' },
        ],
    },
    {
        id: 'DEV-010', name: 'Smart Elevator Panel', class: 'Building Mgmt', vendor: 'KONE',
        trustScore: 38, riskLevel: 'high', status: 'active',
        lastSeen: '2026-03-09T13:55:00Z', mac: 'AA:BB:CC:AA:BB:CC', ip: '192.168.1.110',
        behavioral: 35, policy: 42, drift: 32, threat: 44,
        history: generateHistory(38),
        evidence: [
            { id: 'EV-016', type: 'Suspicious Connection', severity: 'high', timestamp: '2026-03-09T10:30:00Z', details: 'Unexpected connection from DEV-005 (Smart Lock). Possible lateral movement.' },
            { id: 'EV-017', type: 'Protocol Anomaly', severity: 'medium', timestamp: '2026-03-09T10:15:00Z', details: 'Building management device using HTTP instead of expected BACnet protocol.' },
        ],
    },
    {
        id: 'DEV-011', name: 'VoIP Gateway', class: 'Telephony', vendor: 'Cisco',
        trustScore: 85, riskLevel: 'trusted', status: 'active',
        lastSeen: '2026-03-09T13:50:00Z', mac: 'AA:BB:CC:BB:CC:DD', ip: '192.168.1.111',
        behavioral: 88, policy: 86, drift: 82, threat: 84,
        history: generateHistory(85),
        evidence: [
            { id: 'EV-018', type: 'Routine Check', severity: 'low', timestamp: '2026-03-09T08:00:00Z', details: 'Normal SIP traffic patterns. All calls routed through approved PBX.' },
        ],
    },
    {
        id: 'DEV-012', name: 'Infusion Pump', class: 'Medical', vendor: 'Baxter',
        trustScore: 22, riskLevel: 'critical', status: 'isolated',
        lastSeen: '2026-03-09T13:45:00Z', mac: 'AA:BB:CC:CC:DD:EE', ip: '192.168.1.112',
        behavioral: 18, policy: 20, drift: 22, threat: 28,
        history: generateHistory(22),
        evidence: [
            { id: 'EV-019', type: 'Unauthorized Firmware Update', severity: 'critical', timestamp: '2026-03-09T09:30:00Z', details: 'Firmware update initiated from unauthorized source. Update hash mismatch.' },
            { id: 'EV-020', type: 'Data Exfiltration Attempt', severity: 'critical', timestamp: '2026-03-09T09:15:00Z', details: 'Large outbound data transfer (450MB) to external IP 203.0.113.42.' },
            { id: 'EV-021', type: 'C2 Communication', severity: 'critical', timestamp: '2026-03-09T09:00:00Z', details: 'Periodic beaconing to known C2 infrastructure. Interval: 60s ±5s.' },
        ],
    },
];

// ============================================================
// INCIDENTS (6 total)
// ============================================================
export const incidents: Incident[] = [
    {
        id: 'INC-001', deviceId: 'DEV-005', riskLevel: 'critical', severity: 'critical',
        status: 'investigating', recommendedAction: 'VLAN Isolation + Firewall Block',
        createdAt: '2026-03-09T13:05:00Z', trustScore: 11, confidence: 94, vendor: 'Schlage', ip: '192.168.1.105',
        narrative: 'Smart Lock (DEV-005) in the server room has been compromised. The device contacted a known Tor exit node, initiated lateral movement to DEV-010 (Smart Elevator Panel), and performed port scanning across the internal subnet. Trust score has dropped to 11 (CRITICAL). Immediate VLAN isolation and firewall block is recommended. Evidence suggests a coordinated attack exploiting an access control vulnerability.',
        evidence: [
            'Connection to known Tor exit node 185.220.101.34:9001',
            'New lateral movement edge: DEV-005 → DEV-010',
            'Sequential port scan on 192.168.1.0/24 (ports 22, 80, 443, 8080)',
            'Beaconing pattern detected (30s intervals to external C2)',
        ],
        timeline: [
            { time: '13:05', event: 'Incident created — Trust score crossed CRITICAL threshold (11)' },
            { time: '13:00', event: 'Tor exit node contact detected (185.220.101.34:9001)' },
            { time: '12:50', event: 'New communication edge: DEV-005 → DEV-010' },
            { time: '12:45', event: 'Port scanning activity detected on internal subnet' },
            { time: '12:30', event: 'Trust score declined from 35 to 18' },
            { time: '12:00', event: 'Unusual outbound connection spike (8 new IPs in 30 min)' },
        ],
        adjacentDevices: ['DEV-010', 'DEV-012'],
    },
    {
        id: 'INC-002', deviceId: 'DEV-004', riskLevel: 'high', severity: 'high',
        status: 'open', recommendedAction: 'Network Segmentation + Traffic Inspection',
        createdAt: '2026-03-09T12:15:00Z', trustScore: 28, confidence: 87, vendor: 'Philips', ip: '192.168.1.104',
        narrative: 'Medical Monitor (DEV-004) showing signs of compromise. SSH connection attempts were detected from a medical device class, which violates device class policy. Combined with unusual outbound traffic patterns and beaconing behavior, this indicates potential command-and-control activity. Network segmentation and deep traffic inspection recommended.',
        evidence: [
            'SSH connection attempt from medical device (policy violation)',
            '8 new external IP connections within 30 minutes',
            'Beaconing pattern: 30-second intervals, score 0.87',
        ],
        timeline: [
            { time: '12:15', event: 'Incident created — Multiple policy violations detected' },
            { time: '12:00', event: '8 new external IP connections detected' },
            { time: '11:45', event: 'SSH connection attempt (medical device policy violation)' },
            { time: '11:30', event: 'Beaconing behavior detected (30s intervals)' },
        ],
        adjacentDevices: ['DEV-012'],
    },
    {
        id: 'INC-003', deviceId: 'DEV-012', riskLevel: 'critical', severity: 'critical',
        status: 'open', recommendedAction: 'Immediate Isolation + Factory Reset',
        createdAt: '2026-03-09T09:35:00Z', trustScore: 22, confidence: 96, vendor: 'Baxter', ip: '192.168.1.112',
        narrative: 'Infusion Pump (DEV-012) has been severely compromised. An unauthorized firmware update was initiated from an external source with a mismatched hash. A large data exfiltration attempt (450MB) was detected to an external IP. The device is also communicating with known C2 infrastructure at regular intervals. This is a critical medical device — immediate isolation and factory reset is essential.',
        evidence: [
            'Unauthorized firmware update from external source (hash mismatch)',
            'Data exfiltration: 450MB outbound to 203.0.113.42',
            'C2 beaconing: 60s intervals (±5s) to known infrastructure',
            'Firmware integrity check failed',
        ],
        timeline: [
            { time: '09:35', event: 'Incident created — Trust score at CRITICAL (22)' },
            { time: '09:30', event: 'Unauthorized firmware update detected' },
            { time: '09:15', event: 'Large data exfiltration attempt (450MB)' },
            { time: '09:00', event: 'C2 communication channel established' },
            { time: '08:45', event: 'Trust score rapid decline from 65 to 22' },
        ],
        adjacentDevices: ['DEV-004'],
    },
    {
        id: 'INC-004', deviceId: 'DEV-010', riskLevel: 'high', severity: 'high',
        status: 'investigating', recommendedAction: 'Config Rollback + Access Review',
        createdAt: '2026-03-09T10:45:00Z', trustScore: 38, confidence: 82, vendor: 'KONE', ip: '192.168.1.110',
        narrative: 'Smart Elevator Panel (DEV-010) received a suspicious connection from compromised DEV-005 (Smart Lock) and is now exhibiting protocol anomalies. The building management device switched from expected BACnet protocol to HTTP, suggesting possible command injection or configuration tampering.',
        evidence: [
            'Suspicious inbound connection from DEV-005 (compromised)',
            'Protocol anomaly: HTTP instead of expected BACnet',
            'Configuration parameters modified outside maintenance window',
        ],
        timeline: [
            { time: '10:45', event: 'Incident created — Suspicious lateral movement detected' },
            { time: '10:30', event: 'Inbound connection from compromised DEV-005' },
            { time: '10:15', event: 'Protocol switch from BACnet to HTTP detected' },
        ],
        adjacentDevices: ['DEV-005'],
    },
    {
        id: 'INC-005', deviceId: 'DEV-003', riskLevel: 'medium', severity: 'medium',
        status: 'resolved', recommendedAction: 'Firmware Update Required',
        createdAt: '2026-03-08T16:20:00Z', trustScore: 55, confidence: 75, vendor: 'Siemens', ip: '192.168.1.103',
        narrative: 'Industrial PLC #1 (DEV-003) detected with outdated firmware and off-hours network activity. The firmware version mismatch (expected v3.2.1, found v3.1.8) may expose known vulnerabilities. Off-hours activity between 02:00-04:00 warrants investigation but may be related to automated batch processes.',
        evidence: [
            'Firmware version mismatch: v3.1.8 vs expected v3.2.1',
            'Off-hours network activity (02:00-04:00 window)',
        ],
        timeline: [
            { time: '16:20', event: 'Incident created — Firmware drift detected' },
            { time: '06:00', event: 'Firmware version mismatch confirmed' },
            { time: '03:30', event: 'Off-hours network activity detected' },
        ],
        adjacentDevices: ['DEV-007'],
    },
    {
        id: 'INC-006', deviceId: 'DEV-002', riskLevel: 'low', severity: 'low',
        status: 'closed', recommendedAction: 'Monitor + Traffic Filtering',
        createdAt: '2026-03-07T09:10:00Z', trustScore: 71, confidence: 68, vendor: 'Hikvision', ip: '192.168.1.102',
        narrative: 'IP Camera (DEV-002) in the lobby showed a moderate increase in DNS queries (2.3x baseline) and a first-time connection to a Microsoft CDN endpoint. Both activities are likely benign (firmware update check) but have been logged for monitoring. Traffic filtering rules have been applied.',
        evidence: [
            'DNS query volume increased 2.3x above 7-day baseline',
            'First-time connection to Microsoft CDN (13.107.42.14)',
        ],
        timeline: [
            { time: '09:10', event: 'Incident created — DNS anomaly detected' },
            { time: '08:15', event: 'DNS query volume spike (2.3x baseline)' },
            { time: '22:45', event: 'New external IP contact: 13.107.42.14 (Microsoft CDN)' },
        ],
        adjacentDevices: [],
    },
];

// ============================================================
// ALERTS (12 initial)
// ============================================================
export const initialAlerts: Alert[] = [
    { id: 'ALT-001', type: 'trust_update', deviceId: 'DEV-005', message: 'Trust score dropped to 11 (CRITICAL) for Smart Lock - Server Room', timestamp: '2026-03-09T13:05:00Z', severity: 'critical' },
    { id: 'ALT-002', type: 'policy_violation', deviceId: 'DEV-004', message: 'SSH connection attempt from Medical Monitor violates device class policy', timestamp: '2026-03-09T12:00:00Z', severity: 'critical' },
    { id: 'ALT-003', type: 'new_incident', deviceId: 'DEV-012', message: 'New CRITICAL incident created for Infusion Pump — unauthorized firmware update', timestamp: '2026-03-09T09:35:00Z', severity: 'critical' },
    { id: 'ALT-004', type: 'graph_anomaly', deviceId: 'DEV-005', message: 'New communication edge detected: DEV-005 → DEV-010 (lateral movement)', timestamp: '2026-03-09T12:50:00Z', severity: 'critical' },
    { id: 'ALT-005', type: 'trust_update', deviceId: 'DEV-004', message: 'Trust score declined to 28 (HIGH RISK) for Medical Monitor', timestamp: '2026-03-09T11:30:00Z', severity: 'warning' },
    { id: 'ALT-006', type: 'status_change', deviceId: 'DEV-005', message: 'Smart Lock - Server Room status changed to ISOLATED', timestamp: '2026-03-09T13:10:00Z', severity: 'warning' },
    { id: 'ALT-007', type: 'policy_violation', deviceId: 'DEV-003', message: 'Firmware version mismatch on Industrial PLC #1: v3.1.8 vs expected v3.2.1', timestamp: '2026-03-09T06:00:00Z', severity: 'warning' },
    { id: 'ALT-008', type: 'trust_update', deviceId: 'DEV-010', message: 'Trust score declining for Smart Elevator Panel — now at 38 (HIGH RISK)', timestamp: '2026-03-09T10:30:00Z', severity: 'warning' },
    { id: 'ALT-009', type: 'status_change', deviceId: 'DEV-012', message: 'Infusion Pump status changed to ISOLATED', timestamp: '2026-03-09T09:40:00Z', severity: 'warning' },
    { id: 'ALT-010', type: 'trust_update', deviceId: 'DEV-002', message: 'IP Camera - Lobby trust score stable at 71 (LOW RISK)', timestamp: '2026-03-09T08:15:00Z', severity: 'info' },
    { id: 'ALT-011', type: 'status_change', deviceId: 'DEV-007', message: 'Industrial PLC #2 entered MAINTENANCE mode', timestamp: '2026-03-09T07:00:00Z', severity: 'info' },
    { id: 'ALT-012', type: 'trust_update', deviceId: 'DEV-001', message: 'Smart Thermostat trust score confirmed at 94 (TRUSTED)', timestamp: '2026-03-09T10:00:00Z', severity: 'info' },
];

// ============================================================
// COMPUTED EXPORTS
// ============================================================

export const getDeviceById = (id: string): Device | undefined => devices.find(d => d.id === id);
export const getIncidentById = (id: string): Incident | undefined => incidents.find(i => i.id === id);

export const dashboardStats: DashboardStats = {
    totalDevices: devices.length,
    trustedDevices: devices.filter(d => d.riskLevel === 'trusted').length,
    highRiskDevices: devices.filter(d => d.riskLevel === 'high' || d.riskLevel === 'critical').length,
    activeIncidents: incidents.filter(i => i.status === 'open' || i.status === 'investigating').length,
};

export const riskDistribution = [
    { name: 'Trusted', value: devices.filter(d => d.riskLevel === 'trusted').length, color: '#4BDE80' },
    { name: 'Low', value: devices.filter(d => d.riskLevel === 'low').length, color: '#FFB347' },
    { name: 'Medium', value: devices.filter(d => d.riskLevel === 'medium').length, color: '#FF6B35' },
    { name: 'High', value: devices.filter(d => d.riskLevel === 'high').length, color: '#E8478C' },
    { name: 'Critical', value: devices.filter(d => d.riskLevel === 'critical').length, color: '#FF4C4C' },
];

// Dashboard chart data
export const trendData = [
    { day: 'Mar 3', score: 68 },
    { day: 'Mar 4', score: 65 },
    { day: 'Mar 5', score: 62 },
    { day: 'Mar 6', score: 59 },
    { day: 'Mar 7', score: 55 },
    { day: 'Mar 8', score: 52 },
    { day: 'Mar 9', score: 58 },
];

// Security Posture tab data
export const notablesByUrgency = [
    { time: '00:00', critical: 0, high: 1, medium: 2, low: 1, info: 3 },
    { time: '02:00', critical: 0, high: 0, medium: 1, low: 2, info: 2 },
    { time: '04:00', critical: 1, high: 1, medium: 0, low: 1, info: 1 },
    { time: '06:00', critical: 0, high: 2, medium: 3, low: 0, info: 2 },
    { time: '08:00', critical: 1, high: 1, medium: 2, low: 3, info: 4 },
    { time: '10:00', critical: 2, high: 3, medium: 1, low: 1, info: 2 },
    { time: '12:00', critical: 3, high: 2, medium: 2, low: 0, info: 1 },
    { time: '14:00', critical: 1, high: 1, medium: 3, low: 2, info: 3 },
    { time: '16:00', critical: 0, high: 2, medium: 1, low: 3, info: 2 },
    { time: '18:00', critical: 1, high: 0, medium: 2, low: 1, info: 4 },
    { time: '20:00', critical: 0, high: 1, medium: 1, low: 2, info: 1 },
    { time: '22:00', critical: 1, high: 2, medium: 0, low: 1, info: 2 },
];

// Alert generation for live stream
export function generateNewAlert(): Alert {
    const devicePool = devices.slice(0, 6);
    const device = devicePool[Math.floor(Math.random() * devicePool.length)];
    const types: Alert['type'][] = ['trust_update', 'policy_violation', 'status_change', 'graph_anomaly', 'new_incident'];
    const type = types[Math.floor(Math.random() * types.length)];
    const severities: Alert['severity'][] = ['info', 'warning', 'critical'];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const messages: Record<Alert['type'], string[]> = {
        trust_update: [`Trust score changed for ${device.name}`, `${device.name} trust score updated to ${device.trustScore}`],
        policy_violation: [`Policy violation on ${device.name}`, `${device.name} exceeded traffic threshold`],
        status_change: [`${device.name} status changed`, `Device ${device.id} mode updated`],
        graph_anomaly: [`New edge detected involving ${device.name}`, `Anomalous traffic from ${device.name}`],
        new_incident: [`New incident for ${device.name}`, `Investigation opened for ${device.id}`],
    };
    return {
        id: `ALT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type,
        deviceId: device.id,
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
        timestamp: new Date().toISOString(),
        severity,
    };
}

// ============================================================
// SIEM LAYER DATA (Phase 5)
// ============================================================

import type { UEBAEntity, IOC, KillChain, CorrelatedAlert, SIEMLayerStatus } from '../types';

export const uebaEntities: UEBAEntity[] = [
    {
        deviceId: 'DEV-005', deviceName: 'Smart Lock - Server Room', driftSigma: 4.2, status: 'alert',
        features: [
            { name: 'conn_rate', baseline: 5.2, current: 48.7, unit: '/hr' },
            { name: 'dns_entropy', baseline: 0.31, current: 2.87, unit: '' },
            { name: 'iat_mean', baseline: 120, current: 15, unit: 'ms' },
            { name: 'bytes_ratio', baseline: 0.8, current: 3.2, unit: '' },
            { name: 'off_hours', baseline: 0.05, current: 0.72, unit: '%' },
            { name: 'unique_dst', baseline: 3, current: 24, unit: '' },
        ],
        cusumHistory: [
            { day: 'Mar 3', value: 0.2 }, { day: 'Mar 4', value: 0.5 }, { day: 'Mar 5', value: 1.1 },
            { day: 'Mar 6', value: 1.8 }, { day: 'Mar 7', value: 2.5 }, { day: 'Mar 8', value: 3.4 }, { day: 'Mar 9', value: 4.2 },
        ],
    },
    {
        deviceId: 'DEV-004', deviceName: 'Medical Monitor', driftSigma: 2.8, status: 'drift',
        features: [
            { name: 'conn_rate', baseline: 8.1, current: 32.4, unit: '/hr' },
            { name: 'dns_entropy', baseline: 0.45, current: 1.92, unit: '' },
            { name: 'iat_mean', baseline: 200, current: 60, unit: 'ms' },
            { name: 'bytes_ratio', baseline: 1.0, current: 2.5, unit: '' },
            { name: 'off_hours', baseline: 0.1, current: 0.45, unit: '%' },
            { name: 'unique_dst', baseline: 5, current: 14, unit: '' },
        ],
        cusumHistory: [
            { day: 'Mar 3', value: 0.1 }, { day: 'Mar 4', value: 0.4 }, { day: 'Mar 5', value: 0.8 },
            { day: 'Mar 6', value: 1.2 }, { day: 'Mar 7', value: 1.7 }, { day: 'Mar 8', value: 2.3 }, { day: 'Mar 9', value: 2.8 },
        ],
    },
    {
        deviceId: 'DEV-012', deviceName: 'Infusion Pump', driftSigma: 3.6, status: 'alert',
        features: [
            { name: 'conn_rate', baseline: 2.0, current: 22.1, unit: '/hr' },
            { name: 'dns_entropy', baseline: 0.2, current: 2.1, unit: '' },
            { name: 'iat_mean', baseline: 300, current: 55, unit: 'ms' },
            { name: 'bytes_ratio', baseline: 0.5, current: 4.8, unit: '' },
            { name: 'off_hours', baseline: 0.02, current: 0.65, unit: '%' },
            { name: 'unique_dst', baseline: 2, current: 18, unit: '' },
        ],
        cusumHistory: [
            { day: 'Mar 3', value: 0.3 }, { day: 'Mar 4', value: 0.7 }, { day: 'Mar 5', value: 1.5 },
            { day: 'Mar 6', value: 2.1 }, { day: 'Mar 7', value: 2.6 }, { day: 'Mar 8', value: 3.1 }, { day: 'Mar 9', value: 3.6 },
        ],
    },
    {
        deviceId: 'DEV-010', deviceName: 'Smart Elevator Panel', driftSigma: 1.9, status: 'drift',
        features: [
            { name: 'conn_rate', baseline: 12.4, current: 28.9, unit: '/hr' },
            { name: 'dns_entropy', baseline: 0.55, current: 1.1, unit: '' },
            { name: 'iat_mean', baseline: 150, current: 80, unit: 'ms' },
            { name: 'bytes_ratio', baseline: 0.9, current: 1.8, unit: '' },
            { name: 'off_hours', baseline: 0.08, current: 0.3, unit: '%' },
            { name: 'unique_dst', baseline: 6, current: 11, unit: '' },
        ],
        cusumHistory: [
            { day: 'Mar 3', value: 0.1 }, { day: 'Mar 4', value: 0.3 }, { day: 'Mar 5', value: 0.6 },
            { day: 'Mar 6', value: 0.9 }, { day: 'Mar 7', value: 1.2 }, { day: 'Mar 8', value: 1.5 }, { day: 'Mar 9', value: 1.9 },
        ],
    },
    {
        deviceId: 'DEV-003', deviceName: 'Industrial PLC #1', driftSigma: 1.1, status: 'drift',
        features: [
            { name: 'conn_rate', baseline: 6.0, current: 11.2, unit: '/hr' },
            { name: 'dns_entropy', baseline: 0.3, current: 0.6, unit: '' },
            { name: 'iat_mean', baseline: 250, current: 180, unit: 'ms' },
            { name: 'bytes_ratio', baseline: 0.7, current: 1.1, unit: '' },
            { name: 'off_hours', baseline: 0.15, current: 0.28, unit: '%' },
            { name: 'unique_dst', baseline: 4, current: 7, unit: '' },
        ],
        cusumHistory: [
            { day: 'Mar 3', value: 0.0 }, { day: 'Mar 4', value: 0.1 }, { day: 'Mar 5', value: 0.3 },
            { day: 'Mar 6', value: 0.5 }, { day: 'Mar 7', value: 0.7 }, { day: 'Mar 8', value: 0.9 }, { day: 'Mar 9', value: 1.1 },
        ],
    },
];

export const iocs: IOC[] = [
    { id: 'IOC-001', type: 'ip', value: '185.220.101.34', source: 'OTX', severity: 'critical', hits: 3, firstSeen: '2026-03-07T12:00:00Z', lastSeen: '2026-03-09T13:00:00Z', active: true, linkedDevices: ['DEV-005'], country: 'DE' },
    { id: 'IOC-002', type: 'domain', value: 'update-service.xyz', source: 'MISP', severity: 'critical', hits: 2, firstSeen: '2026-03-08T08:00:00Z', lastSeen: '2026-03-09T07:00:00Z', active: true, linkedDevices: ['DEV-004'], country: 'RU' },
    { id: 'IOC-003', type: 'ip', value: '198.51.100.42', source: 'OTX', severity: 'high', hits: 1, firstSeen: '2026-03-09T05:15:00Z', lastSeen: '2026-03-09T05:15:00Z', active: true, linkedDevices: ['DEV-005'], country: 'CN' },
    { id: 'IOC-004', type: 'hash', value: 'a1b2c3d4e5f6789012345678abcdef01', source: 'Manual', severity: 'high', hits: 0, firstSeen: '2026-03-06T10:00:00Z', lastSeen: '2026-03-06T10:00:00Z', active: true, linkedDevices: [], country: undefined },
    { id: 'IOC-005', type: 'domain', value: 'malware.c2-relay.net', source: 'OTX', severity: 'critical', hits: 5, firstSeen: '2026-03-05T14:00:00Z', lastSeen: '2026-03-09T09:00:00Z', active: true, linkedDevices: ['DEV-012'], country: 'KP' },
    { id: 'IOC-006', type: 'ip', value: '203.0.113.42', source: 'MISP', severity: 'high', hits: 1, firstSeen: '2026-03-09T09:15:00Z', lastSeen: '2026-03-09T09:15:00Z', active: true, linkedDevices: ['DEV-012'], country: 'IR' },
    { id: 'IOC-007', type: 'cve', value: 'CVE-2024-11382', source: 'NVD', severity: 'critical', hits: 1, firstSeen: '2026-03-01T00:00:00Z', lastSeen: '2026-03-09T05:00:00Z', active: true, linkedDevices: ['DEV-005'], country: undefined },
    { id: 'IOC-008', type: 'ip', value: '45.33.32.156', source: 'Manual', severity: 'medium', hits: 1, firstSeen: '2026-03-09T08:15:00Z', lastSeen: '2026-03-09T08:15:00Z', active: false, linkedDevices: ['DEV-002'], country: 'US' },
];

export const killChains: KillChain[] = [
    {
        id: 'KC-001', name: 'Server Room Lock Compromise', severity: 'critical', status: 'active',
        startTime: '2026-03-09T04:58:00Z', duration: '8h 34m', devices: ['DEV-005', 'DEV-010', 'DEV-012'],
        stages: [
            { tactic: 'Reconnaissance', technique: 'Port Scanning', deviceId: 'DEV-005', timestamp: '2026-03-09T04:58:00Z', confirmed: true },
            { tactic: 'Initial Access', technique: 'Exploit Public-Facing App (CVE-2024-11382)', deviceId: 'DEV-005', timestamp: '2026-03-09T05:00:00Z', confirmed: true },
            { tactic: 'Credential Access', technique: 'LDAP Credential Dump', deviceId: 'DEV-005', timestamp: '2026-03-09T05:15:00Z', confirmed: true },
            { tactic: 'Lateral Movement', technique: 'Remote Service Exploitation', deviceId: 'DEV-010', timestamp: '2026-03-09T06:30:00Z', confirmed: true },
            { tactic: 'Command & Control', technique: 'Tor Proxy', deviceId: 'DEV-005', timestamp: '2026-03-09T07:00:00Z', confirmed: true },
            { tactic: 'Exfiltration', technique: 'Exfiltration Over C2 Channel', deviceId: 'DEV-005', timestamp: '2026-03-09T07:45:00Z', confirmed: false },
        ],
    },
    {
        id: 'KC-002', name: 'Medical Device Ransomware', severity: 'critical', status: 'active',
        startTime: '2026-03-09T02:00:00Z', duration: '11h 30m', devices: ['DEV-012', 'DEV-004'],
        stages: [
            { tactic: 'Initial Access', technique: 'Unauthorized Firmware Update', deviceId: 'DEV-012', timestamp: '2026-03-09T02:00:00Z', confirmed: true },
            { tactic: 'Execution', technique: 'SNMP Write Exploitation', deviceId: 'DEV-012', timestamp: '2026-03-09T02:15:00Z', confirmed: true },
            { tactic: 'Persistence', technique: 'Create Account (svc_backup)', deviceId: 'DEV-012', timestamp: '2026-03-09T02:30:00Z', confirmed: true },
            { tactic: 'Command & Control', technique: 'DNS Tunneling to C2', deviceId: 'DEV-012', timestamp: '2026-03-09T03:00:00Z', confirmed: true },
            { tactic: 'Impact', technique: 'Data Encrypted for Impact (LockBit 3.0)', deviceId: 'DEV-012', timestamp: '2026-03-09T03:30:00Z', confirmed: true },
            { tactic: 'Lateral Movement', technique: 'Beaconing to Adjacent Device', deviceId: 'DEV-004', timestamp: '2026-03-09T06:30:00Z', confirmed: false },
        ],
    },
];

export const correlatedAlerts: CorrelatedAlert[] = [
    { id: 'CA-001', layers: ['L1', 'L2', 'L3'], deviceId: 'DEV-005', deviceName: 'Smart Lock', severity: 'critical', message: '3-layer correlated — Tor contact + behavioral drift + kill chain progression', timestamp: '2026-03-09T13:32:00Z' },
    { id: 'CA-002', layers: ['L1', 'L3'], deviceId: 'DEV-012', deviceName: 'Infusion Pump', severity: 'critical', message: 'Network anomaly + ransomware kill chain active', timestamp: '2026-03-09T09:18:00Z' },
    { id: 'CA-003', layers: ['L1', 'L2'], deviceId: 'DEV-004', deviceName: 'Medical Monitor', severity: 'high', message: 'Network + UEBA drift — C2 beaconing with behavioral anomaly', timestamp: '2026-03-09T12:05:00Z' },
];

export const siemLayerStatus: SIEMLayerStatus[] = [
    { layer: 'Layer 1', name: 'Network', status: 'live', detail: 'All flows monitored', color: '#1A56DB' },
    { layer: 'Layer 2', name: 'UEBA', status: 'live', detail: `${uebaEntities.filter(e => e.status === 'alert').length} alert(s)`, color: '#7E3AF2' },
    { layer: 'Layer 3', name: 'Correlation', status: 'warning', detail: `${killChains.filter(k => k.status === 'active').length} active chain(s)`, color: '#E02424' },
    { layer: 'Threat Intel', name: 'IOC Feed', status: 'alert', detail: `${iocs.filter(i => i.hits > 0).length} IOC hit(s)`, color: '#FF5A1F' },
];

// ============================================================
// COMPLIANCE DATA
// ============================================================

import type { ComplianceFunction, SOCQueueItem, AuditEntry } from '../types';

export const complianceFunctions: ComplianceFunction[] = [
    {
        name: 'Identify', score: 78, color: '#3B82F6',
        controls: [
            { id: 'ID.AM-1', requirement: 'Physical devices inventoried', status: 'pass' },
            { id: 'ID.AM-2', requirement: 'Software platforms inventoried', status: 'pass' },
            { id: 'ID.BE-3', requirement: 'Organizational mission understood', status: 'partial', evidence: 'Partial documentation' },
            { id: 'ID.RA-1', requirement: 'Asset vulnerabilities identified', status: 'pass' },
        ],
    },
    {
        name: 'Protect', score: 61, color: '#10B981',
        controls: [
            { id: 'PR.AC-1', requirement: 'Identities managed for authorized devices', status: 'pass' },
            { id: 'PR.AC-4', requirement: 'Access permissions managed', status: 'pass' },
            { id: 'PR.DS-1', requirement: 'Data-at-rest is protected', status: 'fail', evidence: 'Missing encryption on 3 devices' },
            { id: 'PR.IP-1', requirement: 'Security baseline config created', status: 'partial' },
        ],
    },
    {
        name: 'Detect', score: 91, color: '#8B5CF6',
        controls: [
            { id: 'DE.AE-1', requirement: 'Baseline of network operations established', status: 'pass' },
            { id: 'DE.AE-3', requirement: 'Event data aggregated and correlated', status: 'pass' },
            { id: 'DE.CM-1', requirement: 'Network is monitored', status: 'pass' },
            { id: 'DE.CM-7', requirement: 'Monitoring for unauthorized personnel', status: 'pass' },
        ],
    },
    {
        name: 'Respond', score: 34, color: '#F59E0B',
        controls: [
            { id: 'RS.RP-1', requirement: 'Response plan executed', status: 'partial', evidence: 'Draft playbooks only' },
            { id: 'RS.CO-2', requirement: 'Incidents reported', status: 'fail', evidence: 'No automated reporting' },
            { id: 'RS.AN-1', requirement: 'Notifications from detection investigated', status: 'pass' },
            { id: 'RS.MI-1', requirement: 'Incidents contained', status: 'fail', evidence: 'Manual containment only' },
        ],
    },
    {
        name: 'Recover', score: 22, color: '#EF4444',
        controls: [
            { id: 'RC.RP-1', requirement: 'Recovery plan executed', status: 'fail', evidence: 'No recovery plan exists' },
            { id: 'RC.IM-1', requirement: 'Recovery plans incorporate lessons learned', status: 'fail' },
            { id: 'RC.CO-1', requirement: 'Public relations managed', status: 'partial' },
        ],
    },
];

export const overallComplianceScore = Math.round(complianceFunctions.reduce((s, f) => s + f.score, 0) / complianceFunctions.length);

// ============================================================
// SOC WORKBENCH DATA
// ============================================================

export const socQueue: SOCQueueItem[] = [
    { incidentId: 'INC-001', deviceId: 'DEV-005', deviceName: 'Smart Lock', severity: 'critical', summary: 'Tor exit node contact + UEBA alert + kill chain active', assignedTo: 'jitraj', timestamp: '2026-03-09T13:32:00Z', status: 'in_progress' },
    { incidentId: 'INC-002', deviceId: 'DEV-004', deviceName: 'Medical Monitor', severity: 'high', summary: 'C2 beaconing detected with behavioral drift', assignedTo: 'analyst_1', timestamp: '2026-03-09T12:05:00Z', status: 'in_progress' },
    { incidentId: 'INC-003', deviceId: 'DEV-012', deviceName: 'Infusion Pump', severity: 'critical', summary: 'Ransomware kill chain — LockBit 3.0 encryption detected', assignedTo: 'jitraj', timestamp: '2026-03-09T09:18:00Z', status: 'queued' },
    { incidentId: 'INC-004', deviceId: 'DEV-010', deviceName: 'Smart Elevator', severity: 'medium', summary: 'Elevated connection rate — lateral movement suspected', assignedTo: 'unassigned', timestamp: '2026-03-09T08:45:00Z', status: 'queued' },
];

export const auditLog: AuditEntry[] = [
    { id: 'AUD-001', analyst: 'jitraj', action: 'Escalated', target: 'INC-001', timestamp: '14:31' },
    { id: 'AUD-002', analyst: 'jitraj', action: 'Executed VLAN_ISOLATION step 1', target: 'INC-001', timestamp: '14:28' },
    { id: 'AUD-003', analyst: 'analyst_1', action: 'Assigned self to', target: 'INC-002', timestamp: '14:15' },
    { id: 'AUD-004', analyst: 'jitraj', action: 'Cleared false positive', target: 'INC-005', timestamp: '13:50' },
    { id: 'AUD-005', analyst: 'analyst_1', action: 'Added note to', target: 'INC-002', timestamp: '13:42' },
    { id: 'AUD-006', analyst: 'jitraj', action: 'Started investigation on', target: 'INC-003', timestamp: '13:30' },
];
