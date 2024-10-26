import React, { useState } from 'react';
import { db } from './firebase'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore';
import './frontend.css';

function CsvUploader() {
  const [csvFile, setCsvFile] = useState(null);
  const [notification, setNotification] = useState(""); // For success notification

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const data = [];

      // Parse CSV rows based on the columns from the NAT data file
      rows.forEach((row, index) => {
        const columns = row.split(',');
        if (columns.length >= 12 && index > 0) { // Skip header row
          data.push({
            lastName: columns[0].trim(),
            firstName: columns[1].trim(),
            age: Number(columns[2].trim()),
            sex: columns[3].trim(),
            ethnic: columns[4].trim(),
            academicPerformance: Number(columns[5].trim()), // Correcting the typo
            academicDescription: columns[6].trim(), // Correcting the typo
            iq: columns[7].trim(),
            typeSchool: columns[8].trim(),
            socioEconomicStatus: columns[9].trim(),
            studyHabit: columns[10].trim(),
            natResults: Number(columns[11].trim()),
          });
        }
      });

      try {
        const batch = data.map(async (item) => {
          await addDoc(collection(db, 'natData'), item);
        });

        await Promise.all(batch);
        // Set success notification after uploading CSV
        setNotification("CSV data uploaded successfully!");
        setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
      } catch (error) {
        console.error('Error uploading CSV data:', error);
      }
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="csv-uploader-container">
      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}
      
      <h2>Upload CSV</h2>
      <div className="csv-controls">
        <input type="file" accept=".csv" onChange={handleFileChange} className="file-input" />
        <button onClick={handleFileUpload} className="upload-button">Upload CSV</button>
      </div>
    </div>
  );
}

export default CsvUploader;
