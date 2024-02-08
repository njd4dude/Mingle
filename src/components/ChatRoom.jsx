import ChatMessage from "./ChatMessage";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import { useEffect, useRef, useState } from "react";
import * as firebase from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { FaChessKing, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import { db, auth } from "../App";
import { storage } from "../App";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { v4 } from "uuid";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Added state
  const [imageUpload, setImageUpload] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [imageList, setImageList] = useState([]);
  const dummy = useRef();
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    console.log("MESSAGES: ", messages);
    console.log("data from imageList ->", imageList);
  }, [messages]);

  //get the messages and the images
  useEffect(() => {
    const fetchData = async () => {
      // await fetchImages(); (NOT USING)
      await fetchMessages();
    };

    fetchData();
  }, []);

  //get the messages
  const fetchMessages = async () => {
    const q = query(messagesRef, orderBy("createdAt"), limit(25));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messageData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("message data in fetch Messages: ", messageData);
      const objDatedMessages = addDatetoMessages(messageData);
      setMessages(objDatedMessages);

      console.log("messages have been set");
    });

    return () => {
      unsubscribe();
      console.log("unsubscribed");
    };
  };

  const addDatetoMessages = (messages) => {
    const messagesWithDate = messages.map((message) => {
      const oldCreatedAt = message.createdAt;
      const dateObject = new Date(
        oldCreatedAt.seconds * 1000 + oldCreatedAt.nanoseconds / 1e6
      );
      return { ...message, createdAt: dateObject };
    });
    console.log("fixed date object for messages");
    return messagesWithDate;
  };

  //handle when user hits send
  const handleSend = async (e) => {
    e.preventDefault();
    console.log("send attempt!");

    // Disable the send button to prevent spamming
    e.target.elements["sendButton"].disabled = true;

    const { uid, photoURL, displayName } = auth.currentUser;
    //message
    if (formValue.trim() !== "") {
      console.log("sending text message");
      try {
        await addDoc(messagesRef, {
          text: formValue,
          createdAt: new Date(),
          photoURL,
          uid,
          displayName,
        });
      } catch (err) {
        console.log("setDoc error", err);
      }

      console.log("sent text message");
    }

    //attachment 2.0
    if (imageUpload !== null) {
      console.log("sending image message");
      const imageId = v4(); // Generate a unique ID for the image
      const imagesRef = ref(storage, `images/${imageId}`);

      try {
        // Upload the image to storage
        await uploadBytes(imagesRef, imageUpload);

        // Get the download URL
        const url = await getDownloadURL(imagesRef);

        // Save the image details to messages section in the firestore database
        await addDoc(messagesRef, {
          url,
          createdAt: new Date(),
          uid,
          displayName,
        });

        console.log("added image document and uploaded to storage");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    // Enable the send button after a delay to prevent quick spamming
    setTimeout(() => {
      e.target.elements["sendButton"].disabled = false;
    }, 1000);

    setFormValue("");
    setImageUpload(null);
    setImageURL("");
  };

  //set when it is the initialLoad
  useEffect(() => {
    // Set isInitialLoad to false after a delay
    const timeoutId = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000); // Adjust the delay time as needed
  }, []);

  //scroll into view
  useEffect(() => {
    dummy.current.scrollIntoView({
      behavior: isInitialLoad ? "instant" : "smooth",
    });
    console.log("scrolledintoview");
  }, [messages, isInitialLoad]);

  //handle when user attaches image
  const handleAttachment = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageURL(imageURL);
      setImageUpload(file);
    }
  };

  //cleanup
  useEffect(() => {
    // Cleanup when component unmounts or when the image changes
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [imageURL]);

  return (
    <div className="CR-wrapper">
      <main className=" mb-24">
        {messages &&
          messages.map((msg) => (
            <>
              <div key={msg.id}>
                <ChatMessage message={msg} />
              </div>
            </>
          ))}
        <div ref={dummy}></div>
      </main>
      <form
        className=""
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(e);
        }}
      >
        <div className="flex justify-between h-24  w-full fixed bottom-0 border-black border-t-2">
          <div className=" bg-blue-400 flex-grow flex">
            <input
              className="px-4 text-2xl w-full h-full focus:border-4 "
              placeholder="Enter text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
            />
            {imageURL !== "" && <img src={imageURL} />}
          </div>
          <div className="bg-blue-500 flex">
            <label className="flex justify-center items-center  bg-green-400 w-40 hover:scale-105 border cursor-pointer">
              <FaPaperclip className="" size={50} />
              <input
                type="file"
                name="attachment"
                onChange={handleAttachment}
                style={{ display: "none" }}
              />
            </label>
            <button
              name="sendButton"
              className="flex justify-center items-center bg-green-400 w-40 hover:scale-105 border"
              type="submit"
            >
              <FaPaperPlane size={40} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
