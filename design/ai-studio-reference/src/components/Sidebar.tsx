import { useState } from "react";
import { 
  LayoutDashboard, 
  Video, 
  FolderHeart, 
  Users, 
  Settings, 
  User, 
  Plus, 
  Sun, 
  Moon,
  HelpCircle,
  Bell
} from "lucide-react";
import { UserProfile } from "../types";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  profile: UserProfile;
  toggleConfigModal?: () => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  darkMode,
  setDarkMode,
  profile,
  toggleConfigModal
}: SidebarProps) {
  return (
    <>
      {/* Horizontal Nav Bar (Mobile Headers / Desktop Aux) */}
      <header className="md:hidden flex justify-between items-center h-16 px-4 bg-[#F2F4EB] text-[#1E1F1A] dark:bg-[#121408] dark:text-[#E3E4CE] border-b border-[#D4D7C8] dark:border-[#454932] z-40 sticky top-0 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1C1D17] dark:bg-[#343627] flex items-center justify-center border border-[#909378]">
            <Video className="w-4 h-4 text-[#D2F000]" />
          </div>
          <span className="font-sans font-bold text-lg tracking-tight select-none">Loomless</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme switcher on mobile header */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-1 px-2 rounded-lg bg-[#E2E6D8] dark:bg-[#292B1D] text-[#5C5E54] dark:text-[#C6C9AB] hover:text-[#1C1D17] dark:hover:text-[#FFFFFF] cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#D2F000]" /> : <Moon className="w-4 h-4 text-[#1C1D17]" />}
          </button>
          
          <button 
            onClick={() => {
              setActiveView("profile");
            }}
            className="w-8 h-8 rounded-full border border-[#909378] overflow-hidden"
          >
            <img 
              src={profile.avatarUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Desktop Left Navigation Sidebar */}
      <aside className="hidden md:flex flex-col items-center py-6 space-y-8 bg-[#F5F7EF] dark:bg-[#121408] fixed left-0 top-0 h-full w-16 border-r border-[#D9DCCB] dark:border-[#454932] z-50">
        {/* Brand/Avatar Area */}
        <div className="flex flex-col items-center gap-2 mb-2 select-none">
          <div className="w-10 h-10 rounded-lg bg-[#1C1D17] dark:bg-[#1F2113] flex items-center justify-center border border-[#D2F000]/40 shadow-sm">
            <span className="text-[#D2F000] font-sans font-bold text-xl uppercase tracking-tighter">L</span>
          </div>
        </div>

        {/* CTA recording floating switch */}
        <button 
          onClick={toggleConfigModal}
          title="New Record"
          className="w-10 h-10 rounded-full bg-[#1C1D17] dark:bg-[#D2F000] text-[#D2F000] dark:text-[#2C3400] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md group relative cursor-pointer"
        >
          <Plus className="w-5 h-5 font-bold" />
          <span className="absolute left-14 bg-[#1C1D17] dark:bg-[#343627] text-white dark:text-[#E3E4CE] font-sans text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
            New Record
          </span>
        </button>

        {/* Primary Links */}
        <div className="flex flex-col space-y-5 flex-1 w-full items-center">
          {/* Dashboard */}
          <button 
            onClick={() => setActiveView("dashboard")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#EAF0DF] dark:hover:bg-[#1F2113] transition-all group relative cursor-pointer ${
              activeView === "dashboard" ? "text-[#1C1D17] dark:text-[#D2F000] bg-[#E5ECD7] dark:bg-[#1F2113]" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="absolute left-14 bg-[#1C1D17] dark:bg-[#343627] text-white dark:text-[#E3E4CE] font-sans text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-sm">
              Dashboard
            </span>
          </button>

          {/* Library Folder section */}
          <button 
            onClick={() => setActiveView("library")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#EAF0DF] dark:hover:bg-[#1F2113] transition-all group relative cursor-pointer ${
              activeView === "library" ? "text-[#1C1D17] dark:text-[#D2F000] bg-[#E5ECD7] dark:bg-[#1F2113]" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
            }`}
          >
            <FolderHeart className="w-5 h-5" />
            <span className="absolute left-14 bg-[#1C1D17] dark:bg-[#343627] text-white dark:text-[#E3E4CE] font-sans text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-sm">
              Library
            </span>
          </button>

          {/* Settings option */}
          <button 
            onClick={() => setActiveView("settings")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#EAF0DF] dark:hover:bg-[#1F2113] transition-all group relative cursor-pointer ${
              activeView === "settings" ? "text-[#1C1D17] dark:text-[#D2F000] bg-[#E5ECD7] dark:bg-[#1F2113]" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="absolute left-14 bg-[#1C1D17] dark:bg-[#343627] text-white dark:text-[#E3E4CE] font-sans text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-sm">
              Settings
            </span>
          </button>

          {/* Profile options */}
          <button 
            onClick={() => setActiveView("profile")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#EAF0DF] dark:hover:bg-[#1F2113] transition-all group relative cursor-pointer ${
              activeView === "profile" ? "text-[#1C1D17] dark:text-[#D2F000] bg-[#E5ECD7] dark:bg-[#1F2113]" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="absolute left-14 bg-[#1C1D17] dark:bg-[#343627] text-white dark:text-[#E3E4CE] font-sans text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-sm">
              Profile Setup
            </span>
          </button>
        </div>

        {/* Global Theme Toggle */}
        <div className="flex flex-col items-center space-y-4 mt-auto">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Light/Dark Theme"
            className="w-10 h-10 rounded-lg border border-[#D9DCCB] dark:border-[#454932] flex items-center justify-center text-[#7B7E6B] dark:text-[#C6C9AB] hover:text-[#1C1D17] dark:hover:text-[#FFFFFF] hover:bg-[#E5ECD7] dark:hover:bg-[#292B1D] cursor-pointer transition-all duration-200"
          >
            {darkMode ? <Sun className="w-5 h-5 text-[#D2F000]" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile Avatar click */}
          <div 
            onClick={() => setActiveView("profile")}
            className="w-8 h-8 rounded-full border border-[#D9DCCB] dark:border-[#454932] overflow-hidden cursor-pointer hover:border-black dark:hover:border-[#D2F000] transition-colors"
          >
            <img 
              src={profile.avatarUrl} 
              alt={profile.displayName} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </aside>

      {/* Floating Bottom Nav Bar (Mobile Viewport only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#F5F7EF] dark:bg-[#1B1D10] border-t border-[#D9DCCB] dark:border-[#454932] shadow-lg z-50 flex justify-around items-center px-4 h-16 pb-safe">
        {/* Home option */}
        <button 
          onClick={() => setActiveView("dashboard")}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-transform ${
            activeView === "dashboard" ? "text-[#1E1F1A] dark:text-[#D2F000] scale-105" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-sans text-[10px] mt-1">Home</span>
        </button>

        {/* Library option */}
        <button 
          onClick={() => setActiveView("library")}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-transform ${
            activeView === "library" ? "text-[#1E1F1A] dark:text-[#D2F000] scale-105" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
          }`}
        >
          <FolderHeart className="w-5 h-5" />
          <span className="font-sans text-[10px] mt-1">Library</span>
        </button>

        {/* Raised center recording trigger FAB */}
        <div className="relative -top-5">
          <button 
            onClick={toggleConfigModal}
            className="w-14 h-14 bg-[#1C1D17] dark:bg-[#D2F000] text-[#D2F000] dark:text-[#2C3400] rounded-full flex items-center justify-center shadow-lg border-4 border-[#F5F7EF] dark:border-[#1E1F1A] active:scale-90 transition-transform cursor-pointer"
          >
            <Plus className="w-6 h-6 font-bold" />
          </button>
        </div>

        {/* Settings option */}
        <button 
          onClick={() => setActiveView("settings")}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-transform ${
            activeView === "settings" ? "text-[#1E1F1A] dark:text-[#D2F000] scale-105" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-sans text-[10px] mt-1">Settings</span>
        </button>

        {/* Profile options */}
        <button 
          onClick={() => setActiveView("profile")}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-transform ${
            activeView === "profile" ? "text-[#1E1F1A] dark:text-[#D2F000] scale-105" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="font-sans text-[10px] mt-1">Profile</span>
        </button>
      </nav>
    </>
  );
}
