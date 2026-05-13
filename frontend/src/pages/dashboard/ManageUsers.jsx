import { useState, useEffect } from "react";
import { getAllUsers, deleteUser, updateUserRole } from "../../api/userApi";
import { TableSkeleton } from "../../components/common/Loader";
import { User, Shield, Trash2, Mail, MoreVertical, Search, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Note: Backend endpoint /api/users needs to be implemented
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users. (Admin access required)");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-slate-400 mt-1">Control system access and manage user roles.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search users..."
            className="input-field pl-11 py-2.5 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b border-white/5">
                  <th className="pb-4 font-medium px-6">User</th>
                  <th className="pb-4 font-medium">Role</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Joined</th>
                  <th className="pb-4 font-medium text-right px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-1.5">
                        <Shield className={`w-3.5 h-3.5 ${user.role === 'ADMIN' ? 'text-accent' : 'text-primary'}`} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'text-accent' : 'text-primary'}`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </div>
                    </td>
                    <td className="py-5 text-sm text-slate-500">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-5 text-right px-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:text-primary transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:text-accent transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
