'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-context';
import { RiveBackground } from '@/components/rive-background';
import { PostCard } from '@/components/post-card';
import { CreatePost } from '@/components/create-post';
import { CreateQuote } from '@/components/create-quote';
import { QuoteCard } from '@/components/quote-card';
import { DebateDialog } from '@/components/debate-dialog';
import { UserSearch } from '@/components/user-search';
import { AvatarUpload } from '@/components/avatar-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Settings, Sparkles, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
  const { user, token, login, register, logout, updateUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [feedPosts, setFeedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [userQuotes, setUserQuotes] = useState([]);
  const [allQuotes, setAllQuotes] = useState([]);
  const [editBio, setEditBio] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('cosmic');
  const [debatePostId, setDebatePostId] = useState<number | null>(null);
  const [showDebate, setShowDebate] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (user) {
      setSelectedTheme(user.theme || 'cosmic');
      setEditBio(user.bio || '');
      setEditDisplayName(user.display_name || '');
      fetchFeedPosts();
      fetchUserPosts();
      fetchUserQuotes();
      fetchAllQuotes();
    }
  }, [user]);

  const fetchFeedPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setFeedPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  const fetchUserPosts = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/posts?userId=${user.id}`);
      const data = await response.json();
      setUserPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const fetchUserQuotes = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/quotes?userId=${user.id}`);
      const data = await response.json();
      setUserQuotes(data.quotes || []);
    } catch (error) {
      console.error('Error fetching user quotes:', error);
    }
  };

  const fetchAllQuotes = async () => {
    try {
      const response = await fetch('/api/quotes');
      const data = await response.json();
      setAllQuotes(data.quotes || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, username, displayName);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleVote = async (postId: number) => {
    if (!token) return;
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, reactionType: 'vote' }),
      });
      fetchFeedPosts();
      fetchUserPosts();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleDebate = (postId: number) => {
    setDebatePostId(postId);
    setShowDebate(true);
  };

  const handleReshare = async (postId: number) => {
    if (!token) return;
    try {
      await fetch('/api/reshares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      });
      fetchFeedPosts();
      fetchUserPosts();
    } catch (error) {
      console.error('Error resharing:', error);
    }
  };

  const handleQuoteReaction = async (quoteId: number, type: string) => {
    if (!token) return;
    try {
      await fetch('/api/quote-reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quoteId, reactionType: type }),
      });
      fetchUserQuotes();
      fetchAllQuotes();
    } catch (error) {
      console.error('Error reacting to quote:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUser({
        display_name: editDisplayName,
        bio: editBio,
        theme: selectedTheme,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
    return (
      <>
        <RiveBackground theme="cosmic" />
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <Sparkles className="w-10 h-10" />
                    Peculiar
                  </h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-lg font-medium"
                >
                  Where Every Voice Shapes Tomorrow
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/60 text-sm mt-2"
                >
                  Join the conversation. Share your perspective. Make an impact.
                </motion.p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/20 text-white mt-1 focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="username" className="text-white font-medium">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white/5 border-white/20 text-white mt-1 focus:ring-2 focus:ring-purple-500/50"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="displayName" className="text-white font-medium">Display Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="bg-white/5 border-white/20 text-white mt-1 focus:ring-2 focus:ring-purple-500/50"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="password" className="text-white font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/20 text-white mt-1 focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold text-lg py-6"
                >
                  {isLogin ? 'Login' : 'Register'}
                </Button>

                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full text-white/70 hover:text-white text-sm transition-colors"
                >
                  {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                </button>
              </form>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <RiveBackground theme={selectedTheme} />
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-3xl font-bold text-white flex items-center gap-2"
              >
                <Sparkles className="w-7 h-7" />
                Peculiar
              </motion.h1>
              <div className="flex items-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900/95 backdrop-blur-xl text-white border-white/20 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <AvatarUpload />
                      <div>
                        <Label>Display Name</Label>
                        <Input
                          value={editDisplayName}
                          onChange={(e) => setEditDisplayName(e.target.value)}
                          className="bg-white/5 border-white/20 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label>Bio</Label>
                        <Textarea
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          className="bg-white/5 border-white/20 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label>Theme</Label>
                        <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cosmic">Cosmic</SelectItem>
                            <SelectItem value="ocean">Ocean</SelectItem>
                            <SelectItem value="sunset">Sunset</SelectItem>
                            <SelectItem value="forest">Forest</SelectItem>
                            <SelectItem value="aurora">Aurora</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" onClick={logout} className="text-white hover:bg-white/10">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <UserSearch />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={50}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
              className="pb-12"
            >
              <SwiperSlide>
                <div className="space-y-6 pb-8">
                  <h2 className="text-3xl font-bold text-white text-center mb-6">Feed</h2>
                  {feedPosts.map((post: any) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onVote={handleVote}
                      onDebate={handleDebate}
                      onReshare={handleReshare}
                    />
                  ))}
                  {feedPosts.length === 0 && (
                    <Card className="p-12 text-center bg-white/10 backdrop-blur-lg border-white/20">
                      <p className="text-white/70 text-lg">No posts yet. Be the first to share!</p>
                    </Card>
                  )}
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="space-y-6 pb-8">
                  <h2 className="text-3xl font-bold text-white text-center mb-6">Quotes</h2>
                  {allQuotes.map((quote: any) => (
                    <QuoteCard
                      key={quote.id}
                      quote={quote}
                      onReaction={handleQuoteReaction}
                    />
                  ))}
                  {allQuotes.length === 0 && (
                    <Card className="p-12 text-center bg-white/10 backdrop-blur-lg border-white/20">
                      <Quote className="w-12 h-12 mx-auto mb-4 text-white/50" />
                      <p className="text-white/70 text-lg">No quotes yet. Share some wisdom!</p>
                    </Card>
                  )}
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="space-y-6 pb-8">
                  <h2 className="text-3xl font-bold text-white text-center mb-6">Profile</h2>
                  <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20">
                    <div className="flex items-start gap-6">
                      <Avatar className="w-24 h-24 ring-4 ring-white/20">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-500 to-pink-500">
                          {user.display_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white">{user.display_name}</h2>
                        <p className="text-white/60 text-lg">@{user.username}</p>
                        {user.bio && <p className="mt-3 text-white/80 leading-relaxed">{user.bio}</p>}
                      </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
                      <CreatePost onPostCreated={() => {
                        fetchFeedPosts();
                        fetchUserPosts();
                      }} />
                    </Card>
                    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
                      <CreateQuote onQuoteCreated={() => {
                        fetchUserQuotes();
                        fetchAllQuotes();
                      }} />
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-white">Your Posts</h3>
                    {userPosts.map((post: any) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onVote={handleVote}
                        onDebate={handleDebate}
                        onReshare={handleReshare}
                      />
                    ))}
                    {userPosts.length === 0 && (
                      <Card className="p-12 text-center bg-white/10 backdrop-blur-lg border-white/20">
                        <p className="text-white/70">You haven't posted anything yet</p>
                      </Card>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-white">Your Quotes</h3>
                    {userQuotes.map((quote: any) => (
                      <QuoteCard
                        key={quote.id}
                        quote={quote}
                        onReaction={handleQuoteReaction}
                      />
                    ))}
                    {userQuotes.length === 0 && (
                      <Card className="p-12 text-center bg-white/10 backdrop-blur-lg border-white/20">
                        <p className="text-white/70">You haven't shared any quotes yet</p>
                      </Card>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </main>
      </div>

      {debatePostId && (
        <DebateDialog
          open={showDebate}
          onOpenChange={setShowDebate}
          postId={debatePostId}
        />
      )}
    </>
  );
}
