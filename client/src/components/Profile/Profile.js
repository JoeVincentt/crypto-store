import React from "react";
import UserInfo from "./UserInfo";
import UserProducts from "./UserProducts";
import withAuth from "../withAuth";

const Profile = ({ session }) => (
  <div className="App">
    <UserInfo session={session} />
    <UserProducts username={session.getCurrentUser.username} />
  </div>
);

export default withAuth(session => session && session.getCurrentUser)(Profile);
