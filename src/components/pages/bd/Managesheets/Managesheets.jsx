import React, { useEffect, useState } from "react";
import { useBDProjectsAssigned } from "../../../context/BDProjectsassigned";
import { Loader2, Calendar, User, Briefcase, Clock, FileText, Target, BarChart, Search } from "lucide-react";

export const Managesheets = () => {
    const { performanceData, fetchPerformanceDetails, isLoading, approvePerformanceSheet, rejectPerformanceSheet } = useBDProjectsAssigned();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetchPerformanceDetails();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = performanceData.flatMap((user) =>
                user.sheets.filter(sheet => sheet.project_name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    }, [searchTerm, performanceData]);

    const handleStatusChange = async (sheet, newStatus) => {
        try {
            if (newStatus === "approved") {
                await approvePerformanceSheet(sheet.id);
            } else if (newStatus === "rejected") {
                await rejectPerformanceSheet(sheet.id);
            }
            fetchPerformanceDetails(); // Refresh data after status update
        } catch (error) {
            console.error("Error Updating Sheet Status:", error);
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="p-8 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500">
                <div className="flex items-center gap-3 mb-3">
                    <BarChart className="h-10 w-10 text-blue-100" />
                    <h2 className="text-3xl font-bold text-white">Manage Performance Sheet</h2>
                </div>
                <p className="text-blue-100 text-lg">Track and manage performance sheets over time</p>
            </div>

            <div className="p-4 flex items-center gap-3">
                <div className="relative w-full max-w-md">
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Search by Project Name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                                    { label: "Date", icon: Calendar },
                                    { label: "Employee Name", icon: User },
                                    { label: "Client Name", icon: User },
                                    { label: "Project Name", icon: Briefcase },
                                    { label: "Work Type", icon: Target },
                                    { label: "Activity", icon: Clock },
                                    { label: "Time", icon: Clock },
                                    { label: "Narration", icon: FileText },
                                    { label: "Status" }
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="relative">
                                                <div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                                                <Loader2 className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                            <span className="text-gray-600 text-lg font-medium">Loading your performance data...</span>
                                            <p className="text-gray-400">Please wait while we fetch your records</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (searchTerm ? filteredData : performanceData.flatMap(user => 
                                user.sheets.map(sheet => ({
                                    ...sheet,
                                    user_name: user.user_name
                                }))
                            )).map((sheet, index) => (
                                <tr key={index} className="hover:bg-blue-50/50 transition-all duration-200 ease-in-out">
                                    <td className="px-6 py-4 text-gray-700">{sheet.date}</td>
                                    <td className="px-6 py-4 text-gray-700">{sheet.user_name}</td>
                                    <td className="px-6 py-4 text-gray-700">{sheet.client_name}</td>
                                    <td className="px-6 py-4 text-gray-700">{sheet.project_name}</td>
                                    <td className="px-6 py-4 text-gray-700">{sheet.work_type}</td>
                                    <td className="px-6 py-4 text-gray-700">{sheet.activity_type}</td>
                                    <td className="px-6 py-4 text-gray-700">{sheet.time}</td>
                                    <td className="px-6 py-4 text-gray-700">{sheet.narration}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            className={`px-3 py-2 border rounded-lg cursor-pointer ${
                                                sheet.status === "approved" ? "bg-green-100 text-green-700" :
                                                sheet.status === "rejected" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}
                                            value={sheet.status}
                                            onChange={(e) => handleStatusChange(sheet, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
