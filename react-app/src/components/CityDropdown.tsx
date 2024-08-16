import React, { useState } from 'react';

interface CityDropdownProps {
  cities: { city: string; data: string; }[];
  branchCode: string;
  onCitySelect: (selectedCity: string) => void;
}


const CityDropdown: React.FC<CityDropdownProps> = ({ cities, branchCode, onCitySelect }) => {
  const [selectedCity, setSelectedCity] = useState<string>('');


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setSelectedCity(city);
    onCitySelect(city);
  };

  return (
    <div className='flex-item'>
      <label htmlFor="city-select">Select a city:</label>
      <select id="city-select" value={branchCode} onChange={handleChange}>
        <option value="-">All</option>
        {
          cities.map((item) => (
            <option key={item.city} value={item.data}>
              {item.city}
            </option>
        ))}
      </select>
    </div>
  );
};

export default CityDropdown;
