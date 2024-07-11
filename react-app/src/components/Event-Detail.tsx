
// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';
// // // import './Event-Detail.css'; // Import the CSS file where the reusable class is defined
// // // import './Calendar.css';
// // // import '../App.css';
// // // import { useNavigate, useSearchParams, Link } from 'react-router-dom';


// // // // export default EventDetail;

// // // const SignUpPage: React.FC = () => {
// // //   const [eventName, setEventName] = useState('');
// // //   const [eventDate, setEventDate] = useState('');
// // //   const [eventLocation, setEventLocation] = useState('');
// // //   const [eventDescription, setEventDescription] = useState('');
// // //   const [eventLink, setEventLink] = useState('');
// // //   const [eventLead, setEventLead] = useState('');
// // //   const [eventBranchID, setEventBranchID] = useState('');

// // //   const [event, setEvent] = useState<any[]>([]);
// // //   const [searchParams, setSearchParams] = useSearchParams();
// // //   const eventId = searchParams.get("id");
// // //   console.log ("Event Id to fetch = " + eventId);

// // //   const submitEvent = async () => {
// // //     const formData = new FormData();
// // //     formData.append('eventName', eventName);
// // //     formData.append('eventDate', eventDate);
// // //     formData.append('eventLocation', eventLocation);
// // //     formData.append('eventDescription', eventDescription);
// // //     formData.append('eventLink', eventLink);
// // //     formData.append('eventLead', eventLead);
// // //     formData.append('eventBranchID', eventBranchID);

// // //     const dataToSend = Object.fromEntries(formData);

// // //     const formJson = { eventName, eventDate, eventLocation, eventDescription, eventLink, eventLead, eventBranchID };

// // //     try {
// // //       const postUrl = '/api/events/event?id=' + eventId;

// // //       const axResponse = await axios.post (postUrl, formJson, { });

// // //       // Handle the response (e.g., redirect to a thank-you page)
// // //     } catch (error) {
// // //       console.error('Error submitting form:', error);
// // //     }

// // //   };


// // // <div className="calendar-container">
// // //       <div className="calendar-header">
// // //         <h2>Calendar</h2>
// // //         <div className="logo">VH</div>
// // //       </div>
// // //       <div className="calendar-content">
// // //         {/* Calendar Content goes here */}
// // //       </div>
// // //     </div>

// // // return (
// // //     <form autoComplete="off" onSubmit={(ev) => {submitEvent(); ev.preventDefault(); return false;}}>
// // //         <label htmlFor="eventNameInputField">Event Name:</label>
// // //         <input type="text" id="eventNameInputField" value={eventName} onChange={(e) => setEventName(e.target.value)} />
// // //         <br />
// // //         <label htmlFor="eventDateInputField">Event Date:</label>
// // //         <input
// // //         type="text" id="eventDateInputField" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
// // //         <br />
// // //         <label htmlFor="eventLocationInputField">Event Location:</label>
// // //         <input type="text" id="eventLocationInputField" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
// // //         <br />
// // //         <label htmlFor="eventDescriptionInputField">Event Description:</label>
// // //         <input type="text" id="eventDescriptionInputField" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
// // //         <br />
// // //         <label htmlFor="eventLinkInputField">Event Link:</label>
// // //         <input type="text" id="eventLinkInputField" value={eventLink} onChange={(e) => setEventLink(e.target.value)} />
// // //         <br />
// // //         <label htmlFor="eventLeadInputField">Event Lead:</label>
// // //         <input type="text" id="eventLeadInputField" value={eventLead} onChange={(e) => setEventLead(e.target.value)} />
// // //         <br />
// // //         <label htmlFor="eventBranchIDInputField">Event BranchID:</label>
// // //         <input type="text" id="eventBranchIDInputField" value={eventBranchID} onChange={(e) => setEventBranchID(e.target.value)} />
// // //         <br />
// // //         <input type="submit" value="Submit" />
// // //     </form>
// // //     );
// // //     };

// // // export default SignUpPage;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Event-Detail.css';
import './Calendar.css';
import '../App.css';

const SignUpPage: React.FC = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventLead, setEventLead] = useState('');
  const [eventBranchID, setEventBranchID] = useState('');

  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("id");
  console.log("Event Id to fetch = " + eventId);

  const submitEvent = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const formData = {
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      eventLink,
      eventLead,
      eventBranchID,
    };

    try {
      const postUrl = `/api/events/event?id=${eventId}`;
      await axios.post(postUrl, formData);
      // Handle the response (e.g., redirect to a thank-you page)
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="signup-container">
      <form autoComplete="off" onSubmit={submitEvent} className="signup-form">
        <div className="form-group">
          <label htmlFor="eventNameInputField">Event Name:</label>
          <input
            type="text"
            id="eventNameInputField"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventDateInputField">Event Date:</label>
          <input
            type="text"
            id="eventDateInputField"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventLocationInputField">Event Location:</label>
          <input
            type="text"
            id="eventLocationInputField"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventDescriptionInputField">Event Description:</label>
          <input
            type="text"
            id="eventDescriptionInputField"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventLinkInputField">Event Link:</label>
          <input
            type="text"
            id="eventLinkInputField"
            value={eventLink}
            onChange={(e) => setEventLink(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventLeadInputField">Event Lead:</label>
          <input
            type="text"
            id="eventLeadInputField"
            value={eventLead}
            onChange={(e) => setEventLead(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventBranchIDInputField">Event BranchID:</label>
          <input
            type="text"
            id="eventBranchIDInputField"
            value={eventBranchID}
            onChange={(e) => setEventBranchID(e.target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default SignUpPage;
