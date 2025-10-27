import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postId, reactionType } = body;

    // Only allow vote reaction type
    if (reactionType !== 'vote') {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    // Check if reaction already exists
    const existing = await pool.query(
      'SELECT * FROM reactions WHERE post_id = $1 AND user_id = $2 AND reaction_type = $3',
      [postId, userId, reactionType]
    );

    if (existing.rows.length > 0) {
      // Remove reaction
      await pool.query(
        'DELETE FROM reactions WHERE post_id = $1 AND user_id = $2 AND reaction_type = $3',
        [postId, userId, reactionType]
      );
      return NextResponse.json({ action: 'removed' });
    } else {
      // Add reaction
      await pool.query(
        'INSERT INTO reactions (post_id, user_id, reaction_type) VALUES ($1, $2, $3)',
        [postId, userId, reactionType]
      );
      return NextResponse.json({ action: 'added' });
    }
  } catch (error) {
    console.error('Error handling reaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
