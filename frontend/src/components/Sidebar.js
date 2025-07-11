import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Sidebar = ({ setView }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLinkClick = (view) => {
    setView(view);
    if (window.innerWidth < 768) setIsOpen(false); // Close on mobile
  };

  return (
    <>
      {/* 🔘 Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-900 text-white shadow-md z-50">
        <h1 className="text-xl font-semibold">🧠 JD Matcher</h1>
        <button onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 📐 Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 z-40 shadow-md transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* 🖥️ Desktop Title */}
        <h2 className="text-2xl font-bold mb-8 hidden md:block">🧠 JD Matcher</h2>

        <nav>
          <ul className="space-y-4 text-lg">
            <li>
              <button
                onClick={() => handleLinkClick('upload')}
                className="hover:text-blue-400"
              >
                📤 Upload
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('results')}
                className="hover:text-blue-400"
              >
                📊 Results
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-10 text-xs text-gray-400 hidden md:block">
          © 2025 JD Matcher
        </div>
      </div>
    </>
  );
};

export default Sidebar;
