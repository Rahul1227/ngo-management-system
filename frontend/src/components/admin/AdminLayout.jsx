import { Outlet } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children || <Outlet />}
    </div>
  );
};

export default AdminLayout;