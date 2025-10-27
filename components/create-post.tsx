'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from './auth-context';
import { Send, Image, Video, Music } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreatePostProps {
  onPostCreated: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { token } = useAuth();
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || !token) return;

    setIsPosting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          mediaUrl: mediaUrl || null,
          mediaType: mediaType || null,
        }),
      });

      if (response.ok) {
        setContent('');
        setMediaUrl('');
        setMediaType(null);
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[100px] resize-none"
      />

      {mediaType && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4"
        >
          <Input
            placeholder={`Enter ${mediaType} URL`}
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
          />
        </motion.div>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMediaType(mediaType === 'image' ? null : 'image')}
              className={`text-white hover:bg-white/10 ${mediaType === 'image' ? 'bg-white/20' : ''}`}
            >
              <Image className="w-5 h-5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMediaType(mediaType === 'video' ? null : 'video')}
              className={`text-white hover:bg-white/10 ${mediaType === 'video' ? 'bg-white/20' : ''}`}
            >
              <Video className="w-5 h-5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMediaType(mediaType === 'audio' ? null : 'audio')}
              className={`text-white hover:bg-white/10 ${mediaType === 'audio' ? 'bg-white/20' : ''}`}
            >
              <Music className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handlePost}
            disabled={!content.trim() || isPosting}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="w-4 h-4 mr-2" />
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </motion.div>
      </div>
    </Card>
  );
}
