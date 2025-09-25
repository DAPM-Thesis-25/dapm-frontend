import exp from "constants";
import axiosInstance from "./axiosInstance";
import { User } from "./userapi";

export interface createProject{
    name: string;
    roles: string[];
}

export interface Project {
    id: string;
    name: string;
    organizationName: string;
    roles: Set<string>; 
    // users: Set<User>;
}
export interface Role{
    id: string;
    name: string;
}

export const createProject = (orgDomainName: string, data: createProject) => 
    axiosInstance.post<Project>(`/api/projects/create`, data,
    { baseURL: `http://localhost:${orgDomainName}` } );

export const getAllProjects = (orgDomainName: string) =>
    axiosInstance.get<Project[]>(`/api/projects`,
    { baseURL: `http://localhost:${orgDomainName}` } );

export const getMyProjects = (orgDomainName: string) =>
    axiosInstance.get<Project[]>(`/api/projects/my-projects`,
    { baseURL: `http://localhost:${orgDomainName}` } );

export const getProjectsRoles = (orgDomainName: string) =>
    axiosInstance.get<Role[]>(`/api/projects/roles`,
    { baseURL: `http://localhost:${orgDomainName}` } );

export const createRole = (orgDomainName: string, data: string) => 
    axiosInstance.post<Role>(`/api/projects/roles/add`, { name: data },
    { baseURL: `http://localhost:${orgDomainName}` } );