'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Lightbulb, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from './auth-context';

interface Quote {
  id: number;
  user_id: number;
  quote_text: string;
  author?: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  love_count: number;
  inspire_count: number;
  agree_count: number;
  created_at: string;
}

interface QuoteCardProps {
  quote: Quote;
  onReaction: (quoteId: number, type: string) => void;
}

export function QuoteCard({ quote, onReaction }: QuoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-white/20 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-pink-500" />
        
        <div className="relative">
          <svg className="absolute -top-4 -left-2 w-12 h-12 text-white/10" fill="currentColor" viewBox="0 0 32 32">
            <path d="M10 8c-3.3 0-6 2.7-6 6v10h8V14h-4c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h8V14h-4c0-2.2 1.8-4 4-4V8z"/>
          </svg>
          
          <blockquote className="text-xl font-medium leading-relaxed mb-4 pl-8">
            {quote.quote_text}
          </blockquote>
          
          {quote.author && (
            <p className="text-white/70 italic pl-8">— {quote.author}</p>
          )}
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <div className="text-sm text-white/60">
              Shared by <span className="font-semibold text-white/80">@{quote.username}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-red-400 hover:bg-red-400/10"
                onClick={() => onReaction(quote.id, 'love')}
              >
                <Heart className="w-4 h-4 mr-1" />
                {quote.love_count}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-yellow-400 hover:bg-yellow-400/10"
                onClick={() => onReaction(quote.id, 'inspire')}
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                {quote.inspire_count}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-green-400 hover:bg-green-400/10"
                onClick={() => onReaction(quote.id, 'agree')}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                {quote.agree_count}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
