import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

const formatDate = date => {
  console.log(date);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  const newDate = new Date(date - 10800000).toUTCString();
  const localDate = new Date(newDate).toLocaleDateString();
  const localTime = new Date(newDate).toLocaleTimeString();

  return `Full Date: ${newDate}--Local Date: ${localDate}--LocalTime: ${localTime}-- From MongoDB: ${date}`;
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
