// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';

// // // const UpcomingEvents: React.FC = () => {
// // //   const [events, setEvents] = useState<any[]>([]);

// // //   useEffect(() => {
// // //     axios.get('/api/events/upcoming')
// // //       .then(response => setEvents(response.data))
// // //       .catch(error => console.error(error));
// // //   }, []);

// // //   return (
// // //     <div>
// // //       <h2>Upcoming Events</h2>
// // //       <ul>
// // //         {events.map(event => (
// // //           <li key={event.id}>{event.name} - {event.date}</li>
// // //         ))}
// // //       </ul>
// // //     </div>
// // //   );
// // // }

// // // export default UpcomingEvents;

import './EventPages.css'; // Import the CSS file where the reusable class is defined

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/events/upcoming')
      .then(response => setEvents(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleEdit = (eventId: string) => {
    navigate(`/event-detail?id=${eventId}`);
  };

  return (
    <div className="ExecutiveBoard-container">
      <div className="ExecutiveBoard-pageTitle">
        Upcoming Events
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
  );
};

export default UpcomingEvents;
