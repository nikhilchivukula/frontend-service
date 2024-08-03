import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Event-Detail.css';
import './Calendar.css';
import '../App.css';
import VtsHubHeader from './VtsHubHeader';
import VtsUser from './VtsUser';


const AddEventPage: React.FC = () => {
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
      const postUrl = `/api/events/event`;
                    //Change to Create new ID Number to which to post
                    //add new route to take the data and create a new event and return the id/eventjson
                    //take returned id and console.log (item updated successfully or alert that it wasn't successful + the error type + ask user to retry + display useful error message)

      // Fetch data response of this post and display ERROR or SUCCESS messages
      const result = await axios.post(postUrl, formData);

      // window.history.back();
      // Handle the response (e.g., redirect to a thank-you page)
    } catch (error) {
      console.error('Error submitting form:', error);
      window.alert('Error submitting form:' + error);
    }
  };

  return (
    <div>
      <div className="top-header flex-container">
        <div className="topBar flex-item">Upcoming Events</div>

        <VtsUser />
      </div>
      <VtsHubHeader />
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
  </div>
  );
};

export default AddEventPage;
