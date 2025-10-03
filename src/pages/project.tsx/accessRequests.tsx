import { SetStateAction, use, useEffect, useState } from "react";
import { AccessRequest } from "../../api/accessRequests";
import { useAccessRequest } from "../../context/accessRequestsProvider";
import TakeDecisionPopup from "../../components/accessReq/takeDecisionPopup";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import { useProject } from "../../context/projectProvider";
import { usePipeline } from "../../context/pipelineProvider";
import BtnPopup from "../../components/shared/btnPopup";
import RequestAccessForm from "../../components/pipeline/requestAccessForm";
import { useUser } from "../../context/usersProvides";

export default function InetrnalAccessRequestPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentAccessRequests, setCurrentAccessRequests] = useState<AccessRequest[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    const [openAccessRequestPopup, setOpenAccessRequestPopup] = useState(false);
    const projectName = pathname.split("/")[3];
    const auth = useAuth();
    const proj = useProject();
    const user = useUser();
    useEffect(() => {
        setPathname(location.pathname);
        console.log(location.pathname);
        console.log(auth.token)
    }, [location.pathname]);

    useEffect(() => {
        if (projectName) pipeline.refreshPipelines(projectName);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectName]);
    const acc = useAccessRequest();
    const pipeline = usePipeline();
    const usersPerPage = 5;




    useEffect(() => {
        if (acc?.accessRequests && pipeline?.pipelines) {
            // Collect valid pipeline names
            const validPipelineNames = pipeline.pipelines.map(p => p.name);

            // Filter requests whose pipelineName is in valid pipelines
            const filteredRequests = acc.accessRequests.filter(req =>
                validPipelineNames.includes(req.pipelineName)
            );

            // Pagination logic
            const indexOfLastEvent = currentPage * usersPerPage;
            const indexOfFirstEvent = indexOfLastEvent - usersPerPage;
            const pagedRequests = filteredRequests.slice(indexOfFirstEvent, indexOfLastEvent);

            setCurrentAccessRequests(pagedRequests);
            setTotalPages(Math.ceil(filteredRequests.length / usersPerPage));
        }
    }, [acc?.accessRequests, pipeline?.pipelines, currentPage, user.loadingRegister]);


    // Handle page change
    const handlePageChange = (pageNumber: SetStateAction<number>) => {
        setCurrentPage(pageNumber);
    };



    useEffect(() => {
        acc.getRequests();
        setAccessRequests(acc.accessRequests || []);

    }, [acc.takingDecisionLoading]);
    return (<div className="w-full">
        {/* lg:mt-[5%] sm:mt-[10%] mt-[12%] */}
        {/* <Header title="Users" button={<AddMemberButton/>} /> */}
        <div className="w-full bg-white md:p-7 p-5 shadow-md  flex justify-between">
            <h1 className="text-2xl font-semibold">Access Requests</h1>
            {
                proj.projectRolePermActions?.some(
                    (perm) => perm.action === "ACCESS_REQUEST_PE"
                ) && (
                    <BtnPopup closePopupState={openAccessRequestPopup} title="Request Access" btnText="Request Access" className="bg-[#ff5722] text-white px-4 py-1 rounded hover:bg-[#e64a19] transition duration-300 ease-in-out">
                        <RequestAccessForm setOpenRequestAccessPopup={setOpenAccessRequestPopup} />
                    </BtnPopup>
                )
            }
        </div>
        <div className="my-table flex flex-wrap w-full mt-5 md:p-7 p-5">
            <div className="text-center text-white p-2 table-header grid grid-cols-4 gap-2 w-full bg-[#292929] border-2 rounded border-white">
                {/* <div className="table-header-item ">Org</div> */}
                <div className="table-header-item ">PE</div>
                <div className="table-header-item ">requestedDurationHours</div>
                <div className="table-header-item ">Pipeline</div>
                <div className="table-header-item ">Status</div>
                {/* <div className="table-header-item">Description</div> */}
            </div>
            <div className="table-body w-full ">
                {currentAccessRequests.length ? currentAccessRequests.map((request) => (
                    <div className="text-center cursor-pointer text-black p-2 table-header w-full grid grid-cols-4  table-tr rounded  mt-2 drop-shadow-2xl">
                        <div className="table-row-item ">{request.templateId}</div>
                        <div className="table-row-item ">
                            {request.requestedDurationHours}
                        </div>
                        <div className="table-row-item  ">{request.pipelineName}</div>
                        <div className="table-row-item  ">
                            <span className={`px-2 py-1 rounded-xl text-sm ${request.status === "PENDING" ? "bg-yellow-500" : request.status === "APPROVED" ? "bg-green-500" : "bg-red-500"}`}>{request.status}</span>
                        </div>
                    </div>
                )) : (
                    <div className="table-row  w-full">
                        <div className="table-row-item w-full text-center">No requests</div>
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