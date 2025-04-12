import { React, useState, useEffect } from "react";
import phonebookService from "./services/phonebook";
import Notification from "./components/Notification";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import AddPersonForm from "./components/AddPersonForm";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const showNotification = (notification) => {
    setNotification(notification);
    setTimeout(() => setNotification(null), 5000);
  };

  const addPerson = (newPerson) => {
    const existingPerson = persons.find(
      (person) => person.name === newPerson.name
    );
    if (existingPerson) {
      if (
        existingPerson.number !== newPerson.number &&
        window.confirm(
          `${existingPerson.name} is already added to phonebook, do you want to update their phone number?`
        )
      ) {
        return phonebookService
          .updatePerson(existingPerson.id, {
            ...existingPerson,
            number: newPerson.number,
          })
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id ? returnedPerson : person
              )
            );
            showNotification({
              message: `Updated ${newPerson.name}`,
              type: "success",
            });
          })
          .catch((error) => {
            if (error.response.status === 404) {
              showNotification({
                message: `${existingPerson.name} was already deleted from the server`,
                type: "error",
              });
              setPersons(
                persons.filter((person) => person.id !== existingPerson.id)
              );
            } else {
              console.error("Error updating person:", error);
              showNotification({
                message: error.response.data.error,
                type: "error",
              });
            }
            throw error;
          });
      } else {
        alert(`${newPerson.name} is already added to phonebook`);
        return Promise.reject(new Error("Person already exists"));
      }
    } else {
      return phonebookService
        .createPerson(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          showNotification({
            message: `Added ${newPerson.name}`,
            type: "success",
          });
        })
        .catch((error) => {
          console.error("Error adding person:", error);
          showNotification({
            message: error.response.data.error,
            type: "error",
          });
        });
    }
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          showNotification({
            message: `Deleted ${person.name}`,
            type: "success",
          });
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
          showNotification({
            message: `${person.name} does not exist on the server`,
            type: "error",
          });
          setPersons(persons.filter((p) => p.id !== person.id));
        });
    }
  };

  return (
    <>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
      <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
      <h2>Add a new entry</h2>
      <AddPersonForm addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </>
  );
};

export default App;
