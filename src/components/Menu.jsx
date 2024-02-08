import React from "react";
import SearchIcon from "@mui/icons-material/Search";

//2/8 left off here try to make menu so that i cna access different group chats..already setup firebase cloud firestore a little

const Menu = () => {
  return (
    <div className="bg-gray-300 h-screen flex items-center flex-col">
      <h1 className="text-7xl text-white bg-red-900">Mingle</h1>
      <div className="search-container">
        <span className="search-icon">
          <SearchIcon />
        </span>
        <input type="text" placeholder="Search" />
      </div>
    </div>
  );
};

export default Menu;
