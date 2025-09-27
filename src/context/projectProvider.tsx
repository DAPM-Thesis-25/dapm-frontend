import React, {
  useContext,
  createContext,
  useState,
  ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assignUserRole, createProject, createRole, getAllProjects, getMyProjects, getProject, getProjectMembers, getProjectRolePermActions, getProjectRolePermActionsByRole, getProjectsRoles, Project, ProjectMember, ProjectPermAction, Role } from "../api/project";




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
  myProjects: Project[] | null;
  getProjectRolePermActionss: (projectName: string) => Promise<string | void>;
  projectRolePermActions: ProjectPermAction[] | null;
  getProjectRolePermActionsByRolee: (projectName: string, roleName: string) => Promise<string | void>;
  projectRolesPermActions: ProjectPermAction[] | null;
  projectMembers: ProjectMember[] | null;
  getProjectMemberss: (projectName: string) => Promise<string | void>;
  assignUserRoleProj: (data: ProjectMember) => Promise<{ success: boolean; message: any; error?: string }>;
  getProjectByName: (name: string) => Promise<string | void>;
  currentProject: Project | null;
}


const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

// provider
const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {

  const [projects, setProjects] = useState<Project[] | null>(null);
  const [myProjects, setMyProjects] = useState<Project[] | null>(null);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [projectRolesPermActions, setProjectRolesPermActions] = useState<ProjectPermAction[] | null>(null);
  const [projectMembers, setProjectMembers] = useState<any[] | null>(null);
  const [projectRolePermActions, setProjectRolePermActions] = useState<ProjectPermAction[] | null>(null);
  const [loadingCreateProject, setLoadingCreateProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  // get all Projects
  async function getProjects(domainName?: string) {
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
  async function getMyProjectss(domainName?: string) {
    try {

      const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getMyProjects(safeOrgDomainName);

      if (response.data) {
        setMyProjects(response.data);
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


  async function getProjectRolePermActionss(projectName: string) {
    try {

      const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getProjectRolePermActions(safeOrgDomainName, projectName);

      if (response.data) {
        setProjectRolesPermActions(response.data);
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


  async function getProjectRolePermActionsByRolee(projectName: string, roleName: string) {
    try {

      const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getProjectRolePermActionsByRole(safeOrgDomainName, projectName, roleName);

      if (response.data) {
        console.log("Project Role Perm Actions:", response.data);
        setProjectRolePermActions(response.data);
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

  async function getProjectMemberss(projectName: string) {
    try {

      const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getProjectMembers(safeOrgDomainName, projectName);

      if (response.data) {
        setProjectMembers(response.data);
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

  const assignUserRoleProj = async (data: ProjectMember) => {
    try {
      const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await assignUserRole(safeOrgDomainName, data);

      return {
        success: true,
        message: response.data || "User role assigned successfully."
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: error.response?.data?.message || error.message || "User role assignment failed",
          error: error.response?.data?.error
        };
      }
      return { success: false, message: "User role assignment failed due to unknown error" };
    }
  };

  // get Project by name
  const getProjectByName = async (name: string) => {
    try {
      const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getProject(safeOrgDomainName, name);

      // console.log("Response from getProjectByName:", response);
      if (response.data) {
        // unwrap if it's an array
        const project = Array.isArray(response.data) ? response.data[0] : response.data;
        setCurrentProject(project);
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
  };
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
        myProjects,
        getProjectRolePermActionss,
        projectRolePermActions,
        getProjectRolePermActionsByRolee,
        projectMembers,
        getProjectMemberss,
        projectRolesPermActions,
        assignUserRoleProj,
        getProjectByName,
        currentProject
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
