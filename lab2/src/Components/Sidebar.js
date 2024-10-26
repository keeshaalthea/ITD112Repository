import React, { useState } from "react";
import './frontend.css';

const Sidebar = () => {
  const [showSubmenu1, setShowSubmenu1] = useState(false);
  const [showSubmenu2, setShowSubmenu2] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(true);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div>
      <div className={`sidebar ${sidebarActive ? '' : 'collapsed'}`}>
        {/* Hamburger Toggle moved to the right */}
        <div className="hamburger" onClick={toggleSidebar} style={{ position: 'absolute', right: '15px', top: '20px' }}>
          &#9776;
        </div>

        <ul className="sidebar-list">
          {/* Add NAT Data */}
          <li className="sidebar-item">
            <a href="#add-nat-data">
              <span className={`menu-item-text ${sidebarActive ? '' : 'hidden-text'}`}>Add NAT Data</span>
            </a>
          </li>

          {/* Upload CSV */}
          <li className="sidebar-item">
            <a href="#upload-csv">
              <span className={`menu-item-text ${sidebarActive ? '' : 'hidden-text'}`}>Upload CSV</span>
            </a>
          </li>

          {/* NAT Data List */}
          <li className="sidebar-item">
            <a href="#nat-data-list">
              <span className={`menu-item-text ${sidebarActive ? '' : 'hidden-text'}`}>NAT Data List</span>
            </a>
          </li>

          {/* Average NAT Score */}
          <li className="sidebar-item">
            <a href="#average-nat-score">
              <span className={`menu-item-text ${sidebarActive ? '' : 'hidden-text'}`}>Average NAT Score</span>
            </a>
          </li>

          {/* Student Population Composition */}
          <li
            className="sidebar-item"
            onMouseEnter={() => setShowSubmenu1(true)}
            onMouseLeave={() => setShowSubmenu1(false)}
          >
            <a href="#student-population-composition">
              <span className={`menu-item-text ${sidebarActive ? '' : 'hidden-text'}`}>
                Student Population Composition
              </span>
              {sidebarActive && <span className="dropdown-icon">&#9662;</span>}
            </a>
            {showSubmenu1 && sidebarActive && (
              <ul className="submenu">
                <li><a href="#stacked-chart">*Stacked Bar Chart</a></li> 
                <li><a></a>  </li> 
                <li><a href="#pie-chart">*Pie Chart</a></li>
              </ul>
            )}
          </li>

          {/* NAT Score Distribution */}
          <li
            className="sidebar-item"
            onMouseEnter={() => setShowSubmenu2(true)}
            onMouseLeave={() => setShowSubmenu2(false)}
          >
            <a href="#nat-score-distribution">
              <span className={`menu-item-text ${sidebarActive ? '' : 'hidden-text'}`}>
                NAT Score Distribution
              </span>
              {sidebarActive && <span className="dropdown-icon">&#9662;</span>}
            </a>
            {showSubmenu2 && sidebarActive && (
              <ul className="submenu">
                <li><a href="#histogram">*Histogram</a></li>
                <li><a></a></li> 
                <li><a href="#violin-plot">*Violin Plot</a></li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
