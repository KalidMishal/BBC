'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Spinner } from '../../../components/Skeletons';
import { API_BASE_URL, resolveMediaUrl } from '../../../lib/api';
import { authHeaders, updateStoredUser } from '../../../lib/auth';
import { AuthUser, UserRole } from '../../../types';

export interface AdminManagedUser {
  id: number;
  name: string;
  full_name?: string;
  email: string;
  role: UserRole;
  writer_role?: string | null;
  profile_picture?: string | null;
  is_default_admin: boolean;
  bio?: string | null;
  linkedin_url?: string | null;
  created_at?: string;
}

type RoleFilterTab = 'ALL' | 'ADMIN' | 'WRITER' | 'READER';

function validateStrongPassword(password: string): string | null {
  if (password.length < 7) {
    return 'Password must be at least 7 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must include at least one lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must include at least one number.';
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must include at least one special character.';
  }
  return null;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function UserAvatar({
  name,
  src,
  sizeClass = 'w-9 h-9 text-xs',
}: {
  name: string;
  src?: string | null;
  sizeClass?: string;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveMediaUrl(src);
  const initial = (name || 'U').trim().charAt(0).toUpperCase();

  return (
    <div
      className={`${sizeClass} rounded-full overflow-hidden bg-neutral-900 text-white font-bold flex items-center justify-center border border-gray-200 flex-shrink-0`}
    >
      {resolved && !failed ? (
        <img
          src={resolved}
          alt={name}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}

interface UsersTabProps {
  currentUser: AuthUser;
  onUsersCountChange?: (count: number) => void;
}

export default function UsersTab({ currentUser, onUsersCountChange }: UsersTabProps) {
  const [users, setUsers] = useState<AdminManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [roleFilter, setRoleFilter] = useState<RoleFilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminManagedUser | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formRole, setFormRole] = useState<UserRole>('reader');
  const [formWriterRole, setFormWriterRole] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formLinkedin, setFormLinkedin] = useState('');
  const [formPhoto, setFormPhoto] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View Modal state
  const [viewingUser, setViewingUser] = useState<AdminManagedUser | null>(null);

  // Delete Confirmation Modal
  const [deletingUser, setDeletingUser] = useState<AdminManagedUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: authHeaders(),
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || !data.success || !Array.isArray(data.users)) {
        setErrorMsg(data.message || 'Failed to load users list');
        return;
      }
      setUsers(data.users);
      onUsersCountChange?.(data.users.length);
    } catch {
      setErrorMsg('Network error while loading users');
    } finally {
      setLoading(false);
    }
  }, [onUsersCountChange]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const counts = useMemo(() => {
    return {
      ALL: users.length,
      ADMIN: users.filter((u) => u.role === 'admin').length,
      WRITER: users.filter((u) => u.role === 'writer').length,
      READER: users.filter((u) => u.role === 'reader').length,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter === 'ADMIN' && u.role !== 'admin') return false;
      if (roleFilter === 'WRITER' && u.role !== 'writer') return false;
      if (roleFilter === 'READER' && u.role !== 'reader') return false;
      if (!q) return true;
      return (
        (u.name || '').toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.writer_role || '').toLowerCase().includes(q)
      );
    });
  }, [users, roleFilter, searchQuery]);

  // Live duplicate email check
  const isDuplicateEmail = useMemo(() => {
    const cleaned = formEmail.trim().toLowerCase();
    if (!cleaned) return false;
    return users.some(
      (u) =>
        u.email.trim().toLowerCase() === cleaned &&
        (!editingUser || u.id !== editingUser.id)
    );
  }, [formEmail, users, editingUser]);

  const canEditTarget = (target: AdminManagedUser): boolean => {
    if (currentUser.is_default_admin) return true;
    if (target.is_default_admin) return false;
    if (target.role === 'admin' && target.id !== currentUser.id) return false;
    return true;
  };

  const canDeleteTarget = (target: AdminManagedUser): boolean => {
    if (target.id === currentUser.id) return false;
    if (target.is_default_admin) return false;
    if (target.role === 'admin' && !currentUser.is_default_admin) return false;
    return true;
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setShowPassword(false);
    setFormRole('writer');
    setFormWriterRole('');
    setFormBio('');
    setFormLinkedin('');
    setFormPhoto('');
    setFormError('');
    setFormOpen(true);
  };

  const openEditModal = (target: AdminManagedUser) => {
    setEditingUser(target);
    setFormName(target.name || target.full_name || '');
    setFormEmail(target.email || '');
    setFormPassword('');
    setShowPassword(false);
    setFormRole(target.role);
    setFormWriterRole(target.writer_role || '');
    setFormBio(target.bio || '');
    setFormLinkedin(target.linkedin_url || '');
    setFormPhoto(target.profile_picture || '');
    setFormError('');
    setFormOpen(true);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setFormError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 240;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              setIsUploadingAvatar(false);
              return;
            }
            const formData = new FormData();
            formData.append('folder', 'avatars');
            formData.append(
              'file',
              blob,
              file.name.replace(/\.[^/.]+$/, '') + '.webp'
            );
            try {
              const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: authHeaders(),
                body: formData,
              });
              const data = await res.json();
              if (res.ok && data.success && data.url) {
                setFormPhoto(data.url);
              } else {
                setFormError(data.message || 'Avatar upload failed');
              }
            } catch {
              setFormError('Network error during avatar upload');
            } finally {
              setIsUploadingAvatar(false);
            }
          },
          'image/webp',
          0.85
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError('');
    setSuccessMsg('');

    const trimmedName = formName.trim();
    const cleanedEmail = formEmail.trim().toLowerCase();

    if (!trimmedName) {
      setFormError('Full name is required.');
      return;
    }
    if (!cleanedEmail || !cleanedEmail.includes('@')) {
      setFormError('Please provide a valid email address.');
      return;
    }
    if (isDuplicateEmail) {
      setFormError('Another account already uses this email address.');
      return;
    }

    if (!editingUser || formPassword.trim().length > 0) {
      const pwErr = validateStrongPassword(formPassword);
      if (pwErr) {
        setFormError(pwErr);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (!editingUser) {
        const res = await fetch(`${API_BASE_URL}/admin/users`, {
          method: 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            name: trimmedName,
            email: cleanedEmail,
            password: formPassword,
            role: formRole,
            writer_role: formRole === 'writer' ? formWriterRole.trim() : null,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setFormError(data.message || 'Failed to create user');
          return;
        }
        setSuccessMsg(`Created account for ${trimmedName}.`);
      } else {
        const res = await fetch(`${API_BASE_URL}/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            name: trimmedName,
            email: cleanedEmail,
            role: formRole,
            writer_role: formRole === 'writer' ? formWriterRole.trim() : null,
            bio: formBio.trim(),
            linkedin_url: formLinkedin.trim(),
            profile_picture: formPhoto.trim() || null,
            ...(formPassword.trim().length > 0 ? { password: formPassword } : {}),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setFormError(data.message || 'Failed to update user');
          return;
        }

        if (editingUser.id === currentUser.id) {
          updateStoredUser({
            name: trimmedName,
            fullName: trimmedName,
            bio: formBio.trim(),
            linkedin_url: formLinkedin.trim(),
            profile_picture: formPhoto.trim() || null,
          });
        }
        setSuccessMsg(`Updated profile for ${trimmedName}.`);
      }

      setFormOpen(false);
      await fetchUsers();
    } catch {
      setFormError('Network error while saving user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser || isDeleting) return;
    setIsDeleting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Failed to delete user');
        setDeletingUser(null);
        return;
      }
      setSuccessMsg(`Removed ${deletingUser.name || deletingUser.email}.`);
      setDeletingUser(null);
      await fetchUsers();
    } catch {
      setErrorMsg('Network error while deleting user');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#141414]">User Directory &amp; Access</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage readers, newsroom writers, and editorial administrators.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#bb1919] hover:bg-[#9d1414] text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm transition-colors cursor-pointer"
        >
          <span>+ ADD USER</span>
        </button>
      </div>

      {/* Status Messages */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded">
          {successMsg}
        </div>
      )}

      {/* Filter Tabs + Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: 'ALL', label: `ALL USERS (${counts.ALL})` },
                { key: 'ADMIN', label: `ADMINS (${counts.ADMIN})` },
                { key: 'WRITER', label: `WRITERS (${counts.WRITER})` },
                { key: 'READER', label: `READERS (${counts.READER})` },
              ] as Array<{ key: RoleFilterTab; label: string }>
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setRoleFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                  roleFilter === tab.key
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-neutral-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, or beat..."
              className="w-full px-3.5 py-2 border border-gray-300 rounded text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-neutral-500">
            <Spinner className="w-5 h-5 text-black" />
            <span>Loading user accounts...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-10 text-center text-xs text-neutral-500">
            No user accounts match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-3 pr-4">User</th>
                  <th className="py-3 px-4">Role / Beat</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.map((u) => {
                  const editable = canEditTarget(u);
                  const deletable = canDeleteTarget(u);
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <UserAvatar name={u.name || u.email} src={u.profile_picture} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-[#141414] truncate">
                                {u.name || 'Unnamed User'}
                              </span>
                              {u.is_default_admin && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase tracking-wider">
                                  ★ DEFAULT ADMIN
                                </span>
                              )}
                              {u.id === currentUser.id && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-500 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-red-50 text-[#bb1919] border border-red-200'
                              : u.role === 'writer'
                              ? 'bg-blue-50 text-[#00508f] border border-blue-200'
                              : 'bg-gray-100 text-neutral-700 border border-gray-200'
                          }`}
                        >
                          {u.role}
                        </span>
                        {u.role === 'writer' && u.writer_role && (
                          <div className="text-xs text-neutral-600 mt-1 font-medium">
                            {u.writer_role}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-neutral-500 whitespace-nowrap">
                        {formatDate(u.created_at)}
                      </td>

                      <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingUser(u)}
                            className="px-2.5 py-1.5 border border-gray-300 rounded text-[11px] font-bold text-neutral-700 hover:bg-gray-100 cursor-pointer"
                          >
                            VIEW
                          </button>

                          {editable && (
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              className="px-2.5 py-1.5 bg-[#00508f] text-white rounded text-[11px] font-bold hover:bg-blue-900 cursor-pointer"
                            >
                              EDIT
                            </button>
                          )}

                          {deletable && (
                            <button
                              type="button"
                              onClick={() => setDeletingUser(u)}
                              className="px-2.5 py-1.5 bg-red-50 text-[#bb1919] border border-red-200 rounded text-[11px] font-bold hover:bg-red-100 cursor-pointer"
                            >
                              DELETE
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit User Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-[520px] w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-serif font-bold text-[#141414]">
                {editingUser ? 'Edit User Account' : 'Create New User'}
              </h3>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded">
                  {formError}
                </div>
              )}

              {editingUser && (
                <div className="flex items-center gap-4 pb-2">
                  <UserAvatar
                    name={formName || formEmail}
                    src={formPhoto}
                    sizeClass="w-14 h-14 text-lg"
                  />
                  <div>
                    <button
                      type="button"
                      disabled={isUploadingAvatar}
                      onClick={() => avatarInputRef.current?.click()}
                      className="text-xs font-bold text-[#00508f] hover:underline cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingAvatar ? 'Uploading...' : 'Upload Profile Photo'}
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    {formPhoto && (
                      <button
                        type="button"
                        onClick={() => setFormPhoto('')}
                        className="block text-[11px] text-[#bb1919] hover:underline mt-1 cursor-pointer"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full border rounded px-3 py-2 text-sm text-neutral-900 focus:outline-none ${
                    isDuplicateEmail
                      ? 'border-[#bb1919] focus:border-[#bb1919]'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {isDuplicateEmail && (
                  <p className="text-[11px] text-[#bb1919] font-medium mt-1">
                    This email address is already registered to another user.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  {editingUser ? 'New Password (Leave blank to keep current)' : 'Password *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editingUser}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={
                      editingUser
                        ? 'Enter new password to reset'
                        : 'Min 7 chars, upper/lower/number/special'
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 pr-16 text-sm text-neutral-900 focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-neutral-500 hover:text-black cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Minimum 7 characters including uppercase, lowercase, number, and symbol.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Account Role *
                </label>
                <select
                  value={formRole}
                  disabled={Boolean(editingUser?.is_default_admin)}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-neutral-900 bg-white focus:outline-none focus:border-black disabled:bg-gray-100"
                >
                  <option value="reader">Reader</option>
                  <option value="writer">Writer</option>
                  {(currentUser.is_default_admin || editingUser?.role === 'admin') && (
                    <option value="admin">Admin</option>
                  )}
                </select>
                {editingUser?.is_default_admin && (
                  <p className="text-[11px] text-amber-800 mt-1">
                    Default Admin accounts cannot be downgraded.
                  </p>
                )}
              </div>

              {formRole === 'writer' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Roles / Editorial Beat (e.g. Senior Politics Correspondent)
                  </label>
                  <input
                    type="text"
                    value={formWriterRole}
                    onChange={(e) => setFormWriterRole(e.target.value)}
                    placeholder="Reporter, Senior Editor, Desk Correspondent..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
              )}

              {editingUser && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      value={formBio}
                      onChange={(e) => setFormBio(e.target.value)}
                      placeholder="Short editorial biography..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formLinkedin}
                      onChange={(e) => setFormLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-neutral-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingAvatar || isDuplicateEmail}
                  className="px-5 py-2 bg-black text-white rounded text-xs font-bold hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Spinner className="w-3.5 h-3.5" /> : null}
                  <span>{editingUser ? 'Save Changes' : 'Create User'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Details Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <UserAvatar
                  name={viewingUser.name || viewingUser.email}
                  src={viewingUser.profile_picture}
                  sizeClass="w-14 h-14 text-lg"
                />
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#141414]">
                    {viewingUser.name || 'Unnamed User'}
                  </h3>
                  <p className="text-xs text-neutral-500">{viewingUser.email}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-neutral-800">
                      {viewingUser.role}
                    </span>
                    {viewingUser.is_default_admin && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        ★ Default Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            {viewingUser.writer_role && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Editorial Beat
                </div>
                <p className="text-sm text-neutral-800 font-medium mt-0.5">
                  {viewingUser.writer_role}
                </p>
              </div>
            )}

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Bio
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed mt-0.5">
                {viewingUser.bio || 'No biography provided.'}
              </p>
            </div>

            {viewingUser.linkedin_url && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  LinkedIn
                </div>
                <a
                  href={
                    viewingUser.linkedin_url.startsWith('http')
                      ? viewingUser.linkedin_url
                      : `https://${viewingUser.linkedin_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#00508f] hover:underline break-all"
                >
                  {viewingUser.linkedin_url}
                </a>
              </div>
            )}

            <div className="text-[11px] text-neutral-500 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>Account ID #{viewingUser.id}</span>
              <span>Joined {formatDate(viewingUser.created_at)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation */}
      {deletingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-[440px] w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-lg font-serif font-bold text-[#141414] mb-2">
              Delete User Account?
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed mb-5">
              You are about to remove{' '}
              <strong className="text-black">
                {deletingUser.name || deletingUser.email}
              </strong>{' '}
              ({deletingUser.role}). Any articles authored by this user will be safely reassigned to the primary Default Admin.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-neutral-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-[#bb1919] text-white rounded text-xs font-bold hover:bg-[#9d1414] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? <Spinner className="w-3.5 h-3.5" /> : null}
                <span>Delete User</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
