# Edlas School Management System - Backend API Documentation

> **Purpose**: This document provides comprehensive API specifications for the backend team to implement all required endpoints for the Edlas School Management System.

---

## Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [Dashboard APIs](#2-dashboard-apis)
3. [Student APIs](#3-student-apis)
4. [Staff APIs](#4-staff-apis)
5. [Class Management APIs](#5-class-management-apis)
6. [Subject APIs](#6-subject-apis)
7. [Class Subject (Course) APIs](#7-class-subject-course-apis)
8. [Teacher Assignment APIs](#8-teacher-assignment-apis)
9. [Marks & Results APIs](#9-marks--results-apis)
10. [AI Chat API](#10-ai-chat-api)

---

## 1. Authentication APIs

### 1.1 Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@edlas.com",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "full_name": "Admin User",
    "email": "admin@edlas.com",
    "user_type": "superadmin",  // "superadmin" | "staff" | "student"
    "phone": "9800000001",
    "avatar_url": "/avatars/user1.jpg"
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Invalid email or password"
}
```

### 1.2 Refresh Token

```
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.3 Logout

```
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 2. Dashboard APIs

### 2.1 Get Dashboard Statistics

```
GET /api/dashboard/stats
```

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**
```json
{
  "students": {
    "total": 1250,
    "change": "+50 this month"
  },
  "teachers": {
    "total": 85,
    "change": "+2 this month"
  },
  "classes": {
    "total": 30,
    "change": "Stable"
  },
  "sections": {
    "total": 95,
    "change": "+3 new"
  }
}
```

### 2.2 Get Class Distribution (for pie chart)

```
GET /api/dashboard/class-distribution
```

**Response (200 OK):**
```json
{
  "distribution": [
    { "name": "Grade 10", "value": 120 },
    { "name": "Grade 11", "value": 90 },
    { "name": "Grade 12", "value": 70 }
  ]
}
```

### 2.3 Get Monthly Admissions (for line chart)

```
GET /api/dashboard/monthly-admissions?year=2024
```

**Response (200 OK):**
```json
{
  "admissions": [
    { "month": "Jan", "students": 40 },
    { "month": "Feb", "students": 60 },
    { "month": "Mar", "students": 55 },
    { "month": "Apr", "students": 80 },
    { "month": "May", "students": 70 },
    { "month": "Jun", "students": 95 }
  ]
}
```

### 2.4 Get Notifications

```
GET /api/dashboard/notifications?limit=10
```

**Response (200 OK):**
```json
{
  "notifications": [
    {
      "id": 1,
      "message": "PTM has been rescheduled for tomorrow",
      "time": "2024-12-13T10:00:00Z",
      "read": false
    },
    {
      "id": 2,
      "message": "Holiday notice: Dashain break starts Oct 10",
      "time": "2024-12-12T15:00:00Z",
      "read": true
    }
  ]
}
```

---

## 3. Student APIs

### 3.1 Get All Students (List)

```
GET /api/students
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by name, roll number, or email |
| `class` | string | Filter by class (e.g., "9", "10", "11", "12") |
| `section` | string | Filter by section (e.g., "A", "B", "C") |
| `status` | string | Filter by status: "active", "graduated", "transferred" |
| `page` | number | Page number for pagination |
| `limit` | number | Items per page (default: 20) |

**Response (200 OK):**
```json
{
  "students": [
    {
      "id": "stu-1",
      "admission_number": "ADM-2024-001",
      "first_name": "John",
      "middle_name": "",
      "last_name": "Doe",
      "full_name": "John Doe",
      "email": "john@example.com",
      "roll_no": 1,
      "student_class": "10",
      "section": "A",
      "dob": "2008-05-15",
      "gender": "male",
      "avatar_url": "/avatars/stu-1.jpg",
      "parent_contact": "9841XXXXXX",
      "admission_date": "2021-04-12",
      "status": "active"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "total_pages": 5
  }
}
```

### 3.2 Get Single Student Details

```
GET /api/students/:id
```

**Response (200 OK):**
```json
{
  "id": "stu-1",
  "admission_number": "ADM-2024-001",
  "first_name": "John",
  "middle_name": "",
  "last_name": "Doe",
  "full_name": "John Doe",
  "email": "john@example.com",
  "roll_no": 1,
  "student_class": "10",
  "section": "A",
  "dob": "2008-05-15",
  "gender": "male",
  "avatar_url": "/avatars/stu-1.jpg",
  "admission_date": "2021-04-12",
  "status": "active",
  "address": "Kathmandu, Nepal",
  "father_name": "Ram Doe",
  "father_phone": "9841111111",
  "mother_name": "Sita Doe",
  "mother_phone": "9841111112",
  "guardian_name": "Ram Doe",
  "guardian_relation": "Father",
  "guardian_phone": "9841111111",
  "previous_school": "ABC School, Pokhara",
  "notes": "Excellent in Mathematics",
  "created_at": "2021-04-12T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

### 3.3 Create New Student (Enrollment)

```
POST /api/students
```

**Request Body (multipart/form-data):**
```json
{
  "admission_number": "ADM-2024-100",
  "first_name": "New",
  "middle_name": "",
  "last_name": "Student",
  "email": "new.student@example.com",
  "roll_no": 45,
  "student_class": "10",
  "section": "A",
  "dob": "2010-03-20",
  "gender": "male",
  "admission_date": "2024-12-13",
  "address": "Lalitpur, Nepal",
  "father_name": "Father Name",
  "father_phone": "9841000001",
  "mother_name": "Mother Name",
  "mother_phone": "9841000002",
  "guardian_name": "Father Name",
  "guardian_relation": "Father",
  "guardian_phone": "9841000001",
  "previous_school": "Previous School Name (optional)",
  "notes": "Additional notes",
  "avatar": "<file upload>"
}
```

**Response (201 Created):**
```json
{
  "id": "stu-100",
  "message": "Student enrolled successfully",
  "student": { /* full student object */ }
}
```

### 3.4 Update Student

```
PUT /api/students/:id
```

**Request Body (multipart/form-data):** Same as create, but partial updates allowed

**Response (200 OK):**
```json
{
  "message": "Student updated successfully",
  "student": { /* updated student object */ }
}
```

### 3.5 Update Student Status

```
PATCH /api/students/:id/status
```

**Request Body:**
```json
{
  "status": "graduated"  // "active" | "graduated" | "transferred" | "expelled"
}
```

**Response (200 OK):**
```json
{
  "message": "Student status updated successfully"
}
```

### 3.6 Bulk Student Placement (Promote/Demote/Transfer)

```
POST /api/students/placement
```

**Request Body:**
```json
{
  "student_ids": ["stu-1", "stu-2", "stu-3"],
  "action": "promote",  // "promote" | "demote" | "transfer"
  "target_class": "11",  // Required for promote/demote
  "target_section": "B"  // Required for transfer
}
```

**Response (200 OK):**
```json
{
  "message": "3 students promoted successfully",
  "updated_students": [
    { "id": "stu-1", "new_class": "11", "new_section": "A" },
    { "id": "stu-2", "new_class": "11", "new_section": "A" },
    { "id": "stu-3", "new_class": "11", "new_section": "A" }
  ]
}
```

### 3.7 Get Students for Placement

```
GET /api/students/placement
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `class` | string | Filter by class (required) |
| `section` | string | Filter by section (required) |
| `search` | string | Search by name |

**Response (200 OK):**
```json
{
  "students": [
    {
      "id": "stu-1",
      "roll": 1,
      "name": "John Doe",
      "class": "10",
      "section": "A",
      "grade": "A",
      "status": "Pass"
    }
  ]
}
```

---

## 4. Staff APIs

### 4.1 Get All Staff

```
GET /api/staff
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by name or email |
| `status` | string | Filter: "all", "active", "inactive" |
| `role` | string | Filter by role: "Teacher", "Admin", etc. |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200 OK):**
```json
{
  "staff": [
    {
      "id": 1,
      "name": "Mr. Sharma",
      "first_name": "Ram",
      "middle_name": "",
      "last_name": "Sharma",
      "email": "sharma@edlas.com",
      "phone": "9841000001",
      "dob": "1980-05-15",
      "gender": "male",
      "address": "Kathmandu, Nepal",
      "role": "Teacher",
      "subjects": [1, 4],  // Array of subject IDs
      "subject_names": ["Mathematics", "Physics"],
      "grades": ["9", "10", "11", "12"],
      "qualification": "M.Sc. Mathematics",
      "experience": "10 years",
      "specialization": "Applied Mathematics",
      "previous_school": "XYZ School",
      "status": "active",
      "avatar_url": "/avatars/staff-1.jpg"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "total_pages": 3
  }
}
```

### 4.2 Get Single Staff Details

```
GET /api/staff/:id
```

**Response (200 OK):** Same structure as single staff object above

### 4.3 Create Staff

```
POST /api/staff
```

**Request Body (multipart/form-data):**
```json
{
  "first_name": "New",
  "middle_name": "",
  "last_name": "Teacher",
  "email": "newteacher@edlas.com",
  "phone": "9841000099",
  "dob": "1990-01-15",
  "gender": "female",
  "address": "Pokhara, Nepal",
  "role": "Teacher",
  "qualification": "M.A. English",
  "experience": "5 years",
  "specialization": "Literature",
  "previous_school": "Previous Institution",
  "subjects": [2, 9],  // Array of subject IDs they can teach
  "grades": ["9", "10", "11"],  // Grades they can teach
  "status": "active",
  "avatar": "<file upload>"
}
```

**Response (201 Created):**
```json
{
  "id": 12,
  "message": "Staff added successfully",
  "staff": { /* full staff object */ }
}
```

### 4.4 Update Staff

```
PUT /api/staff/:id
```

**Request Body:** Same as create (partial updates allowed)

**Response (200 OK):**
```json
{
  "message": "Staff updated successfully",
  "staff": { /* updated staff object */ }
}
```

### 4.5 Toggle Staff Status

```
PATCH /api/staff/:id/status
```

**Request Body:**
```json
{
  "status": "inactive"  // "active" | "inactive"
}
```

**Response (200 OK):**
```json
{
  "message": "Staff status updated successfully"
}
```

### 4.6 Get Active Teachers (for dropdowns)

```
GET /api/staff/teachers/active
```

**Response (200 OK):**
```json
{
  "teachers": [
    { "id": 1, "name": "Mr. Sharma" },
    { "id": 2, "name": "Ms. Karki" },
    { "id": 3, "name": "Mr. Thapa" }
  ]
}
```

---

## 5. Class Management APIs

### 5.1 Get All Classes

```
GET /api/classes
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by class, section, or teacher |
| `class` | string | Filter by class name (e.g., "9", "10") |
| `section` | string | Filter by section (e.g., "A", "B") |

**Response (200 OK):**
```json
{
  "classes": [
    {
      "id": "c1",
      "class_name": "9",
      "section": "A",
      "teacher_id": 1,
      "teacher_name": "Mr. Thapa",
      "total_students": 42,
      "status": "active"
    },
    {
      "id": "c2",
      "class_name": "9",
      "section": "B",
      "teacher_id": 4,
      "teacher_name": "Ms. Singh",
      "total_students": 38,
      "status": "active"
    }
  ],
  "available_classes": ["9", "10", "11", "12"],
  "available_sections": ["A", "B", "C"]
}
```

### 5.2 Create Class

```
POST /api/classes
```

**Request Body:**
```json
{
  "class_name": "9",
  "section": "D",
  "teacher_id": 5,  // Optional - class teacher
  "status": "active"
}
```

**Response (201 Created):**
```json
{
  "id": "c12",
  "message": "Class created successfully",
  "class": { /* class object */ }
}
```

### 5.3 Update Class

```
PUT /api/classes/:id
```

**Request Body:**
```json
{
  "teacher_id": 6,
  "status": "inactive"
}
```

**Response (200 OK):**
```json
{
  "message": "Class updated successfully"
}
```

### 5.4 Assign/Reassign Class Teacher

```
PATCH /api/classes/:id/teacher
```

**Request Body:**
```json
{
  "teacher_id": 3
}
```

**Response (200 OK):**
```json
{
  "message": "Teacher assigned successfully"
}
```

### 5.5 Toggle Class Status

```
PATCH /api/classes/:id/status
```

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response (200 OK):**
```json
{
  "message": "Class status updated"
}
```

---

## 6. Subject APIs (Subject Master)

### 6.1 Get All Subjects

```
GET /api/subjects
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by name or description |

**Response (200 OK):**
```json
{
  "subjects": [
    { "id": 1, "name": "Mathematics", "description": "Number theory, algebra, geometry, and calculus" },
    { "id": 2, "name": "English", "description": "Literature, grammar, and composition" },
    { "id": 3, "name": "Science", "description": "General science concepts" },
    { "id": 4, "name": "Physics", "description": "Mechanics, thermodynamics, and electromagnetism" },
    { "id": 5, "name": "Chemistry", "description": "Organic and inorganic chemistry" },
    { "id": 6, "name": "Biology", "description": "Cell biology, genetics, and ecology" },
    { "id": 7, "name": "Economics", "description": "Microeconomics and macroeconomics" },
    { "id": 8, "name": "Computer Science", "description": "Programming and computational thinking" },
    { "id": 9, "name": "Nepali", "description": "Nepali language and literature" },
    { "id": 10, "name": "Social Studies", "description": "History, geography, and civics" }
  ]
}
```

### 6.2 Create Subject

```
POST /api/subjects
```

**Request Body:**
```json
{
  "name": "Accountancy",
  "description": "Financial accounting and management"
}
```

**Response (201 Created):**
```json
{
  "id": 11,
  "message": "Subject created successfully",
  "subject": { "id": 11, "name": "Accountancy", "description": "Financial accounting and management" }
}
```

### 6.3 Update Subject

```
PUT /api/subjects/:id
```

**Request Body:**
```json
{
  "name": "Accountancy",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "message": "Subject updated successfully"
}
```

### 6.4 Delete Subject

```
DELETE /api/subjects/:id
```

**Response (200 OK):**
```json
{
  "message": "Subject deleted successfully"
}
```

> **Warning**: Should check if subject is in use before deleting

---

## 7. Class Subject (Course) APIs

> These APIs manage which subjects are assigned to which classes, along with their marking schemes.

### 7.1 Get Class Subjects

```
GET /api/class-subjects
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `class` | string | Filter by class (e.g., "9", "10") |
| `search` | string | Search by subject name or code |

**Response (200 OK):**
```json
{
  "class_subjects": {
    "9": [
      {
        "id": 1,
        "subject_id": 1,
        "subject_name": "Mathematics",
        "code": "MATH-9",
        "full_marks": 100,
        "pass_marks": 40,
        "theory": 70,
        "practical": 30,
        "optional": false
      },
      {
        "id": 2,
        "subject_id": 2,
        "subject_name": "English",
        "code": "ENG-9",
        "full_marks": 100,
        "pass_marks": 35,
        "theory": 100,
        "practical": 0,
        "optional": false
      }
    ],
    "10": [
      {
        "id": 6,
        "subject_id": 1,
        "subject_name": "Mathematics",
        "code": "MATH-10",
        "full_marks": 100,
        "pass_marks": 40,
        "theory": 70,
        "practical": 30,
        "optional": false
      }
    ]
  }
}
```

### 7.2 Get Subjects for a Specific Class

```
GET /api/class-subjects/:class
```

**Example:** `GET /api/class-subjects/10`

**Response (200 OK):**
```json
{
  "class": "10",
  "subjects": [
    {
      "id": 6,
      "subject_id": 1,
      "subject_name": "Mathematics",
      "code": "MATH-10",
      "full_marks": 100,
      "pass_marks": 40,
      "theory": 70,
      "practical": 30,
      "optional": false
    }
  ]
}
```

### 7.3 Add Subject to Class

```
POST /api/class-subjects
```

**Request Body:**
```json
{
  "class_name": "10",
  "subject_id": 8,
  "code": "CS-10",
  "full_marks": 100,
  "pass_marks": 40,
  "theory": 50,
  "practical": 50,
  "optional": true
}
```

**Response (201 Created):**
```json
{
  "id": 20,
  "message": "Subject added to class successfully"
}
```

### 7.4 Update Class Subject

```
PUT /api/class-subjects/:id
```

**Request Body:**
```json
{
  "code": "CS-10",
  "full_marks": 100,
  "pass_marks": 35,
  "theory": 60,
  "practical": 40,
  "optional": false
}
```

**Response (200 OK):**
```json
{
  "message": "Class subject updated successfully"
}
```

### 7.5 Delete Class Subject

```
DELETE /api/class-subjects/:id
```

**Response (200 OK):**
```json
{
  "message": "Subject removed from class"
}
```

---

## 8. Teacher Assignment APIs

> These APIs manage which teacher teaches which subject to which class/section.

### 8.1 Get All Teacher Assignments

```
GET /api/teacher-assignments
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `class` | string | Filter by class |
| `search` | string | Search by subject or teacher name |

**Response (200 OK):**
```json
{
  "assignments": [
    {
      "id": 1,
      "subject_id": 1,
      "subject_name": "Mathematics",
      "class_name": "9",
      "section": "A",
      "teacher_id": 1,
      "teacher_name": "Mr. Sharma"
    },
    {
      "id": 2,
      "subject_id": 1,
      "subject_name": "Mathematics",
      "class_name": "9",
      "section": "B",
      "teacher_id": 3,
      "teacher_name": "Mr. Thapa"
    }
  ]
}
```

### 8.2 Create Teacher Assignment

```
POST /api/teacher-assignments
```

**Request Body:**
```json
{
  "subject_id": 1,
  "class_name": "10",
  "section": "C",
  "teacher_id": 1
}
```

**Response (201 Created):**
```json
{
  "id": 9,
  "message": "Teacher assigned successfully"
}
```

### 8.3 Update Teacher Assignment

```
PUT /api/teacher-assignments/:id
```

**Request Body:**
```json
{
  "subject_id": 1,
  "class_name": "10",
  "section": "C",
  "teacher_id": 5
}
```

**Response (200 OK):**
```json
{
  "message": "Assignment updated successfully"
}
```

### 8.4 Delete Teacher Assignment

```
DELETE /api/teacher-assignments/:id
```

**Response (200 OK):**
```json
{
  "message": "Assignment removed successfully"
}
```

---

## 9. Marks & Results APIs

### 9.1 Get Students with Marks (for marks entry page)

```
GET /api/marks
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `class` | string | Class filter (required) |
| `section` | string | Section filter (required) |
| `exam_term` | string | Term: "1st", "2nd", "3rd", "Final" |
| `search` | string | Search by name or roll number |

**Response (200 OK):**
```json
{
  "exam_term": "1st",
  "class": "10",
  "section": "A",
  "subjects": ["Math", "English", "Science", "Health", "Social", "Nepali"],
  "students": [
    {
      "id": "stu-1",
      "roll": 1,
      "name": "John Doe",
      "avatar_url": "/avatars/stu-1.jpg",
      "marks": {
        "Math": { "theory": 60, "practical": 25, "grade": "B+" },
        "English": { "theory": 80, "practical": 0, "grade": "A" },
        "Science": { "theory": 50, "practical": 20, "grade": "B" }
      },
      "total_grade": "B+"
    },
    {
      "id": "stu-2",
      "roll": 2,
      "name": "Jane Smith",
      "avatar_url": "/avatars/stu-2.jpg",
      "marks": {},
      "total_grade": "N/A"
    }
  ]
}
```

### 9.2 Add/Update Student Marks

```
POST /api/marks
```

**Request Body:**
```json
{
  "student_id": "stu-1",
  "exam_term": "1st",
  "class": "10",
  "section": "A",
  "marks": [
    { "subject_id": 1, "subject_name": "Math", "theory": 65, "practical": 28 },
    { "subject_id": 2, "subject_name": "English", "theory": 82, "practical": 0 },
    { "subject_id": 3, "subject_name": "Science", "theory": 55, "practical": 25 }
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Marks saved successfully",
  "calculated_grades": {
    "Math": "B+",
    "English": "A",
    "Science": "B"
  },
  "total_grade": "B+"
}
```

### 9.3 Get Student Results (for My Results page - student view)

```
GET /api/results/my
```

**Headers:** `Authorization: Bearer <access_token>` (Student's token)

**Response (200 OK):**
```json
{
  "results": [
    {
      "id": 1,
      "exam_name": "First Term Examination",
      "year": "2024",
      "class": "10",
      "section": "A",
      "date": "2024-04-15",
      "total_marks": 500,
      "obtained_marks": 423,
      "percentage": 84.6,
      "grade": "A",
      "rank": 5,
      "subjects": [
        {
          "name": "Mathematics",
          "code": "MATH-10",
          "full_marks": 100,
          "obtained": 88,
          "theory": 63,
          "practical": 25,
          "grade": "A+"
        },
        {
          "name": "English",
          "code": "ENG-10",
          "full_marks": 100,
          "obtained": 82,
          "theory": 82,
          "practical": 0,
          "grade": "A"
        }
      ]
    }
  ]
}
```

### 9.4 Get Student Results by ID (Admin/Staff view)

```
GET /api/results/student/:studentId
```

**Response:** Same structure as 9.3

### 9.5 Download Marksheet (PDF)

```
GET /api/results/:resultId/download
```

**Response:** PDF file download

---

## 10. AI Chat API

### 10.1 Send Message to AI

```
POST /api/ai/chat
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "message": "How can I improve my math grades?",
  "conversation_id": "conv-123"  // Optional for continuing conversation
}
```

**Response (200 OK):**
```json
{
  "conversation_id": "conv-123",
  "response": {
    "type": "ai",
    "text": "Here are some tips to improve your math grades: 1. Practice regularly... 2. Focus on weak areas..."
  }
}
```

### 10.2 Get Chat History

```
GET /api/ai/chat/history?conversation_id=conv-123
```

**Response (200 OK):**
```json
{
  "conversation_id": "conv-123",
  "messages": [
    { "type": "user", "text": "How can I improve my math grades?", "timestamp": "2024-12-13T10:00:00Z" },
    { "type": "ai", "text": "Here are some tips...", "timestamp": "2024-12-13T10:00:02Z" }
  ]
}
```

---

## Data Types Reference

### User Types (Roles)
| Value | Description | Permissions |
|-------|-------------|-------------|
| `superadmin` | Full access | All features |
| `staff` | Teacher/Staff | Students list, Marks management, AI Chat |
| `student` | Student | My Results, AI Chat |

### Student Status
| Value | Description |
|-------|-------------|
| `active` | Currently enrolled |
| `graduated` | Completed studies |
| `transferred` | Moved to another school |
| `expelled` | Expelled from school |

### Staff Status
| Value | Description |
|-------|-------------|
| `active` | Currently employed |
| `inactive` | On leave / Not active |

### Staff Roles
| Value | Description |
|-------|-------------|
| `Teacher` | Teaching staff |
| `Admin` | Administrative staff |
| `Accountant` | Finance staff |
| `Librarian` | Library management |
| `Coordinator` | Academic coordinator |

### Class Status
| Value | Description |
|-------|-------------|
| `active` | Currently active class |
| `inactive` | Not running this session |

### Gender
| Value | Description |
|-------|-------------|
| `male` | Male |
| `female` | Female |
| `other` | Other |

### Exam Terms
| Value | Description |
|-------|-------------|
| `1st` | First Term |
| `2nd` | Second Term |
| `3rd` | Third Term |
| `Final` | Final Examination |

---

## Error Response Format

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong",
  "code": "ERROR_CODE",  // Optional, for programmatic handling
  "errors": {  // Optional, for validation errors
    "field_name": ["Error message for this field"]
  }
}
```

### Common HTTP Status Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Authentication

All API calls (except login) require the `Authorization` header:

```
Authorization: Bearer <access_token>
```

When the access token expires (typically after 30 minutes), use the refresh token to get a new access token via the `/api/auth/refresh` endpoint.

---

## Pagination

For list endpoints, pagination follows this format:

**Request:**
```
GET /api/students?page=2&limit=20
```

**Response includes:**
```json
{
  "pagination": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "total_pages": 8
  }
}
```

---

## File Uploads

For endpoints that accept file uploads (avatars):

1. Use `multipart/form-data` content type
2. File field name: `avatar`
3. Max file size: 5MB
4. Accepted formats: `.jpg`, `.jpeg`, `.png`, `.webp`

---

> **Note**: This documentation covers all frontend requirements identified from the Edlas School Management System codebase. The backend team should implement these APIs to support the existing frontend functionality.
