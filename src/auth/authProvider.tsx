import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
  useEffect
} from "react";
import { useNavigate } from "react-router-dom";
import { login, signup, getMe, AuthResponse, SignupRequest, LoginRequest } from "../api/authapi";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


// types
interface UserData {
  username: string;
  orgRole: string;
  organizationName: string;
  organizationId: string;
  projectRoles: { role: string; project: string }[];
}


interface AuthContextType {
  token: string;
  // user: string | null;
  userData: UserData | null;
  orgDomainName: string | null;
  // setOrgDomainName: React.Dispatch<React.SetStateAction<string | null>>;
  signupAction: (data: SignupRequest) => Promise<string | void>;
  loginAction: (data: LoginRequest, domainName?: string) => Promise<string | void>;
  logOut: () => void;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// provider
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // const [user, setUser] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [token, setToken] = useState<string>(
    localStorage.getItem("site") || ""
  );
  const [orgDomainName, setOrgDomainName] = useState<string>(
    localStorage.getItem("domain") || ""
  );

  const navigate = useNavigate();

  // Signup
  async function signupAction(data: SignupRequest) {
    try {
      const response = await signup(data);

      if (response.data) {
        setToken(response.data.token);
        localStorage.setItem("site", response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "Signup failed"
        );
      }
      return "Signup failed";
    }
  }

  // Login
  async function loginAction(data: LoginRequest, domainName?: string) {
    try {
      if (domainName) {
      setOrgDomainName(domainName);
      localStorage.setItem("domain", domainName);
    }
    const safeOrgDomainName = domainName ?? orgDomainName ?? "";
      const response = await login(data, safeOrgDomainName);

      if (response.data) {
        // setUser(response.data.username);
        setToken(response.data.token);
        localStorage.setItem("site", response.data.token);
        // set user data from token

        const decoded = jwtDecode<any>(response.data.token);
        const mappedUser = mapJwtToUserData(decoded);
        setUserData(mappedUser);
        console.log("Mapped user data:", mappedUser);
        navigate("/dashboard");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          (err.response?.data as string) ||
          err.message ||
          "Login failed"
        );
      }
      return "Login failed";
    }
  }

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        const mappedUser = mapJwtToUserData(decoded);
        setUserData(mappedUser);
      } catch (err) {
        // console.error("Invalid token in localStorage", err);
        setUserData(null);
      }
    }
  }, [token]);

  // Logout
  function logOut() {
    // setUser(null);
    setToken("");
    setUserData(null);
    localStorage.removeItem("site");
    navigate("/login");
  }

  function mapJwtToUserData(decoded: any): UserData {
  return {
    username: decoded.sub,             
    orgRole: decoded.orgRole,
    organizationName: decoded.organizationName,
    organizationId: decoded.organizationId,
    projectRoles: decoded.projectRoles || [],
  };
}



  return (
    <AuthContext.Provider
      value={{
        token,
        // user,
        userData,
        orgDomainName,
        signupAction,
        loginAction,
        logOut,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
