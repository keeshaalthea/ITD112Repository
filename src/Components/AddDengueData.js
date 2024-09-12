import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import './frontend.css';

const AddDengueData = () => {
  const [location, setLocation] = useState("");
  const [cases, setCases] = useState("");
  const [deaths, setDeaths] = useState("");
  const [date, setDate] = useState("");
  const [regions, setRegions] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "dengueData"), {
        location,
        cases: Number(cases),
        deaths: Number(deaths),
        date,
        regions,
      });
      setLocation("");
      setCases("");
      setDeaths("");
      setDate("");
      setRegions("");
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Dengue Data</h2>
      <form className="dengue-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="number"
          placeholder="Cases"
          value={cases}
          onChange={(e) => setCases(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="number"
          placeholder="Deaths"
          value={deaths}
          onChange={(e) => setDeaths(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="text"
          placeholder="Regions"
          value={regions}
          onChange={(e) => setRegions(e.target.value)}
          required
          className="form-input"
        />
        <button type="submit" className="submit-button">Add Data</button>
      </form>
    </div>
  );
};

export default AddDengueData;
