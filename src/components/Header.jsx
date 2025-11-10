import { useEffect, useRef, useState } from "react";
import { Menu, X, Bell, Moon, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Dummy admin user data
  const user = {
    firstName: "Dhiraj",
    lastName: "Prajapati",
    role: "Admin",
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Problem", href: "/admin/problems" },
    { name: "Contest", href: "/admin/contest" },
    { name: "Reports", href: "/admin/reports" },
    { name: "Settings", href: "/admin/settings", type: "mobile" },
    { name: "Logout", href: "/logout", type: "mobile" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-black/80 backdrop-blur-md border-b border-gray-800 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 text-2xl font-bold text-purple-400 hover:text-purple-300 transition"
        >
          <Shield size={22} />
          <span>AdminPanel</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-300">
          {navLinks.map(
            (link) =>
              link.type !== "mobile" && (
                <Link
                  key={link.name}
                  to={link.href}
                  className="hover:text-white transition duration-200"
                >
                  {link.name}
                </Link>
              )
          )}
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            className="text-gray-300 hover:text-white transition"
            title="Notifications"
          >
            <Bell size={20} />
          </button>
          <button
            className="text-gray-300 hover:text-white transition"
            title="Toggle Theme"
          >
            <Moon size={20} />
          </button>

          {/* Admin Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center focus:outline-none"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                alt="Admin avatar"
                className="w-9 h-9 rounded-full border border-gray-700 cursor-pointer hover:scale-[1.03] transition-transform duration-200"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
                <div className="px-4 py-2 text-gray-200 border-b border-gray-700">
                  Hello, {user.firstName}
                </div>
                <ul className="text-gray-300">
                  <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
                    <Link to="/admin/profile">My Profile</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
                    Settings
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-red-400">
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-200"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-gray-800 px-5 py-4 flex flex-col space-y-4 text-gray-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="hover:text-white transition duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center space-x-3 border-t border-gray-800 pt-3">
            <img
              src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
              alt="Admin avatar"
              className="w-10 h-10 rounded-full border border-gray-700"
            />
            <span className="text-gray-100 font-medium">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
