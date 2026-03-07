import express from 'express';
import cors from 'cors';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
import { prepare } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors());
app.use(express.json());

// Submit RSVP
app.post('/api/rsvp', (req, res) => {
  try {
    const { name, phone, attending, transport, note } = req.body;

    if (!name || !attending) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    const stmt = prepare(`
      INSERT INTO rsvp (name, phone, attending, transport, note)
      VALUES (?, ?, ?, ?, ?)
    `);

    const info = stmt.run(name, phone || '', attending, transport || '', note || '');

    res.json({ 
      success: true, 
      message: 'Xác nhận thành công!',
      id: info.lastInsertRowid 
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Bạn đã xác nhận rồi!' });
    }
    res.status(500).json({ error: 'Có lỗi xảy ra' });
  }
});

// Lấy danh sách RSVP
app.get('/api/rsvp', (req, res) => {
  try {
    const { attending, transport } = req.query;
    
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
    const rsvps = stmt.all(...params);

    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ error: 'Có lỗi xảy ra' });
  }
});

// Generate QR Code
app.get('/api/generate-qr', async (req, res) => {
  try {
    const url = FRONTEND_URL;
    const qrCode = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#8B5A8D',
        light: '#FFF'
      }
    });

    res.json({ qrCode, url });
  } catch (error) {
    res.status(500).json({ error: 'Không thể tạo QR code' });
  }
});

// Export CSV
app.get('/api/export-csv', (req, res) => {
  try {
    const rsvps = prepare('SELECT * FROM rsvp ORDER BY created_at DESC').all();
    
    let csv = 'Tên,Số điện thoại,Tham dự,Phương tiện,Ghi chú,Thời gian\n';
    
    rsvps.forEach(r => {
      csv += `"${r.name}","${r.phone || ''}","${r.attending}","${r.transport || ''}","${r.note || ''}","${r.created_at}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=rsvp-list.csv');
    res.send('\uFEFF' + csv);
  } catch (error) {
    res.status(500).json({ error: 'Không thể export CSV' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
