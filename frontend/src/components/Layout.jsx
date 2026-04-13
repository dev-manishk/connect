import { Sidebar } from "./Sidebar.jsx";
import { Navbar } from "./Navbar.jsx";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          {/* pb-16 on mobile leaves room for the bottom nav bar */}
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
