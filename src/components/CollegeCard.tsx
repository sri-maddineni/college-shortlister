import { College } from '../types/college';
import { format } from 'date-fns';

interface CollegeCardProps {
    college: College;
    onEdit: (college: College) => void;
    onDelete: (id: string) => void;
}

export default function CollegeCard({ college, onEdit, onDelete }: CollegeCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{college.collegeName}</h3>
                    <p className="text-gray-600">{college.universityName}</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(college)}
                        className="text-indigo-600 hover:text-indigo-900"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(college.id)}
                        className="text-red-600 hover:text-red-900"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                    <span className="font-medium">Location:</span> {college.location.city}, {college.location.country}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium">Tuition Fee:</span> ${college.tuitionFee.toLocaleString()}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium">Semesters:</span> {college.numberOfSemesters}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium">Application Deadline:</span>{' '}
                    {format(new Date(college.applicationDeadline), 'MMMM d, yyyy')}
                </p>
                <div className="text-gray-600">
                    <span className="font-medium">Required Exams:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                        {college.requiredExams.map((exam) => (
                            <span
                                key={exam}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                                {exam}
                            </span>
                        ))}
                    </div>
                </div>
                {college.description && (
                    <p className="text-gray-600 mt-2">
                        <span className="font-medium">Notes:</span> {college.description}
                    </p>
                )}
            </div>
        </div>
    );
} 