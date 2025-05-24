'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { College, AdmissionStatus } from '../types/college';
import { getColleges as getLocalColleges, addCollege as addLocalCollege, updateCollege as updateLocalCollege, deleteCollege as deleteLocalCollege } from '../utils/storage';
import { exportToPDF, exportToWord } from '../utils/export';
import CollegeForm from '../components/CollegeForm';
import CollegeCard from '../components/CollegeCard';

type SortOption = 'deadline-asc' | 'deadline-desc' | 'fee-asc' | 'fee-desc';
type FeeRange = '0-10000' | '10000-20000' | '20000-30000' | '30000-40000' | '40000+';

const ADMISSION_STATUSES: AdmissionStatus[] = ['Deadline passed', 'To apply', 'Applied', 'Admission Received', 'Admission Not Obtained'];

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | undefined>(undefined);
  // const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [feeRange, setFeeRange] = useState<FeeRange | ''>('');
  const [sortBy, setSortBy] = useState<SortOption>('deadline-asc');
  const [selectedStatus, setSelectedStatus] = useState<AdmissionStatus | ''>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setColleges(getLocalColleges());
    setIsLoading(false);
  }, []);

  const handleSubmit = async (data: College) => {
    try {
      if (editingCollege) {
        // Update existing college
        const updatedCollege = { ...data, id: editingCollege.id };
        updateLocalCollege(updatedCollege);
      } else {
        // Add new college
        const newCollege = { ...data, id: uuidv4() };
        addLocalCollege(newCollege);
      }
      setColleges(getLocalColleges());
      setEditingCollege(undefined);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving college:', error);
      alert('Failed to save college. Please try again.');
    }
  };

  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setShowForm(true);
  };

  const handleDelete = async (college: College) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        deleteLocalCollege(college.id!);
        //await deleteFirebaseCollege(college);
        setColleges(getLocalColleges());
      } catch (error) {
        console.error('Error deleting college:', error);
        alert('Failed to delete college. Please try again.');
      }
    }
  };

  const getFeeRangeLimits = (range: FeeRange): [number, number] => {
    switch (range) {
      case '0-10000': return [0, 10000];
      case '10000-20000': return [10000, 20000];
      case '20000-30000': return [20000, 30000];
      case '30000-40000': return [30000, 40000];
      case '40000+': return [40000, Infinity];
      default: return [0, Infinity];
    }
  };

  const sortColleges = (colleges: College[]): College[] => {
    return [...colleges].sort((a, b) => {
      switch (sortBy) {
        case 'deadline-asc':
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        case 'deadline-desc':
          return new Date(b.applicationDeadline).getTime() - new Date(a.applicationDeadline).getTime();
        case 'fee-asc':
          return a.tuitionFee - b.tuitionFee;
        case 'fee-desc':
          return b.tuitionFee - a.tuitionFee;
        default:
          return 0;
      }
    });
  };

  const filteredAndSortedColleges = sortColleges(
    colleges.filter((college) => {
      // const matchesCountry = !selectedCountry || college.location.country === selectedCountry;
      const [minFee, maxFee] = getFeeRangeLimits(feeRange as FeeRange);
      const matchesFeeRange = college.tuitionFee >= minFee && college.tuitionFee <= maxFee;
      const matchesStatus = !selectedStatus || college.admissionStatus === selectedStatus;
      const matchesCourse = !selectedCourse || college.courseName === selectedCourse;
      return matchesFeeRange && matchesStatus && matchesCourse; //matchesCountry
    })
  );

  //const uniqueCountries = Array.from(new Set(colleges.map(college => college.location.country)));

  const uniqueCourses = Array.from(new Set(colleges.map(college => college.courseName)));

  const handleExportPDF = () => {
    exportToPDF(filteredAndSortedColleges);
  };

  const handleExportWord = () => {
    exportToWord(filteredAndSortedColleges);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">College Shortlister</h1>
              <p className="text-indigo-100 mt-1">Manage your college applications efficiently</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const colleges = getLocalColleges();
                  navigator.clipboard.writeText(JSON.stringify(colleges, null, 2));
                  alert('Colleges data copied to clipboard!');
                }}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 flex items-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Copy JSON
              </button>
              <button
                onClick={() => {
                  const json = prompt('Paste your colleges JSON data:');
                  if (json) {
                    try {
                      const colleges = JSON.parse(json);
                      if (Array.isArray(colleges)) {
                        // Clear existing colleges and add new ones
                        colleges.forEach(college => {
                          if (!college.id) {
                            college.id = uuidv4();
                          }
                          addLocalCollege(college);
                        });
                        setColleges(getLocalColleges());
                        alert('Colleges data imported successfully!');
                      } else {
                        alert('Invalid JSON format. Expected an array of colleges.');
                      }
                    } catch (error) {
                      alert('Invalid JSON data. Please check the format.');
                      console.error('Invalid JSON data:', error);
                    }
                  }
                }}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 flex items-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                  <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v5h-4.586l1.293-1.293a1 1 0 10-1.414 1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                </svg>
                Paste JSON
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 flex items-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Export PDF
              </button>
              <button
                onClick={handleExportWord}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 flex items-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Export Word
              </button>
              <button
                onClick={() => {
                  setEditingCollege(undefined);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 flex items-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add College
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter and Sort Colleges</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Countries</option>
                {uniqueCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div> */}


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tuition Fee Range</label>
              <select
                value={feeRange}
                onChange={(e) => setFeeRange(e.target.value as FeeRange)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Fees</option>
                <option value="0-10000">$0 - $10,000</option>
                <option value="10000-20000">$10,000 - $20,000</option>
                <option value="20000-30000">$20,000 - $30,000</option>
                <option value="30000-40000">$30,000 - $40,000</option>
                <option value="40000+">$40,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Courses</option>
                {uniqueCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admission Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as AdmissionStatus)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                {ADMISSION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="deadline-asc">Deadline (Earliest First)</option>
                <option value="deadline-desc">Deadline (Latest First)</option>
                <option value="fee-asc">Fee (Lowest First)</option>
                <option value="fee-desc">Fee (Highest First)</option>
              </select>
            </div>
          </div>
        </div>

        {/* College List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredAndSortedColleges.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No colleges found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters or add a new college.</p>
            <button
              onClick={() => {
                setEditingCollege(undefined);
                setShowForm(true);
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Add College
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCollege ? 'Edit College' : 'Add New College'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCollege(undefined);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CollegeForm
              initialData={editingCollege}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingCollege(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}



