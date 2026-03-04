import { cn } from "@/lib/utils";
import {
  ActivitySquare,
  BookOpen,
  ClipboardList,
  PlusCircle,
} from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: "dashboard" | "crf-new" | "guide") => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col sidebar-nav border-r border-sidebar-border">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
              <ActivitySquare className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <div className="font-bold text-sm text-sidebar-foreground leading-tight">
                Neonatal Sepsis
              </div>
              <div className="text-xs text-sidebar-foreground/60 leading-tight">
                CRF Study App
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav
          className="flex-1 px-3 py-4 space-y-1"
          aria-label="Main navigation"
        >
          <NavItem
            icon={<ClipboardList className="w-4 h-4" />}
            label="Cases"
            active={currentPage === "dashboard"}
            onClick={() => onNavigate("dashboard")}
            data-ocid="nav.cases.link"
          />
          <NavItem
            icon={<PlusCircle className="w-4 h-4" />}
            label="New Case"
            active={currentPage === "crf-new"}
            onClick={() => onNavigate("crf-new")}
            data-ocid="nav.new_case.link"
          />
          <NavItem
            icon={<BookOpen className="w-4 h-4" />}
            label="Adjudication Guide"
            active={currentPage === "guide"}
            onClick={() => onNavigate("guide")}
            data-ocid="nav.guide.link"
          />
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/40 leading-relaxed">
            Observational Study of Clinical Practices
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 sidebar-nav border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ActivitySquare className="w-5 h-5 text-sidebar-primary" />
          <span className="font-bold text-sm text-sidebar-foreground">
            Neonatal Sepsis CRF
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              "p-2 rounded-md text-xs",
              currentPage === "dashboard"
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/70",
            )}
            onClick={() => onNavigate("dashboard")}
            data-ocid="mobile.cases.link"
          >
            Cases
          </button>
          <button
            type="button"
            className={cn(
              "p-2 rounded-md text-xs",
              currentPage === "crf-new"
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/70",
            )}
            onClick={() => onNavigate("crf-new")}
            data-ocid="mobile.new_case.link"
          >
            + New
          </button>
          <button
            type="button"
            className={cn(
              "p-2 rounded-md text-xs",
              currentPage === "guide"
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/70",
            )}
            onClick={() => onNavigate("guide")}
            data-ocid="mobile.guide.link"
          >
            Guide
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">{children}</main>
    </div>
  );
}

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  "data-ocid"?: string;
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  "data-ocid": ocid,
}: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
        active
          ? "bg-sidebar-accent text-sidebar-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      <span
        className={cn("flex-shrink-0", active ? "text-sidebar-primary" : "")}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}
