import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/events/upcoming')
      .then(response => setEvents(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.name} - {event.date}</li>
        ))}
      </ul>
    </div>
  );
}

export default UpcomingEvents;
