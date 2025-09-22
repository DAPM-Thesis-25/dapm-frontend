import { SetStateAction, useEffect, useState } from "react";
import { useAccessRequest } from "../context/accessRequestsProvider";
import type { AccessRequest } from "../api/accessRequests";

export default function AccessRequestPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentAccessRequests, setCurrentAccessRequests] = useState<AccessRequest[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
    const acc = useAccessRequest();
    const usersPerPage = 5;



    useEffect(() => {
        if (acc?.externalAccessRequests) {
            // Calculate the indices for slicing the tasks array
            const indexOfLastEvent = currentPage * usersPerPage;
            const indexOfFirstEvent = indexOfLastEvent - usersPerPage;
            const currentAccessRequests = acc.externalAccessRequests.slice(indexOfFirstEvent, indexOfLastEvent);
            //set the currentAccessRequests in the currentAccessRequests state
            setCurrentAccessRequests(currentAccessRequests);
            // Calculate total pages
            const totalPages = Math.ceil(acc.externalAccessRequests.length / usersPerPage);
            setTotalPages(totalPages)
        }
        // console.log(tasks, "table")
    }, [acc?.externalAccessRequests, currentPage, accessRequests])

    // Handle page change
    const handlePageChange = (pageNumber: SetStateAction<number>) => {
        setCurrentPage(pageNumber);
    };



    useEffect(() => {
        acc.getExternalRequests();
        setAccessRequests(acc.externalAccessRequests || []);
        // acc.getExternalRequests();
        // merge internal and external access requests
        // setAccessRequests([... (acc.accessRequests || []), ...(acc.externalAccessRequests || [])]);
    }, []);
    return (<div className="w-full">
        {/* lg:mt-[5%] sm:mt-[10%] mt-[12%] */}
        {/* <Header title="Users" button={<AddMemberButton/>} /> */}
        <div className="w-full bg-white md:p-7 p-5 shadow-md  flex justify-between">
            <h1 className="text-2xl font-semibold">Access Requests</h1>
            {/* {
                authUser.userData?.orgRole == "ADMIN" && <div className=""><AddMemberButton /></div>
            } */}
        </div>
        <div className="my-table flex flex-wrap w-full mt-5 md:p-7 p-5">
            <div className="text-center text-white p-2 table-header grid grid-cols-4 gap-2 w-full bg-[#292929] border-2 rounded border-white">
                <div className="table-header-item ">Org</div>
                <div className="table-header-item ">requestedDurationHours</div>
                <div className="table-header-item ">Status</div>
                <div className="table-header-item ">Pipeline</div>
                {/* <div className="table-header-item">Description</div> */}
            </div>
            <div className="table-body w-full ">
                {currentAccessRequests.length ? currentAccessRequests.map((request) => (
                    <div className="text-center text-black p-2 table-header w-full grid grid-cols-4  table-tr rounded  mt-2 drop-shadow-2xl">
                        <div className="table-row-item ">{request.organization}</div>
                        <div className="table-row-item ">
                            {/* <select
                                    className="p-0 cursor-pointer select priority-select  bg-transparent border-none focus:border-none text-white"
                                    name="role"
                                    disabled={auth?.user?.role === "Admin" && (user.role === "SuperAdmin" || user.role === "Admin")}
                                    value={user.role}
                                    onChange={(e) => {
                                        userProvider?.updateUser({ id: user.id, role: e.target.value });
                                    }}
                                    aria-label="Project status">
                                    <option disabled={auth?.user?.role !== "SuperAdmin"} className="bg-black" value="SuperAdmin">Super Admin</option>
                                    <option disabled={auth?.user?.role === "Admin" && user.role === "Admin"} className="bg-black" value="Admin">Admin</option>
                                    <option className="bg-black" value="User">User</option>
                                    <option className="bg-black" value="Guest">Guest</option>

                                </select> */}
                            {request.requestedDurationHours}
                        </div>
                        <div className="table-row-item  ">
                            <span className={`px-2 py-1 rounded-xl text-sm ${request.status === "PENDING" ? "bg-yellow-500" : request.status === "APPROVED" ? "bg-green-500" : "bg-red-500"}`}>{request.status}</span>
                        </div>
                        <div className="table-row-item  ">{request.pipelineName}</div>
                        {/* <div className="table-row-item ">{request.approvalToken? <span className="text-green-500"></span> : <span className="text-red-500">{request.approvalToken}</span>}</div> */}
                        {/* <DeleteMemberPopup id={user.id} handleDelete={handleDelete} openDeleteMemberPopup={openDeleteMemberPopup} setOpenDeleteMemberPopup={setOpenDeleteMemberPopup}></DeleteMemberPopup> */}
                        {/* {   !(auth?.user?.role === "Admin" && (user.role === "Admin"||user.role === "SuperAdmin") )?
                                : <p className="text-red-400">No permission</p>
                            } */}
                    </div>
                )) : (
                    <div className="table-row  w-full">
                        <div className="table-row-item w-full text-center">Loading...</div>
                    </div>
                )}
            </div>
        </div>
        <div className="flex justify-end mt-2 md:p-7 p-5">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 py-1 w-24 bg-green-600 rounded-xl text-white text-sm ${currentPage === 1 ? "bg-slate-400" : ""}`}>Previous</button>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 w-24 bg-green-600 rounded-xl text-white ml-2 text-sm ${currentPage === totalPages ? "bg-slate-400" : ""}`}>Next</button>
        </div>

    </div>
    );
}