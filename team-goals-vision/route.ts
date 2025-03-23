import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';

const getDbClient = async () => {
  const client = createClient();
  await client.connect();
  return client;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get('memberId');
  const componentType = searchParams.get('componentType');
  
  if (!memberId) return NextResponse.json({ error: 'Member ID required' }, { status: 400 });

  try {
    const client = await getDbClient();
    let query = 'SELECT * FROM team_goals_vision WHERE memberstack_id = $1';
    const queryParams = [memberId];
    
    if (componentType) {
      query += ' AND component_type = $2';
      queryParams.push(componentType);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const { rows } = await client.query(query, queryParams);

    const response = NextResponse.json(rows);
    response.headers.set('Cache-Control', 'no-store');
    await client.end();
    return response;
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: 'Failed to load team goals and vision data', details: error?.toString() }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      memberstack_id, 
      team_id, 
      component_type, 
      title, 
      subtitle, 
      content, 
      icon_id,
      image_url
    } = body;
    
    if (!memberstack_id) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }
    
    let finalImageUrl = image_url;
    // Handle base64 image if it's provided
    if (image_url && image_url.startsWith('data:image')) {
      const base64Data = image_url.split(',')[1];
      const blob = Buffer.from(base64Data, 'base64');
      const { url } = await put(`team-vision/${memberstack_id}/${Date.now()}.jpg`, blob, { 
        access: 'public',
        addRandomSuffix: true
      });
      finalImageUrl = url;
    }
    
    const client = await getDbClient();
    
    // Check if record exists for this member and component type
    const { rows: existingRows } = await client.query(
      'SELECT id FROM team_goals_vision WHERE memberstack_id = $1 AND component_type = $2',
      [memberstack_id, component_type]
    );
    
    let result;
    
    if (existingRows.length > 0) {
      // Update existing record
      const updateFields = [];
      const values = [memberstack_id, component_type];
      let paramCount = 3;
      
      const fieldsToUpdate: Record<string, any> = {
        team_id,
        title,
        subtitle,
        content,
        icon_id
      };
      
      if (finalImageUrl) {
        fieldsToUpdate.image_url = finalImageUrl;
      }
      
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        if (value !== undefined) {
          updateFields.push(`${key} = $${paramCount++}`);
          values.push(value);
        }
      }
      
      if (updateFields.length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
      }
      
      const updateQuery = `
        UPDATE team_goals_vision 
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE memberstack_id = $1 AND component_type = $2
        RETURNING *
      `;
      
      result = await client.query(updateQuery, values);
    } else {
      // Insert new record
      const insertFields = ['memberstack_id', 'component_type'];
      const placeholders = ['$1', '$2'];
      const values = [memberstack_id, component_type];
      let paramCount = 3;
      
      const fieldsToInsert: Record<string, any> = {
        team_id,
        title,
        subtitle,
        content,
        icon_id
      };
      
      if (finalImageUrl) {
        fieldsToInsert.image_url = finalImageUrl;
      }
      
      for (const [key, value] of Object.entries(fieldsToInsert)) {
        if (value !== undefined) {
          insertFields.push(key);
          placeholders.push(`$${paramCount++}`);
          values.push(value);
        }
      }
      
      const insertQuery = `
        INSERT INTO team_goals_vision (${insertFields.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *
      `;
      
      result = await client.query(insertQuery, values);
    }
    
    const response = NextResponse.json(result.rows[0]);
    response.headers.set('Cache-Control', 'no-store');
    await client.end();
    return response;
  } catch (err) {
    console.error('Error details:', err);
    return NextResponse.json({ error: 'Failed to save team goals and vision data', details: err?.toString() }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id,
      memberstack_id, 
      team_id, 
      component_type, 
      title, 
      subtitle, 
      content, 
      icon_id,
      image_url
    } = body;
    
    if (!id || !memberstack_id) {
      return NextResponse.json({ error: 'ID and Member ID required' }, { status: 400 });
    }
    
    let finalImageUrl = image_url;
    // Handle base64 image if it's provided
    if (image_url && image_url.startsWith('data:image')) {
      const base64Data = image_url.split(',')[1];
      const blob = Buffer.from(base64Data, 'base64');
      const { url } = await put(`team-vision/${memberstack_id}/${Date.now()}.jpg`, blob, { 
        access: 'public',
        addRandomSuffix: true
      });
      finalImageUrl = url;
    }
    
    const client = await getDbClient();
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    const fieldsToUpdate: Record<string, any> = {
      team_id,
      component_type,
      title,
      subtitle,
      content,
      icon_id
    };
    
    if (finalImageUrl) {
      fieldsToUpdate.image_url = finalImageUrl;
    }
    
    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramCount++}`);
        values.push(value);
      }
    }
    
    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    values.push(id, memberstack_id);
    
    const query = `
      UPDATE team_goals_vision 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount++} AND memberstack_id = $${paramCount}
      RETURNING *
    `;
    
    const { rows } = await client.query(query, values);
    await client.end();
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    const response = NextResponse.json(rows[0]);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: 'Failed to update team goals and vision data', details: error?.toString() }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const memberstack_id = searchParams.get('memberId');
  const imageUrl = searchParams.get('imageUrl');
  
  if (!memberstack_id) {
    return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
  }
  
  try {
    const client = await getDbClient();
    
    if (id) {
      // Delete by ID
      // First get the image URL before deleting if it exists
      const { rows: itemRows } = await client.query(
        'SELECT image_url FROM team_goals_vision WHERE id = $1 AND memberstack_id = $2',
        [id, memberstack_id]
      );
      
      if (itemRows.length === 0) {
        await client.end();
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
      
      // Delete from database
      await client.query(
        'DELETE FROM team_goals_vision WHERE id = $1 AND memberstack_id = $2',
        [id, memberstack_id]
      );
      
      // If image is in Vercel Blob storage (URL contains specific pattern)
      const storedImageUrl = itemRows[0].image_url;
      if (storedImageUrl && storedImageUrl.includes('vercel.blob.core.windows.net')) {
        try {
          // Delete from blob storage
          await del(storedImageUrl);
        } catch (blobError) {
          console.error('Failed to delete from blob storage:', blobError);
          // Continue even if blob deletion fails
        }
      }
    } else if (imageUrl) {
      // Delete image only by URL
      if (imageUrl.includes('vercel.blob.core.windows.net')) {
        try {
          // Delete from blob storage
          await del(imageUrl);
        } catch (blobError) {
          console.error('Failed to delete from blob storage:', blobError);
          return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
        }
      }
      
      // Update database record to remove image_url
      await client.query(
        'UPDATE team_goals_vision SET image_url = NULL WHERE image_url = $1 AND memberstack_id = $2',
        [imageUrl, memberstack_id]
      );
    } else {
      await client.end();
      return NextResponse.json({ error: 'ID or imageUrl required' }, { status: 400 });
    }
    
    await client.end();
    
    const response = NextResponse.json({ success: true });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: 'Failed to delete item', details: error?.toString() }, { status: 500 });
  }
}
