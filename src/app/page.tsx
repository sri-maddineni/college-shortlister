'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { College, CollegeFormData, Exam } from '../types/college';
import { getColleges, addCollege, updateCollege, deleteCollege } from '../utils/storage';
import { exportToPDF, exportToWord } from '../utils/export';
import CollegeForm from '../components/CollegeForm';
import CollegeCard from '../components/CollegeCard';

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | undefined>();
  const [filterExam, setFilterExam] = useState<Exam | ''>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setColleges(getColleges());
    setIsLoading(false);
  }, []);

  const handleSubmit = (data: CollegeFormData) => {
    if (editingCollege) {
      const updatedCollege = { ...data, id: editingCollege.id };
      updateCollege(updatedCollege);
      setColleges(getColleges());
      setEditingCollege(undefined);
    } else {
      const newCollege = { ...data, id: uuidv4() };
      addCollege(newCollege);
      setColleges(getColleges());
    }
    setShowForm(false);
  };

  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      deleteCollege(id);
      setColleges(getColleges());
    }
  };

  const handleExportPDF = () => {
    exportToPDF(filteredColleges);
  };

  const handleExportWord = async () => {
    await exportToWord(filteredColleges);
  };

  const filteredColleges = colleges.filter((college) => {
    const matchesExam = !filterExam || college.requiredExams.includes(filterExam);
    const matchesLocation = !filterLocation ||
      college.location.city.toLowerCase().includes(filterLocation.toLowerCase()) ||
      college.location.country.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesExam && matchesLocation;
  });

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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Colleges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Exam</label>
              <select
                value={filterExam}
                onChange={(e) => setFilterExam(e.target.value as Exam)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Exams</option>
                <option value="IELTS">IELTS</option>
                <option value="GRE">GRE</option>
                <option value="TOEFL">TOEFL</option>
                <option value="Duolingo">Duolingo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Location</label>
              <div className="relative">
                <input
                  type="text"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  placeholder="Search by city or country"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
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
            {filteredColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredColleges.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No colleges found</h3>
            <p className="mt-2 text-gray-500">Get started by adding your first college to the list.</p>
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
