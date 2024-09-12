import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './frontend.css';
import DengueChart from "./DengueChart";

const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });

  // Card data states
  const [totalCases, setTotalCases] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1);
  const itemsPerPage = 20;
  const pagesPerGroup = 5;

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [regions, setRegions] = useState([]);

  // State for chart's selected region
  const [chartSelectedRegion, setChartSelectedRegion] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dengueCollection = collection(db, "dengueData");
        const dengueSnapshot = await getDocs(dengueCollection);
        const dataList = dengueSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setDengueData(dataList);
  
        // Extract and sort unique regions
        const uniqueRegions = Array.from(new Set(dataList.map((data) => data.regions)))
          .sort((a, b) => a.localeCompare(b));
  
        setRegions(["All", ...uniqueRegions]);
  
        const filteredByRegion = chartSelectedRegion === "All" 
          ? dengueData 
          : dengueData.filter(data => data.regions === chartSelectedRegion);
  
        // Calculate total cases and deaths for the selected region
        const totalCasesForRegion = filteredByRegion.reduce((sum, data) => sum + Number(data.cases), 0);
        const totalDeathsForRegion = filteredByRegion.reduce((sum, data) => sum + Number(data.deaths), 0);
  
        setTotalCases(totalCasesForRegion);
        setTotalDeaths(totalDeathsForRegion);
  
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchData();
  }, [chartSelectedRegion, dengueData]);
  

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      const updatedData = dengueData.filter((data) => data.id !== id);
      setDengueData(updatedData);
      alert("Data deleted successfully!");

      // Update total cases and deaths after deletion
      const totalCases = updatedData.reduce((sum, data) => sum + Number(data.cases), 0);
      const totalDeaths = updatedData.reduce((sum, data) => sum + Number(data.deaths), 0);
      setTotalCases(totalCases);
      setTotalDeaths(totalDeaths);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });
      const updatedData = dengueData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      );
      setDengueData(updatedData);
      setEditingId(null);
      alert("Data updated successfully!");

      // Update total cases and deaths after edit
      const totalCases = updatedData.reduce((sum, data) => sum + Number(data.cases), 0);
      const totalDeaths = updatedData.reduce((sum, data) => sum + Number(data.deaths), 0);
      setTotalCases(totalCases);
      setTotalDeaths(totalDeaths);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Search and filter logic: Search across multiple fields
  const filteredData = dengueData.filter((data) =>
    Object.values({
      location: data.location,
      cases: String(data.cases),
      deaths: String(data.deaths),
      date: data.date,
      regions: data.regions,
    }).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (selectedRegion === "All" || data.regions === selectedRegion)
  );

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = filteredData.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextGroup = () => {
    if (pageGroup * pagesPerGroup < totalPages) {
      setPageGroup(pageGroup + 1);
      setCurrentPage(pageGroup * pagesPerGroup + 1);
    }
  };

  const handlePrevGroup = () => {
    if (pageGroup > 1) {
      setPageGroup(pageGroup - 1);
      setCurrentPage((pageGroup - 2) * pagesPerGroup + 1);
    }
  };

  const pageNumbers = [];
  const startPage = (pageGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(pageGroup * pagesPerGroup, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="table-container">
        <h2>Dengue Data List</h2>

        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by any field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="region-filter"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {editingId ? (
          <form className="dengue-form" onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Location"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="number"
              placeholder="Cases"
              value={editForm.cases}
              onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="number"
              placeholder="Deaths"
              value={editForm.deaths}
              onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="date"
              placeholder="Date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="text"
              placeholder="Regions"
              value={editForm.regions}
              onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
              required
              className="form-input"
            />
            <button type="submit" className="submit-button">Update Data</button>
            <button onClick={() => setEditingId(null)} className="cancel-button">Cancel</button>
          </form>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Cases</th>
                  <th>Deaths</th>
                  <th>Date</th>
                  <th>Regions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((data) => (
                    <tr key={data.id}>
                      <td>{data.location}</td>
                      <td>{data.cases}</td>
                      <td>{data.deaths}</td>
                      <td>{data.date}</td>
                      <td>{data.regions}</td>
                      <td>
                        <div className="button-group">
                          <button className="edit-button" onClick={() => handleEdit(data)}>Edit</button>
                          <button className="delete-button" onClick={() => handleDelete(data.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                className="page-button small"
                onClick={handlePrevGroup}
                disabled={pageGroup === 1}
              >
                &laquo; Prev
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`page-button small ${currentPage === number ? "active" : ""}`}
                >
                  {number}
                </button>
              ))}
              <button
                className="page-button small"
                onClick={handleNextGroup}
                disabled={pageGroup * pagesPerGroup >= totalPages}
              >
                Next &raquo;
              </button>
            </div>
          </>
        )}
      </div>

      {/* Move chart outside table-container */}
      <div className="chart-container" style={{ marginTop: '20px' }}>
  <h2>Visualization of Dengue Data</h2>
  <label htmlFor="chartRegionFilter">Filter by Region: </label>
  <select
    id="chartRegionFilter"
    value={chartSelectedRegion}
    onChange={(e) => setChartSelectedRegion(e.target.value)}
    className="chart-region-filter"
  >
    {regions.map((region) => (
      <option key={region} value={region}>
        {region}
      </option>
    ))}
  </select>

  <div className="card-container">
    <div className="card">
      <h3>Total Cases</h3>
      <p>{totalCases}</p>
    </div>
    <div className="card">
      <h3>Total Deaths</h3>
      <p>{totalDeaths}</p>
    </div>
  </div>

  {/* Dengue Data Chart */}
  <DengueChart dengueData={dengueData} selectedRegion={chartSelectedRegion} />
    </div>

    </div>
  );
};

export default DengueDataList;