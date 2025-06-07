import React, { useState } from 'react';
import IVChart from './IVChart';
import DataTable from './DataTable';
import axios from 'axios';

export default function Home() {
  const [csvData, setCsvData] = useState(null);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);

    try {
      const response = await axios.get(`/api/data/${selectedDate}.csv`);
      setCsvData(response.data);
      setError('');
    } catch (err) {
      setCsvData(null);
      setError('Data not found for selected date');
    }
  };

  return (
    <div className="app">
      <h1>IV Chart Viewer</h1>
      <input type="date" value={date} onChange={handleDateChange} />
      {error && <p className="error">{error}</p>}
      {csvData && (
        <>
          <IVChart rawCsv={csvData} />
          <DataTable rawCsv={csvData} />
        </>
      )}
    </div>
  );
}
