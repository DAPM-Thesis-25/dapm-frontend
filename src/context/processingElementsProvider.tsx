import React, {
  useContext,
  createContext,
  useState,
  ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getAllAdmins, User, createUser, CreateUserRequest } from "../api/userapi";
import axios from "axios";
import { getAllPublishers, getAllSubscribers, Org, sendHandshakeRequest } from "../api/external-orgs";
import { createProcessingElement, getAllProcessingElements, getPeFromPublisher, ProcessingElement, UploadProcessingElementRequest } from "../api/processingElements";




interface PEContextType {
  processingElements: ProcessingElement[] | null;
  getPes: (domainName?: string) => Promise<string | void>;
  // handshakeRequest: (handshake: sendHandshakeRequest) => Promise<{ success: boolean; message: string; error?: string }>;
  setLoadingProcessingElement: (loading: boolean) => void;
  loadingProcessingElement: boolean;
  addProcessingElement: (
    pe: UploadProcessingElementRequest
  ) => Promise<{ success: boolean; message: string }>;

}

const PEContext = createContext<PEContextType | undefined>(undefined);

interface PeProviderProps {
  children: ReactNode;
}

// provider
const PeProvider: React.FC<PeProviderProps> = ({ children }) => {

  const [processingElements, setProcessingElements] = useState<ProcessingElement[] | null>(null);

  const [loadingProcessingElement, setLoadingProcessingElement] = useState(false);

  const navigate = useNavigate();

  // get all processing elements
  async function getPes(domainName?: string) {
    try {

      const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getAllProcessingElements(safeOrgDomainName);

      if (response.data) {
        setProcessingElements(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "get Processing Elements failed"
        );
      }
      return "Get Processing Elements failed";
    }
  }


  async function addProcessingElement(
    pe: UploadProcessingElementRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await createProcessingElement(safeOrgDomainName, pe);

      return { success: true, message: response.data.message };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message || err.message || "Upload failed",
        };
      }
      return { success: false, message: "Upload failed due to unknown error" };
    }
  }




 





  return (
    <PEContext.Provider
      value={{
        processingElements,
        getPes,
        setLoadingProcessingElement,
        loadingProcessingElement,
        addProcessingElement,
        // handshakeRequest
      }}
    >
      {children}
    </PEContext.Provider>
  );
};

export default PeProvider;

// hook
export const usePE = (): PEContextType => {
  const context = useContext(PEContext);
  if (!context) {
    throw new Error("usePE must be used within PEProvider");
  }
  return context;
};
