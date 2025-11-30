import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { axiosInstance, setAccessToken } from "../api/axiosInstance";

interface AuthContextType {
  isAuth: boolean;
  isLoading: boolean;
  userId: string;
  login: (email: string, password: string) => Promise<{ accessToken: string }>;
  register: (
    email: string,
    password: string
  ) => Promise<{ accessToken: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string>("");
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/auth/refresh");

        setIsAuth(data.accessToken ? true : false);
        setUserId(data.userId);
        setAccessToken(data.accessToken);
      } catch {
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    setAccessToken(data.accessToken);
    setIsAuth(data.accessToken ? true : false);
    return data;
  };

  const register = async (email: string, password: string) => {
    const { data } = await axiosInstance.post("/auth/register", {
      email,
      password,
    });

    setAccessToken(data.accessToken);
    setIsAuth(data.accessToken ? true : false);
    return data;
  };

  const logout = async () => {
    await axiosInstance.get("/auth/logout");
    setAccessToken("");
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{ userId, isAuth, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
