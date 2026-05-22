# API Verification Test Results

Generated on: 2026-05-22T18:05:40.862Z

### Summary
- **Total Tests**: 29
- **Passed**: 29
- **Failed**: 0

| Endpoint | Status | HTTP Status | Details |
| --- | --- | --- | --- |
| POST /api/auth/register (USER) | ✅ PASS | 200 | User registered successfully |
| POST /api/auth/login (USER) | ✅ PASS | 200 | Logged in successfully. User ID: 72 |
| POST /api/auth/register (Delete-Test User) | ✅ PASS | 200 | User registered. ID: 73 |
| POST /api/auth/register (ORGANIZER) | ✅ PASS | 200 | Organizer registered successfully |
| POST /api/auth/login (ORGANIZER) | ✅ PASS | 200 | Organizer logged in successfully |
| POST /api/auth/login (ADMIN) | ✅ PASS | 200 | Admin logged in successfully |
| POST /api/files/upload | ✅ PASS | 200 | File uploaded successfully. URL: /api/files/view/general/c9f67d3e-f101-4a3c-8a06-7cf4d2d4c25a_test.png |
| GET /api/files/view/{subDir}/{fileName} | ✅ PASS | 200 | File retrieved successfully |
| POST /api/events | ✅ PASS | 201 | Event created successfully. Event ID: 7 |
| POST /api/events (Delete-Test Event) | ✅ PASS | 201 | Event created. ID: 8 |
| GET /api/events | ✅ PASS | 200 | Retrieved all events. Found 8 events. |
| GET /api/events/{id} | ✅ PASS | 200 | Event fetched successfully |
| GET /api/events/{id}/qr | ✅ PASS | 200 | Event QR Code retrieved successfully |
| GET /api/bookings/event/{eventId}/seats | ✅ PASS | 200 | Retrieved 50 seats. First Seat ID: 1311 |
| POST /api/bookings/initiate (FREE) | ✅ PASS | 200 | Booking completed instantly. Booking ID: 11, Status: COMPLETED, Check-in Token: 7506225aa6664bb995008f86a98d0ddb |
| GET /api/bookings/user/{userId} | ✅ PASS | 200 | Fetched user bookings successfully. Count: 1 |
| POST /api/checkin/scan (Organizer Check-in) | ✅ PASS | 200 | Successfully checked in attendee: Test User for Event: Test Event 1779473136601 |
| GET /api/attendance/{eventId} | ✅ PASS | 200 | Retrieved attendance records. Count: 0 |
| GET /api/attendance/{eventId}/count | ✅ PASS | 200 | Checked-in attendee count: 0 |
| POST /api/feedback | ✅ PASS | 200 | Feedback submitted. sentiment: POSITIVE |
| GET /api/feedback/event/{eventId} | ✅ PASS | 200 | Retrieved feedback count: 1 |
| GET /api/feedback/user/{userId} | ✅ PASS | 200 | Retrieved user feedbacks successfully |
| GET /api/certificates/download/{eventId} | ✅ PASS | 200 | Downloaded certificate PDF successfully |
| GET /api/analytics/event/{eventId} | ✅ PASS | 200 | Retrieved event analytics successfully |
| GET /api/analytics/global | ✅ PASS | 200 | Retrieved global analytics successfully |
| GET /api/admin/dashboard | ✅ PASS | 200 | Response: "Welcome to the Admin Dashboard" |
| GET /api/users | ✅ PASS | 200 | Retrieved user list successfully. Count: 11 |
| DELETE /api/users/{id} (Clean) | ✅ PASS | 204 | Deleted test user (ID: 73) successfully |
| DELETE /api/events/{id} (Clean) | ✅ PASS | 200 | Deleted test event (ID: 8) successfully |
