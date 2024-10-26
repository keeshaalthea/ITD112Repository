import React, { useState } from "react";
import AddNatData from "./Components/AddNatData";
import NatDataList from "./Components/NatDataList";
import CsvUploader from "./Components/CsvUploader";
import Sidebar from "./Components/Sidebar"; // New Sidebar import

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="app-container">
      {/* Hamburger menu button to toggle sidebar */}
      <div className="hamburger-button" onClick={toggleSidebar}>
        ☰
      </div>

      {/* Conditional rendering of Sidebar based on visibility */}
      {sidebarVisible && <Sidebar />}

      <div className="content-container">
        <h1>NAT Data CRUD App</h1>

        <section id="add-nat-data">
          <AddNatData />
        </section>

        <section id="upload-csv">
          <CsvUploader />
        </section>

        <section id="nat-data-list">
          <NatDataList />
        </section>
      </div>
    </div>
  );
}

export default App;
