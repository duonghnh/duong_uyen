'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function GenerateQRPage() {
  const [qrCode, setQrCode] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQRCode()
  }, [])

  const fetchQRCode = async () => {
    try {
      const res = await fetch(`${API_URL}/api/generate-qr`)
      const data = await res.json()
      setQrCode(data.qrCode)
      setUrl(data.url)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCode
    link.download = 'wedding-rsvp-qr.png'
    link.click()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-duo-gray">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-duo-card p-8 md:p-12 max-w-md w-full text-center border-2 border-duo-gray-border"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-duo-dark mb-6">
          QR Code
        </h1>

        {loading ? (
          <div className="py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-duo-green border-t-transparent"></div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="bg-duo-gray p-6 rounded-2xl mb-6 inline-block border-2 border-duo-gray-border"
            >
              <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            </motion.div>

            <p className="text-duo-dark font-bold mb-2">Quét mã để mở form RSVP</p>
            <p className="text-sm text-gray-500 mb-6 break-all">{url}</p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadQR}
              className="bg-duo-green hover:bg-duo-green-hover text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-duo border-b-4 border-duo-green-dark transition-all"
            >
              📥 Tải xuống QR Code
            </motion.button>

            <p className="text-sm text-gray-500 mt-6">
              Sử dụng QR code này trên thiệp cưới của bạn
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}
