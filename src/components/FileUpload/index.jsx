import React, { useCallback, useState } from 'react';
import './styles.css';
import UploadIcon from '../../assets/icons/upload-icon-dark.svg';
import FileIcon from '../../assets/icons/file-icon.svg';
import CloseIcon from '../../assets/icons/close-icon.svg';

const FileUpload = ({ files, setFiles, isUploading }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
        if (e.type === 'dragleave') setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter(file => file.type === 'application/pdf');

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
            setError('');
        } else {
            setError('Please upload valid PDF files');
        }
    }, [setFiles]);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles) {
            setFiles((prev) => ([...prev, ...newFiles]));
            setError('');
        } else {
            setError('Please upload a valid PDF file');
        }
    };

    const removeFile = idx => setFiles(prev => prev.filter((_, i) => i !== idx));


    return (
        <div className={`upload-wrapper ${isUploading ? 'upload-disabled' : ''}`}>
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`dropzone
          ${isDragging ? 'dragging' : ''}
          ${error ? 'error' : ''}
          ${success ? 'success' : ''}
        `}
            >
                <div className='file-preview-container'>
                    {files && files.length > 0 &&
                        files.map((file, idx) => (
                            <div key={idx} className='file'>
                                <div className="image">
                                     <img src={FileIcon} alt="File Icon" />
                                    <span className="">{file.name}</span>
                                </div>

                                <img src={CloseIcon} onClick={() => removeFile(idx)} />

                            </div>
                        ))}
                </div>
                <div className='add-files'>
                        {files.length > 0 ? (<>
                            <p className='title'>Add More Files...{' '}
                                <label
                                    htmlFor="file-upload"
                                    className=""
                                >
                                    browse your device
                                </label>
                            </p>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept=".pdf,.docx,.xlsx"
                                onChange={handleFileChange}
                            />
                        </>) : null}
                    </div>
                {!files.length > 0 && <div>
                    <img src={UploadIcon} alt="Upload Icon" className="upload-icon" />
                    <p className="upload-text">
                        Drag and drop PDF file here, or{' '}
                        <label htmlFor="file-upload" className="upload-browse">
                            browse your device
                        </label>
                    </p>
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept=".pdf,.docx,.xlsx"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                </div>}
            </div>
        </div>
    );
};

export default FileUpload;
