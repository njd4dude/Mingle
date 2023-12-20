import { useContext } from "react";
import { AppContext } from "../AppContext";
import { auth } from "../App";
const SignOut = () => {
  return (
    auth.currentUser && (
      <button
        className="bg-red-500 text-white border-black p-4 absolute right-8 top-5 hover:border-2"
        onClick={() => auth.signOut()}
      >
        Sign Out
      </button>
    )
  );
};

export default SignOut;
