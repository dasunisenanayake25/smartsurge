# SmartSurge REST API Documentation

Official REST API Reference and Integration Guide for **SmartGrid Home - Household Energy Management Platform (SmartSurge)**.

---

## Overview & Base URLs

All API endpoints are versioned under `/api/v1`. Authentication is handled via JSON Web Tokens (JWT) transmitted as a Bearer token in the `Authorization` header.

| Environment | Base URL |
| :--- | :--- |
| **Production (Vercel)** | `https://smartsurge.vercel.app/api/v1` |
| **Local Development** | `http://localhost:5000/api/v1` |

---

## Global Headers & Authentication

### Standard Request Headers
```http
Content-Type: application/json
Accept: application/json
```

### Authenticated Request Headers
For protected endpoints, include the JWT token issued upon login or registration:
```http
Authorization: Bearer <your_jwt_token_here>
```

---

## 1. System Health & Diagnostics

### 1.1 Verify Server Health
Check uptime status and API availability.

- **Method:** `GET`
- **Endpoint:** `/health`
- **Access:** Public

#### Response (200 OK)
```json
{
  "status": "success",
  "message": "SmartSurge Backend Server is running successfully!",
  "timestamp": "2026-10-29T21:28:35.387Z"
}
```

---

## 2. Authentication & User Profile (`/auth`)

### 2.1 User Registration
Create a new user account with initial premises profile.

- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Access:** Public

#### Request Body
```json
{
  "name": "Dasuni Senanayake",
  "email": "user@smartsurge.com",
  "password": "Password123",
  "cebAccountNo": "074-819-2015-V",
  "houseType": "Two-Storey Residential",
  "residentsCount": 4,
  "district": "Colombo",
  "monthlyBudget": 5000
}
```

#### Response (201 Created)
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "67215f9b4c09d81234567890",
      "name": "Dasuni Senanayake",
      "email": "user@smartsurge.com",
      "role": "user",
      "monthlyBudget": 5000,
      "cebAccountNo": "074-819-2015-V",
      "houseType": "Two-Storey Residential",
      "residentsCount": 4,
      "solarSetup": "None",
      "district": "Colombo"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2.2 Local User Login
Authenticate existing credentials with email and password.

- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Access:** Public

#### Request Body
```json
{
  "email": "demo@smartsurge.com",
  "password": "123456"
}
```

#### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "67215f9b4c09d81234567890",
      "name": "Demo Household",
      "email": "demo@smartsurge.com",
      "role": "user",
      "monthlyBudget": 5000,
      "cebAccountNo": "074-819-2015-V"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2.3 Google OAuth 2.0 Login / Registration
Authenticate user using Google ID token credential. If the user does not exist, an account is created automatically.

- **Method:** `POST`
- **Endpoint:** `/auth/google`
- **Access:** Public

#### Request Body
```json
{
  "credential": "<Google_ID_Token_JWT_from_Client>"
}
```

#### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "67216a2b4c09d81234567891",
      "name": "Google User",
      "email": "user@gmail.com",
      "googleId": "108392019384918239102",
      "role": "user",
      "monthlyBudget": 5000
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2.4 Get Current User Profile
Fetch account preferences, budget target, and tariff configurations.

- **Method:** `GET`
- **Endpoint:** `/auth/profile`
- **Access:** Private (`Bearer <Token>`)

#### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "_id": "67215f9b4c09d81234567890",
    "name": "Demo Household",
    "email": "demo@smartsurge.com",
    "role": "user",
    "monthlyBudget": 5000,
    "cebAccountNo": "074-819-2015-V",
    "houseType": "Two-Storey Residential",
    "residentsCount": 4,
    "solarSetup": "None",
    "district": "Colombo",
    "createdAt": "2026-10-29T20:00:00.000Z"
  }
}
```

---

### 2.5 Update User Profile
Update premises information, monthly budget, or password.

- **Method:** `PUT`
- **Endpoint:** `/auth/profile`
- **Access:** Private (`Bearer <Token>`)

#### Request Body
```json
{
  "name": "Demo Household Updated",
  "monthlyBudget": 7500,
  "district": "Gampaha",
  "solarSetup": "Net-Metering 3kW"
}
```

#### Response (200 OK)
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "_id": "67215f9b4c09d81234567890",
    "name": "Demo Household Updated",
    "monthlyBudget": 7500,
    "district": "Gampaha",
    "solarSetup": "Net-Metering 3kW"
  }
}
```

---

## 3. Appliance Inventory & Control (`/appliances`)

### 3.1 Get All Appliances
Retrieve all appliances registered by the logged-in user.

- **Method:** `GET`
- **Endpoint:** `/appliances`
- **Access:** Private (`Bearer <Token>`)

#### Response (200 OK)
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "_id": "6721601b4c09d81234567892",
      "userId": "67215f9b4c09d81234567890",
      "name": "Inverter AC 18000 BTU",
      "category": "AC",
      "ratedWattage": 1450,
      "status": "ON",
      "isSmartPlugConnected": true,
      "createdAt": "2026-10-29T20:05:00.000Z"
    },
    {
      "_id": "6721603b4c09d81234567893",
      "userId": "67215f9b4c09d81234567890",
      "name": "Double Door Refrigerator",
      "category": "Refrigerator",
      "ratedWattage": 180,
      "status": "ON",
      "isSmartPlugConnected": true,
      "createdAt": "2026-10-29T20:06:00.000Z"
    }
  ]
}
```

---

### 3.2 Create Appliance
Register a new household appliance with category and power specifications.

- **Method:** `POST`
- **Endpoint:** `/appliances`
- **Access:** Private (`Bearer <Token>`)

#### Request Body
```json
{
  "name": "Microwave Oven",
  "category": "Other",
  "ratedWattage": 1200,
  "isSmartPlugConnected": true
}
```

#### Response (201 Created)
```json
{
  "status": "success",
  "data": {
    "_id": "6721607b4c09d81234567894",
    "userId": "67215f9b4c09d81234567890",
    "name": "Microwave Oven",
    "category": "Other",
    "ratedWattage": 1200,
    "status": "OFF",
    "isSmartPlugConnected": true,
    "createdAt": "2026-10-29T20:10:00.000Z"
  }
}
```

---

### 3.3 Update Appliance / Toggle Power State
Modify appliance parameters or toggle the relay switch (`ON` / `OFF`).

- **Method:** `PUT`
- **Endpoint:** `/appliances/:id`
- **Access:** Private (`Bearer <Token>`)

#### Request Body (Toggle Switch)
```json
{
  "status": "ON"
}
```

#### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "_id": "6721607b4c09d81234567894",
    "name": "Microwave Oven",
    "status": "ON",
    "ratedWattage": 1200,
    "isSmartPlugConnected": true
  }
}
```

---

### 3.4 Delete Appliance
Remove an appliance record from inventory.

- **Method:** `DELETE`
- **Endpoint:** `/appliances/:id`
- **Access:** Private (`Bearer <Token>`)

#### Response (200 OK)
```json
{
  "status": "success",
  "message": "Appliance removed successfully"
}
```

---

## 4. Energy Telemetry & Tariff Billing (`/energy`)

### 4.1 Get Live Telemetry Snapshot
Retrieve sub-second real-time telemetry metrics (Power, Voltage, Current, Connected Load).

- **Method:** `GET`
- **Endpoint:** `/energy/live`
- **Access:** Private (`Bearer <Token>`)

#### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "voltage": 230.4,
    "current": 7.12,
    "powerWatt": 1640.4,
    "energyKwh": 142.8,
    "activeAppliancesCount": 4,
    "timestamp": "2026-10-29T21:30:00.000Z"
  }
}
```

---

### 4.2 Query Historical Telemetry Logs
Query aggregated telemetry usage across specific time intervals (`day`, `week`, `month`).

- **Method:** `GET`
- **Endpoint:** `/energy/history?timeframe=day`
- **Access:** Private (`Bearer <Token>`)

#### Query Parameters
| Parameter | Type | Required | Values | Default |
| :--- | :--- | :--- | :--- | :--- |
| `timeframe` | string | No | `day`, `week`, `month` | `day` |

#### Response (200 OK)
```json
{
  "status": "success",
  "timeframe": "day",
  "count": 24,
  "data": [
    {
      "timestamp": "2026-10-29T10:00:00.000Z",
      "powerWatt": 1450,
      "energyKwh": 1.45,
      "voltage": 231.2,
      "current": 6.27
    }
  ]
}
```

---

### 4.3 Calculate Progressive CEB Tariff Bill Estimate
Simulate domestic electricity bill based on progressive Sri Lankan CEB / LECO block tariffs.

- **Method:** `GET`
- **Endpoint:** `/energy/bill-estimate`
- **Access:** Private (`Bearer <Token>`)

#### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "totalUnitsKwh": 124,
    "tier": "Tier 3 (>90 kWh)",
    "breakdown": [
      { "slab": "0 - 30 kWh", "units": 30, "rate": 8.0, "amount": 240.0 },
      { "slab": "31 - 60 kWh", "units": 30, "rate": 10.0, "amount": 300.0 },
      { "slab": "61 - 90 kWh", "units": 30, "rate": 16.0, "amount": 480.0 },
      { "slab": "91+ kWh", "units": 34, "rate": 50.0, "amount": 1700.0 }
    ],
    "energyCharge": 2720.0,
    "fixedCharge": 960.0,
    "estimatedTotalBillLkr": 3680.0,
    "monthlyBudget": 5000.0,
    "budgetUtilizationPct": 73.6
  }
}
```

---

## 5. WebSockets Real-Time Event Architecture (`Socket.io`)

| Event Name | Direction | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `connection` | Client -> Server | Handshake on socket establishment | `{}` |
| `energyUpdate` | Server -> Client | Broadcast active power telemetry | `{"powerWatt": 1650, "voltage": 230, "current": 7.17}` |
| `applianceToggled`| Server -> Client | Relay status change notification | `{"applianceId": "...", "status": "ON"}` |

---

## 6. HTTP Error Handling & Status Codes

All errors conform to a standard JSON envelope:

```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

| HTTP Status | Meaning | Scenario |
| :--- | :--- | :--- |
| `200 OK` | Success | Successful read / update / delete |
| `201 Created` | Resource Created | Successful registration / appliance creation |
| `400 Bad Request` | Client Error | Validation error or missing required fields |
| `401 Unauthorized` | Auth Error | Missing or expired JWT Bearer token |
| `404 Not Found` | Not Found | Target appliance or user does not exist |
| `429 Too Many Requests`| Rate Limited | Exceeded rate limit requests threshold |
| `500 Server Error` | Internal Server Error | Unhandled server exception |
