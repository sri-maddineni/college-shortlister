import { useState, useEffect } from 'react';
import { College, CollegeFormData, Exam, ExamScore } from '../types/college';

interface CollegeFormProps {
    initialData?: College;
    onSubmit: (data: CollegeFormData) => void;
    onCancel: () => void;
}

const EXAMS: Exam[] = ['IELTS', 'GRE', 'TOEFL', 'Duolingo'];

export default function CollegeForm({ initialData, onSubmit, onCancel }: CollegeFormProps) {
    const [formData, setFormData] = useState<CollegeFormData>({
        institutionName: '',
        courseName: '',
        location: {
            city: '',
            country: '',
        },
        tuitionFee: 0,
        numberOfSemesters: 2,
        applicationDeadline: '',
        requiredExams: [],
        description: '',
    });

    useEffect(() => {
        if (initialData) {
            const { ...data } = initialData;
            setFormData(data);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleExamChange = (exam: Exam, score: number) => {
        setFormData((prev) => {
            const existingExamIndex = prev.requiredExams.findIndex((e) => e.exam === exam);
            const updatedExams = [...prev.requiredExams];

            if (existingExamIndex >= 0) {
                if (score > 0) {
                    updatedExams[existingExamIndex] = { exam, score };
                } else {
                    updatedExams.splice(existingExamIndex, 1);
                }
            } else if (score > 0) {
                updatedExams.push({ exam, score });
            }

            return {
                ...prev,
                requiredExams: updatedExams,
            };
        });
    };

    const getExamScore = (exam: Exam): number => {
        const examScore = formData.requiredExams.find((e) => e.exam === exam);
        return examScore?.score || 0;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Institution Name</label>
                    <input
                        type="text"
                        required
                        value={formData.institutionName}
                        onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                        placeholder="Enter course name (e.g., Master of Computer Science)"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                        type="text"
                        required
                        value={formData.location.city}
                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                        type="text"
                        required
                        value={formData.location.country}
                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, country: e.target.value } })}
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
                        onChange={(e) => setFormData({ ...formData, tuitionFee: Number(e.target.value) })}
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
                        onChange={(e) => setFormData({ ...formData, numberOfSemesters: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                    <input
                        type="date"
                        required
                        value={formData.applicationDeadline}
                        onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
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
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2">{exam}</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={exam === 'IELTS' ? 9 : exam === 'TOEFL' ? 120 : exam === 'GRE' ? 340 : 160}
                                    step={exam === 'IELTS' ? 0.5 : 1}
                                    value={getExamScore(exam)}
                                    onChange={(e) => handleExamChange(exam, Number(e.target.value))}
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
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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