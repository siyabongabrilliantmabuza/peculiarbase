'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, AtSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from './auth-context';

interface DebateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number;
}

export function DebateDialog({ open, onOpenChange, postId }: DebateDialogProps) {
  const { token } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [mentionUsername, setMentionUsername] = useState('');

  useEffect(() => {
    if (open) {
      fetchDebate();
      const interval = setInterval(fetchDebate, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [open, postId]);

  const fetchDebate = async () => {
    try {
      const response = await fetch(`/api/debates?postId=${postId}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching debate:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !token) return;

    try {
      await fetch('/api/debates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          message: newMessage,
          mentionedUsername: mentionUsername || null,
        }),
      });

      setNewMessage('');
      setMentionUsername('');
      fetchDebate();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-xl text-white border-white/20 max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Debate Arena</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={msg.avatar_url} />
                  <AvatarFallback>{msg.display_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{msg.display_name}</span>
                    <span className="text-sm text-white/60">@{msg.username}</span>
                    <span className="text-xs text-white/40">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 text-white/90">
                    {msg.mentioned_username && (
                      <span className="text-blue-400 mr-1">@{msg.mentioned_username}</span>
                    )}
                    {msg.message}
                  </p>
                </div>
              </motion.div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-12 text-white/50">
                <p>No messages yet. Start the debate!</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Mention someone (optional)"
                value={mentionUsername}
                onChange={(e) => setMentionUsername(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 pl-10"
              />
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type your argument..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
