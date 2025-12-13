export const mockUsers = {
  "admin@edlas.com": {
    password: "admin123",
    user_type: "superadmin",
    full_name: "Admin User",
    email: "admin@edlas.com",
    phone: "9800000001"
  },
  "staff@edlas.com": {
    password: "staff123",
    user_type: "staff",
    full_name: "Staff User",
    email: "staff@edlas.com",
    phone: "9800000002"
  },
  "student@edlas.com": {
    password: "student123",
    user_type: "student",
    full_name: "Student User",
    email: "student@edlas.com",
    phone: "9800000003"
  }
};

export const allClasses = ["9", "10", "11", "12"];
export const allSections = ["A", "B", "C"];

export const classesData = [
  { id: "c1", className: "9", section: "A", teacher: "Mr. Thapa", totalStudents: 42, status: "active" },
  { id: "c2", className: "9", section: "B", teacher: "Ms. Singh", totalStudents: 38, status: "active" },
  { id: "c3", className: "9", section: "C", teacher: "", totalStudents: 35, status: "inactive" },
  { id: "c4", className: "10", section: "A", teacher: "Mr. Sharma", totalStudents: 45, status: "active" },
  { id: "c5", className: "10", section: "B", teacher: "Ms. Karki", totalStudents: 40, status: "inactive" },
  { id: "c6", className: "10", section: "C", teacher: "", totalStudents: 41, status: "active" },
  { id: "c7", className: "11", section: "A", teacher: "Mrs. Sita", totalStudents: 39, status: "active" },
  { id: "c8", className: "11", section: "B", teacher: "", totalStudents: 36, status: "inactive" },
  { id: "c9", className: "12", section: "A", teacher: "Mr. Ram", totalStudents: 44, status: "active" },
  { id: "c10", className: "12", section: "B", teacher: "", totalStudents: 37, status: "active" },
  { id: "c11", className: "12", section: "C", teacher: "Ms. Koirala", totalStudents: 40, status: "inactive" }
];

export const subjectMaster = [
  { id: 1, name: "Mathematics", description: "Number theory, algebra, geometry, and calculus" },
  { id: 2, name: "English", description: "Literature, grammar, and composition" },
  { id: 3, name: "Science", description: "General science concepts" },
  { id: 4, name: "Physics", description: "Mechanics, thermodynamics, and electromagnetism" },
  { id: 5, name: "Chemistry", description: "Organic and inorganic chemistry" },
  { id: 6, name: "Biology", description: "Cell biology, genetics, and ecology" },
  { id: 7, name: "Economics", description: "Microeconomics and macroeconomics" },
  { id: 8, name: "Computer Science", description: "Programming and computational thinking" },
  { id: 9, name: "Nepali", description: "Nepali language and literature" },
  { id: 10, name: "Social Studies", description: "History, geography, and civics" }
];

export const classSubjects = {
  9: [
    { id: 1, subjectId: 1, code: "MATH-9", fullMarks: 100, passMarks: 40, theory: 70, practical: 30, optional: false },
    { id: 2, subjectId: 2, code: "ENG-9", fullMarks: 100, passMarks: 35, theory: 100, practical: 0, optional: false },
    { id: 3, subjectId: 3, code: "SCI-9", fullMarks: 100, passMarks: 40, theory: 60, practical: 40, optional: false },
    { id: 4, subjectId: 9, code: "NEP-9", fullMarks: 100, passMarks: 35, theory: 100, practical: 0, optional: false },
    { id: 5, subjectId: 10, code: "SOC-9", fullMarks: 100, passMarks: 35, theory: 100, practical: 0, optional: false }
  ],
  10: [
    { id: 6, subjectId: 1, code: "MATH-10", fullMarks: 100, passMarks: 40, theory: 70, practical: 30, optional: false },
    { id: 7, subjectId: 2, code: "ENG-10", fullMarks: 100, passMarks: 35, theory: 100, practical: 0, optional: false },
    { id: 8, subjectId: 4, code: "PHY-10", fullMarks: 100, passMarks: 40, theory: 60, practical: 40, optional: false },
    { id: 9, subjectId: 5, code: "CHEM-10", fullMarks: 100, passMarks: 40, theory: 60, practical: 40, optional: false }
  ],
  11: [
    { id: 10, subjectId: 1, code: "MATH-11", fullMarks: 100, passMarks: 40, theory: 70, practical: 30, optional: false },
    { id: 11, subjectId: 4, code: "PHY-11", fullMarks: 100, passMarks: 40, theory: 60, practical: 40, optional: false },
    { id: 12, subjectId: 5, code: "CHEM-11", fullMarks: 100, passMarks: 40, theory: 60, practical: 40, optional: false },
    { id: 13, subjectId: 6, code: "BIO-11", fullMarks: 100, passMarks: 35, theory: 60, practical: 40, optional: true },
    { id: 14, subjectId: 8, code: "CS-11", fullMarks: 100, passMarks: 40, theory: 50, practical: 50, optional: true }
  ],
  12: [
    { id: 15, subjectId: 1, code: "MATH-12", fullMarks: 100, passMarks: 40, theory: 70, practical: 30, optional: false },
    { id: 16, subjectId: 4, code: "PHY-12", fullMarks: 100, passMarks: 40, theory: 60, practical: 40, optional: false },
    { id: 17, subjectId: 5, code: "CHEM-12", fullMarks: 100, passMarks: 40, theory: 60, practical: 40, optional: false },
    { id: 18, subjectId: 7, code: "ECO-12", fullMarks: 100, passMarks: 35, theory: 100, practical: 0, optional: true }
  ]
};

export const teacherAssignments = [
  { id: 1, subjectId: 1, className: "9", section: "A", teacherId: 1 },
  { id: 2, subjectId: 1, className: "9", section: "B", teacherId: 3 },
  { id: 3, subjectId: 1, className: "9", section: "C", teacherId: 2 },
  { id: 4, subjectId: 2, className: "9", section: "A", teacherId: 2 },
  { id: 5, subjectId: 2, className: "9", section: "B", teacherId: 4 },
  { id: 6, subjectId: 3, className: "9", section: "A", teacherId: 3 },
  { id: 7, subjectId: 1, className: "10", section: "A", teacherId: 1 },
  { id: 8, subjectId: 4, className: "10", section: "A", teacherId: 5 }
];

export const staffList = [
  { id: 1, name: "Mr. Sharma", email: "sharma@edlas.com", phone: "9841000001", role: "Teacher", subjects: [1, 4], grades: ["9", "10", "11", "12"], qualification: "M.Sc. Mathematics", experience: "10 years", status: "active" },
  { id: 2, name: "Ms. Karki", email: "karki@edlas.com", phone: "9841000002", role: "Teacher", subjects: [2, 1], grades: ["9", "10"], qualification: "M.A. English", experience: "8 years", status: "active" },
  { id: 3, name: "Mr. Thapa", email: "thapa@edlas.com", phone: "9841000003", role: "Teacher", subjects: [3, 1], grades: ["9", "10"], qualification: "B.Sc. Physics", experience: "5 years", status: "active" },
  { id: 4, name: "Ms. Singh", email: "singh@edlas.com", phone: "9841000004", role: "Teacher", subjects: [2], grades: ["9", "10", "11"], qualification: "M.A. English Literature", experience: "7 years", status: "active" },
  { id: 5, name: "Dr. Rana", email: "rana@edlas.com", phone: "9841000005", role: "Teacher", subjects: [4, 3], grades: ["10", "11", "12"], qualification: "Ph.D. Physics", experience: "15 years", status: "active" },
  { id: 6, name: "Dr. Shrestha", email: "shrestha@edlas.com", phone: "9841000006", role: "Teacher", subjects: [6], grades: ["11", "12"], qualification: "Ph.D. Biology", experience: "12 years", status: "active" },
  { id: 7, name: "Mr. Bhandari", email: "bhandari@edlas.com", phone: "9841000007", role: "Teacher", subjects: [5, 4], grades: ["10", "11", "12"], qualification: "M.Sc. Chemistry", experience: "9 years", status: "inactive" },
  { id: 8, name: "Mrs. Sita", email: "sita@edlas.com", phone: "9841000008", role: "Teacher", subjects: [3], grades: ["9", "10"], qualification: "B.Sc. General Science", experience: "6 years", status: "active" },
  { id: 9, name: "Mr. Ram", email: "ram@edlas.com", phone: "9841000009", role: "Teacher", subjects: [1], grades: ["11", "12"], qualification: "M.Sc. Applied Mathematics", experience: "11 years", status: "active" },
  { id: 10, name: "Ms. Koirala", email: "koirala@edlas.com", phone: "9841000010", role: "Teacher", subjects: [2], grades: ["11", "12"], qualification: "M.A. English", experience: "4 years", status: "inactive" },
  { id: 11, name: "Ms. Gurung", email: "gurung@edlas.com", phone: "9841000011", role: "Teacher", subjects: [7], grades: ["11", "12"], qualification: "M.A. Economics", experience: "8 years", status: "active" }
];

export const teachersList = staffList.filter(s => s.role === "Teacher" && s.status === "active").map(s => s.name);

export const getSubjectName = (subjectId) => {
  const subject = subjectMaster.find(s => s.id === subjectId);
  return subject ? subject.name : "Unknown";
};

export const getTeacherName = (teacherId) => {
  const teacher = staffList.find(s => s.id === teacherId);
  return teacher ? teacher.name : "Not Assigned";
};

export const rolePermissions = {
  superadmin: {
    sidebar: ["dashboard", "students", "staffs", "academics", "ai"],
    routes: ["/", "/students", "/students/newEnrollment", "/students/placement", "/students/StudentDetail", "/staffs", "/staffs/add", "/classes", "/subjects", "/subject-master", "/teacher-assignments", "/marks", "/ai"]
  },
  staff: {
    sidebar: ["dashboard", "students", "academics", "ai"],
    routes: ["/", "/students", "/marks", "/ai"]
  },
  student: {
    sidebar: ["dashboard", "results", "ai"],
    routes: ["/", "/my-results", "/ai"]
  }
};
