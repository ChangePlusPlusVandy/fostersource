import React, { useState, useEffect } from "react";
import { Expand } from "lucide-react";
import { Pagination } from "../ProductPage/ProductPage";
import apiClient from "../../../services/apiClient";
import { Payment } from "../../../shared/types/payment";
import SearchDropdown from "../ComponentPage/DropDownSearch";
import { Course } from "../../../shared/types/course";

interface Registration {
    title: string; 
    user: string; 
    email: string; 
    date: Date; 
    transactionId: string; 
    paid: number; 
}

export default function RegistrationPage() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [regType, setRegType] = useState("In-Person");
    const regTypes = ["In-Person", "Online"]; 
    const [excludeZero, setExcludeZero] = useState(false); 

    const [searchOptions, setSearchOptions] = useState<string[]>([]); 
    const [searchQuery, setSearchQuery] = useState<string[]>([]); 
    const [registrations, setRegistrations] = useState<Registration[]>([]); 
    const displayedRegistrations = registrations
        .filter(registration => registration.date >= startDate && registration.date <= endDate)
        .filter(registration => searchOptions.includes(registration.title.toLowerCase()))
        .filter(registration => excludeZero ? registration.paid > 0 : true)
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); 

    const tableHeaders = ["Product Title", "Registered User Name", "Registered User Email", "Order Date", "Transaction ID", "$ Paid"]

    const fetchSearchOptions = async () => {
        try {
            const response = await apiClient.get("courses"); 

            const courseTitles: string[] = response.data.map((course: Course) => course.className.toLowerCase());

            setSearchOptions(courseTitles);
        } catch (error) {
            console.error(error); 
        }
    }

    const fetchRegistrations = async () => {
        try {
            const response = await apiClient.get("payments"); 

            const receivedPayments: Registration[] = response.data.map((payment: Payment) => ({
                // title: payment.title, 
                user: payment.userId,
                // email: payment.email,
                date: payment.date,
                // transactionId: payment._id,
            }))

            setRegistrations(receivedPayments); 
        } catch (error) {
            console.error(error); 
        }
    }; 

    const handleToggle = () => {
        setExcludeZero(!excludeZero); 
    }

    const downloadData = () => {
        const headers = Object.keys(displayedRegistrations[0]).join("\t"); // Header row
        const rows = displayedRegistrations.map((row) => Object.values(row).join("\t")).join("\n"); // Data rows

        const tsvContent = `${headers}\n${rows}`;
        const blob = new Blob([tsvContent], { type: "text/tab-separated-values" });
        const url = URL.createObjectURL(blob);

        // Create a temporary download link
        const a = document.createElement("a");
        a.href = url;
        a.download = "table_data.tsv";
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const removeQuery = (index: number) => {
        setSearchQuery(searchQuery => searchQuery.filter((_, i) => i !== index)); 
    }

    useEffect(() => {
        fetchSearchOptions(); 
        fetchRegistrations(); 
    }, []); 

    const totalPages: number = Math.ceil(displayedRegistrations.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100">  
            <div className="max-w-screen-2xl mx-auto px-8 py-6 space-y-4">
                <div className="bg-white border rounded-lg p-6">
                    <div className="flex justify-between">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Registration Report</h1>
                        </div>
                        <Expand className="w-6 border rounded-lg p-1 cursor-pointer"></Expand>
                    </div>

                    <SearchDropdown options={searchOptions} selected={searchQuery} setSelected={setSearchQuery} />

                    {searchQuery.length > 0 && (
                        <div className="flex space-x-2">
                            {searchQuery.map((courseName, idx) => (
                                <div key={idx} className="" onClick={() => removeQuery(idx)}>
                                    {courseName}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between text-xs items-center">
                        <div className="flex space-x-4">
                            <div className="space-x-2">
                                <label className="font-bold">Start Date</label>
                                <input type="date" value={startDate.toDateString()} onChange={(e) => setStartDate(new Date(e.target.value))}
                                    className="border rounded-md p-2"/>
                            </div>
                            <div className="space-x-2">
                                <label className="font-bold">End Date</label>
                                <input type="date" value={endDate.toDateString()} onChange={(e) => setEndDate(new Date(e.target.value))} 
                                    className="border rounded-md p-2"/>
                            </div>
                            <div className="space-x-2">
                                <label className="font-bold">Product Type</label>
                                <select className="border rounded-md p-2" value={regType} onChange={(e) => setRegType(e.target.value)}>
                                    {regTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" checked={excludeZero} onChange={handleToggle} 
                                    className="w-5 h-5"/>
                                <span className="font-bold">Exclude product users who paid $0</span>
                            </div>
                        </div>
                        


                        <button 
                            className="text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90"
                            style={{ backgroundColor: '#8757a3' }}
                            onClick={downloadData}
                        >
                            Download as TSV
                        </button>
                    </div>

                    <table className="w-full border border-gray-300 rounded-md border-separate border-spacing-0 text-sm mt-5">
                        <thead className="bg-gray-100 rounded-md">
                            <tr>
                                {tableHeaders.map((header, idx) => (
                                    <th key={idx} className="border border-gray-200 first:rounded-tl-md last:rounded-tr-md text-left pl-3">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRegistrations.map((registration, rowIdx) => (
                                <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                                    <td className="border border-gray-200 text-left">{registration.title}</td>
                                    <td className="border border-gray-200 text-left">{registration.user}</td>
                                    <td className="border border-gray-200 text-left">{registration.email}</td>
                                    <td className="border border-gray-200 text-left">{registration.date.toDateString()}</td>
                                    <td className="border border-gray-200 text-left">{registration.transactionId}</td>
                                    <td className="border border-gray-200 text-left">{registration.paid}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div className="flex justify-end mt-6">
                        <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages || 1}
                        onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    ); 
}