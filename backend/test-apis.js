const BASE_URL = "http://localhost:8080/api";

async function runTests() {
  console.log("=========================================");
  console.log("   Event Feedback Management System API Tests  ");
  console.log("=========================================\n");

  const results = [];
  const testSuffix = Date.now();
  
  const userEmail = `user_${testSuffix}@example.com`;
  const organizerEmail = `org_${testSuffix}@example.com`;
  const deleteUserEmail = `user_del_${testSuffix}@example.com`;
  const adminEmail = "priya@eventpulse.com"; // Default admin from data.sql
  const password = "Password@123";

  let userToken = "";
  let userId = null;
  let deleteUserId = null;
  let organizerToken = "";
  let adminToken = "";
  let eventId = null;
  let deleteEventId = null;
  let seatId = null;
  let bookingId = null;
  let checkInToken = "";
  let uploadedFileUrl = "";

  function logResult(apiName, success, status, details) {
    results.push({ apiName, success, status, details });
    if (success) {
      console.log(`[PASS] ${apiName} (Status: ${status})`);
    } else {
      console.log(`[FAIL] ${apiName} (Status: ${status}) - ${details}`);
    }
  }

  // Helper request function
  async function sendRequest(url, method = "GET", headers = {}, body = null) {
    const config = {
      method,
      headers: {
        "Accept": "application/json",
        ...headers
      }
    };
    if (body) {
      if (body instanceof FormData) {
        config.body = body;
      } else {
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get("content-type");
      const isJson = contentType?.includes("application/json");
      const isPdf = contentType?.includes("application/pdf");
      
      let responseBody;
      if (isPdf) {
        responseBody = "[PDF Binary Data]";
      } else if (isJson) {
        const text = await response.text();
        try {
          responseBody = JSON.parse(text);
        } catch (jsonErr) {
          responseBody = text; // fallback to raw text if parsing fails (e.g. raw string response)
        }
      } else {
        responseBody = await response.text();
      }

      return {
        status: response.status,
        ok: response.ok,
        body: responseBody
      };
    } catch (e) {
      return {
        status: 0,
        ok: false,
        body: e.message
      };
    }
  }

  // 1. Auth - Register User
  try {
    const res = await sendRequest(`${BASE_URL}/auth/register`, "POST", {}, {
      email: userEmail,
      password: password,
      firstName: "Test",
      lastName: "User",
      role: "USER"
    });
    if (res.ok && res.body.token) {
      logResult("POST /api/auth/register (USER)", true, res.status, "User registered successfully");
    } else {
      logResult("POST /api/auth/register (USER)", false, res.status, JSON.stringify(res.body));
    }
  } catch (e) {
    logResult("POST /api/auth/register (USER)", false, 0, e.message);
  }

  // 2. Auth - Login User
  try {
    const res = await sendRequest(`${BASE_URL}/auth/login`, "POST", {}, {
      email: userEmail,
      password: password
    });
    if (res.ok && res.body.token) {
      userToken = res.body.token;
      userId = res.body.user.id;
      logResult("POST /api/auth/login (USER)", true, res.status, `Logged in successfully. User ID: ${userId}`);
    } else {
      logResult("POST /api/auth/login (USER)", false, res.status, JSON.stringify(res.body));
    }
  } catch (e) {
    logResult("POST /api/auth/login (USER)", false, 0, e.message);
  }

  // 3. Auth - Register Delete-Test User
  try {
    const res = await sendRequest(`${BASE_URL}/auth/register`, "POST", {}, {
      email: deleteUserEmail,
      password: password,
      firstName: "Delete",
      lastName: "TestUser",
      role: "USER"
    });
    if (res.ok && res.body.token) {
      deleteUserId = res.body.user.id;
      logResult("POST /api/auth/register (Delete-Test User)", true, res.status, `User registered. ID: ${deleteUserId}`);
    } else {
      logResult("POST /api/auth/register (Delete-Test User)", false, res.status, JSON.stringify(res.body));
    }
  } catch (e) {
    logResult("POST /api/auth/register (Delete-Test User)", false, 0, e.message);
  }

  // 4. Auth - Register Organizer
  try {
    const res = await sendRequest(`${BASE_URL}/auth/register`, "POST", {}, {
      email: organizerEmail,
      password: password,
      firstName: "Test",
      lastName: "Organizer",
      role: "ORGANIZER"
    });
    if (res.ok && res.body.token) {
      logResult("POST /api/auth/register (ORGANIZER)", true, res.status, "Organizer registered successfully");
    } else {
      logResult("POST /api/auth/register (ORGANIZER)", false, res.status, JSON.stringify(res.body));
    }
  } catch (e) {
    logResult("POST /api/auth/register (ORGANIZER)", false, 0, e.message);
  }

  // 5. Auth - Login Organizer
  try {
    const res = await sendRequest(`${BASE_URL}/auth/login`, "POST", {}, {
      email: organizerEmail,
      password: password
    });
    if (res.ok && res.body.token) {
      organizerToken = res.body.token;
      logResult("POST /api/auth/login (ORGANIZER)", true, res.status, "Organizer logged in successfully");
    } else {
      logResult("POST /api/auth/login (ORGANIZER)", false, res.status, JSON.stringify(res.body));
    }
  } catch (e) {
    logResult("POST /api/auth/login (ORGANIZER)", false, 0, e.message);
  }

  // 6. Auth - Login Admin (Default)
  try {
    const res = await sendRequest(`${BASE_URL}/auth/login`, "POST", {}, {
      email: adminEmail,
      password: password
    });
    if (res.ok && res.body.token) {
      adminToken = res.body.token;
      logResult("POST /api/auth/login (ADMIN)", true, res.status, "Admin logged in successfully");
    } else {
      logResult("POST /api/auth/login (ADMIN)", false, res.status, JSON.stringify(res.body));
    }
  } catch (e) {
    logResult("POST /api/auth/login (ADMIN)", false, 0, e.message);
  }

  // 7. File - Upload File (Organizer)
  try {
    const formData = new FormData();
    const fileBlob = new Blob(["test image content"], { type: "image/png" });
    formData.append("file", fileBlob, "test.png");
    formData.append("subDir", "general");

    const res = await sendRequest(`${BASE_URL}/files/upload`, "POST", {
      "Authorization": `Bearer ${organizerToken}`
    }, formData);

    if (res.ok && res.body.url) {
      uploadedFileUrl = res.body.url;
      logResult("POST /api/files/upload", true, res.status, `File uploaded successfully. URL: ${uploadedFileUrl}`);
    } else {
      logResult("POST /api/files/upload", false, res.status, JSON.stringify(res.body));
    }
  } catch (e) {
    logResult("POST /api/files/upload", false, 0, e.message);
  }

  // 8. File - View File (Public)
  if (uploadedFileUrl) {
    try {
      const res = await sendRequest(`http://localhost:8080${uploadedFileUrl}`, "GET");
      if (res.ok) {
        logResult("GET /api/files/view/{subDir}/{fileName}", true, res.status, "File retrieved successfully");
      } else {
        logResult("GET /api/files/view/{subDir}/{fileName}", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/files/view/{subDir}/{fileName}", false, 0, e.message);
    }
  }

  // 9. Event - Create Event (Organizer)
  try {
    const formData = new FormData();
    const eventDto = {
      title: "Test Event " + testSuffix,
      description: "This is a dynamically created test event.",
      location: "San Francisco, CA",
      date: "2026-07-20T10:00:00",
      category: "Technology",
      capacity: 50,
      price: 0.0 // Free event to bypass actual payment gateway validations
    };
    
    formData.append("event", new Blob([JSON.stringify(eventDto)], { type: "application/json" }));
    
    const posterBlob = new Blob(["dummy poster raw bytes"], { type: "image/png" });
    formData.append("poster", posterBlob, "poster.png");

    const res = await sendRequest(`${BASE_URL}/events`, "POST", {
      "Authorization": `Bearer ${organizerToken}`
    }, formData);

    if (res.status === 201 && res.body.id) {
      eventId = res.body.id;
      logResult("POST /api/events", true, res.status, `Event created successfully. Event ID: ${eventId}`);
    } else {
      logResult("POST /api/events", false, res.status, JSON.stringify(res.body));
    }
  } catch (e) {
    logResult("POST /api/events", false, 0, e.message);
  }

  // 10. Event - Create Delete-Test Event (Organizer)
  try {
    const formData = new FormData();
    const eventDto = {
      title: "Delete Test Event " + testSuffix,
      description: "This event will be deleted.",
      location: "Virtual",
      date: "2026-08-20T10:00:00",
      category: "Education",
      capacity: 10,
      price: 0.0
    };
    
    formData.append("event", new Blob([JSON.stringify(eventDto)], { type: "application/json" }));
    
    const res = await sendRequest(`${BASE_URL}/events`, "POST", {
      "Authorization": `Bearer ${organizerToken}`
    }, formData);

    if (res.status === 201 && res.body.id) {
      deleteEventId = res.body.id;
      logResult("POST /api/events (Delete-Test Event)", true, res.status, `Event created. ID: ${deleteEventId}`);
    } else {
      logResult("POST /api/events (Delete-Test Event)", false, res.status, JSON.stringify(res.body));
    }
  } catch (e) {
    logResult("POST /api/events (Delete-Test Event)", false, 0, e.message);
  }

  // 11. Event - Get All Events (Public)
  try {
    const res = await sendRequest(`${BASE_URL}/events`, "GET");
    if (res.ok) {
      logResult("GET /api/events", true, res.status, `Retrieved all events. Found ${res.body.content ? res.body.content.length : 0} events.`);
    } else {
      logResult("GET /api/events", false, res.status, JSON.stringify(res.body));
    }
  } catch (e) {
    logResult("GET /api/events", false, 0, e.message);
  }

  // 12. Event - Get Event by ID (Public)
  if (eventId) {
    try {
      const res = await sendRequest(`${BASE_URL}/events/${eventId}`, "GET");
      if (res.ok && res.body.id === eventId) {
        logResult("GET /api/events/{id}", true, res.status, `Event fetched successfully`);
      } else {
        logResult("GET /api/events/{id}", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/events/{id}", false, 0, e.message);
    }

    // 13. Event - Get Event QR Code (Organizer)
    try {
      const res = await sendRequest(`${BASE_URL}/events/${eventId}/qr`, "GET", {
        "Authorization": `Bearer ${organizerToken}`
      });
      if (res.ok) {
        logResult("GET /api/events/{id}/qr", true, res.status, "Event QR Code retrieved successfully");
      } else {
        logResult("GET /api/events/{id}/qr", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/events/{id}/qr", false, 0, e.message);
    }
  }

  // 14. Booking - Get Event Seats (User)
  if (eventId) {
    try {
      const res = await sendRequest(`${BASE_URL}/bookings/event/${eventId}/seats`, "GET", {
        "Authorization": `Bearer ${userToken}`
      });
      if (res.ok && Array.isArray(res.body) && res.body.length > 0) {
        seatId = res.body[0].id;
        logResult("GET /api/bookings/event/{eventId}/seats", true, res.status, `Retrieved ${res.body.length} seats. First Seat ID: ${seatId}`);
      } else {
        logResult("GET /api/bookings/event/{eventId}/seats", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/bookings/event/{eventId}/seats", false, 0, e.message);
    }
  }

  // 15. Booking - Initiate Booking (User)
  if (eventId && seatId) {
    try {
      const res = await sendRequest(`${BASE_URL}/bookings/initiate`, "POST", {
        "Authorization": `Bearer ${userToken}`
      }, {
        eventId: eventId,
        seatId: seatId,
        gateway: "razorpay"
      });
      
      // Since price is 0.0, the booking should instantly be marked as COMPLETED!
      if (res.ok && res.body.id) {
        bookingId = res.body.id;
        checkInToken = res.body.checkInToken;
        logResult("POST /api/bookings/initiate (FREE)", true, res.status, `Booking completed instantly. Booking ID: ${bookingId}, Status: ${res.body.paymentStatus}, Check-in Token: ${checkInToken}`);
      } else {
        logResult("POST /api/bookings/initiate (FREE)", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("POST /api/bookings/initiate (FREE)", false, 0, e.message);
    }
  }

  // 16. Booking - Get User Bookings (User)
  if (userId) {
    try {
      const res = await sendRequest(`${BASE_URL}/bookings/user/${userId}`, "GET", {
        "Authorization": `Bearer ${userToken}`
      });
      if (res.ok) {
        logResult("GET /api/bookings/user/{userId}", true, res.status, `Fetched user bookings successfully. Count: ${Array.isArray(res.body) ? res.body.length : 0}`);
      } else {
        logResult("GET /api/bookings/user/{userId}", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/bookings/user/{userId}", false, 0, e.message);
    }
  }

  // 17. Checkin - Scan Checkin (Organizer)
  if (checkInToken) {
    try {
      const res = await sendRequest(`${BASE_URL}/checkin/scan?token=${checkInToken}`, "POST", {
        "Authorization": `Bearer ${organizerToken}`
      });
      if (res.ok && res.body.success) {
        logResult("POST /api/checkin/scan (Organizer Check-in)", true, res.status, `Successfully checked in attendee: ${res.body.attendeeName} for Event: ${res.body.eventTitle}`);
      } else {
        logResult("POST /api/checkin/scan (Organizer Check-in)", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("POST /api/checkin/scan (Organizer Check-in)", false, 0, e.message);
    }
  }

  // 18. Attendance - Get Attendance by Event (Organizer)
  if (eventId) {
    try {
      const res = await sendRequest(`${BASE_URL}/attendance/${eventId}`, "GET", {
        "Authorization": `Bearer ${organizerToken}`
      });
      if (res.ok) {
        logResult("GET /api/attendance/{eventId}", true, res.status, `Retrieved attendance records. Count: ${Array.isArray(res.body) ? res.body.length : 0}`);
      } else {
        logResult("GET /api/attendance/{eventId}", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/attendance/{eventId}", false, 0, e.message);
    }

    // 19. Attendance - Count Attendance (Authenticated User)
    try {
      const res = await sendRequest(`${BASE_URL}/attendance/${eventId}/count`, "GET", {
        "Authorization": `Bearer ${userToken}`
      });
      if (res.ok) {
        logResult("GET /api/attendance/{eventId}/count", true, res.status, `Checked-in attendee count: ${res.body}`);
      } else {
        logResult("GET /api/attendance/{eventId}/count", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/attendance/{eventId}/count", false, 0, e.message);
    }
  }

  // 20. Feedback - Submit Feedback (User)
  if (eventId) {
    try {
      const res = await sendRequest(`${BASE_URL}/feedback`, "POST", {
        "Authorization": `Bearer ${userToken}`
      }, {
        comments: "Excellent session! Very helpful.",
        rating: 5,
        eventId: eventId
      });
      if (res.ok && res.body.id) {
        logResult("POST /api/feedback", true, res.status, `Feedback submitted. sentiment: ${res.body.sentiment}`);
      } else {
        logResult("POST /api/feedback", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("POST /api/feedback", false, 0, e.message);
    }

    // 21. Feedback - Get Feedback by Event (Authenticated User)
    try {
      const res = await sendRequest(`${BASE_URL}/feedback/event/${eventId}`, "GET", {
        "Authorization": `Bearer ${userToken}`
      });
      if (res.ok) {
        logResult("GET /api/feedback/event/{eventId}", true, res.status, `Retrieved feedback count: ${Array.isArray(res.body) ? res.body.length : 0}`);
      } else {
        logResult("GET /api/feedback/event/{eventId}", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/feedback/event/{eventId}", false, 0, e.message);
    }
  }

  // 22. Feedback - Get Feedback by User (User)
  if (userId) {
    try {
      const res = await sendRequest(`${BASE_URL}/feedback/user/${userId}`, "GET", {
        "Authorization": `Bearer ${userToken}`
      });
      if (res.ok) {
        logResult("GET /api/feedback/user/{userId}", true, res.status, `Retrieved user feedbacks successfully`);
      } else {
        logResult("GET /api/feedback/user/{userId}", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/feedback/user/{userId}", false, 0, e.message);
    }
  }

  // 23. Certificate - Download Certificate (User)
  if (eventId) {
    try {
      const res = await sendRequest(`${BASE_URL}/certificates/download/${eventId}`, "GET", {
        "Authorization": `Bearer ${userToken}`
      });
      if (res.ok) {
        logResult("GET /api/certificates/download/{eventId}", true, res.status, "Downloaded certificate PDF successfully");
      } else {
        logResult("GET /api/certificates/download/{eventId}", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/certificates/download/{eventId}", false, 0, e.message);
    }
  }

  // 24. Analytics - Get Event Analytics (Organizer)
  if (eventId) {
    try {
      const res = await sendRequest(`${BASE_URL}/analytics/event/${eventId}`, "GET", {
        "Authorization": `Bearer ${organizerToken}`
      });
      if (res.ok) {
        logResult("GET /api/analytics/event/{eventId}", true, res.status, "Retrieved event analytics successfully");
      } else {
        logResult("GET /api/analytics/event/{eventId}", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/analytics/event/{eventId}", false, 0, e.message);
    }
  }

  // 25. Analytics - Get Global Analytics (Organizer)
  try {
    const res = await sendRequest(`${BASE_URL}/analytics/global`, "GET", {
      "Authorization": `Bearer ${organizerToken}`
    });
    if (res.ok) {
      logResult("GET /api/analytics/global", true, res.status, "Retrieved global analytics successfully");
    } else {
      logResult("GET /api/analytics/global", false, res.status, JSON.stringify(res.body));
    }
  } catch (e) {
    logResult("GET /api/analytics/global", false, 0, e.message);
  }

  // 26. Admin - Get Admin Dashboard (Admin)
  if (adminToken) {
    try {
      const res = await sendRequest(`${BASE_URL}/admin/dashboard`, "GET", {
        "Authorization": `Bearer ${adminToken}`
      });
      if (res.ok) {
        logResult("GET /api/admin/dashboard", true, res.status, `Response: "${res.body}"`);
      } else {
        logResult("GET /api/admin/dashboard", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/admin/dashboard", false, 0, e.message);
    }
  }

  // 27. User - Get Users List (Admin)
  if (adminToken) {
    try {
      const res = await sendRequest(`${BASE_URL}/users`, "GET", {
        "Authorization": `Bearer ${adminToken}`
      });
      if (res.ok) {
        logResult("GET /api/users", true, res.status, `Retrieved user list successfully. Count: ${Array.isArray(res.body) ? res.body.length : 0}`);
      } else {
        logResult("GET /api/users", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("GET /api/users", false, 0, e.message);
    }
  }

  // 28. User - Delete User (Admin - clean delete of user with no bookings)
  if (adminToken && deleteUserId) {
    try {
      const res = await sendRequest(`${BASE_URL}/users/${deleteUserId}`, "DELETE", {
        "Authorization": `Bearer ${adminToken}`
      });
      if (res.ok) {
        logResult("DELETE /api/users/{id} (Clean)", true, res.status, `Deleted test user (ID: ${deleteUserId}) successfully`);
      } else {
        logResult("DELETE /api/users/{id} (Clean)", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("DELETE /api/users/{id} (Clean)", false, 0, e.message);
    }
  }

  // 29. Event - Delete Event (Organizer - clean delete of event with no bookings)
  if (organizerToken && deleteEventId) {
    try {
      const res = await sendRequest(`${BASE_URL}/events/${deleteEventId}`, "DELETE", {
        "Authorization": `Bearer ${organizerToken}`
      });
      if (res.ok) {
        logResult("DELETE /api/events/{id} (Clean)", true, res.status, `Deleted test event (ID: ${deleteEventId}) successfully`);
      } else {
        logResult("DELETE /api/events/{id} (Clean)", false, res.status, JSON.stringify(res.body));
      }
    } catch (e) {
      logResult("DELETE /api/events/{id} (Clean)", false, 0, e.message);
    }
  }

  console.log("\n=========================================");
  console.log("             Test Summary                ");
  console.log("=========================================");
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log("=========================================\n");

  // Output markdown table for reporting
  let markdown = "# API Verification Test Results\n\n";
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;
  markdown += `### Summary\n- **Total Tests**: ${results.length}\n- **Passed**: ${passed}\n- **Failed**: ${failed}\n\n`;
  markdown += "| Endpoint | Status | HTTP Status | Details |\n";
  markdown += "| --- | --- | --- | --- |\n";
  for (const r of results) {
    markdown += `| ${r.apiName} | ${r.success ? "✅ PASS" : "❌ FAIL"} | ${r.status} | ${r.details} |\n`;
  }
  
  // Write to api_test_results.md
  try {
    const fs = require('fs');
    fs.writeFileSync('api_test_results.md', markdown);
    console.log("Results written to api_test_results.md");
  } catch (fsErr) {
    console.error("Failed to write to file: ", fsErr);
  }
}

runTests();
