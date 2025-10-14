import React, {
  useContext,
  createContext,
  useState,
  ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import {getAllUsers, getAllAdmins, User, createUser, CreateUserRequest } from "../api/userapi";
import axios from "axios";
import { getAllPublishers, getAllSubscribers, Org, sendHandshakeRequest, sendUpgradeRequest, UpgradeRequest } from "../api/external-orgs";
import { getPeFromPublisher } from "../api/processingElements";




interface OrgContextType {
    subscribers: Org[] | null;
    getSubscribers: (domainName?: string) => Promise<string | void>;
    publishers: Org[] | null;
    getPublishers: (domainName?: string) => Promise<string | void>;
    handshakeRequest: (handshake: sendHandshakeRequest) => Promise<{ success: boolean; message: string; error?: string }>;
    setLoadingHandshake: (loading: boolean) => void;
    loadingHandshake: boolean;
    loadingUpgrade: boolean;
    setLoadingUpgrade: (loading: boolean) => void;
    upgradeRequest: (upgrade: UpgradeRequest) => Promise<{ success: boolean; message: string; error?: string }>;
    
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

interface OrgProviderProps {
  children: ReactNode;
}

// provider
const OrgProvider: React.FC<OrgProviderProps> = ({ children }) => {

  const [subscribers, setSubscribers] = useState<Org[] | null>(null);
  const [publishers, setPublishers  ] = useState<Org[] | null>(null);

  const [loadingHandshake, setLoadingHandshake] = useState(false);
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);

  const navigate = useNavigate();

  // get all subscribers
  async function getSubscribers( domainName?: string) {
    try {

    const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getAllSubscribers(safeOrgDomainName);

      if (response.data) {
        setSubscribers(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "get Subscribers failed"
        );
      }
      return "Get Subscribers failed";
    }
  }


// get all publishers
    async function getPublishers( domainName?: string) {
    try {

    const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getAllPublishers(safeOrgDomainName);

      if (response.data) {
        setPublishers(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "Get Publishers failed"
        );
      }
      return "Get Publishers failed";
    }
  }

// create handshake request
// create handshake request
async function handshakeRequest(handshake: sendHandshakeRequest): Promise<{ success: boolean; message: string; error?: string }> {
  
 
  try {
    console.log("handshakeRequest:", handshake);
    const safeOrgDomainName = localStorage.getItem("domain") || "";
    const response = await sendHandshakeRequest(safeOrgDomainName, handshake);
    getPeFromPublishe(handshake);
    return {
      success: true,
      message: response.data?.message || "Handshake successful."
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Handshake failed",
        error: err.response?.data?.error
      };
    }
    return { success: false, message: "Handshake failed due to unknown error" };
  }
}

async function upgradeRequest(upgrade: UpgradeRequest): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    console.log("upgradeRequest:", upgrade);
    const safeOrgDomainName = localStorage.getItem("domain") || "";
    const response = await sendUpgradeRequest(safeOrgDomainName, upgrade);

    return {
      success: true,
      message: response.data?.message || "Upgrade successful."
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Upgrade failed",
        error: err.response?.data?.error
      };
    }
    return { success: false, message: "Upgrade failed due to unknown error" };
  }
}




 // user getPeFromPublisher

  async function getPeFromPublishe(pe: sendHandshakeRequest): Promise<{ success: boolean; message: string }> {
    try {
      const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getPeFromPublisher(safeOrgDomainName, pe);

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
    <OrgContext.Provider
      value={{
        getSubscribers,
        subscribers,
        getPublishers,
        publishers,
        handshakeRequest,
        loadingHandshake,
        setLoadingHandshake,
        loadingUpgrade,
        setLoadingUpgrade
        ,upgradeRequest
      }}
    >
      {children}
    </OrgContext.Provider>
  );
};

export default OrgProvider;

// hook
export const useOrg = (): OrgContextType => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("useOrg must be used within OrgProvider");
  }
  return context;
};
