import { useContext } from "react";
import { UserContext } from "../../context/userContext";

export const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="">
      <Navbar activeMenu={activeMenu}></Navbar>

      {user && (
        <div className="flex">
          <div className="hidden lg:block">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
