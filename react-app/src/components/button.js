// src/components/Button.js
import React from 'react';
import './Button.css';

const Button = ({ text }) => {
  return (
    <button className="custom-button">{text}</button>
  );
};

export default Button;
