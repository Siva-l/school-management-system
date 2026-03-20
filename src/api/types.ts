export interface ApiResponse<T> {
  timestamp: string;
  statusCode: number;
  success: boolean;
  data: {
    results: T;
    
      page: number;
      size: number;
      totalCount: number;
      totalPages: number;
    
  };
}

export interface Student {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  admissionNo: string;
  dob: string;
  gender: string;
  phone: string;
  imageUrl:string;
}

export type CreateStudentInput = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;

export interface Teacher {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export type CreateTeacherInput = Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>;

export interface Subject {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  code: string;
}

export type CreateSubjectInput = Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>;
