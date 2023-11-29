import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAFZ3CYUXXq69Ob1yByu0UVKD_hT5iyrU8",
    authDomain: "authentification-b28fb.firebaseapp.com",
    projectId: "authentification-b28fb",
    storageBucket: "authentification-b28fb.appspot.com",
    messagingSenderId: "409344644828",
    appId: "1:409344644828:web:e159e0209d43618b59c619"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const logInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  console.log(email, password);
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

export const logout = () => {
  signOut(auth);
};

export const getToken = async () => {
    if (!auth.currentUser) return '';
    
    return await auth.currentUser
        .getIdToken(false)
        .then(function (idToken) {
        return idToken;
        })
        .catch(function (error) {
        console.log(error);
        return null;
        });
    };
