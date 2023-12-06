import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import Menu from "./Menu";

import AuthProvider from "./context/AuthContext";

export default function App (){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    </AuthProvider>
  );
}

const appDiv = createRoot(document.getElementById("app"));
appDiv.render(<App />);