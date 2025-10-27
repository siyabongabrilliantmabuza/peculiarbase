'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUp, MessageSquare, Repeat2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PostCardProps {
  post: any;
  onVote: (postId: number) => void;
  onDebate: (postId: number) => void;
  onReshare: (postId: number) => void;
}

export function PostCard({ post, onVote, onDebate, onReshare }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12 ring-2 ring-white/20">
            <AvatarImage src={post.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
              {post.display_name?.[0] || post.username?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-white">{post.display_name || post.username}</span>
              <span className="text-white/50 text-sm">@{post.username}</span>
              <span className="text-white/40 text-sm">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-white/90 mb-4 leading-relaxed">{post.content}</p>

            {post.media_url && (
              <div className="mb-4 rounded-lg overflow-hidden">
                {post.media_type === 'image' && (
                  <img
                    src={post.media_url}
                    alt="Post media"
                    className="w-full max-h-96 object-cover"
                  />
                )}
                {post.media_type === 'video' && (
                  <video
                    src={post.media_url}
                    controls
                    className="w-full max-h-96"
                  />
                )}
                {post.media_type === 'audio' && (
                  <audio
                    src={post.media_url}
                    controls
                    className="w-full"
                  />
                )}
              </div>
            )}

            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVote(post.id)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <ArrowUp className="w-4 h-4 mr-1" />
                  {post.vote_count || 0}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDebate(post.id)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Debate
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReshare(post.id)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Repeat2 className="w-4 h-4 mr-1" />
                  {post.reshare_count || 0}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
