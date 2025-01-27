import React from "react";
import authService from "../services/authService";

const handleLogOut = async () => {
  try {
    await authService.logout();
    console.log("logged out");
  } catch (error) {
    console.error(error);
  }
};

export default function Home() {
  return (
    <div>
      <p onClick={handleLogOut}>Logout</p>
    </div>
  );
}
