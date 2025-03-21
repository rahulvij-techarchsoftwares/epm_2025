import React, { useEffect, useState } from "react";
import { useClient } from "../../../context/ClientContext";
import { Edit, Save, Trash2, Loader2 } from "lucide-react";
import { exportToExcel,importFromExcel ,useImportEmployees,fetchGoogleSheetData} from "../../../components/excelUtils";
import { FaFileExcel, FaGoogle } from "react-icons/fa"; 
export const Clienttable = () => {
  const { clients, fetchClients, isLoading, editClient, deleteClient } = useClient();
  const [editClientId, setEditClientId] = useState(null);
  const [editClientName, setEditClientName] = useState("");
  const [edithireId, setEdithireId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
  const [edithirethrough, setEdithirethrough] = useState("");
    const [filterBy, setFilterBy] = useState("name"); // Default filter by name
  const [editContactDetail, setEditContactDetail] = useState("");
    const [showImportOptions, setShowImportOptions] = useState(false); // FIX: Define state
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);


  const [importType, setImportType] = useState(null); // Track selected import type
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
//  const { importEmployees } = useImportEmployees(); // ✅ Extract correctly

  console.log("clients fetched", clients);
  useEffect(() => {
    fetchClients();
  }, []);
  console.log(clients);

  const filteredEmployees = clients?.data?.filter((client) => {
    if (!client || !client[filterBy]) return false;
    return client[filterBy].toString().toLowerCase().includes(searchQuery.toLowerCase());
  });
  

  const clearFilter = () => {
    setSearchQuery("");
    setFilterBy("name");
  };

    // const handleGoogleSheetImport = () => {
    //   if (!googleSheetUrl) {
    //     alert("Please enter a Google Sheets link.");
    //     return;
    //   }
    //   fetchGoogleSheetData(googleSheetUrl, importEmployees);
    // };

  // const handleImport = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  
  //   importFromExcel(file, (data) => {
  //     console.log("Imported Data (Before adding to system):", data);
  //     importEmployees(data); // ✅ Add employees to the system
  //   });
  // };

  

  const handleEditClick = (client) => {
    setEditClientId(client.id);
    setEditClientName(client.name);
    setEdithireId(client.hire_on_id);
    setEdithirethrough(client.hire_through)
    setEditContactDetail(client.contact_detail);
  };

  const handleSaveClick = async () => {
    if (!editClientName.trim() || !edithireId.trim() || !editContactDetail.trim() || !edithirethrough.trim()) return;
    setIsUpdating(true);

    await editClient(editClientId, editClientName, edithireId, edithirethrough, editContactDetail);

    setIsUpdating(false);
    setEditClientId(null);
  };

  const handleDeleteClick = async (clientId) => {
    if (deleteConfirm === clientId) {
      await deleteClient(clientId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(clientId);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex justify-between items-center">
      <div className="p-6 pb-3">
        <h2 className="text-xl font-semibold text-gray-800">Clients Management</h2>
        <p className="text-sm text-gray-500 mt-1">View, edit and manage Clients</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 border p-3 rounded-lg shadow-md bg-white">
        <input
          type="text"
          placeholder={`Search by ${filterBy}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
  value={filterBy}
  onChange={(e) => setFilterBy(e.target.value)}
  className="px-3 py-2 border rounded-md bg-white cursor-pointer focus:outline-none"
>
  <option value="name">Client Name</option>
  <option value="hire_on_id">Hiring Id</option>
  <option value="hire_through">Hiring Platform</option>
</select>


        <button 
          onClick={() => clearFilter()} 
          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Clear
        </button>
      </div>
      <div className="flex gap-3">
      <button
            onClick={() => setShowImportOptions(!showImportOptions)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Import
          </button>
      <button
  onClick={() => exportToExcel(clients.data || [], "clients.xlsx")}
  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
>
  Export to Excel
</button>
</div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Client Name</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Hiring Id</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Hiring Platform</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Contact Details</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              
  {isLoading ? (
    <tr>
      <td colSpan="4" className="px-6 py-8 text-center">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
          <span className="text-gray-500">Loading clients...</span>
        </div>
      </td>
    </tr>
  ) : clients?.data?.length > 0 ? (
    filteredEmployees.map((client) => (
      <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-150">
        <td className="px-6 py-4 text-gray-800 font-medium text-sm">
          {editClientId === client.id ? (
            <input
              type="text"
              value={editClientName}
              onChange={(e) => setEditClientName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
              autoFocus
            />
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
              {client.name}
            </span>
          )}
        </td>
        <td className="px-6 py-4 text-gray-600 text-sm">
          {editClientId === client.id ? (
            <input
              type="text"
              value={edithireId}
              onChange={(e) => setEdithireId(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
            />
          ) : (
            client.hire_on_id || "N/A"
          )}
        </td>
        <td className="px-6 py-4 text-gray-600 text-sm">
          {editClientId === client.id ? (
            <input
              type="text"
              value={edithirethrough}
              onChange={(e) => setEdithirethrough(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
            />
          ) : (
            client.hire_through || "N/A"
          )}
        </td>
        <td className="px-6 py-4 text-gray-600 text-sm">
          {editClientId === client.id ? (
            <input
              type="text"
              value={editContactDetail}
              onChange={(e) => setEditContactDetail(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
            />
          ) : (
            client.contact_detail
          )}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            {editClientId === client.id ? (
              <button
                onClick={handleSaveClick}
                disabled={isUpdating}
                className="inline-flex items-center justify-center px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                Save
              </button>
            ) : (
              <button
                onClick={() => handleEditClick(client)}
                className="inline-flex items-center justify-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}

            <button
              onClick={() => handleDeleteClick(client.id)}
              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md transition ${
                deleteConfirm === client.id
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "border border-red-500 text-red-500 hover:bg-red-50"
              }`}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {deleteConfirm === client.id ? "Confirm" : "Delete"}
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="px-6 py-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-full bg-gray-100 p-3">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
          <p className="mt-1 text-sm text-gray-500">No clients have been added yet.</p>
        </div>
      </td>
    </tr>
  )}
</tbody>

          </table>
          
        </div>
      </div>
      
   
   
             {showImportOptions && (
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-30">
       <div className="bg-white rounded-lg shadow-lg p-6 w-96 flex flex-col gap-4 animate-fadeIn">
         <h3 className="text-lg font-semibold text-gray-800 text-center">Select Import Type</h3>
   
         <button
           onClick={() => {
             setImportType("excel");
             setShowImportOptions(false);
           }}
           className="flex items-center justify-center gap-3 w-full px-4 py-3 text-gray-700 border rounded-md hover:bg-gray-100 transition"
         >
           <FaFileExcel className="text-green-600 text-xl" />
           <span>Import Excel</span>
         </button>
   
         <button
           onClick={() => {
             setImportType("googleSheet");
             setShowImportOptions(false);
           }}
           className="flex items-center justify-center gap-3 w-full px-4 py-3 text-gray-700 border rounded-md hover:bg-gray-100 transition"
         >
           <FaGoogle className="text-blue-500 text-xl" />
           <span>Import Google Sheet</span>
         </button>
   
         <button
           onClick={() => setShowImportOptions(false)}
           className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
         >
           Cancel
         </button>
       </div>
     </div>
   )}
         
   

         {importType === "excel" && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
           <div className="mt-3 p-4 border rounded-lg bg-white shadow-md flex flex-col gap-3">
             <p className="text-gray-700 font-medium">Upload an Excel File:</p>
             <input
               type="file"
               accept=".xlsx, .xls"
              //  onChange={handleImport}
               className="px-3 py-2 border rounded-md cursor-pointer"
             />
               <button
           onClick={() => setImportType("")}
           className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
         >
           Cancel
         </button>
           </div>
           
           </div>
         )}
   
         {importType === "googleSheet" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
           <div className="mt-3 p-4 border rounded-lg bg-white shadow-md flex flex-col gap-3">
             <p className="text-gray-700 font-medium">Paste Google Sheet Link:</p>
             <input
               type="text"
               placeholder="Enter Google Sheet link"
               value={googleSheetUrl}
               onChange={(e) => setGoogleSheetUrl(e.target.value)}
               className="px-3 py-2 border rounded-md w-72 focus:outline-none"
             />
             <button
              //  onClick={handleGoogleSheetImport}
               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
             >
               Import from Google Sheets
             </button>
             <button
           onClick={() => setImportType("")}
           className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
         >
           Cancel
         </button>
           </div>
           </div>
         )}
    </div>
  );
};
