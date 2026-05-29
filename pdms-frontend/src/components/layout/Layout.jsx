import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    // <div className="flex bg-gray-100 min-h-screen ">
    <div className="flex bg-gray-100 ">

      <div className="flex-1">
        {/* <Header className="no-print"/> */}
        <div className="no-print">
          <Header />
        </div>
        {/* <div className="p-6">{children}</div> */}
        <div className=" overflow-x-hidden max-w-full">{children}</div>
      </div>
    </div>
  );
}

export default Layout;