'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from './auth-context';

interface CreateQuoteProps {
  onQuoteCreated: () => void;
}

export function CreateQuote({ onQuoteCreated }: CreateQuoteProps) {
  const { token } = useAuth();
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!quoteText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          quoteText,
          author: author || null,
        }),
      });

      if (response.ok) {
        setQuoteText('');
        setAuthor('');
        onQuoteCreated();
      }
    } catch (error) {
      console.error('Error creating quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-white/20">
        <div className="flex items-center gap-2 mb-4">
          <Quote className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Share a Quote</h3>
        </div>
        
        <Textarea
          placeholder="Enter an inspiring quote..."
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[100px] text-base resize-none focus:ring-2 focus:ring-purple-500/50"
        />
        
        <Input
          placeholder="Author (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-3 bg-white/5 border-white/20 text-white placeholder:text-white/50"
        />

        <div className="flex justify-end mt-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSubmit}
              disabled={!quoteText.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold px-8"
            >
              {isLoading ? 'Sharing...' : 'Share Quote'}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
