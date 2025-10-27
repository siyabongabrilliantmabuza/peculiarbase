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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    // Get or create debate for this post
    let debate = await pool.query(
      'SELECT * FROM debates WHERE post_id = $1',
      [postId]
    );

    if (debate.rows.length === 0) {
      debate = await pool.query(
        'INSERT INTO debates (post_id) VALUES ($1) RETURNING *',
        [postId]
      );
    }

    const debateId = debate.rows[0].id;

    // Get all messages for this debate
    const messages = await pool.query(
      `SELECT dm.*, u.username, u.display_name, u.avatar_url,
              mu.username as mentioned_username
       FROM debate_messages dm
       JOIN users u ON dm.user_id = u.id
       LEFT JOIN users mu ON dm.mentioned_user_id = mu.id
       WHERE dm.debate_id = $1
       ORDER BY dm.created_at ASC`,
      [debateId]
    );

    return NextResponse.json({ 
      debate: debate.rows[0],
      messages: messages.rows 
    });
  } catch (error) {
    console.error('Error fetching debate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postId, message, mentionedUsername } = body;

    // Get or create debate
    let debate = await pool.query(
      'SELECT * FROM debates WHERE post_id = $1',
      [postId]
    );

    if (debate.rows.length === 0) {
      debate = await pool.query(
        'INSERT INTO debates (post_id) VALUES ($1) RETURNING *',
        [postId]
      );
    }

    const debateId = debate.rows[0].id;

    // Get mentioned user ID if username provided
    let mentionedUserId = null;
    if (mentionedUsername) {
      const mentionedUser = await pool.query(
        'SELECT id FROM users WHERE username = $1',
        [mentionedUsername]
      );
      if (mentionedUser.rows.length > 0) {
        mentionedUserId = mentionedUser.rows[0].id;
      }
    }

    // Insert message
    const result = await pool.query(
      'INSERT INTO debate_messages (debate_id, user_id, message, mentioned_user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [debateId, userId, message, mentionedUserId]
    );

    return NextResponse.json({ message: result.rows[0] });
  } catch (error) {
    console.error('Error posting debate message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
