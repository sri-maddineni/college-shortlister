import { useState, useEffect } from 'react';
import { College, CollegeFormData, Exam } from '../types/college';

interface CollegeFormProps {
    initialData?: College;
    onSubmit: (data: CollegeFormData) => void;
    onCancel: () => void;
}

const EXAMS: Exam[] = ['IELTS', 'GRE', 'TOEFL', 'Duolingo'];

export default function CollegeForm({ initialData, onSubmit, onCancel }: CollegeFormProps) {
    const [formData, setFormData] = useState<CollegeFormData>({
        collegeName: '',
        universityName: '',
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
            const { id, ...data } = initialData;
            setFormData(data);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleExamChange = (exam: Exam) => {
        setFormData((prev) => ({
            ...prev,
            requiredExams: prev.requiredExams.includes(exam)
                ? prev.requiredExams.filter((e) => e !== exam)
                : [...prev.requiredExams, exam],
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">College Name</label>
                    <input
                        type="text"
                        required
                        value={formData.collegeName}
                        onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">University Name</label>
                    <input
                        type="text"
                        required
                        value={formData.universityName}
                        onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
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

                <div>
                    <label className="block text-sm font-medium text-gray-700">Required Exams</label>
                    <div className="mt-2 space-y-2">
                        {EXAMS.map((exam) => (
                            <label key={exam} className="inline-flex items-center mr-4">
                                <input
                                    type="checkbox"
                                    checked={formData.requiredExams.includes(exam)}
                                    onChange={() => handleExamChange(exam)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="ml-2">{exam}</span>
                            </label>
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