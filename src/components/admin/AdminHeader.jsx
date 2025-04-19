import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import authService from "../../api/authService";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Container, CustomNavLink, ProfileCard } from "../../router";

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleScroll = () => setIsScrolled(window.scrollY > 0);

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
    window.location.href = "/";
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

  const renderLinks = () => {
    if (isAuthenticated) {
      if (userRole === 0) {
        return (
          <>
            <CustomNavLink href="/dashboard">Dashboard</CustomNavLink>
            <CustomNavLink href="/category">Categories</CustomNavLink>
            <CustomNavLink href="/scategory">Sub-Categories</CustomNavLink>
            <CustomNavLink href="/userlist">Users</CustomNavLink>
            <CustomNavLink href="/postes/admin">Posts</CustomNavLink>
          </>
        );
      } else {
        return (
          <>
            <CustomNavLink href="/home">Home</CustomNavLink>
            <CustomNavLink href="/Auctions">Auctions</CustomNavLink>
            <CustomNavLink href="/create-auction">Create Auction</CustomNavLink>
            <CustomNavLink href="/" onClick={handleLogout}>Log Out</CustomNavLink>
          </>
        );
      }
    } else {
      return (
        <>
          <CustomNavLink href="/home">Home</CustomNavLink>
          <CustomNavLink href="/auctions">Auctions</CustomNavLink>
          <CustomNavLink href="/login">Create Auction</CustomNavLink>
          <CustomNavLink href="/register">Join</CustomNavLink>
          <CustomNavLink href="/login">Log In</CustomNavLink>
        </>
      );
    }
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""} ${isHomePage ? "bg-primary" : "bg-white shadow"}`}>
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
          <div className="hidden lg:flex items-center gap-6 text-[#20354c] font-medium">
            {renderLinks()}
          </div>

          {/* Profile & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2">
                  <ProfileCard>
                    <img
                      src={currentUser?.photoProfil }
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                  </ProfileCard>
                  <span className="text-sm font-semibold text-[#20354c] hidden md:inline">
                    {currentUser?.prenom} {currentUser?.nom}
                  </span>
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

            {/* Menu Mobile Button */}
            <button onClick={toggleMenu} className="p-2 rounded-lg bg-[#20354c] text-white lg:hidden">
              {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-white shadow-lg py-4 z-40" ref={menuRef}>
            <div className="flex flex-col items-center gap-4 text-[#20354c] font-medium">
              {renderLinks()}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default AdminHeader;
