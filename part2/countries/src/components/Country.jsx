/* eslint-disable react/prop-types */
import React from "react";
import Weather from "./Weather";

const Country = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={`flag of ${country.name.common}`}
        style={{ border: "1px solid black" }}
      />
      <Weather capital={country.capital} latlng={country.capitalInfo.latlng} />
    </>
  );
};
export default Country;
