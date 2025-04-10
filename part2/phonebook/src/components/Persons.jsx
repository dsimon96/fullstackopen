/* eslint-disable react/prop-types */
import { React } from "react";

export const Persons = ({ persons, filter, deletePerson }) => {
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

export default Persons;
