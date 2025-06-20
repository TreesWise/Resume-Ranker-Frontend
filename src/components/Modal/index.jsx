import React from 'react';
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg';
import './styles.css';

const Modal = ({ modalOpen, children, onModalClose }) => {
  if (!modalOpen) return null;
  return (
 
      <div className="modal">
        <div className='modal-overlay'  onClick={onModalClose}>

        </div>
        <div className="modal-content-wrapper">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Modal Title</h2>
              <div onClick={onModalClose}>
                <CloseIcon className="close-icon" />
              </div>
            </div>
            <div className="modal-content">
              {children}
            </div>
          </div>
        </div>

      </div>

    
  )
}

export default Modal