import { College } from '../types/college';

const STORAGE_KEY = 'colleges';

export const getColleges = (): College[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveColleges = (colleges: College[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colleges));
};

export const addCollege = (college: College): void => {
    const colleges = getColleges();
    colleges.push(college);
    saveColleges(colleges);
};

export const updateCollege = (updatedCollege: College): void => {
    const colleges = getColleges();
    const index = colleges.findIndex((c) => c.id === updatedCollege.id);
    if (index !== -1) {
        colleges[index] = updatedCollege;
        saveColleges(colleges);
    }
};

export const deleteCollege = (id: string): void => {
    const colleges = getColleges();
    const filteredColleges = colleges.filter((c) => c.id !== id);
    saveColleges(filteredColleges);
}; 