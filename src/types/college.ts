export type Exam = 'IELTS' | 'GRE' | 'TOEFL' | 'Duolingo';

export type AdmissionStatus = 'Need to Apply' | 'Applied' | 'Admission Received' | 'Admission Not Obtained';

export interface ExamScore {
    exam: Exam;
    score: number;
}

export interface College {
    id?: string;
    name: string;
    country: string;
    city: string;
    program: string;
    semesters: number;
    tuitionFee: number;
    applicationDeadline: string;
    admissionStatus: AdmissionStatus;
    ieltsScore: number;
    email: string;
    phoneNumber: string;
}

export type CollegeFormData = Omit<College, 'id'>; 