# IoT Sentinel Mobile — API Requirements

All endpoints that must be connected to the backend for full functionality.
Currently using mock data from `src/data/mockData.ts`.

---

## 🔐 Authentication

| Method | Endpoint | Screen | Current State |
|--------|----------|--------|---------------|
| `POST` | `/api/auth/login` | `LoginScreen.tsx:27` | Simulated 1.5s delay, hardcoded success |
| `POST` | `/api/auth/logout` | `SettingsScreen.tsx` | Not yet wired |
| `GET` | `/api/auth/me` | App-wide | Not yet added — needed for session check |

---

## 📱 Devices

| Method | Endpoint | Screen | Current State |
|--------|----------|--------|---------------|
| `GET` | `/api/devices` | `DevicesScreen.tsx:30` | Uses `devices` from mockData |
| `GET` | `/api/devices/:id` | `DeviceDetailScreen.tsx:6` | Uses `getDeviceById()` from mockData |
| `POST` | `/api/devices/:id/clear` | `DeviceDetailScreen.tsx:54` | Alert only, no fetch |
| `POST` | `/api/devices/:id/maintenance` | `DeviceDetailScreen.tsx:58` | Alert only, no fetch |
| `POST` | `/api/devices/:id/isolate` | `DeviceDetailScreen.tsx:62` | Alert only, no fetch |

---

## 🚨 Incidents

| Method | Endpoint | Screen | Current State |
|--------|----------|--------|---------------|
| `GET` | `/api/incidents` | `IncidentsScreen.tsx:46` | Uses `incidents` from mockData |
| `GET` | `/api/incidents/:id` | `IncidentDetailScreen.tsx:5` | Uses `getIncidentById()` from mockData |
| `POST` | `/api/incidents/:id/notes` | `IncidentDetailScreen.tsx:35` | Alert only, note not persisted |
| `PATCH` | `/api/incidents/:id/status` | `IncidentDetailScreen.tsx:41` | Local state only, not persisted |

---

## ⚠️ Alerts & Events

| Method | Endpoint | Screen | Current State |
|--------|----------|--------|---------------|
| `WS` | `/ws/events` | `AlertsScreen.tsx:25` | Uses `setInterval` + `generateNewAlert()` |
| `POST` | `/api/alerts/clear` | `AlertsScreen.tsx:40` | Clears local state only |
| `GET` | `/api/alerts/history` | Not yet added | Needed for historical alert view |

---

## 📊 Dashboard

| Method | Endpoint | Screen | Current State |
|--------|----------|--------|---------------|
| `GET` | `/api/dashboard/stats` | `DashboardScreen.tsx:7` | Uses `dashboardStats` from mockData |
| `GET` | `/api/dashboard/risk-distribution` | `DashboardScreen.tsx:7` | Uses `riskDistribution` from mockData |
| `GET` | `/api/dashboard/trend?range=7d` | `DashboardScreen.tsx:7` | Uses `trendData` from mockData |
| `GET` | `/api/dashboard/posture?range=7d` | `DashboardScreen.tsx:110` | Hardcoded metrics per range |

---

## 🗺️ Network Topology

| Method | Endpoint | Screen | Current State |
|--------|----------|--------|---------------|
| `GET` | `/api/topology/nodes` | `TopologyScreen.tsx:9` | Uses hardcoded `nodes` array |
| `GET` | `/api/topology/edges` | `TopologyScreen.tsx:9` | Uses `devices` from mockData for edges |

---

## ⚙️ Settings

| Method | Endpoint | Screen | Current State |
|--------|----------|--------|---------------|
| `GET` | `/api/settings` | `SettingsScreen.tsx:10` | Local state only |
| `PATCH` | `/api/settings` | `SettingsScreen.tsx:10` | Local state only |
| `GET` | `/api/export/devices` | `SettingsScreen.tsx:21` | Alert stub only |

---

## 🔔 Push Notifications

| Method | Endpoint | Screen | Current State |
|--------|----------|--------|---------------|
| `POST` | `/api/push/register` | `notifications.ts:87` | Token obtained but not sent to backend |
| `POST` | `/api/push/unregister` | Not yet added | Needed for logout cleanup |

---

## 📝 Summary

| Category | Endpoints | Connected | Remaining |
|----------|-----------|-----------|-----------|
| Auth | 3 | 0 | **3** |
| Devices | 5 | 0 | **5** |
| Incidents | 4 | 0 | **4** |
| Alerts | 3 | 0 | **3** |
| Dashboard | 4 | 0 | **4** |
| Topology | 2 | 0 | **2** |
| Settings | 3 | 0 | **3** |
| Push | 2 | 0 | **2** |
| **Total** | **26** | **0** | **26** |

---

## 🛠️ Mock Data Files to Replace

| File | Used By |
|------|---------|
| `src/data/mockData.ts` → `devices` | DevicesScreen, TopologyScreen, DashboardScreen |
| `src/data/mockData.ts` → `incidents` | IncidentsScreen, DashboardScreen |
| `src/data/mockData.ts` → `initialAlerts` | AlertsScreen |
| `src/data/mockData.ts` → `generateNewAlert()` | AlertsScreen (replace with WebSocket) |
| `src/data/mockData.ts` → `dashboardStats` | DashboardScreen |
| `src/data/mockData.ts` → `riskDistribution` | DashboardScreen |
| `src/data/mockData.ts` → `trendData` | DashboardScreen |
| `src/data/mockData.ts` → `getDeviceById()` | DeviceDetailScreen, TopologyScreen, IncidentDetailScreen |
| `src/data/mockData.ts` → `getIncidentById()` | IncidentDetailScreen |
