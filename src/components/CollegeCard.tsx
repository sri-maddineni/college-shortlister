import { College } from '../types/college';

interface CollegeCardProps {
    college: College;
    onEdit: (college: College) => void;
    onDelete: (college: College) => void;
}

export default function CollegeCard({ college, onEdit, onDelete }: CollegeCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Need to Apply':
                return 'bg-yellow-100 text-yellow-800';
            case 'Applied':
                return 'bg-blue-100 text-blue-800';
            case 'Admission Received':
                return 'bg-green-100 text-green-800';
            case 'Admission Not Obtained':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{college.name}</h3>
                    <p className="text-sm text-gray-500">{college.city}, {college.country}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(college.admissionStatus)}`}>
                    {college.admissionStatus}
                </span>
            </div>

            <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Program:</span> {college.program}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Tuition Fee:</span> ${college.tuitionFee.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Semesters:</span> {college.semesters}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Application Deadline:</span>{' '}
                    {new Date(college.applicationDeadline).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">IELTS Score:</span> {college.ieltsScore}
                </p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                    onClick={() => onEdit(college)}
                    className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(college)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                    Delete
                </button>
            </div>
        </div>
    );
} 