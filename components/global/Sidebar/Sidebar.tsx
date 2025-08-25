import React from "react";
import Nametag from "./Nametag";
import Menu from "./Menu";
import Settings from "./Settings";
import LogoutButton from "../Logout/LogoutButton";

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-2 text-white p-2 h-screen overflow-hidden">
      <Nametag />
      <Menu />
      <Settings />
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
