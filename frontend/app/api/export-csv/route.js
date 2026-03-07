import { NextResponse } from 'next/server';
import { prepare } from '@/lib/db';

export async function GET() {
  try {
    const rsvps = prepare('SELECT * FROM rsvp ORDER BY created_at DESC').all();

    let csv = 'Tên,Số điện thoại,Tham dự,Phương tiện,Ghi chú,Thời gian\n';

    rsvps.forEach((r) => {
      csv += `"${r.name}","${r.phone || ''}","${r.attending}","${r.transport || ''}","${r.note || ''}","${r.created_at}"\n`;
    });

    return new NextResponse('\uFEFF' + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=rsvp-list.csv',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể export CSV' },
      { status: 500 }
    );
  }
}
