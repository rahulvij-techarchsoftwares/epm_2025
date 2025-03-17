import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Briefcase, ClipboardList, Home, FileText, Save } from 'lucide-react';
import { useUserContext } from "../../../context/UserContext";
const Addsheet = () => {

  const { submitEntriesForApproval } = useUserContext();
  const [submitting, setSubmitting] = useState(false);
  
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
  });

  const [savedEntries, setSavedEntries] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!formData.date || !formData.projectId || !formData.hoursSpent) {
      alert("Please fill all required fields before saving.");
      return;
    }

    
  
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
      {view === "dashboard" && (
        <>
          <div className="flex min-w-full flex-col items-center justify-center p-4 space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md h-60">
              <div className="flex justify-center">
                <button
                  className="text-white bg-blue-500 font-bold hover:bg-blue-600 p-2 w-32 rounded-lg text-3xl"
                  onClick={() => setView("timesheet")}
                >
                  +
                </button>
              </div>

              <div className="text-center mt-4">
                <h3 className="text-2xl font-bold text-gray-800 ">
                  Add Timesheet
                </h3>
              </div>

              <div className="mt-8 flex justify-center space-x-8">
                {/* Weekly Option */}
                <p className="flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 rounded-lg px-4 py-2 cursor-pointer transition-all duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    className="mr-2"
                    fill="currentColor"
                  >
                    <path d="M6 2h12c1.104 0 2 .896 2 2v16c0 1.104-.896 2-2 2H6c-1.104 0-2-.896-2-2V4c0-1.104.896-2 2-2zm12 2H6v16h12V4z" />
                  </svg>
                  Weekly
                </p>

                {/* Daily Option */}
                <p className="flex items-center justify-center bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 rounded-lg px-4 py-2 cursor-pointer transition-all duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    className="mr-2"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                  Daily
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Display views based on the current state */}
      {view === "standup" && (
        <>
          <div className="lg:ml-32">
            <div className="m-4">
              <h2 className="text-2xl font-bold">Welcome to StandUp</h2>
            </div>

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              <table className="min-w-full text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 w-1/4 sm:w-[150px]">
                      Project Name
                    </th>
                    <th scope="col" className="px-4 py-3 w-1/4 sm:w-[150px]">
                      Offline/Online
                    </th>
                    <th scope="col" className="px-4 py-3 w-1/4 sm:w-[150px]">
                      No. of Hours
                    </th>
                    <th scope="col" className="px-4 py-3 w-1/4 sm:w-[150px]">
                      Notes
                    </th>
                    <th scope="col" className="px-4 py-3 w-1/4 sm:w-[150px]">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 w-1/4 sm:w-[150px]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="px-4 py-3">
                      <select className="min-w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select Project</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="Offline">Offline</option>
                        <option value="Online">Online</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Notes"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 flex justify-center items-center">
                      <button
                        className="min-w-[40px] m-2 text-white bg-green-500 text-xl font-bold p-2 rounded-lg hover:bg-green-800"
                        // onClick={addRow}
                      >
                        +
                      </button>
                    </td>
                  </tr>

                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">Select Project</option>
                          <option value="">Project A</option>
                          <option value="">Project B</option>
                          <option value="">Project C</option>
                          <option value="">Project D</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="offline">Offline</option>
                          <option value="online">Online</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <textarea
                          className="min-w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Notes"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 flex justify-center items-center">
                        <button
                          className="min-w-[40px] m-2 text-white bg-red-500 text-xl font-bold p-2 rounded-lg hover:bg-red-800"
                        //   onClick={() => removeRow(index)}
                        >
                          -
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="m-4 text-center">
                <button className="bg-yellow-500 h-12 w-full sm:w-32 hover:bg-yellow-600 text-white text-center text-xl font-bold rounded">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {view === "history" && (
        <>
          <div className="min-w-full">
            <div className="m-4">
              <h2 className="text-2xl font-bold">StandUp History</h2>
            </div>

            <div className="overflow-x-auto shadow-md ml-4 sm:ml-28 sm:rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Project Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Offline/Online
                    </th>
                    <th scope="col" className="px-6 py-3">
                      No. of Hours
                    </th>
                    <th scope="col" className="px-6 py-3">
                      No. of Min.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Notes
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-300">
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      ABC
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      Online
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      4
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      30
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      Done
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      11/12/2024
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      <div className="flex space-x-4">
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                          Approved
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      XYZ
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      Online
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      2
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      00
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      xyz
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      12/12/2024
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-lg font-medium text-center"
                    >
                      <div className="flex space-x-4">
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                          Approved
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view === "timesheet" && (
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
              <option value="In House">In-House</option>
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
        <div className="mt-5">
          <h3 className="text-sm font-semibold">Saved Entries:</h3>
          <table className="min-w-full border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-1">Date</th>
                <th className="border p-1">Project</th>
                <th className="border p-1">Time Spent</th>
                <th className="border p-1">Action</th>
                <th className="border p-1">Work Type</th>
                <th className="border p-1">Narration</th>
              </tr>
            </thead>
            <tbody>
              {savedEntries.map((entry, index) => (
                <tr key={index} className="border">
                  <td className="border p-1">{entry.date}</td>
                  <td className="border p-1">{entry.projectId}</td>
                  <td className="border p-1">{entry.hoursSpent}</td>
                  <td className="border p-1">{entry.billingStatus}</td>
                  <td className="border p-1">{entry.status}</td>
                  <td className="border p-1">{entry.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {savedEntries.length > 0 && (
        <div className="flex justify-center mt-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 text-xs"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Addsheet;

