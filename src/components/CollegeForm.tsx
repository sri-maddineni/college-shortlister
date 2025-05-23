import { useState } from 'react';
import { College, AdmissionStatus } from '../types/college';
import { getUserData } from '../utils/storage';

interface CollegeFormProps {
    initialData?: College;
    onSubmit: (data: College) => void;
    onCancel: () => void;
}

const ADMISSION_STATUSES: AdmissionStatus[] = ['Need to Apply', 'Applied', 'Admission Received', 'Admission Not Obtained'];

export default function CollegeForm({ initialData, onSubmit, onCancel }: CollegeFormProps) {
    const userData = getUserData();
    const [formData, setFormData] = useState<College>({
        name: '',
        country: '',
        city: '',
        program: '',
        semesters: 4,
        tuitionFee: 0,
        applicationDeadline: '',
        admissionStatus: 'Need to Apply',
        ieltsScore: 6.5,
        email: userData?.email || '',
        phoneNumber: userData?.phoneNumber || '',
        ...initialData
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'tuitionFee' || name === 'semesters' || name === 'ieltsScore' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Institution Name
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        name="name"
                        placeholder="Enter college or university name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                        Program Name
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.program}
                        onChange={handleInputChange}
                        name="program"
                        placeholder="Enter course name (e.g., Master of Computer Science)"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        name="country"
                        placeholder="Enter country"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        name="city"
                        placeholder="Enter city"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="semesters" className="block text-sm font-medium text-gray-700">
                        Number of Semesters
                    </label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={formData.semesters}
                        onChange={handleInputChange}
                        name="semesters"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="tuitionFee" className="block text-sm font-medium text-gray-700">
                        Tuition Fee (USD)
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        value={formData.tuitionFee}
                        onChange={handleInputChange}
                        name="tuitionFee"
                        placeholder="Enter tuition fee in USD"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">
                        Application Deadline
                    </label>
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
                    <label htmlFor="admissionStatus" className="block text-sm font-medium text-gray-700">
                        Admission Status
                    </label>
                    <select
                        required
                        value={formData.admissionStatus}
                        onChange={handleInputChange}
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

                <div>
                    <label htmlFor="ieltsScore" className="block text-sm font-medium text-gray-700">
                        IELTS Score
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        max="9"
                        step="0.5"
                        value={formData.ieltsScore}
                        onChange={handleInputChange}
                        name="ieltsScore"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {!userData && (
                    <>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                name="email"
                                placeholder="Enter your email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                name="phoneNumber"
                                placeholder="Enter your phone number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {initialData ? 'Update College' : 'Add College'}
                </button>
            </div>
        </form>
    );
} 