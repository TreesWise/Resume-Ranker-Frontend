import React from 'react';
import './styles.css';


const getStrokeColor = (value) => {
    if (value < 30) return '#f44336'; // Red
    if (value < 60) return '#ff9800'; // Orange
    return '#4caf50';                // Green
};
const SemiCircularProgress = ({ value }) => {
    const radius = 40;
    const strokeWidth = 5;
    const circumference = Math.PI * radius; // only half-circle
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="semi-circle-wrapper">
            <svg width="100" height="50" viewBox="0 0 100 50" className="semi-circle">
                {/* Background Arc */}
                <path
                    d="M 10 45 A 40 40 0 0 1 90 45"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {/* Foreground Progress Arc */}
                <path
                    d="M 10 45 A 40 40 0 0 1 90 45"
                    fill="none"
                    stroke={getStrokeColor(value)}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
            </svg>

            <div className="semi-circle-text">
                <div className="value">{value}%</div>
            </div>
        </div>
    );
};


const CircularProgress = ({ value }) => {
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className='progress'>
            <svg className="circular-progress" width="90" height="90">
                <circle className="bg" cx="45" cy="45" r={radius} />
                <circle
                    className="progress"
                    cx="45"
                    cy="45"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ stroke: getStrokeColor(value) }}
                />

            </svg>
            <span className='number'>{value}%</span>
        </div>
    );
};

const ResumeCard = ({ resume }) => {
    const { filename, email, job_title: jobTitle, weighted_score: weightedScore, evaluation_summary, section_scores, message } = resume;

    return (
        <div className="resume-card">
            <div className="card-header">
                <div>
                    {filename && <h3>{filename}</h3>}
                    {jobTitle && <p>{jobTitle}</p>}
                    {email && <p>{email}</p>}
                </div>
                {weightedScore && <CircularProgress value={weightedScore} />}
            </div>
            {
                section_scores && Object.keys(section_scores).length > 0 && (
                    <div   className="evaluation-section" style={{
                        gridTemplateColumns: `repeat(${Object.keys(section_scores).length}, 1fr)`,
            }}>
                        {
                            Object.entries(section_scores).map(([key, { score, comment }]) => {
                                if (key !== "summary_comment") {
                                    return (
                                        <div key={key} className="criteria">
                                            <div className="criteria-header">
                                                <span className="criteria-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>

                                            </div>
                                            <SemiCircularProgress value={score} />
                                            <p className="criteria-comment">{comment}</p>
                                        </div>
                                    )
                                }
                            })}
                    </div>
                )}
            {evaluation_summary && <div className="summary">
                <strong>Summary:</strong>
                <p>{evaluation_summary}</p>
            </div>}

            {message && <div className="summary">
                <strong>Message:</strong>
                <p>{message}</p>
            </div>}
        </div>
    );
};

export default ResumeCard;
