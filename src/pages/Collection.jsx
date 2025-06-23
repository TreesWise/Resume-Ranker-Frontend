import React, { useState } from 'react';
import '../styles/styles.css';
import { getRecords } from '../services/api';
import { ReactComponent as SortIcon } from '../assets/icons/sort-icon.svg';

const Collection = () => {

  const [resumesData, setResumesData] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [searchByJob, setSearchByJob] = useState(true);
  const [loading, setLoading] = useState(false);

  const [isAsc, setIsAsc] = useState(false);

  const handleSortToggle = () => {
    setIsAsc((prev) => !prev);
  };

  const handleSearchOptionChange = (option) => {
    setSearchByJob(option === 'job');
    setJobTitle("");
    setEmail("");
  };


  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await getRecords(email, jobTitle);
      setResumesData(response.data?.ranked_resumes || response.data?.records || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching records:", error);
    }
  }

  const sortedResults = [...resumesData].sort((a, b) =>
    isAsc ? a.weighted_score - b.weighted_score : b.weighted_score - a.weighted_score
  );

  return (
    <div className='resume-ranker-container'>
      {
        loading && <div className='loading-overlay'>
          <div className='loading-spinner'></div>
          <p>Loading...</p>
        </div>
      }
      <div className="table-section">
        <h3>Ranked Resumes</h3>
        <div className='card description'>
          {searchByJob && <div className='upload-section'>
            <label>Job Title</label>
            <input type="text" value={jobTitle} placeholder="Enter Title" onChange={(e) => setJobTitle(e.target.value)} />
          </div>}
          {!searchByJob && <div className='upload-section'>
            <label>Email</label>
            <input type="email" value={email} placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
          </div>}
          <div className="checkbox-group">
            <label className="custom-checkbox">
              <input
                type="radio"
                name="searchType"
                checked={searchByJob}
                onChange={(e) => handleSearchOptionChange('job')}
              />
              <span className="checkmark"></span>
              <span>Search by Job Title</span>
            </label>

            <label className="custom-checkbox">
              <input
                type="radio"
                name="searchType"
                checked={!searchByJob}
                onChange={(e) => handleSearchOptionChange('email')}
              />
              <span className="checkmark"></span>
              <span>Search by Email</span>
            </label>
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
                  Sl/no
                </th>
                <th>
                  Email
                </th>
                <th>
                  Job Title
                </th>
                <th onClick={handleSortToggle} className='sort-option'>
                  Weighted Score %
                  <SortIcon className={`sort-icon ${isAsc ? 'asc' : 'desc'}`} />
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
                  <td>{result.weighted_score}%</td>
                  <td>{result.uploaded_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Collection;