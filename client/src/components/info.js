import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Info({ curspot }) {
  const [addr, setAddr] = useState('');
  useEffect(() => {
    async function reverseGeocode(latitude, longitude) {
      const url = `https://api.opencagedata.com/geocode/v1/json?key=f7a3314cbe3c473381945aa639e573e4&q=${latitude},${longitude}&pretty=1`;

      try {
        const response = await axios.get(url);
        const { results } = response.data;

        if (results.length > 0) {
          // Extract the desired address components from the response
          const { road, city, state, country } = results[0].components;

          // Do whatever you want with the address components
          console.log(`Reverse geocoded address: ${road}, ${city}, ${state}, ${country}`);
          setAddr(`${road}, ${city}, ${state}, ${country}`);
        } else {
          console.log('No results found.');
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    // Call the reverseGeocode function with your latitude and longitude values
    reverseGeocode(curspot.latitude, curspot.longitude);
  }, [curspot]); // Include curspot in the dependency array

  return (
    <div className='infobox'>
      <div>Nearspot:{curspot.index}</div>
      <div >Owner: Pramod</div>
      <div>Address: {addr}</div>
    </div>
  );
}
