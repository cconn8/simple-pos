'use client';

import React from "react";
// import Dashboard from "../../pages/funerals/FuneralDashboard";\
import Dashboard from "../../pages/funerals-v2/page";
import MainSidebar from "../MainSidebar/MainSidebar";

export default function Layout() {
  return (
      <div className="flex flex-row">
        <MainSidebar />
        <Dashboard />
      </div>
  );
}