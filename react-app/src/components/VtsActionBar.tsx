import React from 'react';
import './VtsHubHeader.css'; // Import the CSS file where the reusable class is defined


import { Link } from "react-router-dom";


const VtsHubHeader: React.FC = () => {

  return (
    <div className='vtsactionbar'>
      <button><a href='/add-event'>Add Event</a></button>
      <button><Link to="/option 2">Option 2</Link></button>
    </div>
  );
}

export default VtsHubHeader;

