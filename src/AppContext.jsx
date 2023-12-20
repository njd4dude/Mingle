// AppContext.jsx
import React, { createContext, useState } from "react";
export const AppContext = createContext();

export const AppProvider = ({ children, auth }) => {
  return <AppContext.Provider value={auth}>{children}</AppContext.Provider>;
};
