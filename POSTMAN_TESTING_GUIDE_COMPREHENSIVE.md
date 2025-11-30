# Comprehensive Postman API Testing Guide - PredictaLab Backend

> **Complete end-to-end testing guide with all features, seed data IDs, and example scenarios**

---

## Quick Start Checklist

- [ ] Backend running (`npm run dev`)
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] Database seeded (`npm run seed`)
- [ ] Postman installed
- [ ] Create environment with `access_token` variable

---

## Table of Contents

1. [Setup & Prerequisites](#setup--prerequisites)
2. [Test Data Reference](#test-data-reference)
3. [Authentication & Token Management](#authentication--token-management)
4. [API Endpoints Overview](#api-endpoints-overview)
5. [Student & Scheduling Workflows](#student--scheduling-workflows)
6. [IoT & Fault Detection Flow](#iot--fault-detection-flow)
7. [Maintenance Workflow](#maintenance-workflow)
8. [End-to-End Test Scenarios](#end-to-end-test-scenarios)
9. [Expected Responses & Status Codes](#expected-responses--status-codes)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [cURL Command Reference](#curl-command-reference)

---

## Setup & Prerequisites

### Environment

- Backend URL: `http://localhost:3000`
- Database: PostgreSQL (or configured DB in .env)
- Node.js v14+

### Run Backend

```bash
# Install dependencies
npm install

# Run migrations
npx prisma migrate dev

# Seed database
npm run seed

# Start server
npm run dev
# or
node src/server.js
```

### Postman Setup

1. Create a new Collection: "PredictaLab Backend Testing"
2. Create an Environment: "PredictaLab Dev"
3. Add variable: `access_token` (leave empty, will auto-populate on login)
4. Add variable: `base_url` = `http://localhost:3000`

---

## Test Data Reference

### All ITIs (10)

```
ITI_ID 1: Government ITI Mumbai, Maharashtra
ITI_ID 2: Government ITI Delhi, Delhi
ITI_ID 3: Government ITI Chennai, Tamil Nadu
ITI_ID 4: Government ITI Bengaluru, Karnataka
ITI_ID 5: Government ITI Pune, Maharashtra
ITI_ID 6: Government ITI Hyderabad, Telangana
ITI_ID 7: Government ITI Ahmedabad, Gujarat
ITI_ID 8: Government ITI Jaipur, Rajasthan
ITI_ID 9: Government ITI Kolkata, West Bengal
ITI_ID 10: Government ITI Lucknow, Uttar Pradesh
```

### All Students (10) - with Credentials

```
Student_ID 1 | Aditya Pawar      | Mumbai      | Electrician   | email: aditya.pawar@example.com        | password: password
Student_ID 2 | Rohan Shinde      | Mumbai      | Fitter        | email: rohan.shinde@example.com        | password: password
Student_ID 3 | Shreya Gupta      | Delhi       | COPA          | email: shreya.gupta@example.com        | password: password
Student_ID 4 | Vignesh K         | Chennai     | Mechanic      | email: vignesh.k@example.com           | password: password
Student_ID 5 | Nandini S         | Bengaluru   | Turner        | email: nandini.s@example.com           | password: password
Student_ID 6 | Imran Khan        | Hyderabad   | Welder        | email: imran.khan@example.com          | password: password
Student_ID 7 | Kajal Patel       | Ahmedabad   | Machinist     | email: kajal.patel@example.com         | password: password
Student_ID 8 | Deepak Meena      | Jaipur      | AC Tech       | email: deepak.meena@example.com        | password: password
Student_ID 9 | Ananya Sen        | Kolkata     | Electronics   | email: ananya.sen@example.com          | password: password
Student_ID 10| Rahul Mishra      | Lucknow     | Plumber       | email: rahul.mishra@example.com        | password: password
```

### All Machines (10) - with Status & Scheduling Eligibility

```
Machine_ID  | Name                        | ITI        | Status    | Last_used   | Faults | Schedule ✅/⚠️
1           | Lathe Machine - HMT         | Mumbai     | HEALTHY   | 2024-11-20  | 0      | ✅ YES
2           | Drilling Machine            | Mumbai     | HEALTHY   | 2024-11-19  | 1      | ✅ YES
3           | Computer Lab System         | Delhi      | ALERT     | 2024-11-18  | 2      | ⚠️  NO (needs inspection)
4           | Automotive Engine Test Rig  | Chennai    | CRITICAL  | 2024-10-30  | 4      | ❌ NO (maintenance required)
5           | CNC Lathe Trainer           | Bengaluru  | HEALTHY   | 2024-11-21  | 0      | ✅ YES
6           | Arc Welding Set             | Hyderabad  | ALERT     | 2024-11-15  | 2      | ⚠️  NO (needs inspection)
7           | Milling Machine             | Ahmedabad  | HEALTHY   | 2024-11-17  | 1      | ✅ YES
8           | Split AC Training Unit      | Jaipur     | ALERT     | 2024-11-16  | 2      | ⚠️  NO (needs inspection)
9           | Electronics Workbench       | Kolkata    | HEALTHY   | 2024-11-14  | 1      | ✅ YES
10          | Pipe Threading Machine      | Lucknow    | ALERT     | 2024-11-13  | 3      | ⚠️  NO (needs inspection)
```

### Maintenance Workers (10)

```
M_Worker_ID | Name               | ITI        | Experience | Active | Solved Cases
1           | Sanjay Patil       | Mumbai     | 7 years    | ✅     | 35
2           | Manoj Sharma       | Delhi      | 6 years    | ✅     | 28
3           | Rajesh Kumar       | Chennai    | 8 years    | ✅     | 42
4           | Anita Singh        | Bengaluru  | 5 years    | ✅     | 18
5           | Vikram Patel       | Hyderabad  | 9 years    | ✅     | 51
6           | Nikhil Kapoor      | Ahmedabad  | 7 years    | ✅     | 33
7           | Harsh Reddy        | Jaipur     | 6 years    | ✅     | 25
8           | Pradeep Rao        | Kolkata    | 8 years    | ✅     | 39
9           | Rahul Ghosh        | Lucknow    | 4 years    | ✅     | 12
10          | Sameer Desai       | Mumbai     | 10 years   | ✅     | 67
```

### Trades (10)

```
Trade_ID 1-10 assigned to various ITIs with durations 1-2 years, NCVT Certification
Examples: Electrician, Fitter, COPA, Mechanic, Turner, Welder, etc.
```

---

## Authentication & Token Management

### Login Endpoint

```
POST /api/students/login
```

### Sample Request

```json
{
  "email": "aditya.pawar@example.com",
  "password": "password"
}
```

### Sample Response

```json
{
  "message": "Login successful",
  "student": {
    "Student_ID": 1,
    "Name": "Aditya Pawar",
    "Email": "aditya.pawar@example.com",
    "ITI_ID": 1,
    "Trade_ID": 1,
    "Batch": "2024-2026"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Auto-save Token in Postman

After login request, add this as "Tests" script:

```javascript
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  pm.environment.set("access_token", jsonData.accessToken);
  console.log("Token saved: " + jsonData.accessToken);
}
```

### Use Token in Headers

For all authenticated requests:

```
Authorization: Bearer {{access_token}}
```

---

## API Endpoints Overview

### By Category

#### Students (3 endpoints)

- `POST /api/students/login` (no auth)
- `GET /api/students/:studentId/machines` (auth required)
- `POST /api/students/schedule/auto` (delegates to maintenance.schedule.auto)

#### Machines (7 endpoints)

- `POST /api/machines` (no auth)
- `GET /api/machines` (no auth)
- `GET /api/machines/:id` (no auth)
- `PUT /api/machines/:id` (no auth)
- `DELETE /api/machines/:id` (no auth)
- `GET /api/machines/schedule/:itiId` (no auth)
- `POST /api/machines/assign` (no auth)

#### IoT (1 endpoint) - **CRITICAL for fault detection**

- `POST /api/iot/sensor-data` (no auth)

#### Maintenance (5 endpoints) - **Core workflow**

- `POST /api/maintenance/schedule/auto` (auth required) ⭐ NEW
- `GET /api/maintenance/schedule/today` (auth required)
- `POST /api/maintenance/mark-solved` (auth required)
- `POST /api/maintenance/escalate` (auth required)
- `POST /api/maintenance/notify-policy-maker` (auth required)

#### ITI (5 endpoints)

- `POST /api/itis` (no auth)
- `GET /api/itis` (no auth)
- `GET /api/itis/:id` (no auth)
- `PUT /api/itis/:id` (no auth)
- `DELETE /api/itis/:id` (no auth)

#### Maintenance Workers (5 endpoints)

- `POST /api/maintenanceWorkers` (no auth)
- `GET /api/maintenanceWorkers` (no auth)
- `GET /api/maintenanceWorkers/:id` (no auth)
- `PUT /api/maintenanceWorkers/:id` (no auth)
- `DELETE /api/maintenanceWorkers/:id` (no auth)

---

## Student & Scheduling Workflows

### Workflow 1: Complete Student Scheduling (HEALTHY machines only)

#### Step 1: Login as Student

```
POST http://localhost:3000/api/students/login
Content-Type: application/json

{
  "email": "aditya.pawar@example.com",
  "password": "password"
}
```

✅ **Expected:** 200 OK, token saved in environment

#### Step 2: Auto-Schedule Batch

```
POST http://localhost:3000/api/maintenance/schedule/auto
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "itiId": 1,
  "tradeId": 1,
  "batch": "2024-2026",
  "timeSlotMinutes": 60,
  "workerId": 1
}
```

✅ **Expected:** 201 Created

```json
{
  "message": "Schedule generated",
  "data": {
    "logs": [
      {
        "S_Log_ID": 1,
        "Machine_ID": 1,
        "Student_ID": 1,
        "Worker_ID": 1,
        "Time": 60,
        "Scheduled_On": "2024-12-01T10:00:00Z",
        "machine": {
          "Machine_ID": 1,
          "Machine_Name": "Lathe Machine - HMT",
          "Status": "HEALTHY",
          "ITI_ID": 1
        },
        "student": {
          "Student_ID": 1,
          "Name": "Aditya Pawar"
        },
        "worker": {
          "Worker_ID": 1,
          "Name": "Rahul Deshmukh"
        }
      }
    ],
    "unscheduledStudents": []
  }
}
```

**Key Features:**

- ✅ Only HEALTHY machines selected
- ✅ ALERT/CRITICAL machines automatically excluded
- ✅ Optimistic reservation prevents race conditions
- ✅ Returns created logs + any unscheduled students

#### Step 3: Verify Assignments

```
GET http://localhost:3000/api/students/1/machines
Authorization: Bearer {{access_token}}
```

✅ **Expected:** 200 OK, returns machines assigned to student

#### Step 4: Get Today's Schedule

```
GET http://localhost:3000/api/maintenance/schedule/today?itiId=1&tradeId=1&batch=2024-2026
Authorization: Bearer {{access_token}}
```

✅ **Expected:** 200 OK, shows all schedule logs for today with student/machine/worker details

---

## IoT & Fault Detection Flow

### Fault Detection Algorithm

```
faultScore = (vibration × 0.3) + (temperature × 0.5) + (current × 0.2)

If faultScore > 80:
  → Status = CRITICAL
  → Auto-create maintenance log
  → Auto-assign least-busy maintenance worker
  → Release machine reservation
  → Send alert

Else if faultScore 50-80:
  → Status = ALERT
  → Skip machine in student scheduling
  → No auto-maintenance (flag for inspection)

Else (faultScore < 50):
  → Status = HEALTHY
  → Available for student scheduling
```

### Workflow 2: Detect & Handle Machine Fault

#### Step 1: Normal Operation

```
POST http://localhost:3000/api/iot/sensor-data
Content-Type: application/json

{
  "machineId": 1,
  "vibration": 10,
  "temp": 30,
  "current": 5
}
```

✅ **Expected:** 200 OK, status: "HEALTHY"

```json
{
  "message": "Sensor data received and machine status updated",
  "faultProbability": 17.5,
  "status": "HEALTHY"
}
```

#### Step 2: Alert Level Detected

```
POST http://localhost:3000/api/iot/sensor-data
Content-Type: application/json

{
  "machineId": 3,
  "vibration": 40,
  "temp": 60,
  "current": 8
}
```

✅ **Expected:** 200 OK, status: "ALERT"

```json
{
  "message": "Sensor data received and machine status updated",
  "faultProbability": 52.0,
  "status": "ALERT"
}
```

**Action:** Machine skipped in scheduling, but no maintenance created yet

#### Step 3: Critical Fault Detected

```
POST http://localhost:3000/api/iot/sensor-data
Content-Type: application/json

{
  "machineId": 4,
  "vibration": 85,
  "temp": 92,
  "current": 18
}
```

✅ **Expected:** 200 OK, status: "CRITICAL"

```json
{
  "message": "Sensor data received and machine status updated",
  "faultProbability": 86.5,
  "status": "CRITICAL"
}
```

**Automatic Actions:**

1. Machine_Status → CRITICAL
2. Faults counter incremented
3. Maintenance_Log created (check DB or console)
4. Maintenance worker assigned (least busy worker)
5. Alert logged (console)
6. Machine reserved (can't schedule students)

#### Step 4: Verify Maintenance Assignment

Check the backend console for:

```
Maintenance task assigned to Worker <M_Worker_ID> for Machine <Machine_ID>
```

---

## Maintenance Workflow

### Workflow 3: Complete Maintenance Case Resolution

#### Step 1: Trigger Maintenance (via IoT or manual)

```
POST http://localhost:3000/api/iot/sensor-data
Body: { "machineId": 4, "vibration": 85, "temp": 92, "current": 18 }
```

✅ Result: Maintenance_Log created, worker assigned

#### Step 2: Escalate Case (optional)

```
POST http://localhost:3000/api/maintenance/escalate
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "mlId": 1,
  "workerId": 1
}
```

✅ **Expected:** 200 OK

- Status changed to "Escalated to TO"
- Training Officer assigned

#### Step 3: Notify Policy Maker (optional)

```
POST http://localhost:3000/api/maintenance/notify-policy-maker
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "mlId": 1
}
```

✅ **Expected:** 200 OK

- Status changed to "Notified Policy Maker"

#### Step 4: Mark as Solved

```
POST http://localhost:3000/api/maintenance/mark-solved
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "mlId": 1,
  "actionTaken": "Replaced faulty bearing, tested within spec"
}
```

✅ **Expected:** 200 OK

```json
{
  "message": "Maintenance case marked as solved",
  "updatedLog": {
    "ML_ID": 1,
    "Status": "Solved",
    "Action_Taken": "Replaced faulty bearing, tested within spec",
    "Updated_At": "2024-12-01T..."
  }
}
```

**Automatic Actions:**

1. Maintenance_Log Status → "Solved"
2. Worker's Solved_cases counter incremented
3. Machine Status → "HEALTHY"
4. Worker's pending list updated

---

## End-to-End Test Scenarios

### Scenario 1: Full Student Training Cycle (30 mins)

1. Login as student (2 min)
2. Auto-schedule batch for HEALTHY machines (5 min)
3. View assigned machines (3 min)
4. Check today's schedule (2 min)
5. Simulate IoT sensor data for machine health monitoring (5 min)
6. View maintenance logs (if any faults triggered) (3 min)
7. Verify only HEALTHY machines assigned (5 min)

### Scenario 2: Fault Detection & Repair (20 mins)

1. Send normal sensor data (3 min)
2. Send ALERT level sensor data (2 min)
3. Verify scheduling skips ALERT machine (3 min)
4. Send CRITICAL sensor data (2 min)
5. Verify maintenance assignment (3 min)
6. Mark maintenance as solved (3 min)
7. Verify machine back to HEALTHY (4 min)

### Scenario 3: Maintenance Escalation (25 mins)

1. Create critical maintenance case (5 min)
2. Escalate to Training Officer (5 min)
3. Notify Policy Maker (5 min)
4. Mark case solved (5 min)
5. Verify final status (5 min)

### Scenario 4: Machine Reservation Under Load (15 mins)

1. Start auto-schedule for Batch A (5 min)
2. Simultaneously start auto-schedule for Batch B (5 min)
3. Verify no double-booking of machines (5 min)
4. Confirm reservations released after scheduling (5 min)

---

## Expected Responses & Status Codes

| Code | Meaning                             | Common Endpoints                      |
| ---- | ----------------------------------- | ------------------------------------- |
| 200  | Success (GET, POST returning data)  | All GET, most POST                    |
| 201  | Created (POST creates new resource) | Schedule, Maintenance, Student routes |
| 204  | No Content (DELETE successful)      | DELETE routes                         |
| 400  | Bad Request (invalid data/params)   | All (if malformed body)               |
| 401  | Unauthorized (missing token)        | Auth-required endpoints               |
| 403  | Forbidden (invalid credentials)     | Auth routes                           |
| 404  | Not Found (resource doesn't exist)  | GET by ID, missing record             |
| 500  | Server Error (unexpected crash)     | Any (if DB error, etc.)               |

---

## Troubleshooting Guide

### Problem: "No available machines" when scheduling

**Cause:** All machines ALERT/CRITICAL or reserved
**Solution:**

```
1. Check machine statuses: GET /api/machines
2. Send healthy sensor data: POST /api/iot/sensor-data with low values
3. Mark maintenance cases solved: POST /api/maintenance/mark-solved
```

### Problem: "No available maintenance workers"

**Cause:** No active workers in ITI, or all inactive
**Solution:**

```
1. Check workers: GET /api/maintenanceWorkers
2. Verify Active_Status = true
3. Create new workers if needed: POST /api/maintenanceWorkers
```

### Problem: Student login fails

**Cause:** Wrong email/password, student doesn't exist, or password not hashed
**Solution:**

```
1. Use seed credentials from this guide
2. Reset password: npm run seed (re-seeds with 'password')
3. Check student exists: GET /api/students
```

### Problem: Token expired or invalid

**Cause:** Session timeout, token malformed, or environment variable not set
**Solution:**

```
1. Re-login: POST /api/students/login
2. Verify token in Postman: {{access_token}} not empty
3. Check Authorization header format: "Bearer TOKEN_HERE" (with space)
```

### Problem: Machine reservation stuck

**Cause:** Scheduling crashed mid-transaction, leaving Reserved=true
**Solution:**

```
SQL: UPDATE Machines SET Reserved = false WHERE Machine_ID = ?;
Then restart scheduling
```

### Problem: Maintenance log not created on CRITICAL

**Cause:** Fault detection logic doesn't calculate CRITICAL, or worker not available
**Solution:**

```
1. Verify faultScore > 80: (vibration*0.3) + (temp*0.5) + (current*0.2) > 80
2. Check workers: GET /api/maintenanceWorkers, ensure Active_Status=true
3. Check console logs for error messages
```

---

## cURL Command Reference

### 1. Login (Save token)

```bash
curl -X POST http://localhost:3000/api/students/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aditya.pawar@example.com",
    "password": "password"
  }' | jq '.accessToken' > token.txt

TOKEN=$(cat token.txt | tr -d '"')
```

### 2. Auto-Schedule Batch

```bash
curl -X POST http://localhost:3000/api/maintenance/schedule/auto \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "itiId": 1,
    "tradeId": 1,
    "batch": "2024-2026",
    "timeSlotMinutes": 60,
    "workerId": 1
  }'
```

### 3. Send Sensor Data (Normal)

```bash
curl -X POST http://localhost:3000/api/iot/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "machineId": 1,
    "vibration": 10,
    "temp": 30,
    "current": 5
  }'
```

### 4. Send Sensor Data (CRITICAL)

```bash
curl -X POST http://localhost:3000/api/iot/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "machineId": 4,
    "vibration": 85,
    "temp": 92,
    "current": 18
  }'
```

### 5. Get Today Schedule

```bash
curl -X GET "http://localhost:3000/api/maintenance/schedule/today?itiId=1&tradeId=1&batch=2024-2026" \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Get Student's Assigned Machines

```bash
curl -X GET http://localhost:3000/api/students/1/machines \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Get All Machines

```bash
curl -X GET http://localhost:3000/api/machines
```

### 8. Get All ITIs

```bash
curl -X GET http://localhost:3000/api/itis
```

### 9. Get All Maintenance Workers

```bash
curl -X GET http://localhost:3000/api/maintenanceWorkers
```

### 10. Mark Maintenance Solved

```bash
curl -X POST http://localhost:3000/api/maintenance/mark-solved \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "mlId": 1,
    "actionTaken": "Replaced bearing and tested"
  }'
```

---

## Summary: Key Features Tested

✅ **Student Scheduling:** Only HEALTHY machines assigned
✅ **IoT Fault Detection:** Vibration, temperature, current combined
✅ **Automatic Maintenance:** CRITICAL faults trigger worker assignment
✅ **Machine Reservation:** Optimistic locking prevents race conditions
✅ **Status Transitions:** HEALTHY → ALERT → CRITICAL → Maintenance → HEALTHY
✅ **Maintenance Escalation:** Case can escalate to TO, Policy Maker
✅ **Comprehensive Logging:** All actions logged for audit trail
✅ **Authentication:** Token-based auth for protected endpoints
✅ **Data Integrity:** Transactional scheduling + machine updates

---

## Quick Reference Table

| Use Case                | Endpoint                               | Method | Auth |
| ----------------------- | -------------------------------------- | ------ | ---- |
| Login                   | `/api/students/login`                  | POST   | ❌   |
| View assigned machines  | `/api/students/:id/machines`           | GET    | ✅   |
| Schedule batch          | `/api/maintenance/schedule/auto`       | POST   | ✅   |
| Today schedule          | `/api/maintenance/schedule/today`      | GET    | ✅   |
| Send sensor data        | `/api/iot/sensor-data`                 | POST   | ❌   |
| Mark maintenance solved | `/api/maintenance/mark-solved`         | POST   | ✅   |
| Escalate case           | `/api/maintenance/escalate`            | POST   | ✅   |
| Notify policy maker     | `/api/maintenance/notify-policy-maker` | POST   | ✅   |
| Get all machines        | `/api/machines`                        | GET    | ❌   |
| Get all ITIs            | `/api/itis`                            | GET    | ❌   |
| Get all workers         | `/api/maintenanceWorkers`              | GET    | ❌   |

---

**Last Updated:** December 1, 2025
**Tested Against:** Database seed with 10 ITIs, 10 Students, 10 Machines, 10 Workers
**PredictaLab v1.0 Backend**
