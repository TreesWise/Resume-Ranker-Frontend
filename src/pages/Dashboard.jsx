import React, { useState, useRef, useEffect } from 'react';
import '../styles/styles.css';
import FileUpload from '../components/FileUpload';
import ResumeCard from '../components/ResumeCard';
import UploadIcon from '../assets/icons/upload-icon.svg';
import FileIcon from '../assets/icons/file-icon.svg';
import addLarge from '../assets/icons/add-xl.svg';
import CloseIcon from '../assets/icons/close-icon.svg';
import Modal from '../components/Modal';
import { getJobRoles, rankResumes, uploadFolder, uploadJD } from '../services/api';
import DynamicInputCreation from '../components/DynamicAdd';
import toast from 'react-hot-toast';
import Select from '../components/Select';

const Dashboard = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [jdModalOpen, setJdModalOpen] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [name, setName] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [resumesData, setResumesData] = useState([]);
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMessage, setLoadMessage] = useState("Loading...");
  const [jobRoles, setJobRoles] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleJDChange = (e) => {
    setJobDescription(e.target.files[0]);
  };


  const clearSelectedFiles = () => {
    setSelectedResumes([]);
  }

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

  useEffect(() => {

    fetchJobRoles();
  }, []);

  const handleResumesUpload = async () => {

    if (selectedResumes.length === 0) {
      toast.error("Please select at least one resume to upload");
      return;
    }
    setLoading(true);
    setLoadMessage("Uploading resumes...");
    try {
      const res = await uploadFolder(selectedResumes, name);
      if (res.status === 200) {
        console.log("Files uploaded successfully");
       setResumeUploaded(true);
        toast.success("Resumes uploaded successfully");
      } else {
        console.error("Failed to upload files");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files");
      setResumeUploaded(false);
    } finally {
      setLoading(false);
    }
  
  };

  const handleJobDescriptionUpload = async () => {
    if (!jobDescription || !jobTitle) {
      setError("Please provide both job description and job title");
      return;
    }
    setLoadMessage("Uploading job description...");
    setJdModalOpen(false);
    setLoading(true);
    try {
      const res = await uploadJD(jobDescription, jobTitle, 'test');
      if (res.status === 200) {
        console.log("Job description uploaded successfully");
        toast.success("Job description uploaded successfully");
        setJobDescription("");
        setJobTitle("");
        fetchJobRoles();
      } else {
        console.error("Failed to upload job description");
      }
    } catch (error) {
      toast.error("Error uploading job description");
      console.error("Error uploading job description:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRankResumes = async () => {
    
    if(!resumeUploaded) {
      toast.error("Please upload resumes before ranking");
      return;
    }

    if(criteria.some(item => item.criteria.trim() === "")) {
      toast.error("Please fill all criteria fields");
      return;
    }
    //trim all critieria values
    const updatedCriteria = criteria.map(item => ({
      criterion: item.criteria.trim()
    }))

    try {
      setLoadMessage("Ranking resumes...");
      setLoading(true);
      const res = await rankResumes(updatedCriteria, jobRole, name);
      if (res.status === 200) {
        console.log("Resumes ranked successfully");
        setResumesData(res.data?.ranked_resumes);
        toast.success("Resumes ranked successfully");
        setResumeUploaded(false);
        setSelectedResumes([]);
        setCriteria([]);
      } else {
        console.error("Failed to rank resumes");
        toast.error("Failed to upload resumes");
      }
      console.log("Ranking resumes...");
    } catch (error) {
      setLoading(false);
      toast.error("Error ranking resumes");
      console.error("Error ranking resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJobRole = (value) => {
    setJobRole(value);
  }

  return (
    <div className='resume-ranker-container'>
      {
        loading && <div className='loading-overlay'>
          <div className='loading-spinner'></div>
          <p>{loadMessage}</p>
        </div>
      }
      <h1>Resume Ranking Tool</h1>
      <div className='card'>
        <div className='header'>
          <h3>Add Job Description</h3>
          <button className='upload-btn' onClick={() => setJdModalOpen(true)}>
            <img src={UploadIcon} alt="Upload Icon" />
            Upload</button>
        </div>
      </div>
      <Modal
        modalOpen={jdModalOpen}
        onModalClose={() => {
          setJdModalOpen(false);
          setError(null);
          setJobTitle("");
          setJobDescription("");
        }}
      >
        <div className="input-row">
          <div className="input-group">
            <label>Job Role</label>
            <input
              type="text"
              placeholder="Enter job title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Job Description (PDF or DOCX)</label>
            <div className='upload-area'>
              <div className="file-upload">
                {jobDescription ?
                  <div className='file-preview'>
                    <p className="file-name">{jobDescription.name}</p>
                    <div onClick={handleClick} className='add-more'>browse your device...</div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      className="file-input"
                      onChange={handleJDChange}
                    />
                  </div>
                  : <div onClick={handleClick}>
                    {/* <img src={UploadIcon} alt="Upload" /> */}
                    <span>Upload JD</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      className="file-input"
                      onChange={handleJDChange}
                    />
                  </div>}
              </div>

              <div className="submit-btn">
                <button onClick={handleJobDescriptionUpload}>Submit JD</button>
              </div>

            </div>
            {error && <p className='error-message'>{error}</p>}
          </div>
        </div>
      </Modal>
      <div className="card">
        <div className='job-section'>
          <div className='card'>
            <Select title={"Select Job Role"} data={jobRoles} selectedValue={jobRole} onSelectValue={handleSelectJobRole} />
            <div className='input-section'>
              <label>Name</label>
              <input name="description" id=""
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              >
              </input>
              <label htmlFor="file-upload">Resumes (PDF)</label>
              <FileUpload files={selectedResumes} setFiles={setSelectedResumes} />
              <button className='upload-btn' onClick={handleResumesUpload}>Upload resumes</button>
            </div>
          </div>

          <div className="criteria-section card">
            <p className="section-title">Ranking Criteria</p>
            <DynamicInputCreation data={criteria} setData={setCriteria} />
          </div>
        </div>
  
      </div>
      <button className="submit-btn w-full" onClick={handleRankResumes}>
          <span>Rank Resumes</span>
        </button>
      <div className='display-container'>
        {
          (resumesData && resumesData.length > 0) ?
            resumesData.map((item, index) => (
              <ResumeCard key={index} resume={item} />
            ))
            : <div className='no-resumes'>No resumes to display</div>
        }
      </div>

    </div>
  )
}

export default Dashboard