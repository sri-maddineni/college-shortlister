export type Exam = 'IELTS' | 'GRE' | 'TOEFL' | 'Duolingo';

export type AdmissionStatus = 'Need to Apply' | 'Applied' | 'Admission Received' | 'Admission Not Obtained';

export interface ExamScore {
    exam: Exam;
    score: number;
}

export interface College {
    id?: string;
    institutionName: string;
    courseName: string;
    location: {
        city: string;
        country: string;
    };
    tuitionFee: number;
    numberOfSemesters: number;
    applicationDeadline: string;
    requiredExams: ExamScore[];
    description: string;
    admissionStatus: AdmissionStatus;
    email: string;
    phoneNumber: string;
}

export type CollegeFormData = Omit<College, 'id'>; 