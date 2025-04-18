import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import authService from "../../api/authService";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Container, CustomNavLink, ProfileCard } from "../../router";
import { User1 } from "../hero/Hero";

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  const closeOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/"; // Redirige vers la page d'accueil
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeOutsideClick);
    window.addEventListener("scroll", handleScroll);

    setIsAuthenticated(authService.isAuthenticated());
    setCurrentUser(authService.getAuthenticatedUser());

    return () => {
      document.removeEventListener("mousedown", closeOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isHomePage = location.pathname === "/";
  const userRole = currentUser?.role;

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""} ${isHomePage ? "bg-primary" : "bg-white"}`}>
      <Container>
        <nav className="flex justify-between items-center py-4 relative">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <img
              src={isHomePage && !isScrolled ? "../images/common/header-logo.png" : "../images/common/header-logo2.png"}
              alt="Logo"
              className="h-11"
            />
          </div>

          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {isAuthenticated ? (
              userRole === 0 ? (
                <>
                  <CustomNavLink href="/dashboard">Dashboard</CustomNavLink>
                  <CustomNavLink href="/scategory">Sub-Categories</CustomNavLink>
                  <CustomNavLink href="/category">Categories</CustomNavLink>
                  <CustomNavLink href="/userlist">Users</CustomNavLink>
                  <CustomNavLink href="/postes/admin">Posts</CustomNavLink>
                </>
              ) : (
                <>
                  <CustomNavLink href="/home">Home</CustomNavLink>
                  <CustomNavLink href="/auctions">Auctions</CustomNavLink>
                  <CustomNavLink href="/" onClick={handleLogout}>Log Out</CustomNavLink>
                </>
              )
            ) : (
              <>
                <CustomNavLink href="/home">Home</CustomNavLink>
                <CustomNavLink href="/auctions">Auctions</CustomNavLink>
                <CustomNavLink href="/register">Join</CustomNavLink>
                <CustomNavLink href="/login">Log In</CustomNavLink>
              </>
            )}
          </div>

          {/* Icons and Profile */}
          <div className="flex items-center gap-8">
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-3">
                  <ProfileCard>
                    <img
                      src={currentUser?.photoProfil || User1}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </ProfileCard>
                  <span className="text-black">{currentUser?.prenom} {currentUser?.nom}</span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-[#20354c]">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button onClick={toggleMenu} className="p-2 rounded-lg bg-[#20354c] text-white">
                {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-0 left-0 w-full bg-white shadow-lg py-4">
            <div className="flex flex-col items-center">
              {isAuthenticated ? (
                userRole === 0 ? (
                  <>
                    <CustomNavLink href="/dashboard">Dashboard</CustomNavLink>
                    <CustomNavLink href="/scategory">Sub-Categories</CustomNavLink>
                    <CustomNavLink href="/category">Categories</CustomNavLink>
                    <CustomNavLink href="/userlist">Users</CustomNavLink>
                    <CustomNavLink href="/posts">Posts</CustomNavLink>
                  </>
                ) : (
                  <>
                    <CustomNavLink href="/home">Home</CustomNavLink>
                    <CustomNavLink href="/auctions">Auctions</CustomNavLink>
                    <CustomNavLink href="/" onClick={handleLogout}>Log Out</CustomNavLink>
                  </>
                )
              ) : (
                <>
                  <CustomNavLink href="/home">Home</CustomNavLink>
                  <CustomNavLink href="/auctions">Auctions</CustomNavLink>
                  <CustomNavLink href="/register">Join</CustomNavLink>
                  <CustomNavLink href="/login">Log In</CustomNavLink>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default AdminHeader;
