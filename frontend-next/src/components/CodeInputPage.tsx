'use client'

import { useState } from 'react'

interface CodeInputPageProps {
  onSubmit: (code: string) => void
  loading: boolean
  error: string
}

export default function CodeInputPage({ onSubmit, loading, error }: CodeInputPageProps) {
  const [code, setCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim().length === 6) {
      onSubmit(code)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B132B] to-[#1F2A44] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="font-display text-5xl md:text-6xl text-[#D4AF37] mb-6 tracking-normal drop-shadow-lg font-bold">
              Lễ Tốt Nghiệp
            </h1>
            <p className="text-base md:text-lg text-[#9CA3AF] uppercase tracking-wider font-semibold">
              Nhập mã thiệp mời
            </p>
          </div>

          {/* Code Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-6 py-5 text-center text-5xl font-bold tracking-widest border-2 border-[#D4AF37] rounded-2xl focus:border-[#FFD97A] focus:ring-2 focus:ring-[#FFD97A] focus:ring-opacity-30 transition text-[#0B132B] placeholder-[#D4AF37] placeholder-opacity-50"
              />
              <p className="text-xs text-[#9CA3AF] text-center mt-3 uppercase tracking-widest">
                {code.length} / 6 ký tự
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={code.length !== 6 || loading}
              className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD97A] text-[#0B132B] font-semibold rounded-2xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                'Xem Thiệp Mời'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-[#D4AF37] opacity-30"></div>
            <span className="text-xs text-[#9CA3AF] uppercase">Thông tin</span>
            <div className="flex-1 h-px bg-[#D4AF37] opacity-30"></div>
          </div>

          {/* Info Text */}
          <p className="text-center text-[#9CA3AF] text-sm font-light">
            Mã thiệp mời đã được gửi qua tin nhắn với bạn
          </p>
        </div>
      </div>
    </div>
  )
}
