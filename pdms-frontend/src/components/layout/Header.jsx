import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import logo2 from "../../assets/logo2.png";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload();
  };

  return (
    // <div className="flex justify-between items-center px-6 py-1 bg-white shadow-sm border-b">
      
    //   {/* LEFT - Logo + Text */}
    //   <div className="flex items-center gap-3">
    //     <img
    //       src={logo}
    //       alt="logo"
    //       className="h-14 w-auto object-contain"
    //     />
    //     
        // <img
        //   src={logo2}
        //   alt="logo2"
        //   className="h-14 w-auto object-contain"
        // /> 
    //   </div>
      
    //   {/* RIGHT - Logout */}
    //   <button
    //     onClick={handleLogout}
    //     className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    //   >
    //     🔓 Logout
    //   </button>
    // </div>


    <div className="flex justify-between items-center px-6 py-1 bg-white shadow-sm border-b">

      <div className="flex items-center gap-3 overflow-hidden">
        <img
          src={logo}
          alt="logo"
          className="h-14 w-auto object-contain"
        />

        <svg
          viewBox="0 0 800 300"
          className="h-14 max-w-[300px] w-full object-contain"
        >
          <defs>
            <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#FFFFFF", stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: "#B0B5B9", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#8D9296", stopOpacity: 1 }} />
            </linearGradient>

            <filter id="dropShadow" x="-20%" y="-20%" width="150%" height="150%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="2" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* MAIN TITLE */}
          <text
            x="40"
            y="120"
            fontFamily="Arial Black, sans-serif"
            fontSize="110"
            fontWeight="900"
            fill="url(#silverGradient)"
            stroke="#1A1D21"
            strokeWidth="2"
            filter="url(#dropShadow)"
            letterSpacing="-5"
          >
            S&amp;D Eyecare
          </text>

          {/* SUB TITLE */}
          <text
            x="360"
            y="190"
            fontFamily="Georgia, serif"
            fontSize="55"
            fontWeight="bold"
            fill="#0D2240"
            stroke="#000"
            strokeWidth="0.5"
          >
            and Opticals
          </text>

          {/* LINE */}
          <path
            d="M 20 185 L 340 185 Q 350 185 340 190 L 20 190 Z"
            fill="black"
          />

          {/* TAGLINE */}
          <text
            x="110"
            y="250"
            fontFamily="Georgia, serif"
            fontSize="42"
            fontStyle="italic"
            fontWeight="bold"
            fill="#0D2240"
            filter="url(#dropShadow)"
          >
            Because we care for your vision
          </text>          
        </svg>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        🔓 Logout
      </button>
    </div>


  );
}

export default Header;