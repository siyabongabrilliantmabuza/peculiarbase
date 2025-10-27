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
    const { postId } = body;

    // Check if already reshared
    const existing = await pool.query(
      'SELECT * FROM reshares WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    if (existing.rows.length > 0) {
      // Remove reshare
      await pool.query(
        'DELETE FROM reshares WHERE post_id = $1 AND user_id = $2',
        [postId, userId]
      );
      return NextResponse.json({ action: 'removed' });
    } else {
      // Add reshare
      await pool.query(
        'INSERT INTO reshares (post_id, user_id) VALUES ($1, $2)',
        [postId, userId]
      );
      return NextResponse.json({ action: 'added' });
    }
  } catch (error) {
    console.error('Error handling reshare:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
