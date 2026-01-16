// JSONData.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const ReadData = () => {
 
    const queryParams = new URLSearchParams(window.location.search);
  const jsonData = JSON.parse(queryParams.get('jsonData'));
  return (
    <div>
    <h1>Another Page</h1>
    {jsonData ? (
      <div>
        <h2>Received JSON Data</h2>
        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
      </div>
    ) : (
      <p>No JSON data received.</p>
    )}
  </div>
  );
};

export default ReadData;
