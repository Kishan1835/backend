# Postman API Testing Guide - PredictaLab Backend

## Table of Contents

1. [Base URL & Setup](#base-url--setup)
2. [Authentication](#authentication)
3. [Test Data from Seed](#test-data-from-seed)
4. [Students Routes](#students-routes)
5. [Machines Routes](#machines-routes)
6. [IoT Routes](#iot-routes)
7. [Maintenance Routes](#maintenance-routes)
8. [ITI Routes](#iti-routes)
9. [Maintenance Workers Routes](#maintenance-workers-routes)
10. [Scheduling & Reservation Flow](#scheduling--reservation-flow)
11. [End-to-End Scenarios](#end-to-end-scenarios)

---

## Base URL & Setup

### Base URL

```
http://localhost:3000
```

### Prerequisites

1. Backend running: `npm run dev` or `node src/server.js`
2. Database seeded: `npx prisma migrate dev` then `npm run seed`
3. Environment variables configured in `.env`

---

## Authentication

### Overview

- Most API endpoints require Bearer token authentication
- Get token by logging in as a student
- Include token in all subsequent authenticated requests

### How to Authenticate

1. **Login as Student** (first, save the token)
   - POST `/api/students/login`
   - Response includes `accessToken`
2. **Use Token in Headers**
   ```
   Authorization: Bearer <accessToken>
   ```

### Available Test Credentials (from seed.js)

| Email                    | Password | ITI     | Role    |
| ------------------------ | -------- | ------- | ------- |
| aditya.pawar@example.com | password | Mumbai  | Student |
| shreya.gupta@example.com | password | Delhi   | Student |
| vignesh.k@example.com    | password | Chennai | Student |

---

## Test Data from Seed

### ITIs (10 locations)

- **ITI_ID 1**: Government ITI Mumbai
- **ITI_ID 2**: Government ITI Delhi
- **ITI_ID 3**: Government ITI Chennai
- **ITI_ID 4**: Government ITI Bengaluru
- **ITI_ID 5**: Government ITI Pune
- **ITI_ID 6**: Government ITI Hyderabad
- **ITI_ID 7**: Government ITI Ahmedabad
- **ITI_ID 8**: Government ITI Jaipur
- **ITI_ID 9**: Government ITI Kolkata
- **ITI_ID 10**: Government ITI Lucknow

### Students (10 available)

- **Student_ID 1**: Aditya Pawar (Mumbai, Electrician) - **HEALTHY machines only**
- **Student_ID 2**: Rohan Shinde (Mumbai, Fitter)
- **Student_ID 3**: Shreya Gupta (Delhi, COPA)
- **Student_ID 4**: Vignesh K (Chennai, Mechanic Motor Vehicle)
- **Student_ID 5**: Nandini S (Bengaluru, Turner)
- **Student_ID 6**: Imran Khan (Hyderabad, Welder)
- **Student_ID 7**: Kajal Patel (Ahmedabad, Machinist)
- **Student_ID 8**: Deepak Meena (Jaipur, AC Technician)
- **Student_ID 9**: Ananya Sen (Kolkata, Electronics Mechanic)
- **Student_ID 10**: Rahul Mishra (Lucknow, Plumber)

### Machines (10 available with different statuses)

| Machine_ID | Name                       | ITI       | Status       | Last_used  | Faults | Notes                                    |
| ---------- | -------------------------- | --------- | ------------ | ---------- | ------ | ---------------------------------------- |
| 1          | Lathe Machine - HMT        | Mumbai    | HEALTHY      | 2024-11-20 | 0      | ✅ Can assign to students                |
| 2          | Drilling Machine           | Mumbai    | HEALTHY      | 2024-11-19 | 1      | ✅ Can assign to students                |
| 3          | Computer Lab System        | Delhi     | **ALERT**    | 2024-11-18 | 2      | ⚠️ Skip in scheduling (needs inspection) |
| 4          | Automotive Engine Test Rig | Chennai   | **CRITICAL** | 2024-10-30 | 4      | ❌ Maintenance required                  |
| 5          | CNC Lathe Trainer          | Bengaluru | HEALTHY      | 2024-11-21 | 0      | ✅ Can assign to students                |
| 6          | Arc Welding Set            | Hyderabad | **ALERT**    | 2024-11-15 | 2      | ⚠️ Skip in scheduling                    |
| 7          | Milling Machine            | Ahmedabad | HEALTHY      | 2024-11-17 | 1      | ✅ Can assign to students                |
| 8          | Split AC Training Unit     | Jaipur    | **ALERT**    | 2024-11-16 | 2      | ⚠️ Skip in scheduling                    |
| 9          | Electronics Workbench      | Kolkata   | HEALTHY      | 2024-11-14 | 1      | ✅ Can assign to students                |
| 10         | Pipe Threading Machine     | Lucknow   | **ALERT**    | 2024-11-13 | 3      | ⚠️ Skip in scheduling                    |

### Maintenance Workers (10)

- **M_Worker_ID 1-10**: Various workers assigned to each ITI, all with Active_Status=true

---

## 1. Students Routes (`/api/students`)

### 1.1 Student Login

**POST** `/api/students/login`

- **Auth Required:** No
- **Body (JSON):**

```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

- **Response:** Returns `accessToken` - **SAVE THIS TOKEN** for authenticated requests

### 1.2 Get Assigned Machines

**GET** `/api/students/:studentId/machines`

- **Auth Required:** Yes (Bearer Token)
- **Headers:**

```
Authorization: Bearer <access_token>
```

- **Example:** `GET /api/students/1/machines`

---

## 2. Machines Routes (`/api/machines`)

**⚠️ All routes require authentication**

### 2.1 Create Machine

**POST** `/api/machines`

- **Auth Required:** Yes
- **Body (JSON):**

```json
{
  "Machine_Name": "Lathe Machine 1",
  "ITI_ID": 1,
  "Status": "HEALTHY",
  "Faults": 0,
  "Last_used": "2024-01-01T00:00:00Z"
}
```

### 2.2 Get All Machines

**GET** `/api/machines`

- **Auth Required:** Yes

### 2.3 Get Machine by ID

**GET** `/api/machines/:id`

- **Auth Required:** Yes
- **Example:** `GET /api/machines/1`

### 2.4 Update Machine

**PUT** `/api/machines/:id`

- **Auth Required:** Yes
- **Body (JSON):**

```json
{
  "Machine_Name": "Updated Machine Name",
  "Status": "ALERT"
}
```

### 2.5 Delete Machine

**DELETE** `/api/machines/:id`

- **Auth Required:** Yes
- **Example:** `DELETE /api/machines/1`

### 2.6 Request Machine Schedule

**GET** `/api/machines/schedule/:itiId`

- **Auth Required:** Yes
- **Example:** `GET /api/machines/schedule/1`

### 2.7 Assign Machine to Student

**POST** `/api/machines/assign`

- **Auth Required:** Yes
- **Body (JSON):**

```json
{
  "studentId": 1,
  "machineId": 1,
  "workerId": 1,
  "time": 60
}
```

---

## 3. IoT Routes (`/api/iot`)

**⚠️ No authentication required**

### 3.1 Receive Sensor Data

**POST** `/api/iot/sensor-data`

- **Auth Required:** No
- **Body (JSON):**

```json
{
  "machineId": 1,
  "vibration": 45.5,
  "temp": 75.2,
  "current": 12.3
}
```

---

## 4. Maintenance Routes (`/api/maintenance`)

**⚠️ All routes require authentication**

### 4.1 Mark Case as Solved

**POST** `/api/maintenance/mark-solved`

- **Auth Required:** Yes
- **Body (JSON):**

```json
{
  "mlId": 1,
  "actionTaken": "Replaced faulty component"
}
```

### 4.2 Escalate Maintenance Case

**POST** `/api/maintenance/escalate`

- **Auth Required:** Yes
- **Body (JSON):**

```json
{
  "mlId": 1,
  "workerId": 1
}
```

### 4.3 Notify Policy Maker

**POST** `/api/maintenance/notify-policy-maker`

- **Auth Required:** Yes
- **Body (JSON):**

```json
{
  "mlId": 1
}
```

### 4.4 Auto Schedule for Batch

**POST** `/api/maintenance/schedule/auto`

- **Auth Required:** Yes
- **Body (JSON):**

```json
{
  "itiId": 1,
  "tradeId": 1,
  "batch": "A",
  "timeSlotMinutes": 60,
  "workerId": 1
}
```

### 4.5 Get Today Schedule

**GET** `/api/maintenance/schedule/today?itiId=1&tradeId=1&batch=A`

- **Auth Required:** Yes
- **Query Parameters:**
  - `itiId` (required)
  - `tradeId` (optional)
  - `batch` (optional)

---

## 5. ITI Routes (`/api/itis`)

**⚠️ No authentication required**

### 5.1 Create ITI

**POST** `/api/itis`

- **Body (JSON):**

```json
{
  "Name": "Industrial Training Institute",
  "Location": "City, State"
}
```

### 5.2 Get All ITIs

**GET** `/api/itis`

### 5.3 Get ITI by ID

**GET** `/api/itis/:id`

- **Example:** `GET /api/itis/1`

### 5.4 Update ITI

**PUT** `/api/itis/:id`

- **Body (JSON):**

```json
{
  "Name": "Updated ITI Name"
}
```

### 5.5 Delete ITI

**DELETE** `/api/itis/:id`

- **Example:** `DELETE /api/itis/1`

---

## 6. Trades Routes (`/api/trades`)

**⚠️ No authentication required**

### 6.1 Create Trade

**POST** `/api/trades`

- **Body (JSON):**

```json
{
  "Trade_Name": "Mechanical Engineering",
  "Description": "Mechanical trade course"
}
```

### 6.2 Get All Trades

**GET** `/api/trades`

### 6.3 Get Trade by ID

**GET** `/api/trades/:id`

- **Example:** `GET /api/trades/1`

### 6.4 Update Trade

**PUT** `/api/trades/:id`

- **Body (JSON):**

```json
{
  "Trade_Name": "Updated Trade Name"
}
```

### 6.5 Delete Trade

**DELETE** `/api/trades/:id`

- **Example:** `DELETE /api/trades/1`

---

## 7. Workers Routes (`/api/workers`)

**⚠️ No authentication required**

### 7.1 Create Worker

**POST** `/api/workers`

- **Body (JSON):**

```json
{
  "Name": "John Doe",
  "Role": "TRAINING_OFFICER",
  "ITI_ID": 1
}
```

### 7.2 Get All Workers

**GET** `/api/workers`

### 7.3 Get Worker by ID

**GET** `/api/workers/:id`

- **Example:** `GET /api/workers/1`

### 7.4 Update Worker

**PUT** `/api/workers/:id`

- **Body (JSON):**

```json
{
  "Name": "Updated Name",
  "Role": "ASSISTANT_TRAINING_OFFICER"
}
```

### 7.5 Delete Worker

**DELETE** `/api/workers/:id`

- **Example:** `DELETE /api/workers/1`

---

## 8. Maintenance Workers Routes (`/api/maintenance-workers`)

**⚠️ All routes require authentication**

### 8.1 Create Maintenance Worker

**POST** `/api/maintenance-workers`

- **Auth Required:** Yes
- **Body (JSON):**

```json
{
  "Name": "Maintenance Worker 1",
  "Active_Status": true,
  "Solved_cases": 0,
  "pending": []
}
```

### 8.2 Get All Maintenance Workers

**GET** `/api/maintenance-workers`

- **Auth Required:** Yes

### 8.3 Get Maintenance Worker by ID

**GET** `/api/maintenance-workers/:id`

- **Auth Required:** Yes
- **Example:** `GET /api/maintenance-workers/1`

### 8.4 Update Maintenance Worker

**PUT** `/api/maintenance-workers/:id`

- **Auth Required:** Yes
- **Body (JSON):**

```json
{
  "Active_Status": false
}
```

### 8.5 Delete Maintenance Worker

**DELETE** `/api/maintenance-workers/:id`

- **Auth Required:** Yes
- **Example:** `DELETE /api/maintenance-workers/1`

---

## 9. Inventory Routes (`/api/inventory`)

**⚠️ All routes require authentication**

### 9.1 Create Item

**POST** `/api/inventory`

- **Auth Required:** Yes
- **Body (JSON):**

```json
{
  "Item_Name": "Screwdriver",
  "Quantity": 50,
  "Reorder_Level": 10,
  "Unit_Price": 5.99
}
```

### 9.2 Get All Items

**GET** `/api/inventory`

- **Auth Required:** Yes

### 9.3 Get Item by ID

**GET** `/api/inventory/:id`

- **Auth Required:** Yes
- **Example:** `GET /api/inventory/1`

### 9.4 Update Item

**PUT** `/api/inventory/:id`

- **Auth Required:** Yes
- **Body (JSON):**

```json
{
  "Quantity": 45
}
```

### 9.5 Delete Item

**DELETE** `/api/inventory/:id`

- **Auth Required:** Yes
- **Example:** `DELETE /api/inventory/1`

### 9.6 Check Reorder Levels

**GET** `/api/inventory/reorder-levels`

- **Auth Required:** Yes

---

## 10. Root Endpoint

### 10.1 Health Check

**GET** `/`

- **Response:** "PredictaLab Backend is running!"

---

## Testing Order Recommendation

1. **Start with unauthenticated endpoints:**

   - Test ITI, Trades, Workers routes (create some test data)

2. **Get authentication token:**

   - Login as student: `POST /api/students/login`
   - Save the `accessToken` from response

3. **Test authenticated endpoints:**

   - Use the saved token in Authorization header for:
     - Machines routes
     - Maintenance routes
     - Maintenance Workers routes
     - Inventory routes
     - Student assigned machines route

4. **Test IoT endpoint:**
   - `POST /api/iot/sensor-data` (no auth needed)

---

## Postman Collection Setup Tips

1. **Create Environment Variables:**

   - `base_url`: `http://localhost:3000`
   - `access_token`: (will be set after login)

2. **Create Pre-request Script for authenticated requests:**

   ```javascript
   pm.request.headers.add({
     key: "Authorization",
     value: "Bearer " + pm.environment.get("access_token"),
   });
   ```

3. **Create Test Script for login to save token:**
   ```javascript
   if (pm.response.code === 200) {
     const jsonData = pm.response.json();
     pm.environment.set("access_token", jsonData.accessToken);
   }
   ```

---

## Common Response Codes

- `200` - Success
- `201` - Created
- `204` - No Content (Delete success)
- `400` - Bad Request
- `401` - Unauthorized (Missing/Invalid token)
- `403` - Forbidden (Invalid token)
- `404` - Not Found
- `500` - Internal Server Error
