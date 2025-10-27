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
        q.*,
        u.username,
        u.display_name,
        u.avatar_url,
        (SELECT COUNT(*) FROM quote_reactions WHERE quote_id = q.id AND reaction_type = 'love') as love_count,
        (SELECT COUNT(*) FROM quote_reactions WHERE quote_id = q.id AND reaction_type = 'inspire') as inspire_count,
        (SELECT COUNT(*) FROM quote_reactions WHERE quote_id = q.id AND reaction_type = 'agree') as agree_count
      FROM quotes q
      JOIN users u ON q.user_id = u.id
    `;

    const params: any[] = [];
    if (userId) {
      query += ' WHERE q.user_id = $1';
      params.push(userId);
    }

    query += ' ORDER BY q.created_at DESC';

    const result = await pool.query(query, params);
    return NextResponse.json({ quotes: result.rows });
  } catch (error) {
    console.error('Error fetching quotes:', error);
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
    const { quoteText, author } = body;

    const result = await pool.query(
      'INSERT INTO quotes (user_id, quote_text, author) VALUES ($1, $2, $3) RETURNING *',
      [userId, quoteText, author || null]
    );

    return NextResponse.json({ quote: result.rows[0] });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
