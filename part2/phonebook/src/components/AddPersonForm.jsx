/* eslint-disable react/prop-types */
import { React } from "react";
import { useState } from "react";

export const AddPersonForm = ({ addPerson }) => {
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

export default AddPersonForm;
