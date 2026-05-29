import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-60 h-screen bg-white shadow p-4 space-y-4">
      <Link to="/compounder" className="block hover:text-blue-600">
        Dashboard
      </Link>

      <Link to="/patients" className="block hover:text-blue-600">
        Patients
      </Link>

      <Link to="/appointments" className="block hover:text-blue-600">
        Appointments
      </Link>
    </div>
  );
}

export default Sidebar;