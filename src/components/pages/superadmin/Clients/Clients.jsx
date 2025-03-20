import React, { useState } from "react";
import { useClient } from "../../../context/ClientContext";
import { Loader2 } from "lucide-react";

export const Clients = () => {
    const { addClient, isLoading, message } = useClient();
    const [clientName, setClientName] = useState("");
    const [hiringId, sethringId] = useState("");
    const [hirethrough, sethirethrough] = useState("");
    const [contactDetail, setContactDetail] = useState("");
    const [showMessage, setShowMessage] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (clientName.trim() && hiringId.trim() && hirethrough.trim() &&contactDetail.trim()) {
        await addClient(clientName, hiringId, hirethrough, contactDetail);
        setClientName(""); 
        sethringId("");
        setContactDetail("");
        sethirethrough("");
        setShowMessage(true);
        
      }
    };
  
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-3.5">
        <h2 className="text-xl font-semibold text-gray-800">Enter Client Details</h2>
        <p className="text-sm text-gray-500 mt-1">Add a new Client to the system</p>
        
        {showMessage && message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm font-medium text-center ${
              message.includes("successfully")
                ? "bg-green-50 text-green-800 border border-green-300"
                : "bg-red-50 text-red-800 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="clientName" className="block font-medium text-gray-700 text-sm">
              Client Name
            </label>
            <input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter Client Name"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
  
          <div>
            <label htmlFor="contactDetail" className="block font-medium text-gray-700 text-sm">
              Contact Details
            </label>
            <input
              id="contactDetail"
              value={contactDetail}
              onChange={(e) => setContactDetail(e.target.value)}
              placeholder="Enter Contact Details"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="hirethrough" className="block font-medium text-gray-700 text-sm">
              Hire Through
            </label>
            <input
              id="hirethrough"
              value={hirethrough}
              onChange={(e) => sethirethrough(e.target.value)}
              placeholder="Enter Contact Details"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>


          <div>
            <label htmlFor="hiringId" className="block font-medium text-gray-700 text-sm">
              Hiring Id
            </label>
            <input
              id="hiringId"
              value={hiringId}
              onChange={(e) => sethringId(e.target.value)}
              placeholder="Enter Contact Details"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
  
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Adding Client...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
  );
};