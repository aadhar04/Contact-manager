import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { v4 as uuid } from "uuid";
import api from "../api/contacts";
import "./App.css";
import Header from "./Header";
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import ContactDetail from "./ContactDetail";
import EditContact from "./EditContact";

function App() {
  //key for local storage
  const LOCAL_STORAGE_KEY = "contacts";

  // 1. rendering list in react
  // const contacts = [
  //   {
  //     id: "1",
  //     name: "Dipesh",
  //     email: "malvia@gmail.com",
  //   },
  //   {
  //     id: "2",
  //     name: "Nikesh",
  //     email: "nicks@gmail.com",
  //   },
  // ];

  // 2. now we are going to use useState hook to make a new State to add name and
  //email entered by user in the AddContact component. initially we pass empty list.
  // const [contacts, setContacts] = useState(
  //   JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? []
  // );
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  //Retrive contacts from json call
  const retriveContacts = async () => {
    const response = await api.get("/contact");
    return response.data;
  };

  //this is a function to get contact from the addContact component.
  const addContactHandler = async (contact) => {
    console.log(contact);
    const request = {
      id: uuid(),
      ...contact,
    };
    const response = await api.post("/contact", request);
    setContacts([...contacts, response.data]);
  };

  //to update contact
  const UpdateContactHandler = async (contact) => {
    const response = await api.put(`/contact/${contact.id}`, contact);
    const { id, name, email } = response.data;
    setContacts(
      contacts.map((contact) => {
        return contact.id === id ? { ...response.data } : contact;
      })
    );
  };

  //to delete contact
  const removeContactHandler = async (id) => {
    await api.delete(`/contact/${id}`);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList);
  };

  const searchHandler = (searchTerm) => {
    // console.log(searchTerm);
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const newContactList = contacts.filter((contact) => {
        return Object.values(contact)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setSearchResults(newContactList);
    } else {
      setSearchResults(contacts);
    }
  };

  // 2. we use one more useEffect to get the data from the local storage. Now if I refresh the page after adding contact list, the data won't get vanished.
  useEffect(() => {
    // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if (retriveContacts) setContacts(retriveContacts);
    const getAllContacts = async () => {
      const allContacts = await retriveContacts();
      if (allContacts) setContacts(allContacts);
    };
    getAllContacts();
  }, []);

  // 1. useEffect hook to use local storage to store the contact details.
  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  // }, [contacts]);
  useEffect(() => {
    if (contacts.length > 0) {
      // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
    }
  }, [contacts]);

  return (
    <div className="ui container">
      <Router>
        <Header />
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => (
              <ContactList
                {...props}
                contacts={searchTerm.length < 1 ? contacts : searchResults}
                getContactId={removeContactHandler}
                term={searchTerm}
                searchKeyword={searchHandler}
              />
            )}
          />
          <Route
            path="/add"
            render={(props) => (
              <AddContact {...props} addContactHandler={addContactHandler} />
            )}
          />
          <Route
            path="/edit"
            render={(props) => (
              <EditContact
                {...props}
                UpdateContactHandler={UpdateContactHandler}
              />
            )}
          />
          <Route path="/contact/:id" component={ContactDetail} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

//to use the local storage to persist the data, we use useEffect. what useEffect does is whenever the value actually
//changes, the useeffect help us to render the component again
