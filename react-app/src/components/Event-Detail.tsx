
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Event-Detail.css'; // Import the CSS file where the reusable class is defined
import './Calendar.css';
import '../App.css';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';


// const EventDetail: React.FC = () => {

//   const [event, setEvent] = useState<any[]>([]);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const eventId = searchParams.get("id");
//   console.log ("Event Id to fetch = " + eventId);

//   useEffect(() => {
//     axios.get('http://localhost:3001/api/events/event?id=' + eventId)
//       .then(response => setEvent(response.data))
//       .catch(error => console.error(error));
//   }, []);

//   const navigate = useNavigate();

//   const navigateTo = (path: string) => {
//     navigate(path);
//   };

//   return (
//     <div className="PastEvents-container">
//       <div className="PastEvents-header">
//         <h2>Event Details</h2>
//         <div className="logo">VH</div>
//       </div>
//       {/* Add the content for the PastEventsutive Board page here */}
//       {/* <div className="PastEvents-member">
//           <img src="path-to-image.jpg" alt="Member Name" />
//           <h3>Member Name</h3>
//           <p>Description of the member.</p>
//         </div> */}


//       {/* <div>Past count: {pastEvents.length}</div>

//       <ul>
//         {pastEvents.map(event => (
//           <li key={event.id}>
//           <div className="PastEvents-member">
//               <h3>{event.name} 
//                 <a className="editevent" href={"event-detail?id=" + event.id}>Edit</a>
//               </h3>
//               <p>{event.description}</p>
//             </div>
//           </li>
//         ))}
//       </ul>
//  */}


//       {/* Repeat .PastEvents-member div for each PastEventsutive member */}

      

      
//     </div>
//   );
// }

// export default EventDetail;

const SignUpPage: React.FC = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventLead, setEventLead] = useState('');
  const [eventBranchID, setEventBranchID] = useState('');

  const [event, setEvent] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const eventId = searchParams.get("id");
  console.log ("Event Id to fetch = " + eventId);

  const submitEvent = async () => {
    const formData = new FormData();
    formData.append('eventName', eventName);
    formData.append('eventDate', eventDate);
    formData.append('eventLocation', eventLocation);
    formData.append('eventDescription', eventDescription);
    formData.append('eventLink', eventLink);
    formData.append('eventLead', eventLead);
    formData.append('eventBranchID', eventBranchID);

    const dataToSend = Object.fromEntries(formData);

    const formJson = { eventName, eventDate };

    try {
      const postUrl = '/api/events/event?id=' + eventId;

      const axResponse = await axios.post (postUrl, formJson, { });


      // const response = await fetch (
      //   postUrl, 
      //   {
      //     method: 'POST',
      //     body:  JSON.stringify( formJson ),
      //     headers: {
      //       // "Content-Type": "text/plain"
      //       "Content-Type": "application/json"
      //       // "Content-Type": "application/x-www-form-urlencoded"
      //     }
      //   }
      // );

      // Handle the response (e.g., redirect to a thank-you page)
    } catch (error) {
      console.error('Error submitting form:', error);
    }

  };


//Place to put formatting for making the boxes look good
//   return (
//     <form autoComplete="off" onSubmit={(ev) => {submitEvent(); ev.preventDefault(); return false;}}>
//       <label htmlFor="eventNameInputField">Event Name:</label>
//       <input
//         type="text"
//         id="eventNameInputField"
//         value={eventName}
//         onChange={(e) => setEventName(e.target.value)}
//       />
//       <br />
//       <label htmlFor="eventDateInputField">Event Date:</label>
//       <input
//         type="text"
//         id="eventDateInputField"
//         value={eventDate}
//         onChange={(e) => setEventDate(e.target.value)}
//       />
//       <br />
//       <input type="submit" value="Submit" />
//     </form>
//   );
// };


<div className="calendar-container">
      <div className="calendar-header">
        <h2>Calendar</h2>
        <div className="logo">VH</div>
      </div>
      <div className="calendar-content">
        {/* Calendar Content goes here */}
      </div>
    </div>

return (
    <form autoComplete="off" onSubmit={(ev) => {submitEvent(); ev.preventDefault(); return false;}}>
        <label htmlFor="eventNameInputField">Event Name:</label>
        <input type="text" id="eventNameInputField" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        <br />
        <label htmlFor="eventDateInputField">Event Date:</label>
        <input
        type="text" id="eventDateInputField" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
        <br />
        <label htmlFor="eventLocationInputField">Event Location:</label>
        <input type="text" id="eventLocationInputField" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
        <br />
        <label htmlFor="eventDescriptionInputField">Event Description:</label>
        <input type="text" id="eventDescriptionInputField" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
        <br />
        <label htmlFor="eventLinkInputField">Event Link:</label>
        <input type="text" id="eventLinkInputField" value={eventLink} onChange={(e) => setEventLink(e.target.value)} />
        <br />
        <label htmlFor="eventLeadInputField">Event Lead:</label>
        <input type="text" id="eventLeadInputField" value={eventLead} onChange={(e) => setEventLead(e.target.value)} />
        <br />
        <label htmlFor="eventBranchIDInputField">Event BranchID:</label>
        <input type="text" id="eventBranchIDInputField" value={eventBranchID} onChange={(e) => setEventBranchID(e.target.value)} />
        <br />
        <input type="submit" value="Submit" />
    </form>
    );
    };

export default SignUpPage;