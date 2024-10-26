import React, { useState } from "react";
import Plot from 'react-plotly.js'; // Import Plotly correctly
import './frontend.css';  // Assuming you have this CSS file to modify the styling

const NatChart = ({ natData }) => {

  const [pieCategory, setPieCategory] = useState('ethnic'); // Default to ethnicity for the pie chart filter

  // Data preparation for Stacked Bar Chart: socio-economic status, school type, and gender
  const socioEconomicLabels = Array.from(new Set(natData.map(data => data.socioEconomicStatus)));
  const genderLabels = ["Male", "Female"];
  const schoolTypes = ["Public", "Private"];

  // Calculate proportions for each socio-economic status group
  const socioEconProportions = socioEconomicLabels.map(status => 
    natData.filter(data => data.socioEconomicStatus === status).length / natData.length
  );

  // Calculate the breakdown within each socio-economic status by gender and school type
  const genderSchoolData = genderLabels.map(gender => {
    return schoolTypes.map(schoolType => {
      return socioEconomicLabels.map(status => {
        return natData.filter(data =>
          data.socioEconomicStatus === status &&
          data.sex === gender &&
          data.typeSchool === schoolType
        ).length;
      });
    });
  });

  // Preparing trace data for Stacked Bar chart (stacked bar chart with varying widths)
  const traces = [];
  genderLabels.forEach((gender, genderIndex) => {
    schoolTypes.forEach((schoolType, schoolIndex) => {
      const hoverText = `${gender} - ${schoolType}`;
      traces.push({
        x: socioEconomicLabels,  // socio-economic categories
        y: genderSchoolData[genderIndex][schoolIndex],
        width: socioEconProportions,  
        name: `${gender} - ${schoolType}`,
        type: 'bar',
        marker: {
          color: genderIndex === 0 ? (schoolIndex === 0 ? '#1e90ff' : '#0066cc') : (schoolIndex === 0 ? '#99ccff' : '#003d7a'),
        },
        text: genderSchoolData[genderIndex][schoolIndex],
        hovertemplate: `<b>${hoverText}</b><br>Socio-economic Status: %{x}<br>Count: %{y}<extra></extra>`,
        textposition: 'auto',
        hoverinfo: 'x+y+text',
      });
    });
  });

  // Data for Pie Chart (Composition based on filter)
  const pieLabels = Array.from(new Set(natData.map(data => data[pieCategory])));
  const pieValues = pieLabels.map((label) =>
    natData.filter((data) => data[pieCategory] === label).length
  );

  // Data for Histogram (NAT Scores Distribution)
  const natScores = natData.map(data => data.natResults);

  // Trace for the Histogram with spacing/outline and custom hover format
  const histogramTrace = {
    x: natScores,  // NAT scores data
    type: 'histogram',
    marker: {
      color: '#0066cc',
      line: {
        color: 'white',  // Outline color (creates spacing)
        width: 1.5       // Adjust the width for more or less spacing
      }
    },
    hoverinfo: 'x+y',
    hovertemplate: 'Range: %{x}<br>Count: %{y}',  // Custom hover text format
    name: 'NAT Scores',
  };

  // Data for Violin Plot (NAT Results by School Type)
  const publicSchoolNatResults = natData.filter(data => data.typeSchool === 'Public').map(data => data.natResults);
  const privateSchoolNatResults = natData.filter(data => data.typeSchool === 'Private').map(data => data.natResults);

  // Handle filter changes for the pie chart
  const handlePieCategoryChange = (event) => {
    setPieCategory(event.target.value);
  };

  return (
    <div className="chart-container" style={{ margin: "30px", width: "100%", maxWidth: "1000px" }}>
      {/* Composition Chart for Socio-economic Status, School Type, and Gender */}
      <div id="stacked-chart" style={{ marginBottom: "60px", textAlign: "center" }}>
        <h2 style={{ color: '#1247C1' }}>Student Population Composition by Socio-economic Status, School Type, and Gender</h2>
        <Plot
          data={traces}
          layout={{
            barmode: 'stack',
            title: 'Socio-economic, School Type, and Gender Composition (Stacked Bar Chart)',
            xaxis: { title: 'Socio-economic Status' },
            yaxis: { title: 'Student Count' },
            width: 900,  // Increased width
            height: 600,  // Increased height
            showlegend: true,
            legend: { orientation: 'h', y: -0.2, xanchor: 'center', x: 0.5 },  // Center the legend
            hovermode: 'closest',
            colorway: ['#99ccff', '#1e90ff', '#0066cc', '#003d7a'],  // Shades of blue
          }}
          config={{ displayModeBar: false }}  // Disable toolbar above the chart
        />
      </div>

      {/* Pie Chart for Composition based on filter */}
      <div id="pie-chart" style={{ marginBottom: "60px", textAlign: "center" }}>
        <h2 style={{ color: '#1247C1' }}>Student Composition by Ethnicity, Sex, Type of School, and Socioeconomic Status</h2>
        <label style={{ marginLeft: "20px" }}>
          Select Category for Pie Chart:
          <select value={pieCategory} onChange={handlePieCategoryChange} style={{ marginLeft: "10px", padding: "5px", fontSize: "16px" }}>
            <option value="ethnic">Ethnicity</option>
            <option value="sex">Sex</option>
            <option value="typeSchool">Type of School</option>
            <option value="socioEconomicStatus">Socio-economic Status</option>
          </select>
        </label>
        <Plot
          data={[{
            type: 'pie',
            labels: pieLabels,
            values: pieValues,
            marker: { colors: ['#99ccff', '#1e90ff', '#0066cc', '#003d7a'] },
          }]}
          layout={{
            title: `Composition by ${pieCategory.charAt(0).toUpperCase() + pieCategory.slice(1)}`,
            colorway: ['#99ccff', '#1e90ff', '#0066cc', '#003d7a'],  // Shades of blue
            width: 700,  
            height: 700,  
          }}
          config={{ displayModeBar: false }}  // Disable toolbar above the chart
        />
      </div>

      {/* Histogram for NAT Scores with spacing */}
      <div id="histogram" style={{ marginBottom: "60px", textAlign: "center" }}>
        <h2 style={{ color: '#1247C1' }}>Distribution of National Achievement Test (NAT) Scores</h2>
        <Plot
          data={[histogramTrace]}  // Use histogram trace for NAT scores
          layout={{
            title: 'Histogram of NAT Scores Distribution',
            xaxis: { title: 'NAT Scores' },
            yaxis: { title: 'Frequency' },  // Show frequency on y-axis
            colorway: ['#0066cc'],  // Use blue shade for bars
            width: 900,  // Increased width
            height: 600,  // Increased height
          }}
          config={{ displayModeBar: false }}  // Disable toolbar above the chart
        />
      </div>

      {/* Violin Plot for NAT Results by School Type */}
      <div id="violin-plot" style={{ marginBottom: "60px", textAlign: "center" }}>
        <h2 style={{ color: '#1247C1' }}>NAT Results by School Type</h2>
        <Plot
          data={[
            {
              type: 'violin',
              y: publicSchoolNatResults,
              box: { visible: true },
              line: { color: '#1e90ff' },
              meanline: { visible: true },
              name: 'Public School',
            },
            {
              type: 'violin',
              y: privateSchoolNatResults,
              box: { visible: true },
              line: { color: '#003d7a' },
              meanline: { visible: true },
              name: 'Private School',
            }
          ]}
          layout={{
            title: 'Violin Plot of NAT Results by School Type',
            yaxis: { title: 'NAT Results' },
            xaxis: { title: 'School Type' },
            colorway: ['#99ccff', '#1e90ff', '#0066cc', '#003d7a'],  // Shades of blue
            width: 900,  // Increased width
            height: 600,  // Increased height
          }}
          config={{ displayModeBar: false }}  // Disable toolbar above the chart
        />
      </div>
    </div>
  );
};

export default NatChart;