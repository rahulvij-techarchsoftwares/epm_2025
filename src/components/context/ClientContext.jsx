import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/ApiConfig";
import { useAlert } from "./AlertContext";
const ClientContext = createContext();
export const ClientProvider = ({ children }) => {
    const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  console.log(token);
  const handleUnauthorized = (response) => {
    if (response.status === 401) {
      localStorage.removeItem("userToken");
      navigate("/");
      return true;
    }
    return false;
  };
  const addClient = async (name, hiringId, hirethrough, contactDetail) => {
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          hire_on_id: hiringId,
          hire_through: hirethrough,
          contact_detail: contactDetail,
        }),
      });
      if (handleUnauthorized(response)) return;
      const data = await response.json();
      if (response.ok) {
        // setMessage("Client added successfully!");
        showAlert({ variant: "success", title: "Success", message: "Client added successfully!" });
        fetchClients();
      } else {
        // setMessage(data.message);
        showAlert({ variant: "error", title: "Error", message: data.message });
      }
    } catch (error) {
      // setMessage("An error occurred. Please try again.");
      showAlert({ variant: "error", title: "Error", message: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (handleUnauthorized(response)) return;
      const data = await response.json();
      if (response.ok) {
        setClients(data);
        console.log(clients);
      } else {
        setMessage("Failed to fetch clients.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching clients.");
    } finally {
      setIsLoading(false);
    }
  };
  const editClient = async (id, updatedName, updatedHireId, updatedHireThrough, updatedContactDetail) => {
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedName,
          hire_on_id: updatedHireId,
          hire_through: updatedHireThrough,
          contact_detail: updatedContactDetail,
        }),
      });
      if (handleUnauthorized(response)) return;
      const data = await response.json();
      if (response.ok) {
        showAlert({ variant: "success", title: "Success", message: "Client updated successfully" });
        // setMessage("Client updated successfully!");
        fetchClients();
      } else {
        // setMessage(data.message);
        showAlert({ variant: "error", title: "Error", message:data.message });
      }
    } catch (error) {
      // setMessage("An error occurred while updating the client.");
      showAlert({ variant: "error", title: "Error", message: "An error occurred while updating the client." });
    } finally {
      setIsLoading(false);
    }
  };
  const deleteClient = async (id) => {
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (handleUnauthorized(response)) return;
      if (response.ok) {
        showAlert({ variant: "success", title: "Success", message: "Client deleted successfully!" });
        // setMessage("Client deleted successfully!");
        setClients((prevClients) =>
          Array.isArray(prevClients) ? prevClients.filter((client) => client.id !== id) : []
        );
        fetchClients();
      } else {
        // setMessage("Failed to delete client.");
        showAlert({ variant: "error", title: "Error", message:"Failed to delete client." });
      }
    } catch (error) {
      // setMessage("An error occurred while deleting the client.");
      showAlert({ variant: "error", title: "Error", message:"An error occurred while deleting the client." });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);
  return (
    <ClientContext.Provider value={{ addClient, fetchClients, editClient, deleteClient, clients, isLoading, message }}>
      {children}
    </ClientContext.Provider>
  );
};
export const useClient = () => useContext(ClientContext);