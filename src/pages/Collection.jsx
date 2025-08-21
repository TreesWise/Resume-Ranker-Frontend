import React, { useEffect, useState } from 'react';
import '../styles/styles.css';
import { getJobRoles, getRecords } from '../services/api';
import SortIcon from '../assets/icons/sort-icon.svg';
import Select from '../components/Select';

const Collection = () => {

  const [resumesData, setResumesData] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAsc, setIsAsc] = useState(false);

  const handleSortToggle = () => {
    setIsAsc((prev) => !prev);
  };

  useEffect(() => {
    const fetchJobRoles = async () => {
      setLoading(true);
      try {
        const response = await getJobRoles();
        if (response.status === 200) {
          const roles = response.data?.job_titles || [];
          setJobRoles(roles);
          console.log("Job roles fetched successfully:", roles);
        } else {
          console.error("Failed to fetch job roles");
        }
      } catch (error) {
        console.error("Error fetching job roles:", error);
        toast.error("Error fetching job roles");
      } finally {
        setLoading(false);
      }
    };
    fetchJobRoles();
  }, []);


  const handleSelectJobRole = (value) => {
    setJobTitle(value);
  }

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await getRecords(jobTitle);
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
          <Select title={"Select Job Role"} data={jobRoles} selectedValue={jobTitle} onSelectValue={handleSelectJobRole} />
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
                  <img src={SortIcon} alt="Sort Icon" className={`sort-icon ${isAsc ? 'asc' : 'desc'}`} />
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