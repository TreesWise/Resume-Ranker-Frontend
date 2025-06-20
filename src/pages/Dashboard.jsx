import React, { useState, useRef } from 'react';
import '../styles/styles.css';
import FileUpload from '../components/FileUpload';
import ResumeCard from '../components/ResumeCard';
import { ReactComponent as UploadIcon } from '../assets/icons/upload-icon.svg';
import { ReactComponent as FileIcon } from '../assets/icons/file-icon.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close-icon.svg';
import Modal from '../components/Modal';
import { rankResumes, uploadFolder, uploadJD } from '../services/api';


const Dashboard = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [displayFiles, setdisplayFiles] = useState([]);
  const [criteria, setCriteria] = useState({
    criterion1: "",
    criterion2: "",
    criterion3: ""
  });
  const [resumesData, setResumesData] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleResumesUpload = async () => {
    setModalOpen(false);
    try {
      const res = await uploadFolder(selectedResumes, name);
      if (res.status === 200) {
        console.log("Files uploaded successfully");
        setdisplayFiles(selectedResumes);
      } else {
        console.error("Failed to upload files");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }

    clearSelectedFiles();
  };

  const handleJobDescriptionUpload = async () => {
    if (!jobDescription || !jobTitle) {
      alert("Please provide a job description and title.");
      return;
    }
    setLoading(true);
    try {
      const res = await uploadJD(jobDescription, jobTitle, 'test');
      if (res.status === 200) {
        console.log("Job description uploaded successfully");

      } else {
        console.error("Failed to upload job description");
      }
    } catch (error) {
      console.error("Error uploading job description:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRankResumes = async () => {
    if (!criteria.criterion1 || !criteria.criterion2 || !criteria.criterion3) {
      alert("Please provide all criteria.");
      return;
    }
    if (!jobTitle) {
      alert("Please provide a job title.");
      return;
    }
    //trim all critieria values
    const updatedCriteria = Object.values(criteria).map(c => c.trim());
    try {
      setLoading(true);
      const res = await rankResumes(updatedCriteria, jobTitle, name);
      if (res.status === 200) {
        console.log("Resumes ranked successfully");
        setResumesData(res.data?.ranked_resumes);
      } else {
        console.error("Failed to rank resumes");
      }
      console.log("Ranking resumes...");
    } catch (error) {
      setLoading(false);
      console.error("Error ranking resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = idx => setdisplayFiles(prev => prev.filter((_, i) => i !== idx));

  return (
    <div className='resume-ranker-container'>
      {
        loading && <div className='loading-overlay'>
          <div className='loading-spinner'></div>
          <p>Loading...</p>
        </div>
      }
      <div className='header'>
        <h1>Resume Ranking Tool</h1>
        <button className='upload-btn' onClick={handleModalOpen}>
          <UploadIcon />
          <span>Add Resumes</span>
        </button>
      </div>
      {displayFiles && displayFiles.length > 0 &&
        <div className='card preview'>
          <h3>Resumes</h3>
          <div className='file-preview-container'>
            {displayFiles.map((file, idx) => (
              <div key={idx} className='file'>
                <div className="image">
                  <FileIcon />
                  <span className="">{file.name}</span>
                </div>
                <CloseIcon onClick={() => removeFile(idx)} />
              </div>
            ))}
          </div>
        </div>
      }
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
      <div className='card description'>
        <div className='description w-100'>
          <div className='upload-section'>
            <label>Job Role</label>
            <input name="description" id=""
              placeholder="Paste job description here..."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            >
            </input>
          </div>
          <div className='upload-section'>
            <label>Job Description</label>
            <button className='upload-btn' onClick={handleClick}>
              <UploadIcon />
              <span>Upload Job Description</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className='file-input'
              onChange={handleJDChange}
            />
          </div>
          <p>{jobDescription?.name}</p>
          <button className='' onClick={handleJobDescriptionUpload}>Submit</button>
        </div>

        <div className='upload-section'>
          <label>Criterion 1</label>
          <input type="text" value={criteria.criterion1} name="criteria1" placeholder="Enter criterion 1" onChange={(e) => setCriteria({
            ...criteria,
            criterion1: e.target.value
          })} />
        </div>
        <div className='upload-section'>
          <label>Criterion 2</label> 
          <input type="text" value={criteria.criterion2} name="criteria2" placeholder="Enter criterion 2" onChange={(e) => setCriteria({
            ...criteria,
            criterion2: e.target.value
          })} />
        </div>
        <div className='upload-section'>
          <label>Criterion 3</label>
          <input type="text" value={criteria.criterion3} name="criteria3" placeholder="Enter criterion 3" onChange={(e) => setCriteria({
            ...criteria,
            criterion3: e.target.value
          })} />
        </div>

        <button className='' onClick={handleRankResumes}>
          <span>Search</span>
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