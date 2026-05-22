import React, { useState, useEffect } from "react";
import Navbar from "../components/modules/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import ModulesBackground from "../components/modules/ModulesBackground";
import "./DashboardLayout.css";
import { getProfile } from "../services/profileservices";
const DashboardLayout = ({ children, activePage, onNavigate }) => {
  const [facultyName, setFacultyName] = useState("");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) return;

        const res = await getProfile(user.id);

        const profile = res.data;

        setFacultyName(
          `${profile.salutation || ""}

        ${profile.initial || ""}

        ${profile.staff_name || ""}`,
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);
  return (
    <div className="dashboard-layout">
      <ModulesBackground />
      <Navbar
        facultyName={facultyName}
        onHome={() => onNavigate("home")}
        onProfile={() => onNavigate("profile")}
        onLogout={() => {
          localStorage.removeItem("token");

          localStorage.removeItem("user");

          window.location.href = "/";
        }}
      />
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className="dashboard-content">{children}</main>
    </div>
  );
};

export default DashboardLayout;
