import React from "react";
import UserInfo from "./UserInfo";
import UserProducts from "./UserProducts";
import withAuth from "../withAuth";
import Tabs from "react-materialize/lib/Tabs";
import { Tab } from "react-materialize";

const Profile = ({ session }) => (
  <div className="container center-align" style={{ marginTop: "20px" }}>
    <div className="row">
      <div className="col s12">
        <Tabs className="tab">
          <Tab title="User Products" className="col s3 m3 l4 offset offset-l2">
            <UserProducts username={session.getCurrentUser.username} />
          </Tab>
          <Tab title="User Info" active className="col s3 m3 l4">
            <UserInfo session={session} />
          </Tab>
        </Tabs>
      </div>
    </div>
  </div>
);

export default withAuth(session => session && session.getCurrentUser)(Profile);
