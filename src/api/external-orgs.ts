import exp from "constants";
import axiosInstance from "./axiosInstance";
export interface Org {
    name: string;
    tier: string;
}

export interface sendHandshakeRequest {
    orgName: string;
}

export interface UpgradeRequest {
    orgName: string;
    voucher: string;
}

    // create a get all users function
export const getAllPublishers = (orgDomainName: string) => 
    axiosInstance.get<Org[]>(`/api/partner-organizations/publishers`,
    { baseURL: `http://dapm2:${orgDomainName}` } );

export const getAllSubscribers = (orgDomainName: string) => 
    axiosInstance.get<Org[]>(`/api/partner-organizations/subscribers`,
    { baseURL: `http://dapm2:${orgDomainName}` } );

export const sendHandshakeRequest = (orgDomainName: string, handshakeData: sendHandshakeRequest) => 
    axiosInstance.post<{ message: string }>(`/api/handshake`, handshakeData,
    { baseURL: `http://dapm2:${orgDomainName}` } );

export const sendUpgradeRequest = (orgDomainName: string, upgradeData: UpgradeRequest) => 
    axiosInstance.post<{ message: string }>(`/api/upgrade-subscription`, upgradeData,
    { baseURL: `http://dapm2:${orgDomainName}` } );