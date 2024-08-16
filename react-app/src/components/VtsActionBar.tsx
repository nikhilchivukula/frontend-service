import React, { useState } from 'react';
import './VtsHubHeader.css'; // Import the CSS file where the reusable class is defined
import CityDropdown from './CityDropdown';
import { Link, useSearchParams } from "react-router-dom";
import './VtsHubHeader.css'; // Import the CSS file where the reusable class is defined

const cities = [
  { city: 'Seattle', data: 'SEA' },
  { city: 'New York', data: 'NYC' },
  { city: 'Los Angeles', data: 'LAC' },
  { city: 'Chicago', data: 'CHI' },
  { city: 'Houston', data: 'HOU' },
  { city: 'Phoenix', data: 'PHX' },
  { city: 'Dallas', data: 'DAL' },
  { city: 'NewSea', data: 'New-SEA' },

];

const filterDataByCity = (cityCode: string) => {
  return cities.filter((item) => item.data == cityCode);
};

const VtsHubHeader: React.FC = () => {

  const handleCitySelect = (selectedCity: string) => {
    const result = filterDataByCity(selectedCity);
    // alert (selectedCity + "\n" + JSON.stringify(result));)
    let val = result && result[0] && result[0].data;
    if (val) {
      window.location.href = "/?branch=" + val;
    } else {
      window.location.href = "/";
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const queryBranchCode = searchParams.get("branch") ?? "";

  return (
    <div className='vtsactionbar flex-container'>

      {/* This is the add event button - code unchanged */}
      <div className="flex-item"><button><a href='/add-event'>Add Event</a></button></div>

      {/* The drop down that allows you to select your branch.  */}
      <CityDropdown cities={cities} branchCode={queryBranchCode} onCitySelect={handleCitySelect} />


      {/* Temporary button that does absolutely nothinggggg */}
      {/* <button><Link to="/option2">Option 2</Link></button> */}


      {/* This is the part that displays filtered data after the fact
      
      Needs to be changed so that the data doesnt show up here but instead the calendar is changed appropriately. */}
      {/* <div>
        <h2>Showing events for : {branchName}</h2>
      </div> */}
    </div>
  );
}

export default VtsHubHeader;



// const VtsHubHeader: React.FC = () => {


//   return (
//     <div className='vtsactionbar'>
//       <button><a href='/add-event'>Add Event</a></button>
//       <button><Link to="/option 2">Option 2</Link></button>
//     </div>
//   );
// }

// export default VtsHubHeader;

