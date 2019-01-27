import React from "react";
import { Link } from "react-router-dom";

const formatDate = date => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  const newDate = new Date(date).toLocaleDateString("de-DE", options);
  const newTime = new Date(date).toUTCString();
  return `${newDate} at ${newTime} ----  ${date}`;
};

const UserInfo = ({ session }) => (
  <div className="container center-align">
    <h3>User Info</h3>
    <p>Username: {session.getCurrentUser.username}</p>
    <p>Email: {session.getCurrentUser.email}</p>
    <p>Join Date: {formatDate(session.getCurrentUser.joinDate)}</p>
    <br />
    <ul>
      <h3>{session.getCurrentUser.username}'s Favorites</h3>
      {session.getCurrentUser.favorites.map(favorite => (
        <li key={favorite._id}>
          <Link to={`/products/${favorite._id}`}>
            {" "}
            <p>{favorite.name}</p>{" "}
          </Link>
        </li>
      ))}
      {!session.getCurrentUser.favorites.length && (
        <p>
          {" "}
          <strong> You have no favorites currently. Add some!</strong>
        </p>
      )}
    </ul>
  </div>
);

export default UserInfo;
