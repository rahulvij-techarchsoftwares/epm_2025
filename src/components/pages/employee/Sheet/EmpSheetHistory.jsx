import React, { useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { Loader2, Calendar, User, Briefcase, Clock, FileText, Target, CheckCircle, BarChart, Search, XCircle, Pencil } from "lucide-react";

export const EmpSheetHistory = () => {
      const { userProjects, error, editPerformanceSheet } = useUserContext();
    const { performanceSheets, loading } = useUserContext();
    console.log(performanceSheets);

    const sheets = performanceSheets?.data?.sheets || [];
    const [editingRow, setEditingRow] = useState(null);
    const [editedData, setEditedData] = useState({});
  
    const handleEditClick = (index, sheet) => {
      setEditingRow(index);
      setEditedData({ ...sheet });
    };
  
    const handleChange = (e, field) => {
      setEditedData({ ...editedData, [field]: e.target.value });
    };
  
    const handleSave = async (editId) => {
        if (!editId) {
          console.error("No ID provided for the sheet being edited.");
          return;
        }
        console.log("this is editing id",editId);
      
        const requestData = {
          id: editId, 
          data: {
            project_id: editedData.project_id,
            date: editedData.date,
            time: editedData.time,
            work_type: editedData.work_type,
            activity_type: editedData.activity_type,
            narration: editedData.narration,
            project_type: editedData.project_type,
            project_type_status: editedData.project_type_status,
          },
        };
      
        try {
          const response = await editPerformanceSheet(requestData);
          
          if (response) {
            // Update UI after successful save
            setEditingRow(null);
          }
        } catch (error) {
          console.error("Error saving performance sheet:", error);
        }
      };
    

      const getStatusStyles = (status) => {
        if (!status || typeof status !== "string") {
            return "bg-gray-50 text-gray-700 ring-1 ring-gray-700/20 hover:bg-gray-100";
        }
        
        const safeStatus = String(status).toLowerCase(); // Ensure it's a string
        switch (safeStatus) {
            case "rejected":
                return "bg-red-50 text-red-700 ring-1 ring-red-700/20 hover:bg-red-100";
            case "pending":
                return "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-700/20 hover:bg-yellow-100";
            case "approved":
            case "completed":
                return "bg-green-50 text-green-700 ring-1 ring-green-700/20 hover:bg-green-100";
            default:
                return "bg-gray-50 text-gray-700 ring-1 ring-gray-700/20 hover:bg-gray-100";
        }
    };
    
    const getStatusIcon = (status) => {
        if (!status || typeof status !== "string") {
            return <Clock className="h-4 w-4" />;
        }
    
        const safeStatus = String(status).toLowerCase(); // Ensure it's a string
        switch (safeStatus) {
            case "rejected":
                return <XCircle className="h-4 w-4" />;
            case "pending":
                return <Clock className="h-4 w-4" />;
            case "approved":
            case "completed":
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };
    
    

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="p-10 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                <BarChart className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white">Performance History</h2>
                        </div>
                        <p className="text-blue-100 text-lg max-w-2xl">
                            Track your professional journey, monitor progress, and review achievements across all your projects and activities.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-3xl font-bold text-white">{sheets.length}</div>
                            <div className="text-blue-100">Total Records</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700 text-sm font-semibold border-b border-gray-200">
                                {[
                                    { label: "Date", icon: Calendar },
                                    { label: "Client Name", icon: User },
                                    { label: "Project Name", icon: Briefcase },
                                    { label: "Work Type", icon: Target },
                                    { label: "Activity", icon: Clock },
                                    { label: "Time", icon: Clock },
                                    { label: "Project Type", icon: Clock },
                                    { label: "Project Type Status", icon: Clock },
                                    { label: "Narration", icon: FileText },

                                    { label: "Status", icon: CheckCircle }
                                ].map(({ label, icon: Icon }, index) => (
                                    <th key={index} className="px-6 py-5 text-left">
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4 text-blue-600" />
                                            <span className="text-gray-900">{label}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
      {loading ? (
        <tr>
          <td colSpan="9" className="px-6 py-20 text-center">Loading...</td>
        </tr>
      ) : sheets.length > 0 ? (
        sheets.map((sheet, index) => (
          <tr key={index} className="hover:bg-blue-50/50 transition-all duration-200 ease-in-out group">
            <td className="px-6 py-4 text-gray-700 font-medium">
              {editingRow === index ? (
                <input
                  type="date"
                  value={editedData.date}
                  onChange={(e) => handleChange(e, "date")}
                  className="border rounded px-2 py-1"
                />
              ) : (
                sheet.date
              )}
            </td>
            <td className="px-6 py-4">
                {sheet.client_name}
            </td>
            <td className="px-6 py-4">
  {editingRow === index ? (
    <select
      id="projectId"
      name="projectId"
      value={editedData.project_id} 
      onChange={(e) => handleChange(e, "project_id")}
      className="min-w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
    >
      <option value="">Select Project</option>
      {loading && <option disabled>Loading...</option>}
      {error && <option disabled>Error loading projects</option>}
      {Array.isArray(userProjects?.data) && userProjects.data.length > 0 ? (
        userProjects.data.map((project) => (
          <option key={project.id} value={project.id}>
            {project.project_name}
          </option>
        ))
      ) : (
        !loading && !error && <option disabled>No projects found</option>
      )}
    </select>
  ) : (
    sheet.project_name
  )}
</td>

           <td className="px-6 py-4">
  {editingRow === index ? (
    <select
      id="workType"
      name="workType"
      value={editedData.work_type}
      onChange={(e) => handleChange(e, "work_type")}
      className="min-w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
    >
      <option value="">Select Work Type</option>
      <option value="WFO">Work From Office</option>
      <option value="WFH">Work From Home</option>
    </select>
  ) : (
    sheet.work_type
  )}
</td>

            <td className="px-6 py-4">
  {editingRow === index ? (
    <select
      id="activityType"
      name="activityType"
      value={editedData.activity_type}
      onChange={(e) => handleChange(e, "activity_type")}
      className="min-w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
    >
      <option value="">Select Activity Type</option>
      <option value="Billable">Billable</option>
      <option value="Non Billable">Non - Billable</option>
      <option value="In House">In House</option>
    </select>
  ) : (
    sheet.activity_type
  )}
</td>

            <td className="px-6 py-4">
              {editingRow === index ? (
                <input
                  type="time"
                  value={editedData.time}
                  onChange={(e) => handleChange(e, "time")}
                  className="border rounded px-2 py-1"
                />
              ) : (
                sheet.time
              )}
            </td>

            <td className="px-6 py-4">
  {editingRow === index ? (
    <select
      id="project_type"
      name="project_type"
      value={editedData.project_type}
      onChange={(e) => handleChange(e, "project_type")}
      className="min-w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
    >
      <option value="">Project Type</option>
      <option value="Fixed">Fixed</option>
      <option value="Hourly">Hourly</option>
    </select>
  ) : (
    sheet.project_type
  )}
</td>


<td className="px-6 py-4">
  {editingRow === index ? (
    <select
      id="project_type_status"
      name="project_type_status"
      value={editedData.project_type_status}
      onChange={(e) => handleChange(e, "project_type_status")}
      className="min-w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
    >
      <option value="">Project Type</option>
      <option value="Tracker">Tracker</option>
      <option value="Offline">Offline</option>
    </select>
  ) : (
    sheet.project_type_status
  )}
</td>
            <td className="px-6 py-4">
              {editingRow === index ? (
                <input
                  type="text"
                  value={editedData.narration}
                  onChange={(e) => handleChange(e, "narration")}
                  className="border rounded px-2 py-1"
                />
              ) : (
                sheet.narration
              )}
            </td>
            <td className="px-6 py-4">
              {editingRow === index ? (
                <button onClick={() => handleSave(sheet.id)} className="px-3 py-1 bg-green-500 text-white rounded">
                  Save
                </button>
              ) : (
                <span
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${getStatusStyles(sheet.status)}`}
                >
                  {getStatusIcon(sheet.status)}
                  {sheet.status}
                </span>
              )}
              {sheet.status &&
                                                ['pending', 'rejected'].includes(String(sheet.status).toLowerCase()) && (
                                                    <button onClick={() => handleEditClick(index, sheet)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-all">
                                                        <Pencil className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9" className="px-6 py-20 text-center">No performance sheets found</td>
        </tr>
      )}
    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmpSheetHistory;