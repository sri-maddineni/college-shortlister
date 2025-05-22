import { College } from '../types/college';
import { format } from 'date-fns';

interface CollegeCardProps {
    college: College;
    onEdit: (college: College) => void;
    onDelete: (id: string) => void;
}

export default function CollegeCard({ college, onEdit, onDelete }: CollegeCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                            {college.institutionName}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {college.courseName}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            {college.location.city}, {college.location.country}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(college)}
                            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                            aria-label="Edit college"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(college.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Delete college"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Tuition Fee</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">${college.tuitionFee.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Semesters</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{college.numberOfSemesters}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Application Deadline</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                            {format(new Date(college.applicationDeadline), 'd MMMM yyyy')}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Required Exams</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {college.requiredExams.map((examScore) => (
                                <span
                                    key={examScore.exam}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                >
                                    {examScore.exam}: {examScore.score}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {college.description && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Notes</p>
                        <p className="mt-1 text-sm text-gray-600">{college.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
} 