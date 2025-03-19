import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../utils/ApiConfig";
import axios from "axios";
const PMContext = createContext();

export const PMProvider = ({ children }) => {
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("userToken");
  const [isAssigning, setIsAssigning] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeeProjects, setEmployeeProjects] = useState([]);


console.log("assigned", assignedProjects);
  const fetchEmployeeProjects = async () => {
    if (!token) return; // Prevent API call if token is missing

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/get-projectof-employee-assignby-projectmanager`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token
        },
      });
      setEmployeeProjects(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const getPerformanceDetails = async () => {
    setLoading(true);
    setError(null);

    try {

      const response = await axios.get(`${API_URL}/api/get-performa-manager-emp`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setPerformanceData(response.data);
      
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // console.log("performance data", performanceData);


  const assignProjectToEmployees = async (projectId, employeeIds) => {
    setIsAssigning(true);
    setError(null);

    const requestBody = { project_id: Number(projectId), employee_ids: employeeIds.map(id => Number(id)) };


    console.log("Request Payload:", requestBody);

    try {
        const response = await fetch(`${API_URL}/api/assign-projectmanager-projectto-employee`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestBody),
        });

        const textResponse = await response.text();
        console.log("Raw Response:", textResponse);

        const data = JSON.parse(textResponse);

        if (!response.ok) {
            throw new Error(data.message || "Failed to assign employees");
        }

        return data;
    } catch (err) {
        setError(err.message);
        console.error("Assignment Error:", err);
    } finally {
        setIsAssigning(false);
    }
};




  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    
    try {

        const response = await fetch(`${API_URL}/api/get-project-manager-employee`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Sending token in headers
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch employees");
        }

        const data = await response.json();
        setEmployees(data.employees); // Assuming API returns an `employees` array
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
};
  const fetchAssignedProjects = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/assigned-projects`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("Fetching assigned projects...");

      if (response.status === 401) {
        localStorage.removeItem("userToken");
        window.location.href = "/"; 
        return;
      }

      const data = await response.json();
      // console.log("Assigned Projects Response:", data);

      if (response.ok) {
        setAssignedProjects(data.data || []);
      } else {
        setMessage(data.message || "Failed to fetch assigned projects.");
      }
    } catch (error) {
      console.error("Error fetching assigned projects:", error);
      setMessage("An error occurred while fetching assigned projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedProjects();
    fetchEmployees();
    fetchEmployeeProjects();
  }, []);

  return (
    <PMContext.Provider value={{ employeeProjects, fetchEmployeeProjects, performanceData, loading, error, getPerformanceDetails, assignProjectToEmployees, isAssigning, employees, fetchEmployees, assignedProjects, isLoading, message, fetchAssignedProjects }}>
      {children}
    </PMContext.Provider>
  );
};

export const usePMContext = () => {
  return useContext(PMContext);
};
