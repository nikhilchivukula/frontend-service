

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EventPages.css'; // Import the CSS file where the reusable class is defined
import VtsHubHeader from './VtsHubHeader';
import VtsUser from './VtsUser';
import VtsActionBar from './VtsActionBar';



const PastEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/events/past')
      .then(response => setEvents(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleEdit = (eventId: string) => {
    navigate(`/event-detail?id=${eventId}`);
  };

  return (
    <div>
      <div className="top-header flex-container">
        <div className="topBar flex-item">Past Events</div>

        <VtsUser />
      </div>
      <VtsHubHeader />

      <VtsActionBar/>



      <div className="ExecutiveBoard-container">
        <div className="ExecutiveBoard-pageTitle">
          Past Events
        </div>

        <div className="ExecutiveBoard-textActual">
          {events.map(event => (
            <li key={event.id}>
              {event.name} - {event.date}
              <button onClick={() => handleEdit(event.id)}> -  Edit</button>
            </li>
          ))}
        </div>
      </div>
    </div>

  );
};

export default PastEvents;
