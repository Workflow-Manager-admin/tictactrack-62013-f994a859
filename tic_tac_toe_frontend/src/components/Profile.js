import React from "react";
import { useAuth } from "./AuthProvider";

// PUBLIC_INTERFACE
const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="center-box profile-box">
      <h2>{user.username}'s Profile</h2>
      <p>More profile features coming soon.</p>
    </div>
  );
};

export default Profile;
