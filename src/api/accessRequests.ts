import axiosInstance from "./axiosInstance";
export interface AccessRequest {
  id: string;
  pipelineName: string;
  organization: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedDurationHours: number;
  approvalToken: string;
}

// export const getAllAccessRequests = (orgDomainName: string) => 
//     axiosInstance.get<AccessRequest[]>(`/api/pipeline/configuration/requests`,
//     { baseURL: `http://localhost:${orgDomainName}` } );

export const getAllExternalAccessRequests = (orgDomainName: string) => 
    axiosInstance.get<AccessRequest[]>(`/api/pipeline/configuration/external-requests`,
    { baseURL: `http://localhost:${orgDomainName}` } );

export const getAllAccessRequests = (orgDomainName: string) => 
    axiosInstance.get<AccessRequest[]>(`/api/pipeline/configuration/all-requests`,
    { baseURL: `http://localhost:${orgDomainName}` } );