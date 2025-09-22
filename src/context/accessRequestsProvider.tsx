import React, {
  useContext,
  createContext,
  useState,
  ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AccessRequest, getAllAccessRequests, getAllExternalAccessRequests } from "../api/accessRequests";




interface AccessRequestContextType {
    accessRequests: AccessRequest[] | null;
    getRequests: (domainName?: string) => Promise<string | void>;
    externalAccessRequests: AccessRequest[] | null;
    getExternalRequests: (domainName?: string) => Promise<string | void>;
}

const AccessRequestContext = createContext<AccessRequestContextType | undefined>(undefined);

interface AccessRequestProviderProps {
  children: ReactNode;
}

// provider
const AccessRequestProvider: React.FC<AccessRequestProviderProps> = ({ children }) => {

  const [accessRequests, setAccessRequests] = useState<AccessRequest[] | null>(null);
  const [externalAccessRequests, setExternalAccessRequests] = useState<AccessRequest[] | null>(null);



  const navigate = useNavigate();

  // get all access requests
  async function getRequests( domainName?: string) {
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
    async function getExternalRequests( domainName?: string) {
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

  return (
    <AccessRequestContext.Provider
      value={{
        accessRequests,
        getRequests,
        externalAccessRequests,
        getExternalRequests
      }}
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
