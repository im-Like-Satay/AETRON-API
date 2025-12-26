# AETRON API Documentation

> 📌 **Last Updated:** December 18, 2025  
> 🚀 **Base URL:** `http://localhost:3000`  
> 📦 **Version:** v1  

This documentation describes the available endpoints for the AETRON System API built with Node.js and Express. The system integrates with a PostgreSQL database.

---

## Table of Contents

- [AETRON API Documentation](#aetron-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [General Information](#general-information)
- [Response Format | Endpoints \& Payloads](#response-format--endpoints--payloads)
  - [`GET /api/v1/energy/status`](#get-apiv1energystatus)
  - [`POST /api/v1/chat`](#post-apiv1chat)
  - [`GET /api/v1/chat`](#get-apiv1chat)
  - [`POST /api/v1/emergency/shutdown`](#post-apiv1emergencyshutdown)
  - [`POST /api/v1/auth/register`](#post-apiv1authregister)
  - [`POST /api/v1/auth/login`](#post-apiv1authlogin)

---

## General Information

- All API requests must use **JSON** format.
- All responses follow a standardized JSON structure (see below).
- The API uses **HTTP status codes** to indicate success or failure.
- No authentication is currently implemented (for demo purposes).

---

# Response Format | Endpoints & Payloads

## `GET /api/v1/energy/status`
**Response Payload:**
```json
{
  "status": 200,
  "data": [
    { "id": 1, "battery_level": 85, "timestamp": "2025-12-14T10:00:00Z" }
  ],
  "message": "Energy status retrieved successfully"
}
```

## `POST /api/v1/chat`
**Request Payload:**
```json
{ "input": "status/siapa admin" }
```
**Response Payload (Example for `"status"`):**
```json
{
  "status": 200,
  "data": "Energi 85%, saldo aman",
  "message": "Get data success"
}
```

## `GET /api/v1/chat`
**Response Payload (Example for `"status"`):**
```json
{
  "status": 200,
  "data": [{..},{..},{..}],
  "message": "Chat history retrieved successfully"
}
```


## `POST /api/v1/emergency/shutdown`
**Request Payload:**
```json
{
  "sector_name": "Sector-A"
}
```
**Response Payload (Success):**
```json
{
  "status": 201,
  "data": [{ "sector_name": "Sector-A", "is_active": false }],
  "message": "Sector shutdown successfully"
}
```

## `POST /api/v1/auth/register`
**Request Payload:**
```json
{
  "email": "email",
  "username": "username",
  "pass": "password"
}
```
**Response Payload (Success):**
```json
{
  "status": 201,
  "data": null,
  "message": "User registered successfully"
}
```

## `POST /api/v1/auth/login`
**Request Payload:**
*note: bisa gunakan salah satu, bisa email dan pass saja atau username dan pass saja*
```json
{
  "email": "email",
  "username": "username",
  "pass": "password"
}
```
**Response Payload (Success):**
```json
{
  "status": 201,
  "data": [{ "token": "jwt_token" }],
  "message": "Login successfuly"
}
```