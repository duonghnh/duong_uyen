'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attending: '',
    transport: '',
    note: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setSubmitted(true)
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E8A0BF', '#F4A6C8', '#FFFFFF', '#FCE7EC']
      })
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center p-4 bg-duo-gray"
      >
        <div className="bg-white rounded-3xl shadow-duo-card p-8 md:p-12 max-w-md w-full text-center border-2 border-duo-gray-border">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-duo-green-light flex items-center justify-center"
          >
            <span className="text-5xl">🎉</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-duo-dark mb-3">
            Hoàn thành!
          </h1>
          <p className="text-lg text-gray-600">
            {formData.attending === 'yes'
              ? 'Cảm ơn bạn đã xác nhận. Hẹn gặp bạn tại tiệc cưới!'
              : 'Cảm ơn bạn đã phản hồi.'}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4 py-12 bg-duo-gray"
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-duo-card p-6 md:p-10 max-w-lg w-full border-2 border-duo-gray-border"
      >
        <div className="text-center mb-8 -mx-2 md:-mx-6 -mt-2 md:-mt-4 pt-6 pb-6 px-4 rounded-2xl bg-duo-green-light border-2 border-duo-green/30">
          <h1 className="text-3xl md:text-5xl font-extrabold text-duo-green mb-2 drop-shadow-sm">
            Wedding RSVP
          </h1>
          <p className="text-duo-dark font-bold text-base md:text-lg mb-1">
            Xác nhận tham dự tiệc cưới
          </p>
          <p className="text-2xl md:text-3xl font-extrabold text-duo-green-dark">
            Dương & Uyên
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <label className="block text-duo-dark font-bold mb-2">
              Tên của bạn <span className="text-duo-red">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-duo-gray-border focus:border-duo-green focus:outline-none transition-colors font-medium"
              placeholder="Nguyễn Văn A"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <label className="block text-duo-dark font-bold mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-duo-gray-border focus:border-duo-green focus:outline-none transition-colors font-medium"
              placeholder="0912345678"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <label className="block text-duo-dark font-bold mb-3">
              Bạn có tham dự không? <span className="text-duo-red">*</span>
            </label>
            <div className="space-y-3">
              {[
                { value: 'yes', label: 'Có, tôi sẽ đến', emoji: '✨' },
                { value: 'no', label: 'Rất tiếc, tôi không thể đến', emoji: '💐' }
              ].map((option) => (
                <motion.label
                  key={option.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-center p-4 rounded-2xl cursor-pointer border-2 transition-all font-bold ${
                    formData.attending === option.value
                      ? 'border-duo-green bg-duo-green-light'
                      : 'border-duo-gray-border bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value={option.value}
                    checked={formData.attending === option.value}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value, transport: '' })}
                    className="mr-3 w-5 h-5 accent-duo-green"
                    required
                  />
                  <span className="mr-2 text-xl">{option.emoji}</span>
                  <span className="text-duo-dark">{option.label}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {formData.attending === 'yes' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <label className="block text-duo-dark font-bold mb-3">
                  Phương tiện di chuyển
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'self', label: 'Tôi tự đi', emoji: '🚗' },
                    { value: 'arranged', label: 'Tôi đi xe do BTC sắp xếp', emoji: '🚌' }
                  ].map((option) => (
                    <motion.label
                      key={option.value}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`flex items-center p-4 rounded-2xl cursor-pointer border-2 transition-all font-bold ${
                        formData.transport === option.value
                          ? 'border-duo-green bg-duo-green-light'
                          : 'border-duo-gray-border bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="transport"
                        value={option.value}
                        checked={formData.transport === option.value}
                        onChange={(e) => setFormData({ ...formData, transport: e.target.value })}
                        className="mr-3 w-5 h-5 accent-duo-green"
                      />
                      <span className="mr-2 text-xl">{option.emoji}</span>
                      <span className="text-duo-dark">{option.label}</span>
                    </motion.label>
                  ))}
                </div>

                <AnimatePresence>
                  {formData.transport === 'self' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 overflow-hidden"
                    >
                      <p className="text-duo-dark font-bold mb-2">📍 Địa chỉ nhà hàng / QR chỉ đường</p>
                      <div className="rounded-2xl border-2 border-duo-gray-border overflow-hidden bg-duo-gray">
                        <img
                          src="/dia-chi-nha-hang.png"
                          alt="Địa chỉ nhà hàng - QR chỉ đường"
                          className="w-full h-auto block"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-4">
                  <label className="block text-duo-dark font-bold mb-2">
                    Ghi chú thêm
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-duo-gray-border focus:border-duo-green focus:outline-none transition-colors resize-none font-medium"
                    rows="3"
                    placeholder="Ví dụ: Tôi sẽ đi cùng 2 người..."
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-duo-red-light border-2 border-duo-red text-duo-red px-4 py-3 rounded-xl font-bold"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-duo-green hover:bg-duo-green-hover text-white py-4 rounded-2xl font-bold text-lg shadow-duo transition-all disabled:opacity-60 disabled:cursor-not-allowed border-b-4 border-duo-green-dark"
          >
            {loading ? 'Đang gửi...' : 'Xác nhận'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
