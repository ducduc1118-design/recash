import React, { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button, StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Toast } from '@/components/ui';
import { adminService } from '@/services/admin.service';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await adminService.getUsers(controller.signal);
        setUsers(data);
      } catch {
        setToast({ show: true, message: 'Unable to load users.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-6">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Users</h2>
        <Button><UserPlus className="w-4 h-4 mr-2" /> Add User</Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableHead>User</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>{user.joined}</TableCell>
              <TableCell className="font-mono font-bold">{user.balance}</TableCell>
              <TableCell><StatusBadge label={user.status} variant={user.status === 'Active' ? 'success' : 'error'} /></TableCell>
              <TableCell>
                <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">Edit</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
