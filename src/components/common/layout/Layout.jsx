import React from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import AdminHeader from "../../admin/AdminHeader";

export const Layout = ({ children }) => {
  // Récupération de l'utilisateur depuis localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 0;

  return (
    <>
      {isAuthenticated && isAdmin ? <AdminHeader /> : <Header />}
     
      <main>{children}</main>
      <Footer />
    </>
  );
};