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
