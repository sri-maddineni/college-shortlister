import { College } from '../types/college';

interface UserData {
    email: string;
    phoneNumber: string;
    colleges: College[];
}

const STORAGE_KEY = 'college-shortlister-data';

export const getUserData = (): UserData | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
};

export const setUserData = (data: UserData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getColleges = (): College[] => {
    const data = getUserData();
    return data?.colleges || [];
};

export const addCollege = (college: College) => {
    const data = getUserData() || { email: college.email, phoneNumber: college.phoneNumber, colleges: [] };
    data.colleges.push(college);
    setUserData(data);
};

export const updateCollege = (college: College) => {
    const data = getUserData();
    if (!data) return;

    const index = data.colleges.findIndex((c) => c.id === college.id);
    if (index !== -1) {
        data.colleges[index] = college;
        setUserData(data);
    }
};

export const deleteCollege = (id: string) => {
    const data = getUserData();
    if (!data) return;

    data.colleges = data.colleges.filter((c) => c.id !== id);
    setUserData(data);
}; 