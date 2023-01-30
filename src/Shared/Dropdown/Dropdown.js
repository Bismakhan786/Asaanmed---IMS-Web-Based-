import React from "react";
import Select from "react-select";
import "./Dropdown.css";

const colourStyles = {
  valueContainer: (styles) => ({
    ...styles,
    height: "2.5vmax",
    padding: "0 1vmax",
  }),

  input: (styles) => ({
    ...styles,
    margin: "0px",
  }),
  indicatorSeparator: (styles) => ({
    display: "none",
  }),
  indicatorsContainer: (styles) => ({
    ...styles,
    height: "2.5vmax",
  }),
  placeholder: (styles) => ({
    ...styles,
    fontSize: "1vmax",
  }),
  control: (styles, {isDisabled, isFocused }) => ({
    ...styles,
    fontSize: "1vmax",
    backgroundColor: isDisabled ? 'rgba(0, 0, 0, 0.03)': "white",
    borderColor: 'rgba(0, 0, 0, 0.2)',
    cursor: "pointer",
    minHeight: "2.5vmax",
    height: "2.5vmax",
    boxShadow: isFocused ? null : null,
    ":active": {
      ...styles[":active"],
      borderColor: "rgba(0, 0, 0, 0.05)",
      borderWidth: 0.3,
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.6)",
    },
  }),
  option: (styles, { isFocused, isSelected }) => {
    return {
      ...styles,
      fontSize: 12,
      cursor: "pointer",
      backgroundColor: "transparent",
      color: "rgba(0, 0, 0, 0.6)",
      ":hover": {
        ...styles[":hover"],
        backgroundColor: "rgba(0, 0, 0, 0.05)",
      },
    };
  },
};

const Dropdown = ({ options, placeholder, onChange, name, defaultValue, disabled, isMulti=false }) => {
  return (
    <Select
      name={name}
      isMulti={isMulti}
      // value={options.filter((option) => option.label === defaultValue)}
      defaultValue={defaultValue}
      options={options}
      isDisabled={disabled}
      placeholder={placeholder}
      className="custom-select"
      styles={colourStyles}
      onChange={onChange}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: "rgba(0, 0, 0, 0.9)",
          primary: "rgba(0, 0, 0, 0.6)",
        },
      })}
    />
  );
};

export default Dropdown;
