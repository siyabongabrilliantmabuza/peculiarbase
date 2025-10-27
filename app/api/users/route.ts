import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ users: [] });
    }

    const result = await pool.query(
      `SELECT id, username, display_name, avatar_url, bio 
       FROM users 
       WHERE username ILIKE $1 OR display_name ILIKE $1 
       LIMIT 20`,
      [`%${query}%`]
    );

    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
