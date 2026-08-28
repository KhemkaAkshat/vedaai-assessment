"use client";

import Image from "next/image";
import {
  Grid2X2,
  BriefcaseBusiness,
  BookOpen,
  Library,
  Settings,
  Sparkles,
  PanelLeft,
  ClipboardPen,
  University,
} from "lucide-react";

export default function Sidebar({ collapsed = false, onToggle }) {
  return (
    <aside className={`hidden shrink-0 px-3 mt-3 transition-[width] duration-200 md:block ${collapsed ? "w-22" : "w-[22%]"}`}>
      <div className={`flex h-[calc(100vh-20px)] flex-col rounded-2xl bg-white py-6 shadow-2xl transition-[padding] duration-200 ${collapsed ? "items-center px-2" : "px-7"}`}>
        {/* Logo */}
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/images/Logo.png"
              alt="VedaAI"
              width={100}
              height={100}
              className={collapsed ? "h-auto w-[28px] object-contain" : "h-auto w-[45%] object-contain"}
              priority
            />
            {!collapsed && <p className="text-xl font-bold">VedaAI</p>}
          </div>

          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#777] hover:bg-[#f5f5f5]"
          >
            <PanelLeft size={16} strokeWidth={1.7} />
          </button>
        </div>

        {/* AI Teacher's Toolkit */}
        <button aria-label="AI Teacher's Toolkit" className={`mt-8 flex h-[38px] items-center justify-center rounded-full border-[3px] border-[#ff7043] bg-[#292929] text-[13px] font-medium text-white ${collapsed ? "w-[38px]" : "w-full gap-2"}`}>
          <Sparkles size={14} />
          {!collapsed && "AI Teacher's Toolkit"}
        </button>

        {/* Navigation */}
        <nav className="mt-12 flex w-full flex-col gap-3">
          <NavItem collapsed={collapsed} icon={<Grid2X2 size={17} />} label="Home" />

          <NavItem
            icon={<BriefcaseBusiness size={17} />}
            label="My Classroom"
            collapsed={collapsed}
          />

          <NavItem collapsed={collapsed} icon={<BookOpen size={17} />} label="Assignments" />

          <NavItem collapsed={collapsed} icon={<ClipboardPen size={17} />} label="Exams" active />

          <NavItem collapsed={collapsed} icon={<Library size={17} />} label="My Library" />
        </nav>

        {/* Bottom */}
        <div className="mt-auto">
          <button aria-label="Settings" className={`mb-5 flex items-center py-2 text-left text-[13px] text-[#777] ${collapsed ? "justify-center items-center " : "w-full gap-3 px-3"}`}>
            <Settings size={18} strokeWidth={1.7} />
            {!collapsed && "Settings"}
          </button>

          {/* School */}
          <div className={`flex items-center rounded-[14px] bg-[#f1f1f1] py-3 ${collapsed ? "justify-center px-1" : "gap-3 px-3"}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
              <University size={24}/>
            </div>

            {!collapsed && <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#404040]">
                Delhi Public School
              </p>

              <p className="mt-0.5 text-[11px] text-[#777]">
                Bokaro Steel City
              </p>
            </div>}
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false, collapsed = false }) {
  return (
    <button
      aria-label={label}
      className={`flex h-8 items-center rounded-[7px] text-left text-xl transition ${collapsed ? "justify-center" : "w-full gap-3 px-3"} ${
        active
          ? "bg-[#eeeeee] font-medium text-[#222]"
          : "text-[#666] hover:bg-[#f6f6f6]"
      }`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
