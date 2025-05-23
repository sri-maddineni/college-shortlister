import { useState, useEffect } from 'react';
import { College, Exam, AdmissionStatus } from '../types/college';
import { v4 as uuidv4 } from 'uuid';
import { getUserData } from '../utils/storage';

interface CollegeFormProps {
    initialData?: College;
    onSubmit: (data: College) => void;
    onCancel: () => void;
}

const EXAMS: Exam[] = ['IELTS', 'GRE', 'TOEFL', 'Duolingo'];
const ADMISSION_STATUSES: AdmissionStatus[] = ['Need to Apply', 'Applied', 'Admission Received', 'Admission Not Obtained'];

const MAX_SCORES: Record<Exam, number> = {
    IELTS: 9,
    GRE: 340,
    TOEFL: 120,
    Duolingo: 160,
};

export default function CollegeForm({ initialData, onSubmit, onCancel }: CollegeFormProps) {
    const userData = getUserData();
    const [formData, setFormData] = useState<Omit<College, 'id'>>({
        institutionName: '',
        courseName: '',
        city: '',
        country: '',
        tuitionFee: 0,
        numberOfSemesters: 4,
        applicationDeadline: '',
        requiredExams: [],
        description: '',
        admissionStatus: 'Need to Apply',
        email: userData?.email || '',
        phoneNumber: userData?.phoneNumber || '',
    });

    useEffect(() => {
        if (initialData) {
            const { id, ...data } = initialData;
            setFormData(data);
        }
    }, [initialData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'tuitionFee' || name === 'numberOfSemesters' ? Number(value) : value,
        }));
    };

    const handleExamChange = (exam: Exam, score: number) => {
        setFormData((prev) => {
            const existingExamIndex = prev.requiredExams.findIndex((e) => e.exam === exam);
            const updatedExams = [...prev.requiredExams];

            if (existingExamIndex >= 0) {
                updatedExams[existingExamIndex] = { exam, score };
            } else {
                updatedExams.push({ exam, score });
            }

            return {
                ...prev,
                requiredExams: updatedExams,
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const getExamScore = (exam: Exam): number => {
        const examScore = formData.requiredExams.find((e) => e.exam === exam);
        return examScore?.score || 0;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {!userData && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            pattern="[0-9]{10}"
                            title="Please enter a 10-digit phone number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Institution Name</label>
                    <input
                        type="text"
                        required
                        value={formData.institutionName}
                        onChange={handleInputChange}
                        name="institutionName"
                        placeholder="Enter college or university name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Course Name</label>
                    <input
                        type="text"
                        required
                        value={formData.courseName}
                        onChange={handleInputChange}
                        name="courseName"
                        placeholder="Enter course name (e.g., Master of Computer Science)"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        name="city"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        name="country"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tuition Fee</label>
                    <input
                        type="number"
                        required
                        min="0"
                        value={formData.tuitionFee}
                        onChange={handleInputChange}
                        name="tuitionFee"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Semesters</label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={formData.numberOfSemesters}
                        onChange={handleInputChange}
                        name="numberOfSemesters"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                    <input
                        type="date"
                        required
                        value={formData.applicationDeadline}
                        onChange={handleInputChange}
                        name="applicationDeadline"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Admission Status</label>
                    <select
                        value={formData.admissionStatus}
                        onChange={(e) => setFormData({ ...formData, admissionStatus: e.target.value as AdmissionStatus })}
                        name="admissionStatus"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        {ADMISSION_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Exams and Scores</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {EXAMS.map((exam) => (
                            <div key={exam} className="flex items-center space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={getExamScore(exam) > 0}
                                        onChange={(e) => handleExamChange(exam, e.target.checked ? 0 : 0)}
                                        name={`${exam}Score`}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2">{exam}</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={MAX_SCORES[exam]}
                                    step={exam === 'IELTS' ? 0.5 : 1}
                                    value={getExamScore(exam)}
                                    onChange={(e) => handleExamChange(exam, Number(e.target.value))}
                                    name={`${exam}Score`}
                                    placeholder="Score"
                                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description/Notes</label>
                <textarea
                    value={formData.description}
                    onChange={handleInputChange}
                    name="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                    {initialData ? 'Update College' : 'Add College'}
                </button>
            </div>
        </form>
    );
} 