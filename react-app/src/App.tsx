import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import UpcomingEvents from './components/UpcomingEvents';
import PastEvents from './components/PastEvents';
import ExecutiveBoard from './components/ExecutiveBoard';
import SignUp from './components/SignUp';
import EventDetails from './components/Event-Detail';
import AddEventPage from './components/Add-Event';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upcoming-events" element={<UpcomingEvents />} />
        <Route path="/past-events" element={<PastEvents />} />
        <Route path="/executives" element={<ExecutiveBoard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Event-Detail" element={<EventDetails/>} />
        <Route path="/add-event" element={<AddEventPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
