import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request) {
  try {
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const url = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    const qrCode = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#8B5A8D',
        light: '#FFF',
      },
    });

    return NextResponse.json({ qrCode, url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể tạo QR code' },
      { status: 500 }
    );
  }
}
