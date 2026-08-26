"use client";

import Image from "next/image";
import {
  Grid2X2,
  BriefcaseBusiness,
  BookOpen,
  Clock3,
  Library,
  Settings,
  Sparkles,
  PanelLeft,
  ClipboardPen,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="hidden w-[20%] shrink-0 p-2 md:block">
      <div className="flex h-[calc(100vh-20px)] flex-col rounded-[18px] bg-white px-7 py-6 shadow-md">
        {/* Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/images/logo.png"
              alt="VedaAI"
              width={100}
              height={100}
              className="h-auto w-[45%] object-contain"
              priority
            />
            <p className="font-bold text-xl">VedaAI</p>
          </div>

          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#777] hover:bg-[#f5f5f5]">
            <PanelLeft size={16} strokeWidth={1.7} />
          </button>
        </div>

        {/* AI Teacher's Toolkit */}
        <button className="mt-8 flex h-[38px] items-center justify-center gap-2 rounded-full border-[3px] border-[#ff7043] bg-[#292929] text-[13px] font-medium text-white">
          <Sparkles size={14} />
          AI Teacher&apos;s Toolkit
        </button>

        {/* Navigation */}
        <nav className="mt-12 flex flex-col gap-3">
          <NavItem icon={<Grid2X2 size={17} />} label="Home" />

          <NavItem
            icon={<BriefcaseBusiness size={17} />}
            label="My Classroom"
          />

          <NavItem icon={<BookOpen size={17} />} label="Assignments" />

          <NavItem icon={<ClipboardPen size={17} />} label="Exams" active />

          <NavItem icon={<Library size={17} />} label="My Library" />
        </nav>

        {/* Bottom */}
        <div className="mt-auto">
          <button className="mb-5 flex w-full items-center gap-3 px-3 py-2 text-left text-[13px] text-[#777]">
            <Settings size={17} strokeWidth={1.7} />
            Settings
          </button>

          {/* School */}
          <div className="flex items-center gap-3 rounded-[14px] bg-[#f1f1f1] px-3 py-3">
            <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
              <span className="text-[20px] text-[#4d8754]">✺</span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#404040]">
                Delhi Public School
              </p>

              <p className="mt-0.5 text-[11px] text-[#777]">
                Bokaro Steel City
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <button
      className={`flex h-8 w-full items-center gap-3 rounded-[7px] px-3 text-left text-xl transition ${
        active
          ? "bg-[#eeeeee] font-medium text-[#222]"
          : "text-[#666] hover:bg-[#f6f6f6]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
