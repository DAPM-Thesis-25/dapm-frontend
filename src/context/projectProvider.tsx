import React, {
  useContext,
  createContext,
  useState,
  ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createProject, createRole, getAllProjects, getMyProjects, getProjectsRoles, Project, Role } from "../api/project";




interface ProjectContextType {

    projects: Project[] | null;
    getProjects: (domainName?: string) => Promise<string | void>;
    registerProject: (projectData: createProject) => Promise<{ success: boolean; message: any; error?: string }>;
    setLoadingCreateProject: (loading: boolean) => void;
    loadingCreateProject: boolean;
    getMyProjectss: (domainName?: string) => Promise<string | void>;
    getProjectsRoless: (domainName?: string) => Promise<string | void>;
    roles: Role[] | null;
    createRoles: (roleName: string) => Promise<{ success: boolean; message: any; error?: string }>;
    // getRoles: (domainName?: string) => Promise<string | void>;
}


const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

// provider
const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {

  const [projects, setProjects] = useState<Project[] | null>(null);
  const [roles, setRoles] = useState<Role[] | null>(null);  

  const [loadingCreateProject, setLoadingCreateProject] = useState(false);

  const navigate = useNavigate();

  // get all Projects
  async function getProjects( domainName?: string) {
    try {

    const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getAllProjects(safeOrgDomainName);

      if (response.data) {
        setProjects(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "get Projects failed"
        );
      }
      return "Get Projects failed";
    }
  }
  

  // get all Roles
  async function getProjectsRoless(domainName?: string) {
    try {
      const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getProjectsRoles(safeOrgDomainName);

      if (response.data) {
        setRoles(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "get Roles failed"
        );
      }
      return "Get Roles failed";
    }
  }

    // get all Projects
  async function getMyProjectss( domainName?: string) {
    try {

    const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getMyProjects(safeOrgDomainName);

      if (response.data) {
        setProjects(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "get Projects failed"
        );
      }
      return "Get Projects failed";
    }
  }

  // create Role
  async function createRoles(roleName: string): Promise<{ success: boolean; message: any; error?: string }> {
    try {
      console.log("RoleName in createRoles:", roleName);
      const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await createRole(safeOrgDomainName, roleName);
      // update roles state
      setRoles(prevRoles => prevRoles ? [...prevRoles, response.data] : [response.data]);
      getProjectsRoless()
      return {
        success: true,
        message: response.data || "Role created successfully."
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message || err.message || "Role creation failed",
          error: err.response?.data?.error
        };
      }
      return { success: false, message: "Role creation failed due to unknown error" };
    }
  }

// register Project
async function registerProject(projectData: createProject): Promise<{ success: boolean; message: any; error?: string }> {
  try {
    console.log("ProjectData in registerProject:", projectData);
    const safeOrgDomainName = localStorage.getItem("domain") || "";
    const response = await createProject(safeOrgDomainName, projectData);
    return {
      success: true,
      message: response.data || "Project created successfully."
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Project creation failed",
        error: err.response?.data?.error
      };
    }
    return { success: false, message: "Project creation failed due to unknown error" };
  }
}







  return (
    <ProjectContext.Provider
      value={{
        projects,
        getProjects,
        registerProject,
        setLoadingCreateProject,
        loadingCreateProject,
        getMyProjectss,
        getProjectsRoless,
        roles,
        createRoles,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;

// hook
export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within ProjectProvider");
  }
  return context;
};
