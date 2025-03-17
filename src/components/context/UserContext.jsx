import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/ApiConfig";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProjects, setUserProjects] = useState([]);
  const [userassignedProjects, setUserassignedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("userToken");
  
  const [performanceSheets, setPerformanceSheets] = useState([]);
  console.log(token);
  const fetchUserProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/user-projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProjects(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchUserassignedProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/user-projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Fetched projects:", response.data); // Debugging
  
      if (response.data && Array.isArray(response.data.data)) {
        setUserassignedProjects(response.data.data); // Ensure only 'data' array is stored
      } else {
        setUserassignedProjects([]); // Handle unexpected response structure
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  // Improved time formatting function
  const formatTime = (time) => {
    if (!time || typeof time !== "string") return "00:00";

    const match = time.match(/^(\d{1,2}):?(\d{0,2})$/);
    if (!match) return "00:00";

    let [_, hours, minutes] = match;
    hours = hours.padStart(2, "0");
    minutes = minutes ? minutes.padStart(2, "0") : "00"; // Default minutes to "00" if missing

    return `${hours}:${minutes}`;
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate) ? parsedDate.toISOString().split("T")[0] : "1970-01-01";
  };

  const submitEntriesForApproval = async (savedEntries) => {
    try {
      console.log("Raw savedEntries:", savedEntries);

      // Extract the array if `savedEntries.data` exists
      const entriesArray = Array.isArray(savedEntries.data) ? savedEntries.data : savedEntries;

      if (!entriesArray.length) {
        console.error("Error: entriesArray is empty!", savedEntries);
        return;
      }

      console.log("Formatted entriesArray before mapping:", entriesArray);

      const formattedData = {
        data: entriesArray.map(entry => ({
          project_id: parseInt(entry.project_id, 10) || 0,
          date: formatDate(entry.date),
          time: formatTime(entry.hoursSpent || entry.time), // Ensure time is correctly formatted
          work_type: String(entry.work_type || ""),
          activity_type: String(entry.activity_type || ""),
          narration: String(entry.narration || ""),
        }))
      };

      console.log("Submitting formattedData:", JSON.stringify(formattedData, null, 2));

      const response = await axios.post(`${API_URL}/api/add-performa-sheets`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response from server:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error submitting entries for approval:", error);

      if (error.response) {
        console.error("Server Response Error:", error.response.data);
      }
      throw error;
    }
  };


  const fetchPerformanceSheets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/get-performa-sheet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPerformanceSheets(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  const editPerformanceSheet = async (id) => {
    setLoading(true);
  
    try {
      console.log("🔍 Checking values before sending API request...");
      console.log("📌 ID:", id); // This should already contain both `id` and `data`
  
      // Ensure `id` contains the necessary fields
      if (!id || !id.id || !id.data) {
        throw new Error("Missing required data for updating the performance sheet.");
      }
  
      const payload = id; // Send only `id`, as it contains both id and data
      console.log("✅ Final Payload:", JSON.stringify(payload, null, 2));
  
      const response = await fetch(`${API_URL}/api/edit-performa-sheets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      if (!response.ok) {
        console.error("🚨 API Error:", result);
        throw new Error(result.message || "Failed to update performance sheet");
      }
      fetchPerformanceSheets();
      return result;
      
    } catch (error) {
      console.error("❌ Error updating performance sheet:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  


  useEffect(() => {
    fetchUserProjects();
    fetchPerformanceSheets();
    fetchUserassignedProjects();
  }, []);

  return (
    <UserContext.Provider value={{ editPerformanceSheet, fetchUserassignedProjects, userassignedProjects, userProjects, performanceSheets, loading, error, fetchUserProjects, submitEntriesForApproval, fetchPerformanceSheets }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
