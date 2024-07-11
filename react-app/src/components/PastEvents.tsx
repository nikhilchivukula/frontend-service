// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';

// // // const PastEvents: React.FC = () => {
// // //   const [events, setEvents] = useState<any[]>([]);

// // //   useEffect(() => {
// // //     axios.get('/api/events/past')
// // //       .then(response => setEvents(response.data))
// // //       .catch(error => console.error(error));
// // //   }, []);

// // //   return (
// // //     <div>
// // //       <h2>Past Events</h2>
// // //       <ul>
// // //         {events.map(event => (
// // //           <li key={event.id}>{event.name} - {event.date} - <a href={event.link}>More Info</a></li>
// // //         ))}
// // //       </ul>
// // //     </div>
// // //   );
// // // }

// // // export default PastEvents;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      <h2>Past Events</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.name} - {event.date}
            <button onClick={() => handleEdit(event.id)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PastEvents;
