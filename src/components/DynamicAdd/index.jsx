import React, { useState } from 'react';
import './style.css';
import addIcon from '../../assets/icons/add-icon.svg';
import removeIcon from '../../assets/icons/delete-icon.svg';

const DynamicInputCreation = ({data, setData}) => {

    const handleAdd = () => {
        const newItem = { id: Date.now(), criteria: '', weight: 0 };
        setData([...data, newItem]);
    };

    const handleRemove = (id) => {
        setData(data.filter(item => item.id !== id));
    };

    const handleChange = (id, field, value) => {
        setData(data.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    return (
        <div className='dynamic-add'>
            <div className='head'>
                <div className='title-block'>
                    <p>Add Criteria and Weightage</p>
                </div>
                <button onClick={handleAdd}>
                    <span>Add</span>
                    <img src={addIcon} alt="Add Icon" />
                </button>
            </div>
            <div className='input-container'>
                {
                    data.map((item) => (
                        <div key={item.id} className='input-block'>
                            <input 
                                type="text" 
                                placeholder="Criteria" 
                                value={item.criteria} 
                                onChange={(e) => handleChange(item.id, 'criteria', e.target.value)} 
                            />
                            <input 
                                type="number" 
                                placeholder="Weight" 
                                value={item.weight} 
                                onChange={(e) => handleChange(item.id, 'weight', e.target.value)} 
                            />
                            <div className='remove' onClick={() => handleRemove(item.id)}>
                                <img src={removeIcon} alt="Remove Icon" />  
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default DynamicInputCreation;