"use client";
import React, { useEffect, useState } from "react";
import Logo from "../../../public/assets/logo.avif";
import Image from "next/image"; // Import the Image component

const NavBar = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

    console.log("Stored user:", storedUser?.user);

    if (storedUser) {
      setUser(storedUser?.user);
    }
  }, []);

  return (
    <div className="w-full h-[10vh] bg-[rgb(44,56,92)] flex items-center justify-between shadow-md px-4 py-2">
      <Image src={Logo} alt="Logo" width={70} height={40} />
      <div className="text-white text-sm font-medium">
        <p>{user?.name}</p>
        <p>{user?.email}</p>
      </div>
    </div>
  );
};

export default NavBar;
