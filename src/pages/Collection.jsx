import React, { useState } from 'react';
import '../styles/styles.css';
import { getRecords } from '../services/api';

const Collection = () => {

  const [resumesData, setResumesData] = useState([]);

  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");


  const [isAsc, setIsAsc] = useState(false); // false = descending by default

  const handleSortToggle = () => {
    setIsAsc((prev) => !prev);
  };


  const handleSearch = async () => {
    try {
      const response = await getRecords(email, jobTitle);
      setResumesData(response.data?.ranked_resumes || []);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  }

  const sortedResults = [...resumesData].sort((a, b) =>
    isAsc ? a.match - b.match : b.match - a.match
  );

  return (
    <div className='resume-ranker-container'>
      <div className="table-section">
        <h3>Ranked Resumes</h3>
        <div className='card description'>
          <div className='upload-section'>
            <label>Job Title</label>
            <input type="text" value={jobTitle} placeholder="Enter criterion 2" onChange={(e) => setJobTitle(e.target.value)} />
          </div>
          <div className='upload-section'>
            <label>Email</label>
            <input type="email" value={email} placeholder="Enter criterion 2" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className='' onClick={handleSearch}>
            <span>Search</span>
          </button>
        </div>
        {resumesData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>
                  Rank
                </th>
                <th>
                  Resume Name
                </th>
                <th onClick={handleSortToggle} style={{ cursor: 'pointer' }}>
                  Match %
                  <span className="sort-icon">{isAsc ? ' ▲' : ' ▼'}</span>
                </th>
                <th>
                  Job Title
                </th>
                <th>
                  Uploaded By
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{result.email}</td>
                  <td>{result.job_title}</td>
                  <td>{result.weightedScore}%</td>
                  <td>{result.uploaded_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
        }
      </div>
    </div>
  )
}

export default Collection;