import { useContext } from "react";
import { AppContext } from "../AppContext";
import { auth } from "../App";

const ChatMessage = (props) => {
  const { text, uid, photoURL, displayName, url } = props.message;
  const liveUser = uid === auth.currentUser.uid;

  const messageStyle = liveUser ? "flex-row-reverse" : " ";

  return (
    <div className="px-5 ">
      <div className={`flex ${messageStyle}`}>
        <span className={`mb-1 text-2xl font-bold`}>{displayName}</span>
      </div>

      <div className={`flex items-center ${messageStyle}`}>
        {photoURL && (
          <img
            className="rounded-full m-2 w-28"
            src={photoURL}
            alt={`${displayName}'s profile`}
          />
        )}
        {text ? (
          <p
            className={` bg-green-400 rounded-full text-center px-4 py-2 mx-5 min-w-[40px] text-2xl`}
          >
            {text}
          </p>
        ) : (
          <>
            <img className="h-56" src={url} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
