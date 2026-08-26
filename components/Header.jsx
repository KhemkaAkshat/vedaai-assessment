"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  ChevronDown,
  ClipboardPen,
  HelpCircle,
  Menu,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function Header() {
  return (
    <header className="mx-3 mt-3 flex h-[46px] items-center justify-between rounded-[16px] bg-white px-4 md:mx-0 md:mr-5 md:mt-3 md:h-[60px]">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          aria-label="Go back"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f4f4f4]"
        >
          <ArrowLeft size={24} strokeWidth={2} />
        </button>

        {/* Mobile logo */}
        <div className="md:hidden">
          <Image
            src="/images/logo.png"
            alt="VedaAI"
            width={74}
            height={28}
            className="h-auto w-[74px]"
          />
        </div>

        {/* Desktop breadcrumb */}
        <div className="hidden items-center gap-2 md:flex">
          <ClipboardPen
            size={18}
            className="text-[#a0a0a0]"
            strokeWidth={1.7}
          />

          <span className="text-[14px] text-[#999]">
            Exams
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Help */}
        <button className="hidden h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5f5f5] md:flex">
          <HelpCircle size={18} strokeWidth={1.7} />
        </button>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5f5f5]">
          <Bell size={18} strokeWidth={1.7} />

          <span className="absolute right-[6px] top-[5px] h-[5px] w-[5px] rounded-full bg-[#ff633b]" />
        </button>

        {/* AI */}
        <button className="hidden h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5f5f5] md:flex">
          <Sparkles size={18} strokeWidth={1.7} />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-full px-1.5 py-1 hover:bg-[#f5f5f5]">
          <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#f0d8cf]">
            <UserRound size={15} className="text-[#555]" />
          </div>

          <span className="hidden text-[12px] font-medium text-[#333] md:block">
            Madhur Rastogi
          </span>

          <ChevronDown
            size={15}
            className="hidden text-[#555] md:block"
          />
        </button>

        {/* Mobile menu */}
        <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5f5f5] md:hidden">
          <Menu size={19} />
        </button>
      </div>
    </header>
  );
}