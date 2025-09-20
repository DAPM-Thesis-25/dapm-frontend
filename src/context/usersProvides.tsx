import React, {
  useContext,
  createContext,
  useState,
  ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import {getAllUsers, getAllAdmins, User, createUser, CreateUserRequest } from "../api/userapi";
import axios from "axios";




interface UserContextType {
    users: User[] | null;
    getUsers: (domainName?: string) => Promise<string | void>;
    admins: User[] | null;
    getAdmins: (domainName?: string) => Promise<string | void>;
    // registerUser: (userData: CreateUserRequest) => Promise<string | { message: string }>;
    registerUser: (userData: CreateUserRequest) => Promise<string | { message: string }>;
    
    setLoadingRegister: (loading: boolean) => void;
    loadingRegister: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// provider
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {

  const [users, setUsers] = useState<User[] | null>(null);
  const [admins, setAdmins] = useState<User[] | null>(null);

  const [loadingRegister, setLoadingRegister] = useState(false);

  const navigate = useNavigate();

  // get all users
  async function getUsers( domainName?: string) {
    try {

    const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getAllUsers(safeOrgDomainName);

      if (response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "get Users failed"
        );
      }
      return "Get Users failed";
    }
  }


// get all admins
    async function getAdmins( domainName?: string) {
    try {

    const safeOrgDomainName = localStorage.getItem("domain") || "";
      const response = await getAllAdmins(safeOrgDomainName);

      if (response.data) {
        setAdmins(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "Get Admins failed"
        );
      }
      return "Get Admins failed";
    }
  }

// register user
async function registerUser(userData: CreateUserRequest): Promise<string> {
  try {
    console.log("userData in registerUser:", userData);
    const safeOrgDomainName = localStorage.getItem("domain") || "";
    const response = await createUser(safeOrgDomainName, userData);

    // ✅ normalize to a message string
    return response.data?.message || "User registered successfully.";
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return (
        (err.response?.data?.message as string) ||
        err.message ||
        "Register User failed"
      );
    }
    return "Register User failed";
  }
}


//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwtDecode<any>(token);
//         const mappedUser = mapJwtToUserData(decoded);
//         setUserData(mappedUser);
//       } catch (err) {
//         // console.error("Invalid token in localStorage", err);
//         setUserData(null);
//       }
//     }
//   }, [token]);

  // Logout





  return (
    <UserContext.Provider
      value={{
        users,
        loadingRegister,
        getUsers,
        admins,
        getAdmins,
        registerUser,
        setLoadingRegister
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

// hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
