/* eslint-disable react/prop-types */
import { React } from "react";

export const Filter = ({ filter, onChange }) => {
  return (
    <form>
      <label>
        filter shown with:&nbsp;
        <input value={filter} onChange={onChange} />
      </label>
    </form>
  );
};

export default Filter;
