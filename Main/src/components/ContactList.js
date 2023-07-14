import React, { useRef } from "react";
import { Link } from "react-router-dom";
import ContactCard from "./ContactCard";

const ContactList = (props) => {
  const inputEl = useRef("");

  //just to check props are rendering properly or not
  // console.log(props);

  //deleteContactHandler is getting id from the contactCard
  //and contactList will give the id to the App.js.

  const deleteConactHandler = (id) => {
    props.getContactId(id);
  };

  const renderContactList = props.contacts.map((contact) => {
    return (
      <ContactCard
        contact={contact}
        clickHander={deleteConactHandler}
        key={contact.id}
      />
    );
  });

  const getSearchTerm = () => {
    // console.log(inputEl.current.value);
    props.searchKeyword(inputEl.current.value);
  };

  return (
    <div class="main">
      <h2>
        Contact List
        <Link to="/add">
          <button className="ui button right floated blue">Add Contact</button>
        </Link>
      </h2>
      <div className="ui category search">
        <div className="ui icon input">
          <input
            ref={inputEl}
            type="text"
            placeholder="Search Contacts"
            className="prompt"
            value={props.term}
            onChange={getSearchTerm}
          />
          <i className="search icon"></i>
        </div>
      </div>
      <div className="ui celled list">
        {renderContactList.length > 0
          ? renderContactList
          : "No contact available"}
      </div>
    </div>
  );
};

export default ContactList;
