import { useState, useEffect } from "react";
import axios from "axios";

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
        addPerson(newPerson);
        setNewPerson({ name: "", number: "" });
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

const Persons = ({ persons, filter }) => {
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
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addPerson = (newPerson) => {
    if (persons.some((person) => person.name === newPerson.name)) {
      alert(`${newPerson.name} is already added to phonebook`);
    } else {
      setPersons(persons.concat({ id: persons.length + 1, ...newPerson }));
    }
  };

  return (
    <>
      <h1>Phonebook</h1>
      <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
      <h2>Add a new entry</h2>
      <AddPersonForm addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </>
  );
};

export default App;
