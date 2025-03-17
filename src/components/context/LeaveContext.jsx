import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/ApiConfig';

const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const token = localStorage.getItem("userToken");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addLeave = async (leaveData) => {
    setLoading(true);
    setError(null);
  
    try {
      console.log("Sending Leave Data to API:", leaveData);
  
      const response = await axios.post(
        `${API_URL}/api/add-leave`,
        leaveData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("API Response:", response.data);
      return response.data;
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <LeaveContext.Provider value={{ addLeave, loading, error }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  return useContext(LeaveContext);
};
