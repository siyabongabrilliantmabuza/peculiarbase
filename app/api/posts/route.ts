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
    const userId = searchParams.get('userId');

    let query = `
      SELECT 
        p.*,
        u.username,
        u.display_name,
        u.avatar_url,
        (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND reaction_type = 'vote') as vote_count,
        (SELECT COUNT(*) FROM debate_messages dm JOIN debates d ON dm.debate_id = d.id WHERE d.post_id = p.id) as debate_count,
        (SELECT COUNT(*) FROM reshares WHERE post_id = p.id) as reshare_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
    `;

    const params: any[] = [];
    if (userId) {
      query += ' WHERE p.user_id = $1';
      params.push(userId);
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    return NextResponse.json({ posts: result.rows });
  } catch (error) {
    console.error('Error fetching posts:', error);
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
    const { content, mediaUrl, mediaType } = body;

    const result = await pool.query(
      'INSERT INTO posts (user_id, content, media_url, media_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, content, mediaUrl || null, mediaType || null]
    );

    return NextResponse.json({ post: result.rows[0] });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
