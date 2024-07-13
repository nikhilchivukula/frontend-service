import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format, subHours, startOfMonth } from 'date-fns';
import '@zach.codes/react-calendar/dist/calendar-tailwind.css';
import './Calendar.css';

import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
  MonthlyNav,
  DefaultMonthlyEventItem,
} from '@zach.codes/react-calendar';

import {
  addMonths,
  addHours,
  addDays,
  subDays,
} from 'date-fns';

export type EventType = {
  title: string;
  date: Date;
};
/*
  You should load an array of events per month from your backend
  This lets us render the calendar without loading too much at once
  Return an array of items with the date of the event, 
  and any extra properties you want
*/

export const events: { [key: string]: EventType[] } = {
  firstMonth: [
    { title: 'Call John', date: subHours(new Date(), 2) },
    { title: 'Call John', date: subHours(new Date(), 1) },
    { title: 'Meeting with Bob', date: new Date() },
    { title: 'Bike Appt', date: addHours(new Date(), 3) },
    { title: 'John Hilmer', date: addDays(new Date(), 3) },
    { title: 'Jane Call', date: subDays(new Date(), 4) },
    { title: 'Sound alarm', date: addDays(new Date(), 6) },
    { title: 'Soccer Practice', date: subDays(new Date(), 3) },
    { title: 'Alert', date: addHours(subDays(new Date(), 4), 4) },
    { title: 'Donation', date: addDays(new Date(), 6) },
  ],
  secondMonth: [
    { title: 'Meeting Next Month', date: addMonths(new Date(), 1) },
  ],
};

const Home: React.FC = () => {

  // Initiative the calendar eventItems data property to SAMPLE data
  // let eventItems:EventType[] = [] ; //events.firstMonth;
  const [eventItems, setEventItems] = useState<EventType[]>([]);

  const [vtsEvents, setVTSEvents] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/events/upcoming')
      .then(response => {
        setVTSEvents(response.data);
        updateCalendarEvents(response.data);
      })
      .catch(error => console.error(error));
  }, []);

    // UPDATE the calendar eventItems data property to real backend data
    function updateCalendarEvents(vtsEvents: any[]) {
    // alert (vtsEvents.length);

    let events = vtsEvents.map ( vtsEvent => {
      var event = { title: vtsEvent.name, date: new Date(vtsEvent.date) };
      return event;
    })

    // Update the calendar useState variable so React uses it to show the new events.
    setEventItems(events);
  }


 const MyMonthlyCalendar = () => {
    let [currentMonth, setCurrentMonth] = useState<Date>(
      startOfMonth(new Date())
    );

    return (
      <MonthlyCalendar
        currentMonth={currentMonth}
        onCurrentMonthChange={date => setCurrentMonth(date)}
      >
        <MonthlyNav />
        <MonthlyBody
          events={eventItems}
        >
          <MonthlyDay
          renderDay={data =>
            data.map((item: any, index) => (
              <DefaultMonthlyEventItem
                key={index}
                title={item.title}
                // Format the date here to be in the format you prefer
                date={format(item.date, 'k:mm')}
              />
            ))
          }
        />
        </MonthlyBody>
      </MonthlyCalendar>
    );
  };


  return (
    <div>
      <b>Homepage</b>

      {/* <Calendar /> */}

      <MyMonthlyCalendar />

      <div>
        <button><Link to="/upcoming-events">Upcoming Events</Link></button>
        <button><Link to="/past-events">Past Events</Link></button>
        <button><Link to="/executives">Executive Board</Link></button>
        <button><Link to="/signup">Sign Up</Link></button>
      </div>
    </div>
  );
}

export default Home;
