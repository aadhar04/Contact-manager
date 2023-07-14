import React from "react";
import { Link } from "react-router-dom";
import user from "../images/user1.jpg";

const ContactDetail = (props) => {
  const { name, email } = props.location.state.contact;
  return (
    <div className="main">
      <Link to="/">
        <div className="center-div">
          <button
            className="ui blue button"
            style={{ padding: "5px", fontSize: "30px", borderRadius: "50%" }}
          >
            ⬅
          </button>
        </div>
      </Link>
      <div className="ui card centered">
        <div className="image">
          <img src={user} alt="user" />
        </div>
        <div className="content">
          <div className="header">{name}</div>
          <div className="description">{email}</div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
