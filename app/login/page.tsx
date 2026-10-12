"use client";

import React from "react";
import Login from "./Login";
import "./page.css";
// import Loader from '../component/loader/Loader';

const page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden custom-class ">
      <Login />
      {/* <Loader/> */}
    </div>
  );
};

export default page;
