'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from './auth-context';

export function AvatarUpload() {
  const { token, updateUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!avatarUrl.trim() || !token) return;

    setIsLoading(true);
    try {
      await updateUser({ avatar_url: avatarUrl });
      setAvatarUrl('');
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-white flex items-center gap-2">
        <Camera className="w-4 h-4" />
        Profile Picture URL
      </Label>
      <div className="flex gap-2">
        <Input
          placeholder="Enter image URL"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleUpload}
            disabled={!avatarUrl.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </motion.div>
      </div>
      <p className="text-xs text-white/50">
        Paste a direct link to your profile picture
      </p>
    </div>
  );
}
