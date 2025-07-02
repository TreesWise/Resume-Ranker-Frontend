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
  const [modalOpen, setModalOpen] = useState(false);
  const [jdModalOpen, setJdModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [displayFiles, setdisplayFiles] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [resumesData, setResumesData] = useState([]);
  const [jobRole, setJobRole] = useState("");
  const [criteriaView, setCriteriaView] = useState(false);
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

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const clearSelectedFiles = () => {
    setSelectedResumes([]);
  }

  const handleModalClose = () => {
    setModalOpen(false);
    clearSelectedFiles();
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

  const handleResumesUpload = async () => {

    if (selectedResumes.length === 0) {
      toast.error("Please select at least one resume to upload");
      return;
    }
    setModalOpen(false);
    setLoading(true);
    setLoadMessage("Uploading resumes...");
    try {
      const res = await uploadFolder(selectedResumes, name);
      if (res.status === 200) {
        console.log("Files uploaded successfully");
        setdisplayFiles(selectedResumes);
        toast.success("Resumes uploaded successfully");
      } else {
        console.error("Failed to upload files");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files");
    } finally {
      setLoading(false);
    }
    
    clearSelectedFiles();
  };

  const handleJobDescriptionUpload = async () => {
    if (!jobDescription || !jobTitle) {
      setError("Please provide both job description and job title");
      return;
    }
    setLoadMessage("Uploading job description...");
    setLoading(true);
    try {
      const res = await uploadJD(jobDescription, jobTitle, 'test');
      if (res.status === 200) {
        console.log("Job description uploaded successfully");
        toast.success("Job description uploaded successfully");
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
    //trim all critieria values
    const updatedCriteria = criteria.map(item => ({
      criterion: item.criteria.trim(),
      weight: Number(item.weight)
    }))
   
    try {
      setLoadMessage("Ranking resumes...");
      setLoading(true);
      const res = await rankResumes(updatedCriteria, jobRole, name);
      if (res.status === 200) {
        console.log("Resumes ranked successfully");
        setResumesData(res.data?.ranked_resumes);
        toast.success("Resumes ranked successfully");
      } else {
        console.error("Failed to rank resumes");
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

  const removeFile = idx => setdisplayFiles(prev => prev.filter((_, i) => i !== idx));

  const handleAdd = () => {
    setCriteriaView(true)
    const newItem = { id: Date.now(), criteria: '', weight: '' };
    setCriteria([...criteria, newItem]);
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
      <div className='card header'>
        <h3>Add Job Description</h3>
        <button className='upload-btn' onClick={() => setJdModalOpen(true)}>
          <img src={UploadIcon} alt="Upload Icon" />
          Upload</button>
      </div>
      <div className='card'>
        <div className='header'>
          <h3>Upload Resumes</h3>
          <button className='upload-btn' onClick={handleModalOpen}>
            <img src={UploadIcon} alt="Upload Icon" />
            <span>Add Resumes</span>
          </button>
        </div>
        {displayFiles && displayFiles.length > 0 &&
          <div className='preview'>
            <div className='file-preview-container'>
              {displayFiles.map((file, idx) => (
                <div key={idx} className='file'>
                  <div className="image">
                    <img src={FileIcon} alt="File Icon" />
                    <span className="">{file.name}</span>
                  </div>
                  <img src={CloseIcon} onClick={() => removeFile(idx)} />
                </div>
              ))}
            </div>
          </div>
        }
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
      <Modal
        modalOpen={modalOpen}
        onModalClose={handleModalClose}
      >
        <div className='card input-section'>
          <h3>Upload Resumes</h3>
          <label>Name</label>
          <input name="description" id=""
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
          </input>
          <label htmlFor="file-upload">Resumes (PDF)</label>
          <FileUpload files={selectedResumes} setFiles={setSelectedResumes} />
          <button className='upload' onClick={handleResumesUpload}>Upload Resumes</button>
        </div>
      </Modal>
      <div className="card">
        <div className='job-section'>
          <Select title={"Select Job Role"} data={jobRoles} selectedValue={jobRole} onSelectValue={handleSelectJobRole} />
          <div className="criteria-section">
            <p className="section-title">Ranking Criteria</p>
            {!criteriaView ? <div className='section-add' onClick={handleAdd}>
              <img src={addLarge} alt="Add Icon" />
              <p>Add Criteria</p>
            </div> :
              <DynamicInputCreation data={criteria} setData={setCriteria} />
            }
          </div>
        </div>
        <button className="submit-btn w-full" onClick={handleRankResumes}>
          <span>Rank Resumes</span>
        </button>
      </div>

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