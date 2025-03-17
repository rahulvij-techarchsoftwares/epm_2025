import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/ApiConfig";
import axios from "axios";

const BDProjectsAssignedContext = createContext();

export const BDProjectsAssignedProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [assignedData, setAssignedData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();
  const [performanceSheets, setPerformanceSheets] = useState([]);

  const handleUnauthorized = (response) => {
    if (response.status === 401) {
      localStorage.removeItem("userToken");
      navigate("/");
      return true;
    }
    return false;
  };

  const fetchAssigned = async () => {
    setIsLoading(true);

    try {
        const response = await axios.get(`${API_URL}/api/assigned-all-projects`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        setAssignedData(response.data.data);
    } catch (error) {
        console.error("Error fetching assigned projects:", error);
    } finally {
        setIsLoading(false);
    }
};


  // Fetch Projects
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (handleUnauthorized(response)) return;
      const data = await response.json();
      if (response.ok) {
        setProjects(data.data || []);
      } else {
        setMessage("Failed to fetch projects.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching projects.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Project Managers
  const fetchProjectManagers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projectManager`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (handleUnauthorized(response)) return;
      const data = await response.json();
      if (response.ok) {
        setProjectManagers(data.data || []);
      } else {
        setMessage("Failed to fetch project managers.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching project managers.");
    }
  };

  

  // Assign Project to Project Manager
  const assignProject = async (projectId, managerId) => {
    setIsLoading(true);
    setMessage("");

    console.log("Assigning project:", projectId, "to manager:", managerId); // Log request data

    try {
        const response = await fetch(`${API_URL}/api/assign-project-manager`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ 
                project_id: projectId, 
                project_manager_id: managerId 
            }),
        });

        console.log("Response Status:", response.status); // Log status code
        const data = await response.json();
        console.log("Response Data:", data); // Log full response data

        if (handleUnauthorized(response)) return;

        if (response.ok) {
            setMessage("Project assigned successfully!");
        } else {
            setMessage(data.message || "Something went wrong!");
        }
    } catch (error) {
        console.error("Error while assigning project:", error); // Log any errors
        setMessage("Failed to assign project. Please try again.");
    } finally {
        setIsLoading(false);
    }
};

const fetchPerformanceDetails = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get(`${API_URL}/api/get-all-performa-sheets`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setPerformanceData(response.data.data);
  } catch (error) {
    console.error("Error fetching performance details:", error);
  } finally {
    setIsLoading(false);
  }
};


 // Approve a performance sheet
 const approvePerformanceSheet = async (id) => {

  try {
      const response = await fetch(`${API_URL}/api/get-approval-performa-sheets`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
              data: [{ id, status: "approved" }]
          })
      });

      if (response.ok) {
          setPerformanceSheets(prevSheets =>
              prevSheets.map(sheet =>
                  sheet.id === id ? { ...sheet, status: "approved" } : sheet
              )
          );
      }
  } catch (error) {
      console.error("Error approving performance sheet:", error);
  }
};

// Reject a performance sheet
const rejectPerformanceSheet = async (id) => {

  try {
      const response = await fetch(`${API_URL}/api/get-approval-performa-sheets`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
              data: [{ id, status: "rejected" }]
          })
      });

      if (response.ok) {
          setPerformanceSheets(prevSheets =>
              prevSheets.map(sheet =>
                  sheet.id === id ? { ...sheet, status: "rejected" } : sheet
              )
          );
      }
  } catch (error) {
      console.error("Error rejecting performance sheet:", error);
  }
};


  useEffect(() => {
    fetchProjects();
    fetchProjectManagers();
    fetchPerformanceDetails();
  }, []);

  return (
    <BDProjectsAssignedContext.Provider value={{ 
      projects, 
      projectManagers, 
      isLoading, 
      assignedData,
      performanceData,
      assignProject,
      fetchAssigned, 
      fetchPerformanceDetails,
      performanceSheets, 
      approvePerformanceSheet, 
      rejectPerformanceSheet,
      message 
    }}>
      {children}
    </BDProjectsAssignedContext.Provider>
  );
};

export const useBDProjectsAssigned = () => {
  return useContext(BDProjectsAssignedContext);
};
