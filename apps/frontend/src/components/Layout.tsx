import { LayoutProps } from "../Types/LayoutProps";
import Navbar from "./Navbar";
import SideBar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import { FC } from "react";

const Layout: FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth()

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow mt-10">
        {user && (
          <SideBar role={user?.role} />
        )}
        <div className={`flex-grow p-4 ml-56`} style={{ height: 'calc(100vh - 40px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
