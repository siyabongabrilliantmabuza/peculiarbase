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
    const { followingId } = body;

    // Check if already following
    const existing = await pool.query(
      'SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2',
      [userId, followingId]
    );

    if (existing.rows.length > 0) {
      // Unfollow
      await pool.query(
        'DELETE FROM followers WHERE follower_id = $1 AND following_id = $2',
        [userId, followingId]
      );
      return NextResponse.json({ action: 'unfollowed' });
    } else {
      // Follow
      await pool.query(
        'INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)',
        [userId, followingId]
      );
      return NextResponse.json({ action: 'followed' });
    }
  } catch (error) {
    console.error('Error handling follow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const followers = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.avatar_url 
       FROM followers f 
       JOIN users u ON f.follower_id = u.id 
       WHERE f.following_id = $1`,
      [userId]
    );

    const following = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.avatar_url 
       FROM followers f 
       JOIN users u ON f.following_id = u.id 
       WHERE f.follower_id = $1`,
      [userId]
    );

    return NextResponse.json({
      followers: followers.rows,
      following: following.rows,
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
