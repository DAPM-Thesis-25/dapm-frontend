import React, {
  useContext,
  createContext,
  useState,
  ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AccessRequest, getAllAccessRequests, getAllExternalAccessRequests, revokeAccessRequest, takeDecisionOnAccessRequest, TakeDecisionRequest } from "../api/accessRequests";




interface AccessRequestContextType {
  accessRequests: AccessRequest[] | null;
  getRequests: (domainName?: string) => Promise<string | void>;
  externalAccessRequests: AccessRequest[] | null;
  getExternalRequests: (domainName?: string) => Promise<string | void>;
  takeDecisionOnRequest: (takeDecision: TakeDecisionRequest) => Promise<string | void>;
  takingDecisionLoading?: boolean;
  setTakingDecisionLoading: (loading: boolean) => void;
  revokeRequest: (requestId: string) => Promise<string | void>;
}

const AccessRequestContext = createContext<AccessRequestContextType | undefined>(undefined);

interface AccessRequestProviderProps {
  children: ReactNode;
}

// provider
const AccessRequestProvider: React.FC<AccessRequestProviderProps> = ({ children }) => {

  const [accessRequests, setAccessRequests] = useState<AccessRequest[] | null>(null);
  const [externalAccessRequests, setExternalAccessRequests] = useState<AccessRequest[] | null>(null);
  const [takingDecisionLoading, setTakingDecisionLoading] = useState<boolean>(false);


  const navigate = useNavigate();

  // get all access requests
  async function getRequests(domainName?: string) {
    try {

      const safeAccessRequestDomainName = localStorage.getItem("domain") || "";
      const response = await getAllAccessRequests(safeAccessRequestDomainName);

      if (response.data) {
        setAccessRequests(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "get Access Requests failed"
        );
      }
      return "Get Access Requests failed";
    }
  }

  // get all external access requests
  async function getExternalRequests(domainName?: string) {
    try {
      const safeAccessRequestDomainName = localStorage.getItem("domain") || "";
      const response = await getAllExternalAccessRequests(safeAccessRequestDomainName);

      if (response.data) {
        // console.log("Polling for new external access requests...", response.data);
        setExternalAccessRequests(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "get External Access Requests failed"
        );
      }
      return "Get External Access Requests failed";
    }
  }

  // take decision on access request
  async function takeDecisionOnRequest(takeDecision: TakeDecisionRequest) {
    try {
      console.log("Taking decision on Access Request with data:", takeDecision);
      const safeAccessRequestDomainName = localStorage.getItem("domain") || "";
      const response = await takeDecisionOnAccessRequest(safeAccessRequestDomainName, takeDecision);

      if (response.data) {
        // Update the access requests state
        setAccessRequests((prev) => prev?.map((req) => (req.id === takeDecision.requestId ? { ...req, status: takeDecision.status } : req)) || null);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "take decision on Access Request failed"
        );
      }
      return "Take decision on Access Request failed";
    }
  }

  async function revokeRequest(requestId: string) {
    try {
      console.log("Revoking Access Request with ID:", requestId);
      const safeAccessRequestDomainName = localStorage.getItem("domain") || "";
      const response = await revokeAccessRequest(safeAccessRequestDomainName, requestId);

      if (response.data) {
        // update local state (remove or mark revoked)
        setAccessRequests((prev) =>
          prev?.map((req) =>
            req.id === requestId ? { ...req, status: "REJECTED" } : req
          ) || null
        );
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "Revoke Access Request failed"
        );
      }
      return "Revoke Access Request failed";
    }
  }




  return (
    <AccessRequestContext.Provider
      value={{
        accessRequests,
        getRequests,
        externalAccessRequests,
        getExternalRequests,
        takeDecisionOnRequest,
        takingDecisionLoading,
        setTakingDecisionLoading,
        revokeRequest}}
    >
      {children}
    </AccessRequestContext.Provider>
  );
};

export default AccessRequestProvider;

// hook
export const useAccessRequest = (): AccessRequestContextType => {
  const context = useContext(AccessRequestContext);
  if (!context) {
    throw new Error("useAccessRequest must be used within AccessRequestProvider");
  }
  return context;
};
