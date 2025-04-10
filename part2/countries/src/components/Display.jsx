/* eslint-disable react/prop-types */
import React from "react";
import Country from "./Country";

const Display = ({ countries, onShow }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length === 0) {
    return <div>No matches found, specify another filter</div>;
  } else if (countries.length > 1) {
    /* if there are multiple matches, list them */
    return (
      <>
        {countries.map((country) => (
          <div key={country.name.common}>
            {country.name.common}{" "}
            <button onClick={() => onShow(country)}>show</button>
          </div>
        ))}
      </>
    );
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }
};

export default Display;
