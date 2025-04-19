import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../api/authService";

// design
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import {
  Container,
  CustomNavLink,
  CustomNavLinkList,
  ProfileCard,
} from "../../router";
import { User1 } from "../hero/Hero";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate("/");
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeMenuOutside);
    window.addEventListener("scroll", handleScroll);

    const user = authService.getAuthenticatedUser();
    setIsAuthenticated(authService.isAuthenticated());
    setCurrentUser(user);

    return () => {
      document.removeEventListener("mousedown", closeMenuOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isHomePage = location.pathname === "/";
  const navLinkStyle = `${isScrolled || !isHomePage
    ? "text-[#20354c] hover:text-blue-600"
    : "text-white hover:text-gray-300"} transition-colors duration-200`;

  const links = [
    { id: 1, name: "home", path: "/" },
    { id: 2, name: "auctions", path: "/auctions" },
    {
      id: 3,
      name: "create auction",
      path: isAuthenticated ? "/create-auction" : "/login",
    },
  ];

  return (
    <header
      className={`header py-1 ${isHomePage ? "bg-primary" : "bg-white shadow-s1"
        } ${isScrolled ? "scrolled" : ""} transition-all duration-300`}
    >
      <Container>
        <nav className="p-4 flex justify-between items-center relative">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img
              src={
                isHomePage && !isScrolled
                  ? "../images/common/header-logo.png"
                  : "../images/common/header-logo2.png"
              }
              alt="LogoImg"
              className="h-11 transition duration-300"
            />
          </div>

          {/* Centered Nav Links */}
          <ul className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {links.map((link) => (
              <li key={link.id} className="capitalize list-none">
                <CustomNavLinkList
                  href={link.path}
                  isActive={location.pathname === link.path}
                  className={navLinkStyle}
                >
                  {link.name}
                </CustomNavLinkList>
              </li>
            ))}
          </ul>

          {/* Right Side: Auth + Profile + Burger */}
          <div className="flex items-center gap-6">
            {isAuthenticated && currentUser?.role === 1 && (
              <CustomNavLink href="/dashboard">
                <ProfileCard>
                  <img
                    src={currentUser?.photoProfil || User1}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </ProfileCard>
              </CustomNavLink>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              currentUser?.role === 1 && (
                <button
                  onClick={handleLogout}
                  className="text-red-600 font-semibold hover:underline hidden lg:block"
                >
                  Log out
                </button>
              )
            ) : (
              <div className="hidden lg:flex gap-4 items-center">
                <CustomNavLink
                  href="/register"
                  className={`flex items-center justify-center px-6 py-2 rounded-full shadow-md transition duration-200 text-sm font-medium ${isScrolled || !isHomePage
                    ? "bg-[#20354c] text-white hover:bg-blue-900"
                    : "bg-white text-[#20354c] hover:bg-gray-200"
                    }`}
                >
                  Join
                </CustomNavLink>
                <CustomNavLink
                  href="/login"
                  className={`flex items-center justify-center px-6 py-2 rounded-full border transition duration-200 text-sm font-medium ${isScrolled || !isHomePage
                    ? "text-[#20354c] border-[#20354c] hover:text-blue-600 hover:border-blue-600"
                    : "text-white border-white hover:text-gray-300 hover:border-gray-300"
                    }`}
                >
                  Log in
                </CustomNavLink>
              </div>
            )}

            {/* Burger Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden w-10 h-10 flex justify-center items-center bg-[#20354c] text-white"
            >
              {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
          </div>

          {/* Responsive Menu */}
          <ul
            ref={menuRef}
            className={`lg:hidden absolute w-full right-0 top-full bg-white z-10 p-5 shadow-md rounded-md space-y-4 transition-all ${isOpen ? "block" : "hidden"
              }`}
          >
            {links.map((link) => (
              <li key={link.id} className="capitalize list-none">
                <CustomNavLink href={link.path} className="text-[#20354c]">
                  {link.name}
                </CustomNavLink>
              </li>
            ))}

            {isAuthenticated ? (
              currentUser?.role === 1 && (
                <li className="capitalize list-none">
                  <button
                    onClick={handleLogout}
                    className="text-red-600 font-semibold"
                  >
                    Log out
                  </button>
                </li>
              )
            ) : (
              <>
                <li className="capitalize list-none">
                  <CustomNavLink
                    href="/register"
                    className={`px-6 py-2 rounded-full shadow-md transition duration-200 text-sm font-medium ${isScrolled || !isHomePage
                      ? "bg-[#20354c] text-white hover:bg-blue-900"
                      : "bg-white text-[#20354c] hover:bg-gray-200"
                      }`}
                  >
                    Join
                  </CustomNavLink>
                </li>
                <li className="capitalize list-none">
                  <CustomNavLink
                    href="/login"
                    className={`px-6 py-2 rounded-full border transition duration-200 text-sm font-medium ${isScrolled || !isHomePage
                      ? "text-[#20354c] border-[#20354c] hover:text-blue-600 hover:border-blue-600"
                      : "text-white border-white hover:text-gray-300 hover:border-gray-300"
                      }`}
                  >
                    Log in
                  </CustomNavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
};
