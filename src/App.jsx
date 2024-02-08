// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AppProvider } from "./AppContext";
import ChatRoom from "./components/ChatRoom";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import { getStorage } from "firebase/storage";
import Menu from "./components/Menu";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Intialize Firebase Authentication
const auth = getAuth(app);

//Intiaizlize Cloud Firestore
const db = getFirestore(app);

const storage = getStorage(app);

export { auth, db, storage }; // Exporting them together

//NOTE: LEFT OFF HERE 1/28 NEED TO RESTRUCTURE THE DATABSE ON HOW I STORE INFORMATION ABOUT DIFFERENT CHAT ROOMS
function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="min-h-screen bg-white">
      <Menu />
      {/* <header className="bg-[#4ade80] ">
        <div className="flex justify-center  relative">
          <img
            className=" w-24 absolute left-2 hover:scale-105"
            src="/chaticon2.png"
          />
          <h1 className="text-white text-6xl font-bold font-serif mt-4 mb-4 ">
            Mingle
          </h1>
        </div>
        <SignOut />
      </header> */}
      {/* {user ? <ChatRoom /> : <SignIn />} */}
    </div>
  );
}

export default App;
