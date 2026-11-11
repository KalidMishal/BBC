'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Spinner } from './Skeletons';
import { API_BASE_URL, resolveMediaUrl } from '../lib/api';
import { AuthUser } from '../types';
import {
  authHeaders,
  getDisplayName,
  getStoredUser,
  updateStoredUser,
} from '../lib/auth';

interface ProfileUpdatePayload {
  fullName: string;
  bio: string;
  linkedin: string;
  photo: string;
}

interface ReaderProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate: (newProfile: ProfileUpdatePayload) => void;
}

export default function ReaderProfileSettingsModal({
  isOpen,
  onClose,
  onProfileUpdate,
}: ReaderProfileSettingsModalProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [profileData, setProfileData] = useState<ProfileUpdatePayload>({
    fullName: '',
    bio: '',
    linkedin: '',
    photo: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg('');
    const storedUser = getStoredUser();
    if (!storedUser) return;
    setUser(storedUser);

    const cachedKey = `userProfile_${storedUser.email}`;
    const storedProfile = sessionStorage.getItem(cachedKey);
    if (storedProfile) {
      try {
        const sp = JSON.parse(storedProfile);
        setProfileData({
          fullName: sp.fullName || getDisplayName(storedUser),
          bio: sp.bio !== undefined ? sp.bio : storedUser.bio || '',
          linkedin:
            sp.linkedin !== undefined ? sp.linkedin : storedUser.linkedin_url || '',
          photo: sp.photo || storedUser.profile_picture || '',
        });
        return;
      } catch {
        // Fallback to storedUser fields
      }
    }

    setProfileData({
      fullName: getDisplayName(storedUser),
      photo: storedUser.profile_picture || '',
      bio: storedUser.bio || '',
      linkedin: storedUser.linkedin_url || '',
    });
  }, [isOpen]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 240;
        const MAX_HEIGHT = 240;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              setIsUploading(false);
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
                setProfileData((prev) => ({ ...prev, photo: data.url }));
              } else {
                setErrorMsg(data.message || 'Photo upload failed');
              }
            } catch {
              setErrorMsg('Network error during photo upload');
            } finally {
              setIsUploading(false);
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

  const handleSave = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          name: profileData.fullName,
          bio: profileData.bio,
          profile_picture: profileData.photo,
          linkedin_url: profileData.linkedin || '',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Failed to update profile');
        setIsSaving(false);
        return;
      }

      const nextUser = updateStoredUser({
        name: profileData.fullName,
        fullName: profileData.fullName,
        bio: profileData.bio,
        profile_picture: profileData.photo,
        linkedin_url: profileData.linkedin || '',
      });
      if (nextUser) setUser(nextUser);

      sessionStorage.setItem(
        `userProfile_${user.email}`,
        JSON.stringify(profileData)
      );
      window.dispatchEvent(new Event('userProfileUpdated'));
      onProfileUpdate(profileData);
      onClose();
    } catch {
      setErrorMsg('Network error while saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  const initial = (profileData.fullName || user.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-xl w-full max-w-[500px] overflow-hidden shadow-2xl relative border border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
          aria-label="Close settings"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-8 pb-6">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-1">
            Profile Settings
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
            Manage Your Account
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-900 text-white shadow-sm border border-gray-200 flex items-center justify-center font-bold text-xl flex-shrink-0">
              {profileData.photo ? (
                <img
                  src={resolveMediaUrl(profileData.photo)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-sm font-bold text-[#1a65d6] hover:underline mb-1 cursor-pointer disabled:opacity-60"
              >
                {isUploading ? 'Uploading photo...' : 'Change photo'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              <p className="text-xs text-gray-500 mb-2">{user.email}</p>
              <span className="inline-block bg-[#eef5ff] text-[#1a65d6] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {user.role === 'admin'
                  ? 'Admin'
                  : user.role === 'writer'
                  ? 'Writer'
                  : 'Reader'}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullName: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1a65d6]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                rows={3}
                placeholder="Write a brief bio..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1a65d6] resize-none"
              />
            </div>

            {user.role !== 'reader' && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={profileData.linkedin || ''}
                  onChange={(e) =>
                    setProfileData({ ...profileData, linkedin: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1a65d6]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between gap-4 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 py-2.5 border border-gray-300 rounded font-bold text-[13px] text-gray-700 hover:bg-gray-100 transition-colors text-center disabled:opacity-50 cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex-1 py-2.5 bg-[#00508f] hover:bg-blue-900 rounded font-bold text-[13px] text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? <Spinner /> : null}
            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}
