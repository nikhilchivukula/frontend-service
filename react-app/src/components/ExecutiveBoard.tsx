import React from 'react';
import './ExecutiveBoard.css'; // Import the CSS file where the reusable class is defined

const ExecutiveBoard: React.FC = () => {
  return (
    <div className="ExecutiveBoard-container">
      <div className="ExecutiveBoard-header">
        <h2>ExecutiveBoard</h2>
        <div className="logo">VH</div>
      </div>
      <div className="ExecutiveBoard-content">
        {/* Add the content for the ExecutiveBoardutive Board page here */}
        <div className="ExecutiveBoard-member">
          <img src="path-to-image.jpg" alt="Member Name" />
          <h3>Member Name</h3>
          <p>Description of the member.</p>
        </div>
        {/* Repeat .ExecutiveBoard-member div for each ExecutiveBoardutive member */}
      </div>
    </div>
  );
}

export default ExecutiveBoard;

