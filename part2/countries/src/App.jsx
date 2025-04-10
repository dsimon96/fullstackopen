import React, { useState, useEffect } from "react";
import countriesService from "./services/countries";
import Display from "./components/Display";

function App() {
  const [filterString, setFilterString] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    countriesService.getAll().then((countries) => {
      setAllCountries(countries);
    });
  }, []);

  const matchingCountries =
    selectedCountry !== null
      ? [selectedCountry]
      : allCountries.filter((country) =>
          country.name.common.toLowerCase().includes(filterString.toLowerCase())
        );

  return (
    <>
      <label htmlFor="search">find countries </label>
      <input
        type="search"
        id="search"
        onChange={(e) => {
          setFilterString(e.target.value);
          setSelectedCountry(null);
        }}
      />
      <Display countries={matchingCountries} onShow={setSelectedCountry} />
    </>
  );
}

export default App;
