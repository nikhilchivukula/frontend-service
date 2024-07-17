import React from 'react';
import './VtsHubHeader.css'; // Import the CSS file where the reusable class is defined


import { Link } from "react-router-dom";


const VtsHubHeader: React.FC = () => {

return (
    <div className='vtshubheader'>
        <button><Link to="/upcoming-events">Upcoming Events</Link></button>
        <button><Link to="/past-events">Past Events</Link></button>
        <button><Link to="/executives">Executive Board</Link></button>
        <button><Link to="/signup">Sign Up</Link></button>
    </div>
  );
}

export default VtsHubHeader;

