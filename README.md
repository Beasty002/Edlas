# Edlas - School Management System

A comprehensive school management system frontend built with React. Role-based interfaces for **Admin**, **Teachers**, and **Students**.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Routing | React Router v6 |
| Notifications | Sonner |
| Deployment | Docker + CI/CD |

---

## ✅ Completed

### Pages & Features

**Student Management**
- Student list with filters and search
- Student details page
- Student enrollment/edit form
- Student placement (promote, demote, transfer with bulk actions)

**Class Management**
- Classes and sections management
- Add new class or section to existing class
- Assign class teachers

**Subject Management**
- Subject master (school-wide subjects CRUD)
- Class courses (assign subjects to classes with marks config)
- Assign/reassign teachers to subjects

**Staff Management**
- Staff list with filters
- Add staff form
- Edit staff and toggle status

**Marks & Results**
- Marks management with dynamic subject columns
- Add/edit marks per student per term
- My Results page for students

**Authentication & Authorization**
- Login for 3 user types (Admin, Teacher, Student)
- Authority-based routing with lazy loading
- Role-based sidebar menu

### UI/UX
- Responsive collapsible sidebar
- Dark/Light theme toggle
- Page headers with descriptions
- Filter toolbars on all pages
- Reusable DataGrid component (sorting, actions, bulk selection)

### DevOps
- Docker configuration
- CI/CD pipeline
- Environment configuration

---

## 📋 Further Development (To-Do)

### Backend & AI Integration
- [ ] **Replace Mock Data with API Calls**
  - Connect to backend REST API
  - Implement proper authentication flow
  - Add loading states and error handling
- [ ] **Integrate Actual AI**
  - Connect to AI backend/service
  - Implement real chat functionality
  - Add context-aware responses

### New Modules
- [ ] **Homework/Assignment System**
  - Teachers: Create and assign homework
  - Students: View and submit assignments
  - Grading and feedback system
- [ ] **Chat System**
  - Class group chat
  - Teachers group chat
  - One-on-one student-teacher chat
  - Real-time messaging with WebSockets
- [ ] **Notification System**
  - Admin notification creation panel
  - Push notifications
  - In-app notification center
  - Email notifications

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

---

## 📁 Structure

```
src/
├── components/       # UI + reusable components
├── pages/
│   ├── admin/       # Admin pages
│   ├── shared/      # Admin + Teacher pages
│   ├── student/     # Student pages
│   └── Teacher/     # Teacher pages
├── context/         # Auth, Theme
├── data/            # Mock data
└── layout/          # Layout components
```

---

## 👥 Roles

| Role | Access |
|------|--------|
| Admin | Full access |
| Teacher | Students, marks, classes |
| Student | Results, profile |
