import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import authService from "../../api/authService";

// design
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { Container, CustomNavLink, CustomNavLinkList, ProfileCard } from "../../router";
import { User1 } from "../hero/Hero";
import { menulists } from "../../utils/data";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenuOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeMenuOutside);
    window.addEventListener("scroll", handleScroll);

    // Vérifier si l'utilisateur est authentifié
    setIsAuthenticated(authService.isAuthenticated());
    setCurrentUser(authService.getAuthenticatedUser()); 

    return () => {
      document.removeEventListener("mousedown", closeMenuOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Appel uniquement lors du premier rendu du composant

  // Check if it's the home page
  const isHomePage = location.pathname === "/";

  return (
    <header className={isHomePage ? `header py-1 bg-primary ${isScrolled ? "scrolled" : ""}` : `header bg-white shadow-s1 ${isScrolled ? "scrolled" : ""}`}>
      <Container>
        <nav className="p-4 flex justify-between items-center relative">
          <div className="flex items-center gap-14">
            <div>
              {isHomePage && !isScrolled ? (
                <img src="../images/common/header-logo.png" alt="LogoImg" className="h-11" />
              ) : (
                <img src="../images/common/header-logo2.png" alt="LogoImg" className="h-11" />
              )}
            </div>
            <div className="hidden lg:flex items-center justify-between gap-8">
              {menulists.map((list) => (
                <li key={list.id} className="capitalize list-none">
                  <CustomNavLinkList
                    href={list.path}
                    isActive={location.pathname === list.path}
                    className={`${isScrolled || !isHomePage ? "text-black" : "text-white hover:text-[#cedaed]"}`}
                  >
                    {list.link}
                  </CustomNavLinkList>
                </li>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-8 icons">
            <div className="hidden lg:flex lg:items-center lg:gap-8">
              <IoSearchOutline size={23} className={`${isScrolled || !isHomePage ? "text-black" : "text-white hover:text-[#dde4f0]"}`} />
              {isAuthenticated ? (
                <CustomNavLink href="/dashboard">
                  <ProfileCard>
                  <img
                        src={currentUser?.photoProfil || User1}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />                  </ProfileCard>
                </CustomNavLink>
              ) : (
                <>
                  <CustomNavLink
                    href="/login"
                    className={`${isScrolled || !isHomePage ? "text-black" : "text-white hover:text-[#cedaed]"}`}
                  >
                    Sign in
                  </CustomNavLink>
                  <CustomNavLink
                    href="/register"
                    className={`${!isHomePage || isScrolled ? "bg-[#20354c] text-white" : "bg-white text-[#20354c]"} px-8 py-2 rounded-full shadow-md`}
                  >
                    Join
                  </CustomNavLink>
                </>
              )}
            </div>
            <div className={`icon flex items-center justify-center gap-6 ${isScrolled || !isHomePage ? "text-primary" : "text-white"}`}>
              <button onClick={toggleMenu} className="lg:hidden w-10 h-10 flex justify-center items-center bg-[#20354c] text-white focus:outline-none">
                {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
              </button>
            </div>
          </div>
          {/* Responsive Menu if below 768px */}
          <div
            ref={menuRef}
            className={`lg:flex lg:items-center lg:w-auto w-full p-5 absolute right-0 top-full menu-container ${isOpen ? "open" : "closed"}`}
          >
            {menulists.map((list) => (
              <li key={list.id} className="uppercase list-none">
                <CustomNavLink href={list.path} className="text-[#20354c]">
                  {list.link}
                </CustomNavLink>
              </li>
            ))}
          </div>
        </nav>
      </Container>
    </header>
  );
};
