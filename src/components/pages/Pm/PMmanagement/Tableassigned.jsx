import React, { useEffect, useState } from "react";
import { usePMContext } from "../../../context/PMContext";
import { Loader2, Calendar, User, Briefcase, BarChart, Search } from "lucide-react";

export const Tableassigned = () => {
    const { employeeProjects, loading, fetchEmployeeProjects } = usePMContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetchEmployeeProjects(); // Fetch employee project details on mount
    }, []);

    useEffect(() => {
        if (Array.isArray(employeeProjects?.data?.projects)) {
            const filtered = employeeProjects.data.projects.filter((project) =>
                project.project_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData([]); // Handle case where no data exists
        }
    }, [searchQuery, employeeProjects]);

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="p-8 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500">
                <div className="flex items-center gap-3 mb-3">
                    <BarChart className="h-10 w-10 text-blue-100" />
                    <h2 className="text-3xl font-bold text-white">Assigned Projects</h2>
                </div>
                <p className="text-blue-100 text-lg">Projects Assigned to Team Members</p>
            </div>

            {/* Search Input */}
            <div className="p-4 flex items-center gap-3">
                <div className="relative w-full max-w-md">
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Search by Project Name..." 
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-600 text-sm border-b border-gray-200">
                                {[ 
                                    { label: "Project Name", icon: Briefcase },
                                    { label: "Client Name", icon: User },
                                    { label: "Assigned Employees", icon: User },
                                    { label: "Deadline", icon: Calendar }
                                ].map(({ label, icon: Icon }, index) => (
                                    <th key={index} className="px-6 py-4 text-left font-semibold">
                                        <div className="flex items-center gap-2">
                                            {Icon && <Icon className="h-4 w-4 text-blue-600" />}
                                            {label}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="relative">
                                                <div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                                                <Loader2 className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                            <span className="text-gray-600 text-lg font-medium">Loading assigned projects...</span>
                                            <p className="text-gray-400">Please wait while we fetch the data</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((project, index) => (
                                    <tr key={index} className="hover:bg-blue-50/50 transition-all duration-200 ease-in-out">
                                        <td className="px-6 py-4 text-gray-700">{project.project_name}</td>
                                        <td className="px-6 py-4 text-gray-700">{project.client?.name || "N/A"}</td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {project.assigned_employees?.map(emp => emp.name).join(", ") || "No Employees Assigned"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{project.deadline}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center text-gray-500">
                                        No assigned projects found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
