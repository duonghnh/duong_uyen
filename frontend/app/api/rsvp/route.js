import { NextResponse } from 'next/server';
import { prepare } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, attending, transport, note } = body;

    if (!name || !attending) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    const stmt = prepare(`
      INSERT INTO rsvp (name, phone, attending, transport, note)
      VALUES (?, ?, ?, ?, ?)
    `);

    const info = stmt.run(name, phone || '', attending, transport || '', note || '');

    return NextResponse.json({
      success: true,
      message: 'Xác nhận thành công!',
      id: info.lastInsertRowid,
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json({ error: 'Bạn đã xác nhận rồi!' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const attending = searchParams.get('attending');
    const transport = searchParams.get('transport');

    let query = 'SELECT * FROM rsvp WHERE 1=1';
    const params = [];

    if (attending) {
      query += ' AND attending = ?';
      params.push(attending);
    }
    if (transport) {
      query += ' AND transport = ?';
      params.push(transport);
    }
    query += ' ORDER BY created_at DESC';

    const stmt = prepare(query);
    const rsvps = params.length ? stmt.all(...params) : stmt.all();

    return NextResponse.json(rsvps);
  } catch (error) {
    return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
  }
}
