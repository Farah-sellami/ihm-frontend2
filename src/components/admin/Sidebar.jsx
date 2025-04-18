import { useEffect, useState } from "react";
import { Caption, CustomNavLink, Title } from "../common/Design";
import { CiGrid41 } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { useLocation } from "react-router-dom";
import AuthService from "../../api/authService";

export const Sidebar = () => {
  const [user, setUser] = useState(null); // État pour l'utilisateur
  const location = useLocation();
  const className = "flex items-center gap-3 mb-2 p-4 rounded-full";

  // Récupérer l'utilisateur authentifié à l'aide de AuthService
  useEffect(() => {
    const authenticatedUser = AuthService.getAuthenticatedUser();
    setUser(authenticatedUser); // Mettre à jour l'état avec l'utilisateur récupéré
  }, []);

  // Si l'utilisateur n'est pas encore récupéré, vous pouvez afficher un loader ou un message.
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <section className="sidebar flex flex-col justify-between h-full">
      <div className="profile flex items-center text-center justify-center gap-8 flex-col mb-8">
        {/* Affichage de l'image de l'utilisateur ou image par défaut */}
        <img src={user?.photoProfil || "/default-profile.jpg"} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
        <div>
          {/* Affichage du nom et du CIN de l'utilisateur */}
          <Title className="capitalize">
          {user ? `${user.prenom} ${user.nom}` : "User Name"}
        </Title>
          <Caption>{user?.CIN || "CIN Number"}</Caption>
        </div>
      </div>

      <div>
        <CustomNavLink href="/dashboard" isActive={location.pathname === "/dashboard"} className={className}>
          <span>
            <CiGrid41 size={22} />
          </span>
          <span>Dashboard</span>
        </CustomNavLink>

        <CustomNavLink href="/profile" isActive={location.pathname === "/profile"} className={className}>
          <span>
            <IoSettingsOutline size={22} />
          </span>
          <span>Personal Profile</span>
        </CustomNavLink>

        <button className="flex items-center w-full gap-3 mt-4 bg-red-500 mb-3 hover:text-white p-4 rounded-full text-white">
          <span>
            <IoIosLogOut size={22} />
          </span>
          <span>Log Out</span>
        </button>
      </div>
    </section>
  );
};
