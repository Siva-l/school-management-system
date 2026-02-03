/**
 * Generic API Response Structure
 */
export interface ApiResponse<T> {
  timestamp: string;
  statusCode: number;
  success: boolean;
  data: T;
}

/**
 * Class Entity
 */
export interface Class {
  id: string;
  createdAt: string;
  updatedAt: string;
  grade: number;
  description: string;
  passedStudentsCount: number;
}

/**
 * Division Entity
 */
export interface Division {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  classId: string;
  class?: Class;
}

/**
 * Student Enrollment Entity
 */
export interface StudentEnrollment {
  id: string;
  createdAt: string;
  updatedAt: string;
  studentId: string;
  divisionId: string;
  status: 'ACTIVE' | 'INACTIVE';
  division?: Division;
}

/**
 * Student Entity
 */
export interface Student {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  admissionNo: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  studentEnrollments: StudentEnrollment[];
  grade?: string | number;
  enrollmentDate?: string;
}

export interface Teacher {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}
