'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function AdminPage() {
  const [rsvps, setRsvps] = useState([])
  const [filter, setFilter] = useState({ attending: '', transport: '' })
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, yes: 0, no: 0, self: 0, arranged: 0 })

  useEffect(() => {
    fetchRSVPs()
  }, [filter])

  const fetchRSVPs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter.attending) params.append('attending', filter.attending)
      if (filter.transport) params.append('transport', filter.transport)

      const res = await fetch(`${API_URL}/api/rsvp?${params}`)
      const data = await res.json()
      setRsvps(data)

      const total = data.length
      const yes = data.filter(r => r.attending === 'yes').length
      const no = data.filter(r => r.attending === 'no').length
      const self = data.filter(r => r.transport === 'self').length
      const arranged = data.filter(r => r.transport === 'arranged').length

      setStats({ total, yes, no, self, arranged })
    } catch (error) {
      console.error('Error fetching RSVPs:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    window.open(`${API_URL}/api/export-csv`, '_blank')
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-duo-gray">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-duo-card p-6 md:p-8 border-2 border-duo-gray-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-duo-dark">
              Admin Dashboard
            </h1>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportCSV}
              className="bg-duo-green hover:bg-duo-green-hover text-white px-6 py-3 rounded-2xl font-bold shadow-duo border-b-4 border-duo-green-dark transition-all"
            >
              📥 Export CSV
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Tổng số', value: stats.total, bg: 'bg-gray-100', text: 'text-duo-dark' },
              { label: 'Có tham dự', value: stats.yes, bg: 'bg-duo-green-light', text: 'text-duo-green-dark' },
              { label: 'Không tham dự', value: stats.no, bg: 'bg-duo-red-light', text: 'text-duo-red' },
              { label: 'Tự đi', value: stats.self, bg: 'bg-blue-100', text: 'text-blue-700' },
              { label: 'Xe BTC', value: stats.arranged, bg: 'bg-amber-100', text: 'text-amber-700' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`${stat.bg} ${stat.text} rounded-2xl p-4 text-center border-2 border-transparent font-bold`}
              >
                <div className="text-3xl">{stat.value}</div>
                <div className="text-sm mt-1 opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
              value={filter.attending}
              onChange={(e) => setFilter({ ...filter, attending: e.target.value })}
              className="px-4 py-3 rounded-xl border-2 border-duo-gray-border focus:border-duo-green focus:outline-none font-bold"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="yes">Có tham dự</option>
              <option value="no">Không tham dự</option>
            </select>

            <select
              value={filter.transport}
              onChange={(e) => setFilter({ ...filter, transport: e.target.value })}
              className="px-4 py-3 rounded-xl border-2 border-duo-gray-border focus:border-duo-green focus:outline-none font-bold"
            >
              <option value="">Tất cả phương tiện</option>
              <option value="self">Tự đi</option>
              <option value="arranged">Xe BTC</option>
            </select>

            <button
              onClick={() => setFilter({ attending: '', transport: '' })}
              className="px-6 py-3 rounded-xl border-2 border-duo-gray-border hover:border-duo-green hover:bg-duo-green-light font-bold transition-all"
            >
              Reset
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-duo-green border-t-transparent"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border-2 border-duo-gray-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-duo-gray border-b-2 border-duo-gray-border">
                    <th className="text-left py-3 px-4 font-bold text-duo-dark">Tên</th>
                    <th className="text-left py-3 px-4 font-bold text-duo-dark">SĐT</th>
                    <th className="text-left py-3 px-4 font-bold text-duo-dark">Tham dự</th>
                    <th className="text-left py-3 px-4 font-bold text-duo-dark">Phương tiện</th>
                    <th className="text-left py-3 px-4 font-bold text-duo-dark">Ghi chú</th>
                    <th className="text-left py-3 px-4 font-bold text-duo-dark">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((rsvp, idx) => (
                    <motion.tr
                      key={rsvp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-duo-gray-border hover:bg-duo-green-light/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-duo-dark">{rsvp.name}</td>
                      <td className="py-3 px-4">{rsvp.phone || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1.5 rounded-xl text-sm font-bold ${
                          rsvp.attending === 'yes'
                            ? 'bg-duo-green-light text-duo-green-dark'
                            : 'bg-duo-red-light text-duo-red'
                        }`}>
                          {rsvp.attending === 'yes' ? '✓ Có' : '✗ Không'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {rsvp.transport === 'self' && '🚗 Tự đi'}
                        {rsvp.transport === 'arranged' && '🚌 Xe BTC'}
                        {!rsvp.transport && '-'}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">{rsvp.note || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(rsvp.created_at).toLocaleString('vi-VN')}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {rsvps.length === 0 && (
                <div className="text-center py-12 text-gray-500 font-bold">
                  Chưa có dữ liệu
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
