import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';

const getDbClient = async () => {
  const client = createClient();
  await client.connect();
  return client;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get('memberId');
  
  console.log("Progress & Wins API GET request received for memberId:", memberId);
  
  if (!memberId) return NextResponse.json({ error: 'Member ID required' }, { status: 400 });

  try {
    const client = await getDbClient();
    
    console.log("Connected to database. Querying for memberId:", memberId);
    
    const { rows } = await client.query(
      'SELECT * FROM progress_wins WHERE memberstack_id = $1 ORDER BY created_at DESC LIMIT 1',
      [memberId]
    );
    
    console.log(`Found ${rows.length} progress & wins records for memberId:`, memberId);
    
    const response = NextResponse.json(rows);
    response.headers.set('Cache-Control', 'no-store');
    await client.end();
    return response;
  } catch (err) {
    const error = err as Error;
    console.error("Database error in GET request:", error);
    return NextResponse.json({ error: 'Failed to load progress & wins data', details: error?.toString() }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlMemberId = searchParams.get('memberId');
    
    console.log("Progress & Wins API POST request received with URL memberId:", urlMemberId);
    
    const body = await request.json();
    console.log("POST request body:", body);
    
    const { 
      memberstack_id, 
      team_id, 
      title, 
      victories_title,
      wins,
      icon_id
    } = body;
    
    // Use URL memberId as fallback if body doesn't contain it
    const finalMemberId = memberstack_id || urlMemberId;
    
    console.log("Using memberId:", finalMemberId);
    
    if (!finalMemberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }
    
    const client = await getDbClient();
    
    // Check if record exists for this member
    const { rows: existingRows } = await client.query(
      'SELECT id FROM progress_wins WHERE memberstack_id = $1',
      [finalMemberId]
    );
    
    console.log(`Found ${existingRows.length} existing records for memberId:`, finalMemberId);
    
    let result;
    
    if (existingRows.length > 0) {
      // Update existing record
      console.log("Updating existing record");
      const query = `
        UPDATE progress_wins 
        SET 
          team_id = $1,
          title = $2,
          victories_title = $3,
          wins = $4,
          icon_id = $5,
          updated_at = NOW()
        WHERE memberstack_id = $6
        RETURNING *
      `;
      
      result = await client.query(query, [
        team_id,
        title,
        victories_title,
        wins,
        icon_id,
        finalMemberId
      ]);
    } else {
      // Insert new record
      console.log("Creating new record");
      const query = `
        INSERT INTO progress_wins (
          memberstack_id,
          team_id,
          title,
          victories_title,
          wins,
          icon_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      
      result = await client.query(query, [
        finalMemberId,
        team_id,
        title,
        victories_title,
        wins,
        icon_id
      ]);
    }
    
    console.log("Database operation result:", result.rows[0]);
    
    const response = NextResponse.json(result.rows[0]);
    response.headers.set('Cache-Control', 'no-store');
    await client.end();
    return response;
  } catch (err) {
    console.error('Error details:', err);
    return NextResponse.json({ error: 'Failed to save progress & wins data', details: err?.toString() }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id,
      memberstack_id, 
      team_id, 
      title, 
      victories_title,
      wins,
      icon_id
    } = body;
    
    if (!id || !memberstack_id) {
      return NextResponse.json({ error: 'ID and Member ID required' }, { status: 400 });
    }
    
    const client = await getDbClient();
    
    const query = `
      UPDATE progress_wins 
      SET 
        team_id = $1,
        title = $2,
        victories_title = $3,
        wins = $4,
        icon_id = $5,
        updated_at = NOW()
      WHERE id = $6 AND memberstack_id = $7
      RETURNING *
    `;
    
    const { rows } = await client.query(query, [
      team_id,
      title,
      victories_title,
      wins,
      icon_id,
      id,
      memberstack_id
    ]);
    
    await client.end();
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    const response = NextResponse.json(rows[0]);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: 'Failed to update progress & wins data', details: error?.toString() }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const memberstack_id = searchParams.get('memberId');
  
  if (!id || !memberstack_id) {
    return NextResponse.json({ error: 'ID and Member ID required' }, { status: 400 });
  }

  try {
    const client = await getDbClient();
    
    // Delete from database
    const { rowCount } = await client.query(
      'DELETE FROM progress_wins WHERE id = $1 AND memberstack_id = $2',
      [id, memberstack_id]
    );
    
    await client.end();
    
    if (rowCount === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    const response = NextResponse.json({ success: true });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: 'Failed to delete item', details: error?.toString() }, { status: 500 });
  }
}
