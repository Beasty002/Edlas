// ============================================
// MOCK DATA - All mock data for the application
// ============================================

// ==================== AUTHENTICATION ====================
export const mockUsers = {
  "admin@edlas.com": {
    id: 1,
    password: "admin123",
    user_type: "superadmin",
    is_superuser: true,
    first_name: "Admin",
    middle_name: "",
    last_name: "User",
    full_name: "Admin User",
    email: "admin@edlas.com",
    phone: "9800000001",
    avatar_url: "",
    status: "active"
  },
  "staff@edlas.com": {
    id: 2,
    password: "staff123",
    user_type: "staff",
    is_superuser: false,
    first_name: "Staff",
    middle_name: "",
    last_name: "User",
    full_name: "Staff User",
    email: "staff@edlas.com",
    phone: "9800000002",
    avatar_url: "",
    status: "active"
  },
  "student@edlas.com": {
    id: 3,
    password: "student123",
    user_type: "student",
    is_superuser: false,
    first_name: "Student",
    middle_name: "",
    last_name: "User",
    full_name: "Student User",
    email: "student@edlas.com",
    phone: "9800000003",
    avatar_url: "",
    status: "active"
  }
};

// ==================== ROLE PERMISSIONS ====================
export const rolePermissions = {
  superadmin: {
    sidebar: ["dashboard", "students", "staffs", "academics", "announcements", "ai"],
    routes: ["/", "/students", "/students/newEnrollment", "/students/placement", "/students/StudentDetail", "/staffs", "/staffs/add", "/classes", "/subjects", "/subject-master", "/teacher-assignments", "/announcements", "/marks", "/ai"]
  },
  staff: {
    sidebar: ["dashboard", "students", "academics", "classroom", "ai"],
    routes: ["/", "/students", "/marks", "/classroom", "/ai"]
  },
  student: {
    sidebar: ["dashboard", "classroom", "results", "ai"],
    routes: ["/", "/my-classroom", "/my-results", "/ai"]
  }
};

// ==================== STUDENTS ====================
export const mockStudents = [
  {
    id: 1,
    first_name: "Aarav",
    middle_name: "",
    last_name: "Sharma",
    full_name: "Aarav Sharma",
    email: "aarav.sharma@student.edlas.com",
    roll_no: 1,
    student_class: "10",
    section: "A",
    dob: "2010-05-12",
    gender: "male",
    parent_contact: "9841000101",
    parent_name: "Ramesh Sharma",
    address: "Kathmandu, Ward 10",
    admission_date: "2023-04-01",
    avatar_url: "",
    status: "active"
  },
  {
    id: 2,
    first_name: "Sita",
    middle_name: "Kumari",
    last_name: "Thapa",
    full_name: "Sita Kumari Thapa",
    email: "sita.thapa@student.edlas.com",
    roll_no: 2,
    student_class: "10",
    section: "A",
    dob: "2010-08-22",
    gender: "female",
    parent_contact: "9841000102",
    parent_name: "Hari Thapa",
    address: "Lalitpur, Ward 5",
    admission_date: "2023-04-01",
    avatar_url: "",
    status: "active"
  },
  {
    id: 3,
    first_name: "Bikash",
    middle_name: "",
    last_name: "Karki",
    full_name: "Bikash Karki",
    email: "bikash.karki@student.edlas.com",
    roll_no: 3,
    student_class: "10",
    section: "B",
    dob: "2010-03-15",
    gender: "male",
    parent_contact: "9841000103",
    parent_name: "Shyam Karki",
    address: "Bhaktapur, Ward 8",
    admission_date: "2023-04-01",
    avatar_url: "",
    status: "active"
  },
  {
    id: 4,
    first_name: "Priya",
    middle_name: "",
    last_name: "Rana",
    full_name: "Priya Rana",
    email: "priya.rana@student.edlas.com",
    roll_no: 4,
    student_class: "9",
    section: "A",
    dob: "2011-11-08",
    gender: "female",
    parent_contact: "9841000104",
    parent_name: "Binod Rana",
    address: "Kathmandu, Ward 15",
    admission_date: "2024-04-01",
    avatar_url: "",
    status: "active"
  },
  {
    id: 5,
    first_name: "Rohan",
    middle_name: "Kumar",
    last_name: "Shrestha",
    full_name: "Rohan Kumar Shrestha",
    email: "rohan.shrestha@student.edlas.com",
    roll_no: 5,
    student_class: "11",
    section: "A",
    dob: "2009-06-25",
    gender: "male",
    parent_contact: "9841000105",
    parent_name: "Prakash Shrestha",
    address: "Pokhara, Ward 3",
    admission_date: "2022-04-01",
    avatar_url: "",
    status: "graduated"
  },
  {
    id: 6,
    first_name: "Anita",
    middle_name: "",
    last_name: "Bhandari",
    full_name: "Anita Bhandari",
    email: "anita.bhandari@student.edlas.com",
    roll_no: 6,
    student_class: "12",
    section: "A",
    dob: "2008-02-14",
    gender: "female",
    parent_contact: "9841000106",
    parent_name: "Gopal Bhandari",
    address: "Chitwan, Ward 7",
    admission_date: "2021-04-01",
    avatar_url: "",
    status: "active"
  },
  {
    id: 7,
    first_name: "Sunil",
    middle_name: "",
    last_name: "Magar",
    full_name: "Sunil Magar",
    email: "sunil.magar@student.edlas.com",
    roll_no: 7,
    student_class: "9",
    section: "B",
    dob: "2011-09-30",
    gender: "male",
    parent_contact: "9841000107",
    parent_name: "Tek Magar",
    address: "Lalitpur, Ward 12",
    admission_date: "2024-04-01",
    avatar_url: "",
    status: "transferred"
  },
  {
    id: 8,
    first_name: "Maya",
    middle_name: "Devi",
    last_name: "Gurung",
    full_name: "Maya Devi Gurung",
    email: "maya.gurung@student.edlas.com",
    roll_no: 8,
    student_class: "10",
    section: "C",
    dob: "2010-12-05",
    gender: "female",
    parent_contact: "9841000108",
    parent_name: "Dil Gurung",
    address: "Pokhara, Ward 9",
    admission_date: "2023-04-01",
    avatar_url: "",
    status: "active"
  }
];

// ==================== STAFF/TEACHERS ====================
export const mockStaff = [
  {
    id: 1,
    first_name: "Ram",
    middle_name: "Bahadur",
    last_name: "Sharma",
    full_name: "Ram Bahadur Sharma",
    email: "ram.sharma@edlas.com",
    phone: "9841000001",
    role: "Teacher",
    subjects: [1, 4],
    grades: ["9", "10", "11", "12"],
    qualification: "M.Sc. Mathematics",
    experience: "10 years",
    join_date: "2015-04-01",
    address: "Kathmandu, Ward 5",
    gender: "male",
    status: "active"
  },
  {
    id: 2,
    first_name: "Sushila",
    middle_name: "",
    last_name: "Karki",
    full_name: "Sushila Karki",
    email: "sushila.karki@edlas.com",
    phone: "9841000002",
    role: "Teacher",
    subjects: [2],
    grades: ["9", "10"],
    qualification: "M.A. English",
    experience: "8 years",
    join_date: "2017-04-01",
    address: "Lalitpur, Ward 3",
    gender: "female",
    status: "active"
  },
  {
    id: 3,
    first_name: "Hari",
    middle_name: "Prasad",
    last_name: "Thapa",
    full_name: "Hari Prasad Thapa",
    email: "hari.thapa@edlas.com",
    phone: "9841000003",
    role: "Teacher",
    subjects: [3, 4],
    grades: ["9", "10"],
    qualification: "M.Sc. Physics",
    experience: "5 years",
    join_date: "2020-04-01",
    address: "Bhaktapur, Ward 7",
    gender: "male",
    status: "active"
  },
  {
    id: 4,
    first_name: "Gita",
    middle_name: "",
    last_name: "Singh",
    full_name: "Gita Singh",
    email: "gita.singh@edlas.com",
    phone: "9841000004",
    role: "Teacher",
    subjects: [2, 9],
    grades: ["9", "10", "11"],
    qualification: "M.A. English Literature",
    experience: "7 years",
    join_date: "2018-04-01",
    address: "Kathmandu, Ward 12",
    gender: "female",
    status: "active"
  },
  {
    id: 5,
    first_name: "Deepak",
    middle_name: "",
    last_name: "Rana",
    full_name: "Dr. Deepak Rana",
    email: "deepak.rana@edlas.com",
    phone: "9841000005",
    role: "Teacher",
    subjects: [4, 5],
    grades: ["10", "11", "12"],
    qualification: "Ph.D. Physics",
    experience: "15 years",
    join_date: "2010-04-01",
    address: "Kathmandu, Ward 20",
    gender: "male",
    status: "active"
  },
  {
    id: 6,
    first_name: "Sunita",
    middle_name: "",
    last_name: "Shrestha",
    full_name: "Dr. Sunita Shrestha",
    email: "sunita.shrestha@edlas.com",
    phone: "9841000006",
    role: "Teacher",
    subjects: [6],
    grades: ["11", "12"],
    qualification: "Ph.D. Biology",
    experience: "12 years",
    join_date: "2013-04-01",
    address: "Lalitpur, Ward 8",
    gender: "female",
    status: "active"
  },
  {
    id: 7,
    first_name: "Binod",
    middle_name: "",
    last_name: "Bhandari",
    full_name: "Binod Bhandari",
    email: "binod.bhandari@edlas.com",
    phone: "9841000007",
    role: "Teacher",
    subjects: [5],
    grades: ["10", "11", "12"],
    qualification: "M.Sc. Chemistry",
    experience: "9 years",
    join_date: "2016-04-01",
    address: "Bhaktapur, Ward 2",
    gender: "male",
    status: "inactive"
  },
  {
    id: 8,
    first_name: "Kamala",
    middle_name: "",
    last_name: "Koirala",
    full_name: "Kamala Koirala",
    email: "kamala.koirala@edlas.com",
    phone: "9841000008",
    role: "Teacher",
    subjects: [7],
    grades: ["11", "12"],
    qualification: "M.A. Economics",
    experience: "6 years",
    join_date: "2019-04-01",
    address: "Kathmandu, Ward 14",
    gender: "female",
    status: "inactive"
  }
];

// ==================== CLASSROOMS ====================
export const mockClassrooms = [
  { id: 1, name: "9", description: "Grade 9" },
  { id: 2, name: "10", description: "Grade 10" },
  { id: 3, name: "11", description: "Grade 11 (Science)" },
  { id: 4, name: "12", description: "Grade 12 (Science)" }
];

// ==================== CLASS SECTIONS ====================
export const mockClassSections = [
  { id: 1, classroom: 1, classroom_name: "9", section: "A", class_teacher: "Mr. Thapa", class_teacher_id: 3, total_students: 42, status: "active" },
  { id: 2, classroom: 1, classroom_name: "9", section: "B", class_teacher: "Ms. Singh", class_teacher_id: 4, total_students: 38, status: "active" },
  { id: 3, classroom: 1, classroom_name: "9", section: "C", class_teacher: "", class_teacher_id: null, total_students: 35, status: "inactive" },
  { id: 4, classroom: 2, classroom_name: "10", section: "A", class_teacher: "Mr. Sharma", class_teacher_id: 1, total_students: 45, status: "active" },
  { id: 5, classroom: 2, classroom_name: "10", section: "B", class_teacher: "Ms. Karki", class_teacher_id: 2, total_students: 40, status: "active" },
  { id: 6, classroom: 2, classroom_name: "10", section: "C", class_teacher: "", class_teacher_id: null, total_students: 41, status: "inactive" },
  { id: 7, classroom: 3, classroom_name: "11", section: "A", class_teacher: "Dr. Rana", class_teacher_id: 5, total_students: 39, status: "active" },
  { id: 8, classroom: 3, classroom_name: "11", section: "B", class_teacher: "", class_teacher_id: null, total_students: 36, status: "inactive" },
  { id: 9, classroom: 4, classroom_name: "12", section: "A", class_teacher: "Dr. Shrestha", class_teacher_id: 6, total_students: 44, status: "active" },
  { id: 10, classroom: 4, classroom_name: "12", section: "B", class_teacher: "", class_teacher_id: null, total_students: 37, status: "active" }
];

// ==================== SUBJECTS (Master List) ====================
export const mockSubjects = [
  { id: 1, name: "Mathematics", code: "MATH", description: "Number theory, algebra, geometry, and calculus" },
  { id: 2, name: "English", code: "ENG", description: "Literature, grammar, and composition" },
  { id: 3, name: "Science", code: "SCI", description: "General science concepts" },
  { id: 4, name: "Physics", code: "PHY", description: "Mechanics, thermodynamics, and electromagnetism" },
  { id: 5, name: "Chemistry", code: "CHEM", description: "Organic and inorganic chemistry" },
  { id: 6, name: "Biology", code: "BIO", description: "Cell biology, genetics, and ecology" },
  { id: 7, name: "Economics", code: "ECO", description: "Microeconomics and macroeconomics" },
  { id: 8, name: "Computer Science", code: "CS", description: "Programming and computational thinking" },
  { id: 9, name: "Nepali", code: "NEP", description: "Nepali language and literature" },
  { id: 10, name: "Social Studies", code: "SOC", description: "History, geography, and civics" }
];

// ==================== CLASS SUBJECTS ====================
export const mockClassSubjects = [
  // Class 9
  { id: 1, classroom: 1, classroom_name: "9", subject: 1, subject_name: "Mathematics", subject_code: "MATH-9", full_marks: 100, pass_marks: 40, theory_marks: 70, practical_marks: 30, is_optional: false },
  { id: 2, classroom: 1, classroom_name: "9", subject: 2, subject_name: "English", subject_code: "ENG-9", full_marks: 100, pass_marks: 35, theory_marks: 100, practical_marks: 0, is_optional: false },
  { id: 3, classroom: 1, classroom_name: "9", subject: 3, subject_name: "Science", subject_code: "SCI-9", full_marks: 100, pass_marks: 40, theory_marks: 60, practical_marks: 40, is_optional: false },
  { id: 4, classroom: 1, classroom_name: "9", subject: 9, subject_name: "Nepali", subject_code: "NEP-9", full_marks: 100, pass_marks: 35, theory_marks: 100, practical_marks: 0, is_optional: false },
  { id: 5, classroom: 1, classroom_name: "9", subject: 10, subject_name: "Social Studies", subject_code: "SOC-9", full_marks: 100, pass_marks: 35, theory_marks: 100, practical_marks: 0, is_optional: false },
  // Class 10
  { id: 6, classroom: 2, classroom_name: "10", subject: 1, subject_name: "Mathematics", subject_code: "MATH-10", full_marks: 100, pass_marks: 40, theory_marks: 70, practical_marks: 30, is_optional: false },
  { id: 7, classroom: 2, classroom_name: "10", subject: 2, subject_name: "English", subject_code: "ENG-10", full_marks: 100, pass_marks: 35, theory_marks: 100, practical_marks: 0, is_optional: false },
  { id: 8, classroom: 2, classroom_name: "10", subject: 4, subject_name: "Physics", subject_code: "PHY-10", full_marks: 100, pass_marks: 40, theory_marks: 60, practical_marks: 40, is_optional: false },
  { id: 9, classroom: 2, classroom_name: "10", subject: 5, subject_name: "Chemistry", subject_code: "CHEM-10", full_marks: 100, pass_marks: 40, theory_marks: 60, practical_marks: 40, is_optional: false },
  { id: 10, classroom: 2, classroom_name: "10", subject: 9, subject_name: "Nepali", subject_code: "NEP-10", full_marks: 100, pass_marks: 35, theory_marks: 100, practical_marks: 0, is_optional: false },
  // Class 11
  { id: 11, classroom: 3, classroom_name: "11", subject: 1, subject_name: "Mathematics", subject_code: "MATH-11", full_marks: 100, pass_marks: 40, theory_marks: 70, practical_marks: 30, is_optional: false },
  { id: 12, classroom: 3, classroom_name: "11", subject: 4, subject_name: "Physics", subject_code: "PHY-11", full_marks: 100, pass_marks: 40, theory_marks: 60, practical_marks: 40, is_optional: false },
  { id: 13, classroom: 3, classroom_name: "11", subject: 5, subject_name: "Chemistry", subject_code: "CHEM-11", full_marks: 100, pass_marks: 40, theory_marks: 60, practical_marks: 40, is_optional: false },
  { id: 14, classroom: 3, classroom_name: "11", subject: 6, subject_name: "Biology", subject_code: "BIO-11", full_marks: 100, pass_marks: 35, theory_marks: 60, practical_marks: 40, is_optional: true },
  { id: 15, classroom: 3, classroom_name: "11", subject: 8, subject_name: "Computer Science", subject_code: "CS-11", full_marks: 100, pass_marks: 40, theory_marks: 50, practical_marks: 50, is_optional: true },
  // Class 12
  { id: 16, classroom: 4, classroom_name: "12", subject: 1, subject_name: "Mathematics", subject_code: "MATH-12", full_marks: 100, pass_marks: 40, theory_marks: 70, practical_marks: 30, is_optional: false },
  { id: 17, classroom: 4, classroom_name: "12", subject: 4, subject_name: "Physics", subject_code: "PHY-12", full_marks: 100, pass_marks: 40, theory_marks: 60, practical_marks: 40, is_optional: false },
  { id: 18, classroom: 4, classroom_name: "12", subject: 5, subject_name: "Chemistry", subject_code: "CHEM-12", full_marks: 100, pass_marks: 40, theory_marks: 60, practical_marks: 40, is_optional: false },
  { id: 19, classroom: 4, classroom_name: "12", subject: 7, subject_name: "Economics", subject_code: "ECO-12", full_marks: 100, pass_marks: 35, theory_marks: 100, practical_marks: 0, is_optional: true }
];

// ==================== TEACHER ASSIGNMENTS ====================
export const mockTeacherAssignments = [
  { id: 1, class_subject: 1, class_subject_code: "MATH-9", classroom_name: "9", section: "A", teacher: 1, teacher_name: "Ram Bahadur Sharma" },
  { id: 2, class_subject: 1, class_subject_code: "MATH-9", classroom_name: "9", section: "B", teacher: 1, teacher_name: "Ram Bahadur Sharma" },
  { id: 3, class_subject: 2, class_subject_code: "ENG-9", classroom_name: "9", section: "A", teacher: 2, teacher_name: "Sushila Karki" },
  { id: 4, class_subject: 2, class_subject_code: "ENG-9", classroom_name: "9", section: "B", teacher: 4, teacher_name: "Gita Singh" },
  { id: 5, class_subject: 3, class_subject_code: "SCI-9", classroom_name: "9", section: "A", teacher: 3, teacher_name: "Hari Prasad Thapa" },
  { id: 6, class_subject: 6, class_subject_code: "MATH-10", classroom_name: "10", section: "A", teacher: 1, teacher_name: "Ram Bahadur Sharma" },
  { id: 7, class_subject: 8, class_subject_code: "PHY-10", classroom_name: "10", section: "A", teacher: 5, teacher_name: "Dr. Deepak Rana" },
  { id: 8, class_subject: 12, class_subject_code: "PHY-11", classroom_name: "11", section: "A", teacher: 5, teacher_name: "Dr. Deepak Rana" }
];

// ==================== STUDENT RESULTS ====================
export const mockStudentResults = [
  {
    id: 1,
    exam_name: "First Term Examination",
    year: "2024",
    student_class: "10",
    section: "A",
    date: "2024-04-15",
    total_marks: 500,
    obtained_marks: 423,
    percentage: 84.6,
    grade: "A",
    rank: 5,
    subjects: [
      { name: "Mathematics", code: "MATH-10", full_marks: 100, obtained: 85, grade: "A" },
      { name: "English", code: "ENG-10", full_marks: 100, obtained: 78, grade: "B+" },
      { name: "Physics", code: "PHY-10", full_marks: 100, obtained: 92, grade: "A+" },
      { name: "Chemistry", code: "CHEM-10", full_marks: 100, obtained: 80, grade: "A" },
      { name: "Nepali", code: "NEP-10", full_marks: 100, obtained: 88, grade: "A+" }
    ]
  },
  {
    id: 2,
    exam_name: "Mid Term Examination",
    year: "2024",
    student_class: "10",
    section: "A",
    date: "2024-08-20",
    total_marks: 500,
    obtained_marks: 445,
    percentage: 89.0,
    grade: "A+",
    rank: 3,
    subjects: [
      { name: "Mathematics", code: "MATH-10", full_marks: 100, obtained: 90, grade: "A+" },
      { name: "English", code: "ENG-10", full_marks: 100, obtained: 85, grade: "A" },
      { name: "Physics", code: "PHY-10", full_marks: 100, obtained: 95, grade: "A+" },
      { name: "Chemistry", code: "CHEM-10", full_marks: 100, obtained: 87, grade: "A+" },
      { name: "Nepali", code: "NEP-10", full_marks: 100, obtained: 88, grade: "A+" }
    ]
  },
  {
    id: 3,
    exam_name: "Final Examination",
    year: "2023",
    student_class: "9",
    section: "A",
    date: "2023-12-10",
    total_marks: 500,
    obtained_marks: 398,
    percentage: 79.6,
    grade: "B+",
    rank: 8,
    subjects: [
      { name: "Mathematics", code: "MATH-9", full_marks: 100, obtained: 78, grade: "B+" },
      { name: "English", code: "ENG-9", full_marks: 100, obtained: 82, grade: "A" },
      { name: "Science", code: "SCI-9", full_marks: 100, obtained: 88, grade: "A+" },
      { name: "Social Studies", code: "SOC-9", full_marks: 100, obtained: 70, grade: "B" },
      { name: "Nepali", code: "NEP-9", full_marks: 100, obtained: 80, grade: "A" }
    ]
  }
];

// ==================== ANNOUNCEMENTS ====================
export const mockAnnouncements = [
  {
    id: 1,
    title: "Annual Sports Day Announcement",
    description: "We are excited to announce that our Annual Sports Day will be held on January 25th, 2026. All students are required to participate in at least one event. Registration forms are available at the sports department.",
    contentType: "message",
    recipients: {
      type: "all_students",
      classes: [],
      sections: []
    },
    deliveryChannel: ["web", "email"],
    status: "sent",
    scheduledDate: null,
    sentAt: "2026-01-15T10:00:00",
    createdAt: "2026-01-15T09:30:00",
    createdBy: "Admin User",
    imageUrl: null,
    linkUrl: null
  },
  {
    id: 2,
    title: "Class 10 Board Exam Schedule",
    description: "The board examination schedule for Class 10 has been released. Please click the link below to download the complete timetable and guidelines.",
    contentType: "link",
    recipients: {
      type: "all_students",
      classes: [],
      sections: []
    },
    deliveryChannel: ["web", "email"],
    status: "sent",
    scheduledDate: null,
    sentAt: "2026-01-14T14:30:00",
    createdAt: "2026-01-14T14:00:00",
    createdBy: "Admin User",
    imageUrl: null,
    linkUrl: "https://edlas.edu.np/board-exam-schedule-2026"
  },
  {
    id: 3,
    title: "Parent-Teacher Meeting Reminder",
    description: "A reminder that the Parent-Teacher Meeting for Class 9A and 9B is scheduled for tomorrow. Parents are requested to be present at the school auditorium by 10:00 AM.",
    contentType: "message",
    recipients: {
      type: "all_students",
      classes: [],
      sections: []
    },
    deliveryChannel: ["email"],
    status: "scheduled",
    scheduledDate: "2026-01-18T08:00:00",
    sentAt: null,
    createdAt: "2026-01-16T11:00:00",
    createdBy: "Admin User",
    imageUrl: null,
    linkUrl: null
  },
  {
    id: 4,
    title: "Staff Training Workshop",
    description: "All teaching staff are required to attend the professional development workshop on modern teaching methodologies. The workshop will be conducted by Dr. Sharma from the Education Board.",
    contentType: "blog",
    recipients: {
      type: "all_staff",
      classes: [],
      sections: []
    },
    deliveryChannel: ["web"],
    status: "sent",
    scheduledDate: null,
    sentAt: "2026-01-13T09:00:00",
    createdAt: "2026-01-12T16:00:00",
    createdBy: "Admin User",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    linkUrl: null
  },
  {
    id: 5,
    title: "School Holiday Notice",
    description: "The school will remain closed on January 26th, 2026 on account of Republic Day. Regular classes will resume on January 27th.",
    contentType: "message",
    recipients: {
      type: "whole_school",
      classes: [],
      sections: []
    },
    deliveryChannel: ["web", "email"],
    status: "scheduled",
    scheduledDate: "2026-01-24T07:00:00",
    sentAt: null,
    createdAt: "2026-01-17T10:00:00",
    createdBy: "Admin User",
    imageUrl: null,
    linkUrl: null
  },
  {
    id: 6,
    title: "New Library Resources Available",
    description: "We have added 500+ new books to our library including fiction, non-fiction, and reference materials. Students can now access digital resources through our new e-library portal.",
    contentType: "blog",
    recipients: {
      type: "all_students",
      classes: [],
      sections: []
    },
    deliveryChannel: ["web"],
    status: "draft",
    scheduledDate: null,
    sentAt: null,
    createdAt: "2026-01-17T08:00:00",
    createdBy: "Admin User",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
    linkUrl: null
  }
];

// ==================== ASSIGNMENTS ====================
export const mockAssignments = [
  {
    id: 1,
    classSubjectId: 6,
    classSubjectCode: "MATH-10",
    className: "10",
    section: "A",
    subjectName: "Mathematics",
    title: "Chapter 5: Quadratic Equations - Practice Set",
    description: "Complete exercises 1-15 from Chapter 5. Show all your working steps clearly. Submit handwritten solutions.",
    dueDate: "2026-01-25T23:59:00",
    allowLateSubmission: true,
    lateDeadline: "2026-01-28T23:59:00",
    attachmentUrl: null,
    totalMarks: 50,
    createdBy: 1,
    createdByName: "Ram Bahadur Sharma",
    createdAt: "2026-01-10T10:00:00",
    status: "active"
  },
  {
    id: 2,
    classSubjectId: 6,
    classSubjectCode: "MATH-10",
    className: "10",
    section: "A",
    subjectName: "Mathematics",
    title: "Chapter 6: Arithmetic Progression",
    description: "Solve all problems from exercise 6.1 and 6.2. Focus on word problems.",
    dueDate: "2026-01-20T23:59:00",
    allowLateSubmission: false,
    lateDeadline: null,
    attachmentUrl: null,
    totalMarks: 30,
    createdBy: 1,
    createdByName: "Ram Bahadur Sharma",
    createdAt: "2026-01-08T14:00:00",
    status: "active"
  },
  {
    id: 3,
    classSubjectId: 8,
    classSubjectCode: "PHY-10",
    className: "10",
    section: "A",
    subjectName: "Physics",
    title: "Light and Reflection Lab Report",
    description: "Write a detailed lab report on the experiment conducted in class. Include diagrams, observations, and conclusions.",
    dueDate: "2026-01-22T23:59:00",
    allowLateSubmission: true,
    lateDeadline: "2026-01-24T23:59:00",
    attachmentUrl: "https://example.com/lab-template.pdf",
    totalMarks: 40,
    createdBy: 5,
    createdByName: "Dr. Deepak Rana",
    createdAt: "2026-01-12T09:00:00",
    status: "active"
  },
  {
    id: 4,
    classSubjectId: 1,
    classSubjectCode: "MATH-9",
    className: "9",
    section: "A",
    subjectName: "Mathematics",
    title: "Linear Equations Worksheet",
    description: "Complete the attached worksheet on linear equations in two variables.",
    dueDate: "2026-01-18T23:59:00",
    allowLateSubmission: false,
    lateDeadline: null,
    attachmentUrl: null,
    totalMarks: 25,
    createdBy: 1,
    createdByName: "Ram Bahadur Sharma",
    createdAt: "2026-01-05T11:00:00",
    status: "active"
  },
  {
    id: 5,
    classSubjectId: 1,
    classSubjectCode: "MATH-9",
    className: "9",
    section: "B",
    subjectName: "Mathematics",
    title: "Linear Equations Worksheet",
    description: "Complete the attached worksheet on linear equations in two variables.",
    dueDate: "2026-01-18T23:59:00",
    allowLateSubmission: false,
    lateDeadline: null,
    attachmentUrl: null,
    totalMarks: 25,
    createdBy: 1,
    createdByName: "Ram Bahadur Sharma",
    createdAt: "2026-01-05T11:00:00",
    status: "active"
  },
  {
    id: 6,
    classSubjectId: 12,
    classSubjectCode: "PHY-11",
    className: "11",
    section: "A",
    subjectName: "Physics",
    title: "Thermodynamics Problem Set",
    description: "Solve problems 1-10 from the thermodynamics chapter. Include all derivations.",
    dueDate: "2026-01-30T23:59:00",
    allowLateSubmission: true,
    lateDeadline: "2026-02-02T23:59:00",
    attachmentUrl: null,
    totalMarks: 50,
    createdBy: 5,
    createdByName: "Dr. Deepak Rana",
    createdAt: "2026-01-15T10:00:00",
    status: "active"
  }
];

// ==================== SUBMISSIONS ====================
export const mockSubmissions = [
  {
    id: 1,
    assignmentId: 1,
    studentId: 1,
    studentName: "Aarav Sharma",
    studentRollNo: 1,
    submittedAt: "2026-01-20T14:30:00",
    fileUrl: "https://example.com/submissions/aarav-math-ch5.pdf",
    fileName: "quadratic_solutions.pdf",
    status: "submitted",
    grade: null,
    feedback: null
  },
  {
    id: 2,
    assignmentId: 1,
    studentId: 2,
    studentName: "Sita Kumari Thapa",
    studentRollNo: 2,
    submittedAt: "2026-01-24T22:45:00",
    fileUrl: "https://example.com/submissions/sita-math-ch5.pdf",
    fileName: "chapter5_homework.pdf",
    status: "submitted",
    grade: 42,
    feedback: "Good work! Minor calculation errors in Q12."
  },
  {
    id: 3,
    assignmentId: 2,
    studentId: 1,
    studentName: "Aarav Sharma",
    studentRollNo: 1,
    submittedAt: "2026-01-19T18:00:00",
    fileUrl: "https://example.com/submissions/aarav-math-ap.pdf",
    fileName: "arithmetic_progression.pdf",
    status: "graded",
    grade: 28,
    feedback: "Excellent work on word problems!"
  },
  {
    id: 4,
    assignmentId: 3,
    studentId: 1,
    studentName: "Aarav Sharma",
    studentRollNo: 1,
    submittedAt: "2026-01-21T16:20:00",
    fileUrl: "https://example.com/submissions/aarav-phy-lab.pdf",
    fileName: "light_reflection_report.pdf",
    status: "submitted",
    grade: null,
    feedback: null
  },
  {
    id: 5,
    assignmentId: 4,
    studentId: 4,
    studentName: "Priya Rana",
    studentRollNo: 4,
    submittedAt: "2026-01-17T20:00:00",
    fileUrl: "https://example.com/submissions/priya-linear-eq.pdf",
    fileName: "linear_equations.pdf",
    status: "graded",
    grade: 23,
    feedback: "Very good understanding!"
  }
];

// ==================== HELPER FUNCTIONS ====================
export const getSubjectName = (subjectId) => {
  const subject = mockSubjects.find(s => s.id === subjectId);
  return subject ? subject.name : "Unknown";
};

export const getTeacherName = (teacherId) => {
  const teacher = mockStaff.find(s => s.id === teacherId);
  return teacher ? teacher.full_name : "Not Assigned";
};

export const getActiveTeachers = () => {
  return mockStaff.filter(s => s.role === "Teacher" && s.status === "active");
};

export const allClasses = ["9", "10", "11", "12"];
export const allSections = ["A", "B", "C"];
