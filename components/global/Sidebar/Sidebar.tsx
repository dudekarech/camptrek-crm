import React from "react";
import Nametag from "./Nametag";
import Menu from "./Menu";
import Settings from "./Settings";
import LogoutButton from "../Logout/LogoutButton";

const Sidebar = () => {
  return (
    <div className="w-80 bg-white shadow-2xl border-r border-gray-100 h-screen overflow-hidden flex flex-col">
      {/* Header with Camptrek branding */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 p-6 flex-shrink-0">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg mb-4 border border-white/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">
            CAMPTREK SAFARIS
          </h1>
          <p className="text-white/90 text-sm">AFRICA IS A FEELING</p>
        </div>
      </div>
      
      {/* Sidebar Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <Nametag />
          <Menu />
          <Settings />
        </div>
      </div>
      
      {/* Logout Button - Fixed at Bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
            Account
          </h3>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
