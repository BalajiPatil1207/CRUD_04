import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Map of URL segments to readable labels for a cleaner UI
  const breadcrumbMap = {
    admin: "Home",
    dashboard: "Command Center",
    chat: "Secure Messaging",
    create: "New Entry",
    edit: "Update Details",
  };

  if (location.pathname === "/admin/dashboard") return null;

  return (
    <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-slate-500 mb-8 bg-gray-50/50 dark:bg-slate-900/50 w-fit px-4 py-2 rounded-full border border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-500">
      <Link
        to="/admin/dashboard"
        className="flex items-center gap-2 hover:text-brand-500 dark:hover:text-brand-400 transition-colors group"
      >
        <Home
          size={12}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="opacity-60">Admin</span>
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        // Skip 'admin' as it's handled by the Home link
        if (value === "admin") return null;

        // Handle UUIDs in paths (don't show them as breadcrumb segments)
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            value,
          );
        if (isUUID) return null;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={10} className="opacity-30" />
            {last ? (
              <span className="text-gray-900 dark:text-white font-black">
                {breadcrumbMap[value] || value}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors opacity-60 hover:opacity-100"
              >
                {breadcrumbMap[value] || value}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
