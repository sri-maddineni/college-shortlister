import { College } from '../types/college';

interface CollegeCardProps {
    college: College;
    onEdit: (college: College) => void;
    onDelete: (college: College) => void;
}

export default function CollegeCard({ college, onEdit, onDelete }: CollegeCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status: College['admissionStatus']) => {
        switch (status) {
            case 'Admission Received':
                return 'bg-green-100 text-green-800';
            case 'Applied':
                return 'bg-blue-100 text-blue-800';
            case 'Admission Not Obtained':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{college.institutionName}</h3>
                    <p className="text-sm text-gray-600">{college.courseName}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(college.admissionStatus)}`}>
                    {college.admissionStatus}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium">{college.location.city}, {college.location.country}</p>
                </div>
                <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium">{college.numberOfSemesters} semesters</p>
                </div>
                <div>
                    <p className="text-gray-600">Tuition Fee</p>
                    <p className="font-medium">{formatCurrency(college.tuitionFee)}</p>
                </div>
                <div>
                    <p className="text-gray-600">Application Deadline</p>
                    <p className="font-medium">{formatDate(college.applicationDeadline)}</p>
                </div>
            </div>

            <div>
                <p className="text-gray-600 text-sm mb-2">Required Exams</p>
                <div className="space-y-2">
                    {college.requiredExams.map((exam, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="text-sm font-medium">{exam.exam}:</span>
                            <span className="text-sm">{exam.score}</span>
                        </div>
                    ))}
                </div>
            </div>

            {college.description && (
                <div>
                    <p className="text-gray-600 text-sm mb-2">Description</p>
                    <p className="text-sm text-gray-900">{college.description}</p>
                </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
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