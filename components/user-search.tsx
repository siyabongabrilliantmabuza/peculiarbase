'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserPlus, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './auth-context';

export function UserSearch() {
  const { token, user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [following, setFollowing] = useState<Set<number>>(new Set());
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFollowing();
    }
  }, [user]);

  useEffect(() => {
    if (query.length > 0) {
      const timer = setTimeout(() => {
        searchUsers();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const fetchFollowing = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/followers?userId=${user.id}`);
      const data = await response.json();
      const followingIds = new Set(data.following.map((u: any) => u.id));
      setFollowing(followingIds);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const searchUsers = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.users.filter((u: any) => u.id !== user?.id));
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollow = async (userId: number) => {
    if (!token) return;
    try {
      const response = await fetch('/api/followers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ followingId: userId }),
      });
      
      const data = await response.json();
      if (data.action === 'followed') {
        setFollowing(prev => new Set([...prev, userId]));
      } else {
        setFollowing(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        <Input
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full z-50"
          >
            <Card className="p-2 bg-slate-900/95 backdrop-blur-xl border-white/20 max-h-96 overflow-y-auto">
              {results.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
                      {user.display_name?.[0] || user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{user.display_name}</p>
                    <p className="text-sm text-white/60">@{user.username}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleFollow(user.id)}
                    className={
                      following.has(user.id)
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    }
                  >
                    {following.has(user.id) ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                </motion.div>
              ))}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
