import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './frontend.css';
import NatChart from "./NatChart";

const NatDataList = () => {
  const [natData, setNatData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    lastName: "",
    firstName: "",
    age: "",
    sex: "",
    ethnic: "",
    academicPerformance: "",
    academicDescription: "",
    iq: "",
    typeSchool: "",
    socioEconomicStatus: "",
    studyHabit: "",
    natResults: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Only for showing/hiding the edit form
  const [notification, setNotification] = useState(""); // For success notification
  const [averageNatScore, setAverageNatScore] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({
    sex: "All",
    ethnic: "",
    academicDescription: "All",
    iq: "All",
    typeSchool: "All",
    socioEconomicStatus: "All",
    studyHabit: "All",
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1);
  const itemsPerPage = 20;
  const pagesPerGroup = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolTypes, setSchoolTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const natCollection = collection(db, "natData");
        const natSnapshot = await getDocs(natCollection);
        const dataList = natSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNatData(dataList);

        const uniqueSchoolTypes = Array.from(new Set(dataList.map((data) => data.typeSchool)))
          .sort((a, b) => a.localeCompare(b));

        setSchoolTypes(["All", ...uniqueSchoolTypes]);

        const filteredByFilters = dataList.filter((data) =>
          (selectedFilters.sex === "All" || data.sex === selectedFilters.sex) &&
          (selectedFilters.ethnic === "" || data.ethnic.toLowerCase().includes(selectedFilters.ethnic.toLowerCase())) &&
          (selectedFilters.academicDescription === "All" || data.academicDescription === selectedFilters.academicDescription) &&
          (selectedFilters.iq === "All" || data.iq === selectedFilters.iq) &&
          (selectedFilters.typeSchool === "All" || data.typeSchool === selectedFilters.typeSchool) &&
          (selectedFilters.socioEconomicStatus === "All" || data.socioEconomicStatus === selectedFilters.socioEconomicStatus) &&
          (selectedFilters.studyHabit === "All" || data.studyHabit === selectedFilters.studyHabit)
        );

        const totalNatScores = filteredByFilters.reduce((sum, data) => sum + Number(data.natResults), 0);
        const averageScore = filteredByFilters.length > 0 ? (totalNatScores / filteredByFilters.length).toFixed(2) : 0;

        setAverageNatScore(averageScore);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [selectedFilters]);

  const handleFilterChange = (category, value) => {
    if (value === "All") {
      removeFilter(category);
    } else {
      setSelectedFilters({ ...selectedFilters, [category]: value });
      if (!activeFilters.some(filter => filter.category === category)) {
        setActiveFilters([...activeFilters, { category, value }]);
      } else {
        setActiveFilters(activeFilters.map(filter => filter.category === category ? { category, value } : filter));
      }
    }
  };

  const removeFilter = (category) => {
    setSelectedFilters({ ...selectedFilters, [category]: "All" });
    setActiveFilters(activeFilters.filter((filter) => filter.category !== category));
  };

  const handleDelete = async (id) => {
    const natDocRef = doc(db, "natData", id);
    try {
      await deleteDoc(natDocRef);
      const updatedData = natData.filter((data) => data.id !== id);
      setNatData(updatedData);
      setNotification("Data deleted successfully!");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      lastName: data.lastName,
      firstName: data.firstName,
      age: data.age,
      sex: data.sex,
      ethnic: data.ethnic,
      academicPerformance: data.academicPerformance,
      academicDescription: data.academicDescription,
      iq: data.iq,
      typeSchool: data.typeSchool,
      socioEconomicStatus: data.socioEconomicStatus,
      studyHabit: data.studyHabit,
      natResults: data.natResults,
    });
    setIsEditing(true); // Show the update form
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const natDocRef = doc(db, "natData", editingId);
    try {
      await updateDoc(natDocRef, {
        lastName: editForm.lastName,
        firstName: editForm.firstName,
        age: Number(editForm.age),
        sex: editForm.sex,
        ethnic: editForm.ethnic,
        academicPerformance: Number(editForm.academicPerformance),
        academicDescription: editForm.academicDescription,
        iq: editForm.iq,
        typeSchool: editForm.typeSchool,
        socioEconomicStatus: editForm.socioEconomicStatus,
        studyHabit: editForm.studyHabit,
        natResults: Number(editForm.natResults),
      });
      const updatedData = natData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      );
      setNatData(updatedData);
      setEditingId(null);
      setIsEditing(false); // Close the form
      setNotification("Data updated successfully!"); // Show success notification
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const filteredData = natData.filter((data) => {
    const searchText = searchTerm.toLowerCase();
    const matchesSearch =
      data.lastName.toLowerCase().includes(searchText) ||
      data.firstName.toLowerCase().includes(searchText) ||
      String(data.age).includes(searchText) ||
      data.sex.toLowerCase().includes(searchText) ||
      data.ethnic.toLowerCase().includes(searchText) ||
      data.academicDescription.toLowerCase().includes(searchText) ||
      data.iq.toLowerCase().includes(searchText) ||
      data.typeSchool.toLowerCase().includes(searchText) ||
      data.socioEconomicStatus.toLowerCase().includes(searchText) ||
      data.studyHabit.toLowerCase().includes(searchText) ||
      String(data.natResults).includes(searchText);

    const matchesFilters =
      (selectedFilters.sex === "All" || data.sex === selectedFilters.sex) &&
      (selectedFilters.ethnic === "" || data.ethnic.toLowerCase().includes(selectedFilters.ethnic.toLowerCase())) &&
      (selectedFilters.academicDescription === "All" || data.academicDescription === selectedFilters.academicDescription) &&
      (selectedFilters.iq === "All" || data.iq === selectedFilters.iq) &&
      (selectedFilters.typeSchool === "All" || data.typeSchool === selectedFilters.typeSchool) &&
      (selectedFilters.socioEconomicStatus === "All" || data.socioEconomicStatus === selectedFilters.socioEconomicStatus) &&
      (selectedFilters.studyHabit === "All" || data.studyHabit === selectedFilters.studyHabit);

    return matchesSearch && matchesFilters;
  });

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = filteredData.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleCancelEdit = () => {
    setIsEditing(false); // This will hide the edit form
};

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
      {/* Conditionally apply blur to the background */}
      <div className={isEditing ? 'blur-container' : ''}>
        <div className="table-container">
          <h2>NAT Data List</h2>

          <div className="search-filter-container">
            <input
              type="text"
              placeholder="Search by any field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />

            {/* Filter Options Dropdown with Submenus */}
            <div className="dropdown">
              <button className="dropdown-button">Filter Options</button>
              <div className="dropdown-content">
                <div className="dropdown-category">
                  <span>Sex</span>
                  <div className="dropdown-submenu">
                    <button onClick={() => handleFilterChange("sex", "All")}>All</button>
                    <button onClick={() => handleFilterChange("sex", "Female")}>Female</button>
                    <button onClick={() => handleFilterChange("sex", "Male")}>Male</button>
                  </div>
                </div>

                <div className="dropdown-category">
                  <span>Ethnic</span>
                  <div className="dropdown-submenu">
                    <input
                      type="text"
                      placeholder="Ethnic"
                      value={selectedFilters.ethnic}
                      onChange={(e) => handleFilterChange("ethnic", e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="dropdown-category">
                  <span>Academic Description</span>
                  <div className="dropdown-submenu">
                    <button onClick={() => handleFilterChange("academicDescription", "All")}>All</button>
                    <button onClick={() => handleFilterChange("academicDescription", "Outstanding")}>Outstanding</button>
                    <button onClick={() => handleFilterChange("academicDescription", "Very Satisfactory")}>Very Satisfactory</button>
                    <button onClick={() => handleFilterChange("academicDescription", "Fairly Satisfactory")}>Fairly Satisfactory</button>
                    <button onClick={() => handleFilterChange("academicDescription", "Satisfactory")}>Satisfactory</button>
                    <button onClick={() => handleFilterChange("academicDescription", "Did not meet expectation")}>Did not meet expectation</button>
                  </div>
                </div>

                <div className="dropdown-category">
                  <span>IQ</span>
                  <div className="dropdown-submenu">
                    <button onClick={() => handleFilterChange("iq", "All")}>All</button>
                    <button onClick={() => handleFilterChange("iq", "High")}>High</button>
                    <button onClick={() => handleFilterChange("iq", "Average")}>Average</button>
                    <button onClick={() => handleFilterChange("iq", "Low")}>Low</button>
                  </div>
                </div>

                <div className="dropdown-category">
                  <span>Type of School</span>
                  <div className="dropdown-submenu">
                    <button onClick={() => handleFilterChange("typeSchool", "All")}>All</button>
                    <button onClick={() => handleFilterChange("typeSchool", "Public")}>Public</button>
                    <button onClick={() => handleFilterChange("typeSchool", "Private")}>Private</button>
                  </div>
                </div>

                <div className="dropdown-category">
                  <span>Socio-Economic Status</span>
                  <div className="dropdown-submenu">
                    <button onClick={() => handleFilterChange("socioEconomicStatus", "All")}>All</button>
                    <button onClick={() => handleFilterChange("socioEconomicStatus", "Above poverty line")}>Above poverty line</button>
                    <button onClick={() => handleFilterChange("socioEconomicStatus", "On poverty line")}>On poverty line</button>
                    <button onClick={() => handleFilterChange("socioEconomicStatus", "Below poverty line")}>Below poverty line</button>
                  </div>
                </div>

                <div className="dropdown-category">
                  <span>Study Habit</span>
                  <div className="dropdown-submenu">
                    <button onClick={() => handleFilterChange("studyHabit", "All")}>All</button>
                    <button onClick={() => handleFilterChange("studyHabit", "Excellent")}>Excellent</button>
                    <button onClick={() => handleFilterChange("studyHabit", "Good")}>Good</button>
                    <button onClick={() => handleFilterChange("studyHabit", "Poor")}>Poor</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active filters */}
            <div className="active-filters">
              {activeFilters.map((filter, index) => (
                <div key={index} className="filter-tag">
                  <span>{filter.category}: {filter.value}</span>
                  <button onClick={() => removeFilter(filter.category)} className="remove-filter-button">x</button>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable table */}
          <div className="table-scrollable">
            <table>
              <thead>
                <tr>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>Ethnic</th>
                  <th>Academic Performance</th>
                  <th>Academic Description</th>
                  <th>IQ</th>
                  <th>Type of School</th>
                  <th>Socio-economic Status</th>
                  <th>Study Habit</th>
                  <th>NAT Results</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((data) => (
                    <tr key={data.id}>
                      <td>{data.lastName}</td>
                      <td>{data.firstName}</td>
                      <td>{data.age}</td>
                      <td>{data.sex}</td>
                      <td>{data.ethnic}</td>
                      <td>{data.academicPerformance}</td>
                      <td>{data.academicDescription}</td>
                      <td>{data.iq}</td>
                      <td>{data.typeSchool}</td>
                      <td>{data.socioEconomicStatus}</td>
                      <td>{data.studyHabit}</td>
                      <td>{data.natResults}</td>
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
                    <td colSpan="13">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
        </div>
      </div>

      {/* Show the dimmed background when editing */}
      {isEditing && <div className="dim-background"></div>}

      {/* Update Form (Pop-up) */}
      {isEditing && (
        <div className="edit-form-popup">
          <h2>Update NAT Data</h2>
          <form className="nat-form" onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Last Name"
              value={editForm.lastName}
              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="text"
              placeholder="First Name"
              value={editForm.firstName}
              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="number"
              placeholder="Age"
              value={editForm.age}
              onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
              required
              className="form-input"
            />
            <select
              value={editForm.sex}
              onChange={(e) => setEditForm({ ...editForm, sex: e.target.value })}
              required
              className="form-input"
            >
              <option value="">Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="text"
              placeholder="Ethnic"
              value={editForm.ethnic}
              onChange={(e) => setEditForm({ ...editForm, ethnic: e.target.value })}
              className="form-input"
            />
            <input
              type="number"
              placeholder="Academic Performance"
              value={editForm.academicPerformance}
              onChange={(e) => setEditForm({ ...editForm, academicPerformance: e.target.value })}
              required
              className="form-input"
            />
            <select
              value={editForm.academicDescription}
              onChange={(e) => setEditForm({ ...editForm, academicDescription: e.target.value })}
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
              value={editForm.iq}
              onChange={(e) => setEditForm({ ...editForm, iq: e.target.value })}
              required
              className="form-input"
            >
              <option value="">IQ</option>
              <option value="High">High</option>
              <option value="Average">Average</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={editForm.typeSchool}
              onChange={(e) => setEditForm({ ...editForm, typeSchool: e.target.value })}
              required
              className="form-input"
            >
              <option value="">Type of School</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
            <select
              value={editForm.socioEconomicStatus}
              onChange={(e) => setEditForm({ ...editForm, socioEconomicStatus: e.target.value })}
              required
              className="form-input"
            >
              <option value="">Socio-Economic Status</option>
              <option value="Above poverty line">Above poverty line</option>
              <option value="On poverty line">On poverty line</option>
              <option value="Below poverty line">Below poverty line</option>
            </select>
            <select
              value={editForm.studyHabit}
              onChange={(e) => setEditForm({ ...editForm, studyHabit: e.target.value })}
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
              value={editForm.natResults}
              onChange={(e) => setEditForm({ ...editForm, natResults: e.target.value })}
              required
              className="form-input"
            />
           <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button type="button" className="cancel-button2" onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="submit" className="submit-button">Update Data</button>
          </div>

          </form>
        </div>
      )}

      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}

        {/* Move chart outside table-container */}
      <div id="average-nat-score"  className="chart-container" style={{ marginTop: '20px' }}>
        <h2>Visualization of NAT Data</h2>
        
      <div className="card-container">
        <div className="card">
          <h3>Average NAT Score</h3>
          <p>{averageNatScore}</p>
        </div>
      </div>

      {/* Add the NatChart component here */}
      <NatChart natData={natData} />
        </div>

        </div>

    
  );
};

export default NatDataList;
