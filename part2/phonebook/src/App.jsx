/* eslint-disable react/prop-types */
import { React, useState, useEffect } from "react";
import phonebookService from "./services/phonebook";

const Filter = ({ filter, onChange }) => {
  return (
    <form>
      <label>
        filter shown with:&nbsp;
        <input value={filter} onChange={onChange} />
      </label>
    </form>
  );
};

const AddPersonForm = ({ addPerson }) => {
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPerson({ ...newPerson, [name]: value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (addPerson(newPerson)) {
          setNewPerson({ name: "", number: "" });
        }
      }}
    >
      <div>
        <label>
          name:&nbsp;
          <input name="name" value={newPerson.name} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          number:&nbsp;
          <input
            name="number"
            value={newPerson.number}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit">add</button>
    </form>
  );
};

const Persons = ({ persons, filter, deletePerson }) => {
  const shownPersons = filter
    ? persons.filter((person) =>
        person.name.toUpperCase().includes(filter.toUpperCase())
      )
    : persons;

  return shownPersons.length > 0 ? (
    <>
      {shownPersons.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </div>
      ))}
    </>
  ) : (
    <div>No entries matching filter</div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    phonebookService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

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
        phonebookService
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
          });
        return true;
      } else {
        alert(`${newPerson.name} is already added to phonebook`);
        return false;
      }
    } else {
      phonebookService
        .createPerson(newPerson)
        .then((returnedPerson) => setPersons(persons.concat(returnedPerson)));
      return true;
    }
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService.deletePerson(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  return (
    <>
      <h1>Phonebook</h1>
      <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
      <h2>Add a new entry</h2>
      <AddPersonForm addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </>
  );
};

export default App;
