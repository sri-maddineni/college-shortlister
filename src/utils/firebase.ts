import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { College } from '../types/college';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BASE_PATH = 'College-shortlister/XPoIHymZ0oD0bkN70iP3';

export const getCollectionPath = (email: string, phoneNumber: string) => {
    return `${BASE_PATH}/${email}${phoneNumber}`;
};

export const addCollege = async (college: College) => {
    if (!college.id || !college.email || !college.phoneNumber) {
        throw new Error('College must have an ID, email, and phone number');
    }

    const collectionPath = getCollectionPath(college.email, college.phoneNumber);
    await setDoc(doc(db, collectionPath, college.id), college);
};

export const getColleges = async (email: string, phoneNumber: string): Promise<College[]> => {
    const collectionPath = getCollectionPath(email, phoneNumber);
    const querySnapshot = await getDocs(collection(db, collectionPath));
    return querySnapshot.docs.map(doc => doc.data() as College);
};

export const updateCollege = async (college: College) => {
    if (!college.id || !college.email || !college.phoneNumber) {
        throw new Error('College must have an ID, email, and phone number');
    }

    const collectionPath = getCollectionPath(college.email, college.phoneNumber);
    await setDoc(doc(db, collectionPath, college.id), college);
};

export const deleteCollege = async (college: College) => {
    if (!college.id || !college.email || !college.phoneNumber) {
        throw new Error('College must have an ID, email, and phone number');
    }

    const collectionPath = getCollectionPath(college.email, college.phoneNumber);
    await deleteDoc(doc(db, collectionPath, college.id));
}; 