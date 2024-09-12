import React from "react";
import AddDengueData from "./Components/AddDengueData";
import DengueDataList from "./Components/DengueDataList";
import CsvUploader from "./Components/CsvUploader"; 

function App() {
  return (
    <div className="App">
      <h1>Dengue Data CRUD App</h1>
      <AddDengueData />
      {<CsvUploader /> }
      <DengueDataList />
    </div>
  );
}

export default App;