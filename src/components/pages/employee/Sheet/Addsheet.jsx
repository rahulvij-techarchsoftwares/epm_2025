import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Briefcase, ClipboardList, Home, FileText, Save } from 'lucide-react';
import { useUserContext } from "../../../context/UserContext";
const Addsheet = () => {

  const { submitEntriesForApproval } = useUserContext();
  const [submitting, setSubmitting] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [view, setView] = useState('dashboard');
  const [rows, setRows] = useState([]);
  const [projects, setProjects] = useState([]);
  const [standups, setStandups] = useState([]);
  const [users, setUsers] = useState([]);
  const [profileName, setProfileName] = useState('');
  const { userProjects, loading, error } = useUserContext();
  const [selectedProject, setSelectedProject] = useState("");
  // console.log("projects mounted", userProjects);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    projectId: "",
    hoursSpent: "",
    billingStatus: "",
    status: "",
    notes: "",
    project_type:"",
    project_type_status:"",
  });

  const [savedEntries, setSavedEntries] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (index, field, value) => {
    const updatedEntries = [...savedEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setSavedEntries(updatedEntries);
  };

  const handleDelete = (index) => {
    const updatedEntries = savedEntries.filter((_, i) => i !== index);
    setSavedEntries(updatedEntries);
    console.log("these are saved entries", savedEntries);
  };

  const handleEditClick = (index) => {
    setEditIndex(index); 
    console.log("these are saved entries", savedEntries);
  };

  const handleSaveClick = () => {
    setEditIndex(null); 
    console.log("these are saved entries", savedEntries);
  };

  const handleSave = () => {
    if (!formData.date || !formData.projectId || !formData.hoursSpent) {
      alert("Please fill all required fields before saving.");
      return;
    }

    console.log("these are saved entries", savedEntries);
    
  
    setSavedEntries([...savedEntries, formData]);
    setFormData({
      date: new Date().toISOString().split("T")[0], // Keep date reset on save
      projectId: "",
      hoursSpent: "",
      billingStatus: "",
      status: "",
      notes: "",
    });
  };

  const formatTime = (time) => {
    if (!time || typeof time !== "string") return "00:00";
    
    let match = time.match(/^(\d{1,2}):?(\d{0,2})$/);
    if (!match) return "00:00";
  
    let [_, hours, minutes] = match;
    hours = hours.padStart(2, "0");
    minutes = minutes ? minutes.padStart(2, "0") : "00"; // Default to "00" if minutes are missing
  
    return `${hours}:${minutes}`;
  };
  

  const handleSubmit = async () => {
    if (!savedEntries.length) return;

    const formattedEntries = {
      data: savedEntries.map((entry) => ({
        project_id: entry.projectId,
        date: entry.date,
        time: entry.hoursSpent,
        work_type: entry.status,
        activity_type: entry.billingStatus,
        narration: entry.notes,
        project_type: entry.project_type,
        project_type_status: entry.project_type_status,
      })),
    };

    setSubmitting(true);
    try {
      await submitEntriesForApproval(formattedEntries);
      alert("Entries submitted for approval successfully!");
    } catch (error) {
      alert("Failed to submit entries for approval.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>

        <>
          <div>
            <div className=" min-h-screen space-x-2 min-w-full overflow-hidden">
              <div className="flex flex-col lg:flex-row p-2 ml-0 lg:ml-28">
                {/* Timesheet Form */}
                <div className="p-3 ml-0 border-t min-w-full sm:min-w-[600px] rounded-lg shadow-xl mb-5 lg:mb-0">
                <div className="">
      <div className="flex items-center justify-center mb-6">
        <ClipboardList className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Daily Timesheet</h2>
      </div>

      <form className="space-y-6">
        {/* Date Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
              readOnly
            />
          </div>
        </div>

        {/* Project and Time Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
              Project Name
            </label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out appearance-none bg-white"
            >
              <option value="">Select Project</option>
              {loading && <option disabled>Loading...</option>}
              {error && <option disabled>Error loading projects</option>}
              {Array.isArray(userProjects?.data) && userProjects.data.length > 0 ? (
                userProjects.data.map((project) => (
                  <option key={project.id} value={project.id}>{project.project_name}</option>
                ))
              ) : (
                !loading && !error && <option disabled>No projects found</option>
              )}
            </select>
          </div>

          <div className="relative">
            <label htmlFor="hoursSpent" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              Time Spent
            </label>
            <input
              type="text"
              id="hoursSpent"
              name="hoursSpent"
              value={formData.hoursSpent}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
            />
          </div>
        </div>

        {/* Billing and Work Type Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="billingStatus" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <ClipboardList className="w-4 h-4 mr-2 text-gray-400" />
              Action
            </label>
            <select
              id="billingStatus"
              name="billingStatus"
              value={formData.billingStatus}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out appearance-none bg-white"
            >
              <option value="">--Select--</option>
              <option value="Billable">Billable</option>
              <option value="Non Billable">Non-Billable</option>
              <option value="Inhouse">In-House</option>
            </select>
          </div>

          <div className="relative">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Home className="w-4 h-4 mr-2 text-gray-400" />
              Work Type
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out appearance-none bg-white"
            >
              <option value="">--Select--</option>
              <option value="WFO">Work From Office</option>
              <option value="WFH">Work from Home</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="project_type" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <ClipboardList className="w-4 h-4 mr-2 text-gray-400" />
              Project Type
            </label>
            <select
              id="project_type"
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out appearance-none bg-white"
            >
              <option value="">--Select--</option>
              <option value="Hourly">Hourly</option>
              <option value="Fixed">Fixed</option>
            </select>
          </div>

          <div className="relative">
            <label htmlFor="project_type_status" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Home className="w-4 h-4 mr-2 text-gray-400" />
              Project Type Status
            </label>
            <select
              id="project_type_status"
              name="project_type_status"
              value={formData.project_type_status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out appearance-none bg-white"
            >
              <option value="">--Select--</option>
              <option value="Offline">Offline</option>
              <option value="Tracker">Tracker</option>
            </select>
          </div>
        </div>

        {/* Narration Section */}
        <div className="relative">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            Narration
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out resize-none"
            placeholder="Enter your notes here"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Timesheet
          </button>
        </div>
      </form>
    </div>

     
                </div>


                {/* <div className="w-full sm:min-w-[600px] h-[50vh] bg-white border-gray-300 border-t m-0 lg:m-5 shadow-xl rounded overflow-auto sm:mt-0">
                  <div className="text-center font-bold text-xl p-2 border-b-2">
                    Weekly Summary
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr>
                          <th className="p-2 border-b text-left">Date</th>
                          <th className="p-2 border-b text-left">
                            Daily Timeout
                          </th>
                          <th className="p-2 border-b text-left">Avlb/Ot</th>
                          <th className="p-2 border-b text-left">Bill Hrs</th>
                          <th className="p-2 border-b text-left">Non Hours</th>
                        </tr>
                      </thead>
                      <tbody>
     
                        <tr>
                          <td className="p-2 border-b">12/01/2024</td>
                          <td className="p-2 border-b">2 hrs</td>
                          <td className="p-2 border-b">8 hrs</td>
                          <td className="p-2 border-b">7 hrs</td>
                          <td className="p-2 border-b">1 hr</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b">12/02/2024</td>
                          <td className="p-2 border-b">1.5 hrs</td>
                          <td className="p-2 border-b">7 hrs</td>
                          <td className="p-2 border-b">6 hrs</td>
                          <td className="p-2 border-b">0.5 hrs</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b">12/03/2024</td>
                          <td className="p-2 border-b">3 hrs</td>
                          <td className="p-2 border-b">9 hrs</td>
                          <td className="p-2 border-b">8 hrs</td>
                          <td className="p-2 border-b">2 hrs</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b">12/04/2024</td>
                          <td className="p-2 border-b">1 hr</td>
                          <td className="p-2 border-b">8 hrs</td>
                          <td className="p-2 border-b">7 hrs</td>
                          <td className="p-2 border-b">1 hr</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b">12/05/2024</td>
                          <td className="p-2 border-b">2.5 hrs</td>
                          <td className="p-2 border-b">8 hrs</td>
                          <td className="p-2 border-b">7.5 hrs</td>
                          <td className="p-2 border-b">1 hr</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div> */}
              </div>

              {/* Timesheet Table */}
              <div className="min-w-screen mt-8 ml-0 lg:mb-32 rounded">
                <div className="overflow-x-auto">
                       {/* Display Saved Entries */}
                       {savedEntries.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Time Entries</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Date</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Type</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Narration</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type Status</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Modify</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savedEntries.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editIndex === index ? (
                        <select
                          value={entry.projectId}
                          onChange={(e) => handleEdit(index, "projectId", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                        entry.projectId
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={entry.hoursSpent}
                          onChange={(e) => handleEdit(index, "hoursSpent", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        entry.hoursSpent
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editIndex === index ? (
                        <select
                          id="billingStatus"
                          name="billingStatus"
                          value={entry.billingStatus}
                          onChange={(e) => handleEdit(index, "billingStatus", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="">--Select--</option>
                          <option value="Billable">Billable</option>
                          <option value="Non Billable">Non-Billable</option>
                          <option value="Inhouse">In-House</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.billingStatus === 'Billable' ? 'bg-green-100 text-green-800' :
                          entry.billingStatus === 'Non Billable' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {entry.billingStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editIndex === index ? (
                        <select
                          id="status"
                          name="status"
                          value={entry.status}
                          onChange={(e) => handleEdit(index, "status", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="">--Select--</option>
                          <option value="WFO">Work From Office</option>
                          <option value="WFH">Work from Home</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'WFO' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {entry.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={entry.notes}
                          onChange={(e) => handleEdit(index, "notes", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        entry.notes
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editIndex === index ? (
                         <select
                         id="project_type"
                         name="project_type"
                         value={entry.project_type}
                         onChange={(e) => handleEdit(index, "project_type", e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                       >
                         <option value="">--Select--</option>
                         <option value="Fixed">Fixed</option>
                         <option value="Hourly">Hourly</option>
                       </select>
                      ) : (
                        entry.project_type
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {editIndex === index ? (
                         <select
                         id="project_type_status"
                         name="project_type_status"
                         value={entry.project_type}
                         onChange={(e) => handleEdit(index, "project_type_status", e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                       >
                         <option value="">--Select--</option>
                         <option value="Offline">Offline</option>
                         <option value="Tracker">Tracker</option>
                       </select>
                      ) : (
                        entry.project_type_status
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        {editIndex === index ? (
                          <button
                            onClick={handleSaveClick}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(index)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(index)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {savedEntries.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit for Approval"
            )}
          </button>
        </div>
      )}
                </div>
              </div>
            </div>
          </div>
        </>

    </>
  );
};

export default Addsheet;

