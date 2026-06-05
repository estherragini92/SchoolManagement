import { Outlet } from "react-router-dom";
import ParentSidebar from "../components/ParentSidebar/ParentSidebar";
import "./ParentLayout.css";

function ParentLayout() {
  return (
    <div className="parent-layout">
      
<ParentSidebar />

      <div className="parent-main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default ParentLayout;