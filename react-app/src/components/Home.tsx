import React from 'react';
import Calendar from './Calendar';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <b>Homepage</b>
      <Calendar />
      <div>
        <button><Link to="/upcoming-events">Upcoming Events</Link></button>
        <button><Link to="/past-events">Past Events</Link></button>
        <button><Link to="/executives">Executive Board</Link></button>
        <button><Link to="/signup">Sign Up</Link></button>
      </div>
      <div>
        <Link to="/upcoming-events">Upcoming</Link>
        <Link to="/past-events">Past</Link>
        <Link to="/executives">Executives</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default Home;
