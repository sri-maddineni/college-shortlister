export type Exam = 'IELTS' | 'GRE' | 'TOEFL' | 'Duolingo';

export interface College {
    id: string;
    collegeName: string;
    universityName: string;
    location: {
        city: string;
        country: string;
    };
    tuitionFee: number;
    numberOfSemesters: number;
    applicationDeadline: string;
    requiredExams: Exam[];
    description?: string;
}

export type CollegeFormData = Omit<College, 'id'>; 