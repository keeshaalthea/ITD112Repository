import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import './frontend.css';

const AddNatData = () => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [ethnic, setEthnic] = useState("");
  const [academicPerformance, setAcademicPerformance] = useState("");
  const [academicDescription, setAcademicDescription] = useState("");
  const [iq, setIq] = useState("");
  const [typeSchool, setTypeSchool] = useState("");
  const [socioEconomicStatus, setSocioEconomicStatus] = useState("");
  const [studyHabit, setStudyHabit] = useState("");
  const [natResults, setNatResults] = useState("");
  const [notification, setNotification] = useState(""); // For success notification

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "natData"), {
        lastName,
        firstName,
        age: Number(age),
        sex,
        ethnic,
        academicPerformance: Number(academicPerformance),
        academicDescription,
        iq,
        typeSchool,
        socioEconomicStatus,
        studyHabit,
        natResults: Number(natResults),
      });
      console.log("Document written with ID: ", docRef.id); // Log the ID of the new document
      // Clear the form after submission
      setLastName("");
      setFirstName("");
      setAge("");
      setSex("");
      setEthnic("");
      setAcademicPerformance("");
      setAcademicDescription("");
      setIq("");
      setTypeSchool("");
      setSocioEconomicStatus("");
      setStudyHabit("");
      setNatResults("");
      setNotification("Data added successfully!");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };


  return (
    <div className="form-container">
      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}
      <h2 className="form-title">Add NAT Data</h2>
      <form className="nat-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="form-input"
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="form-input"
          />
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Sex</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
          <input
            type="text"
            placeholder="Ethnic"
            value={ethnic}
            onChange={(e) => setEthnic(e.target.value)}
            required
            className="form-input"
          />
          <input
            type="number"
            placeholder="Academic Performance"
            value={academicPerformance}
            onChange={(e) => setAcademicPerformance(e.target.value)}
            required
            className="form-input"
          />
          <select
            value={academicDescription}
            onChange={(e) => setAcademicDescription(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Academic Description</option>
            <option value="Outstanding">Outstanding</option>
            <option value="Very Satisfactory">Very Satisfactory</option>
            <option value="Fairly Satisfactory">Fairly Satisfactory</option>
            <option value="Satisfactory">Satisfactory</option>
            <option value="Did not meet expectation">Did not meet expectation</option>
          </select>
          <select
            value={iq}
            onChange={(e) => setIq(e.target.value)}
            required
            className="form-input"
          >
            <option value="">IQ</option>
            <option value="High">High</option>
            <option value="Average">Average</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={typeSchool}
            onChange={(e) => setTypeSchool(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Type of School</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
          <select
            value={socioEconomicStatus}
            onChange={(e) => setSocioEconomicStatus(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Socio-Economic Status</option>
            <option value="Above poverty line">Above poverty line</option>
            <option value="On poverty line">On poverty line</option>
            <option value="Below poverty line">Below poverty line</option>
          </select>
          <select
            value={studyHabit}
            onChange={(e) => setStudyHabit(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Study Habit</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Poor">Poor</option>
          </select>
          <input
            type="number"
            placeholder="NAT Results"
            value={natResults}
            onChange={(e) => setNatResults(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Add Data</button>
      </form>
    </div>
  );
};

export default AddNatData;
