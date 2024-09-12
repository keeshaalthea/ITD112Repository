import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ScatterChart, Scatter } from 'recharts';
import moment from 'moment'; // Import moment to handle date filtering

const DengueChart = ({ dengueData, selectedRegion }) => {
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [xAxisField, setXAxisField] = useState('cases'); // Default X axis field
  const [yAxisField, setYAxisField] = useState('deaths'); // Default Y axis field
  const [showChartType, setShowChartType] = useState('both'); // Chart type: 'both', 'bar', or 'scatter'

  if (!dengueData || !Array.isArray(dengueData)) {
    return <p>No data available</p>;
  }

  // Extract unique months and years from the dengueData
  const months = Array.from(new Set(dengueData.map(data => moment(data.date).format('MMMM'))));
  const years = Array.from(new Set(dengueData.map(data => moment(data.date).format('YYYY'))));

  // Filter the data by the selected region, month, and year
  const filteredData = dengueData
    .filter(data => selectedRegion === "All" || data.regions === selectedRegion)
    .filter(data => selectedMonth === 'All' || moment(data.date).format('MMMM') === selectedMonth)
    .filter(data => selectedYear === 'All' || moment(data.date).format('YYYY') === selectedYear);

  // Sort the filtered data by regions alphabetically if "All" is selected
  const sortedData = selectedRegion === "All"
    ? filteredData.sort((a, b) => a.regions.localeCompare(b.regions)) // Sort alphabetically by region
    : filteredData;

  // Available numeric fields for X and Y axis selection
  const availableNumericFields = ['cases', 'deaths'];

  // Custom Tooltip for ScatterPlot to include location
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { cases, deaths, location } = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#f4f4f4', padding: '10px', border: '1px solid #ccc' }}>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Cases:</strong> {cases}</p>
          <p><strong>Deaths:</strong> {deaths}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for BarChart to include both region and location
  const CustomTooltipB = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { cases, deaths, location, regions } = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#f4f4f4', padding: '10px', border: '1px solid #ccc' }}>
          <p><strong>Region:</strong> {regions}</p> {/* Display the region */}
          <p><strong>Location:</strong> {location}</p> {/* Display the location */}
          <p><strong>Cases:</strong> {cases}</p>
          <p><strong>Deaths:</strong> {deaths}</p>
        </div>
      );
    }
    return null;
  };

  // Total Cases and Deaths
  const totalCases = filteredData.reduce((acc, curr) => acc + curr.cases, 0);
  const totalDeaths = filteredData.reduce((acc, curr) => acc + curr.deaths, 0);

  return (
    <div className="chart-container">
    
      {/* Chart type selection */}
      <div className="chart-selection" style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="radio"
            value="both"
            checked={showChartType === 'both'}
            onChange={() => setShowChartType('both')}
          />
          Show Both Charts
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            value="bar"
            checked={showChartType === 'bar'}
            onChange={() => setShowChartType('bar')}
          />
          Show Bar Chart Only
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            value="scatter"
            checked={showChartType === 'scatter'}
            onChange={() => setShowChartType('scatter')}
          />
          Show Scatterplot Only
        </label>
      </div>

      {/* Filters */}
      <div className="filter-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div className="filter-group" style={{ display: 'flex', gap: '20px', marginRight:'60px', marginLeft:'60px' }}>
          <div>
            <label htmlFor="monthFilter">Filter by Month:</label>
            <select
              id="monthFilter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="chart-filter"
            >
              <option value="All">All</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="yearFilter">Filter by Year:</label>
            <select
              id="yearFilter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="chart-filter"
            >
              <option value="All">All</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="axis-selection" style={{ display: 'flex', gap: '20px' }}>
          <div>
            <label htmlFor="xAxisSelect">X-Axis:</label>
            <select
              id="xAxisSelect"
              value={xAxisField}
              onChange={(e) => setXAxisField(e.target.value)}
              className="chart-filter"
              style={{ marginLeft: '10px', marginRight: '20px' }}
            >
              {availableNumericFields.map((field) => (
                <option key={field} value={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)} {/* Capitalize field names */}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="yAxisSelect">Y-Axis:</label>
            <select
              id="yAxisSelect"
              value={yAxisField}
              onChange={(e) => setYAxisField(e.target.value)}
              className="chart-filter"
              style={{ marginLeft: '10px' }}
            >
              {availableNumericFields.map((field) => (
                <option key={field} value={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)} {/* Capitalize field names */}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conditionally render Bar Chart, Scatterplot, or Both */}
      {showChartType === 'both' || showChartType === 'bar' ? (
        <ResponsiveContainer width="100%" height={650}>
          <div><h3 style={{ textAlign: 'center', marginTop: '30px' }}>Bar Chart of Dengue Data</h3></div>
          <BarChart data={sortedData} margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={selectedRegion === "All" ? "regions" : "location"}  // Dynamically change the X-axis field
              angle={-55}
              textAnchor="end"
              dy={10}
              tick={{ fontSize: 13 }} 
            />
            <YAxis />
            <Tooltip content={<CustomTooltipB />} />
            <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 200 }} />
            <Bar dataKey="cases" fill="#194878" name="Cases" />
            <Bar dataKey="deaths" fill="#CC0033" name="Deaths" />
          </BarChart>
        </ResponsiveContainer>
      ) : null}

      {showChartType === 'both' || showChartType === 'scatter' ? (
        <div>
          <h3 style={{ textAlign: 'center', marginTop: '70px' }}>Scatterplot of Dengue Deaths and Cases</h3>
          <ResponsiveContainer width={970} height={400}>
            <ScatterChart margin={{ top: 20, right: 20, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey={xAxisField}
                name={xAxisField.charAt(0).toUpperCase() + xAxisField.slice(1)}
                label={{ value: xAxisField.charAt(0).toUpperCase() + xAxisField.slice(1), position: 'bottom', offset: -5 }}
              />
              <YAxis
                type="number"
                dataKey={yAxisField}
                name={yAxisField.charAt(0).toUpperCase() + yAxisField.slice(1)}
                label={{ value: yAxisField.charAt(0).toUpperCase() + yAxisField.slice(1), angle: -90, position: 'insideLeft' }}
              />
              <Scatter name={`${xAxisField} vs ${yAxisField}`} data={filteredData} fill="#194878" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </div>
  );
};

export default DengueChart;
