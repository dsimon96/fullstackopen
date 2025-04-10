import React, { useState, useEffect } from "react";
import countriesService from "./services/countries";
import Display from "./components/Display";

function App() {
  const [filterString, setFilterString] = useState("");
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    countriesService.getAll().then((countries) => {
      setAllCountries(countries);
    });
  }, []);

  const matchingCountries = allCountries.filter((country) =>
    country.name.common.toLowerCase().includes(filterString.toLowerCase())
  );

  return (
    <>
      <div>
        <label htmlFor="search">find countries </label>
        <input
          type="search"
          id="search"
          onChange={(e) => setFilterString(e.target.value)}
        />
        <Display countries={matchingCountries} />
      </div>
    </>
  );
}

export default App;
