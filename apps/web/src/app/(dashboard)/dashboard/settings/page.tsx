'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/lib/theme-context';
import {
  Lock,
  Shield,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  User,
  KeyRound,
  X,
  Palette,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    try {
      setPasswordError(null);
      setPasswordSuccess(false);

      await api.patch('/users/me/password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      setPasswordSuccess(true);
      reset();
      setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password. Please check your current password.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      await api.delete('/users/me');
      await logout();
      router.push('/');
    } catch (err: any) {
      alert(err.message || 'Failed to delete account.');
      setDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your login credentials and security preferences.</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>Your registered identity on the CareerCraft platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1526]/60 border border-slate-100 dark:border-navy-700/60 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Registered Email</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{user?.email}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1526]/60 border border-slate-100 dark:border-navy-700/60 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Account Role</p>
              <div className="pt-0.5">
                <Badge variant={user?.role === 'ADMIN' ? 'default' : 'neutral'}>
                  {user?.role}
                </Badge>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1526]/60 border border-slate-100 dark:border-navy-700/60 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Member Since</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance & Theme Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#005A9C] dark:text-[#60C1E5]" />
            <CardTitle>Appearance &amp; Theme</CardTitle>
          </div>
          <CardDescription>Select your preferred color theme for the CareerCraft interface.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Crisp ocean & sea white interface' },
              { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Deep navy midnight sea theme' },
              { id: 'system', label: 'System Sync', icon: Monitor, desc: 'Matches your OS appearance' },
            ].map(({ id, label, icon: Icon, desc }) => {
              const isSelected = theme === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id as any)}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#005A9C] bg-[#A0E0EF]/15 dark:border-[#60C1E5] dark:bg-[#005A9C]/25 shadow-xs'
                      : 'border-slate-200 dark:border-navy-700/80 hover:border-slate-300 dark:hover:border-navy-600 bg-white dark:bg-[#0b1526]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-[#005A9C] dark:text-[#60C1E5]' : 'text-slate-400'}`} />
                    {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#005A9C] dark:bg-[#60C1E5]" />}
                  </div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-600" />
            <CardTitle>Security &amp; Password</CardTitle>
          </div>
          <CardDescription>Update the password used to sign in to your CareerCraft account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordSuccess && (
            <Alert variant="success" title="Password Changed">
              Your password has been updated successfully.
            </Alert>
          )}

          {passwordError && <Alert variant="error">{passwordError}</Alert>}

          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="At least 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="pt-2">
              <Button type="submit" isLoading={isSubmitting}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone: Account Deletion */}
      <Card className="border-red-200 bg-red-50/20">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-red-700/80">
            Permanently delete your account and all associated documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
            Once you delete your account, there is no going back. All of your saved CVs, portfolio websites, projects,
            and personal profile records will be permanently removed from MySQL.
          </p>
          <div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-gray-900 text-lg">Permanently Delete Account?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                This will immediately delete your user record (<span className="font-semibold">{user?.email}</span>), all
                CVs, and unpublish your public portfolios. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deletingAccount}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={deletingAccount}
                onClick={handleDeleteAccount}
              >
                Yes, Delete Everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
