'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api/auth';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: '', photoUrl: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfileForm({ name: user.name, photoUrl: user.photoUrl || '' });
  }, [user]);

  const saveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setSavingProfile(true);
      await authApi.updateProfile({ name: profileForm.name.trim(), photoUrl: profileForm.photoUrl.trim() });
      await refreshUser();
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Both password fields are required');
      return;
    }

    try {
      setSavingPassword(true);
      await authApi.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success('Password changed');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <div className="mt-4 space-y-3">
          <Input placeholder="Full name" value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} />
          <Input placeholder="Email" value={user?.email || ''} disabled />
          <Input
            placeholder="Photo URL"
            value={profileForm.photoUrl}
            onChange={(e) => setProfileForm((p) => ({ ...p, photoUrl: e.target.value }))}
          />
          <p className="text-xs text-slate-500">Role: {user?.role}</p>
          <Button onClick={saveProfile} disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Change Password</h2>
        <div className="mt-4 space-y-3">
          <Input
            type="password"
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
          />
          <Input
            type="password"
            placeholder="New password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
          />
          <Button onClick={savePassword} disabled={savingPassword}>
            {savingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
