import { College } from '../types/college';
import { format } from 'date-fns';

interface CollegeCardProps {
    college: College;
    onEdit: (college: College) => void;
    onDelete: (id: string) => void;
}

export default function CollegeCard({ college, onEdit, onDelete }: CollegeCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{college.institutionName}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {college.city}, {college.country}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(college)}
                            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(college.id!)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Course:</span> {college.courseName}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Tuition Fee:</span> ${college.tuitionFee.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Semesters:</span> {college.numberOfSemesters}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Deadline:</span>{' '}
                        {format(new Date(college.applicationDeadline), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span>{' '}
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${college.admissionStatus === 'Admission Received'
                                ? 'bg-green-100 text-green-800'
                                : college.admissionStatus === 'Applied'
                                    ? 'bg-blue-100 text-blue-800'
                                    : college.admissionStatus === 'Admission Not Obtained'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}
                        >
                            {college.admissionStatus}
                        </span>
                    </p>
                    {college.requiredExams.length > 0 && (
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Required Exams:</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {college.requiredExams.map((exam) => (
                                    <span
                                        key={exam.exam}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                    >
                                        {exam.exam}: {exam.score}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {college.description && (
                        <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Notes:</span> {college.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
} 