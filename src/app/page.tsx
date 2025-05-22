'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { College, CollegeFormData } from '../types/college';
import { getColleges, addCollege, updateCollege, deleteCollege } from '../utils/storage';
import { exportToPDF, exportToWord } from '../utils/export';
import CollegeForm from '../components/CollegeForm';
import CollegeCard from '../components/CollegeCard';

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | undefined>();
  const [filterExam, setFilterExam] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');

  useEffect(() => {
    setColleges(getColleges());
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

  const filteredColleges = colleges.filter((college) => {
    const matchesExam = !filterExam || college.requiredExams.includes(filterExam as any);
    const matchesLocation = !filterLocation ||
      college.location.city.toLowerCase().includes(filterLocation.toLowerCase()) ||
      college.location.country.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesExam && matchesLocation;
  });

  const handleExportPDF = () => {
    exportToPDF(filteredColleges);
  };

  const handleExportWord = async () => {
    await exportToWord(filteredColleges);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">College Shortlister</h1>
          <div className="flex gap-4">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Export PDF
            </button>
            <button
              onClick={handleExportWord}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Export Word
            </button>
            <button
              onClick={() => {
                setEditingCollege(undefined);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add College
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                {editingCollege ? 'Edit College' : 'Add New College'}
              </h2>
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

        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Filter by Exam</label>
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Exams</option>
              <option value="IELTS">IELTS</option>
              <option value="GRE">GRE</option>
              <option value="TOEFL">TOEFL</option>
              <option value="Duolingo">Duolingo</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Filter by Location</label>
            <input
              type="text"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              placeholder="Search by city or country"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

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

        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No colleges found. Add your first college to get started!</p>
          </div>
        )}
      </div>
    </main>
  );
}
