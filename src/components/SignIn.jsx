import {
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
} from "firebase/auth";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import { auth } from "../App";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithRedirect(auth, provider);
      const result = await getRedirectResult();
      console.log("Redirect result:", result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button
      className="flex items-center bg-white border-black px-2 py-4 hover:border-2 absolute right-8 top-5"
      onClick={signInWithGoogle}
    >
      <FcGoogle size={30} />
      <span className="text-black px-2">Continue With Google</span>
    </button>
  );
};

export default SignIn;
