'use client'

import { useState } from 'react'
import Image from 'next/image'
import ChatBot from './ChatBot'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface GraduateInfo {
  id: string
  name: string
  degree: string
  department: string
  graduation_datetime: string
  venue: {
    name: string
    address: string
    parking: string
  }
  contact: {
    email: string
    phone: string
  }
  photo_urls: string[]
  invitation_template?: string
}

interface InvitationPageProps {
  data: {
    graduate_id: string
    guest_name: string
    graduate_info: GraduateInfo
  }
  onBack: () => void
}

export default function InvitationPage({ data, onBack }: InvitationPageProps) {
  const [showChat, setShowChat] = useState(false)
  const graduate = data.graduate_info

  // Parse datetime
  const eventDate = new Date(graduate.graduation_datetime)
  const eventEndDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000) // Thêm 2 tiếng
  const formattedDate = eventDate.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = eventDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const formattedEndTime = eventEndDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-[#F6F2EB] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center text-[#0B132B] hover:text-[#D4AF37] transition gap-2 font-poppins font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>

        {/* ChatBot Floating Button - Fixed Bottom Right */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-[#D4AF37] hover:bg-[#FFD97A] text-[#0B132B] shadow-soft hover:shadow-lg transition transform hover:scale-110 flex items-center justify-center text-2xl animate-border-pulse font-bold"
          title="Hỏi Đáp"
        >
          💬
        </button>

        {/* Main Invitation Card */}
        <div className="bg-white rounded-3xl overflow-visible shadow-soft">
          {/* Hero Section - Compact */}
          <div className="gradient-hero text-white px-6 md:px-12 py-12 md:py-16 relative overflow-visible">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37] opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Main Title */}
              <div className="text-center mb-6">
                <h1 className="font-display text-4xl md:text-6xl font-bold tracking-widest">
                  Happy Graduation
                </h1>
              </div>

              {/* Invitation Template - Sub Hero */}
              {graduate.invitation_template && (
                <div className="text-center mb-8">
                  <p className="font-serif text-base md:text-xl italic text-[#F6F2EB] opacity-95 max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
                    "{graduate.invitation_template}"
                  </p>
                </div>
              )}

              {/* Guest Name Section */}
              <div className="text-center space-y-3">
                <p className="text-xs md:text-sm uppercase tracking-widest opacity-80">Thân mời</p>
                <p className="text-gold font-display text-2xl md:text-4xl font-bold">
                  {data.guest_name}
                </p>
              </div>

              {/* Separator */}
              <div className="my-6 flex justify-center">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
              </div>

              {/* Event Line */}
              <p className="text-center text-sm md:text-base opacity-90 leading-relaxed">
                đến dự lễ tốt nghiệp của
              </p>
              <p className="text-center text-lg md:text-xl font-semibold mt-2 pb-20 md:pb-24">
                {graduate.name}
              </p>
            </div>
          </div>

          {/* Avatar Section - Overlap */}
          {graduate.photo_urls && graduate.photo_urls.length > 0 && (
            <div className="-mt-24 md:-mt-32 mb-2 flex justify-center relative z-20">
              <div className="relative">
                <div className="w-48 h-48 md:w-64 md:h-64 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37] opacity-80 shadow-soft"></div>
                  <Image
                    src={graduate.photo_urls[0]}
                    alt={graduate.name}
                    fill
                    className="object-cover rounded-full"
                    priority
                  />
                </div>
                {/* Caption below avatar */}
                <p className="text-center text-xs md:text-sm text-[#0B132B] font-semibold mt-3 opacity-70">
                  {graduate.degree} {graduate.department}
                </p>
              </div>
            </div>
          )}

          {/* Event Information Cards - Compact */}
          <div className="px-6 md:px-12 py-6 md:py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date & Time Card */}
              <div className="bg-[#F6F2EB] rounded-2xl p-5 md:p-6 shadow-soft text-center hover:shadow-lg transition">
                <div className="text-[#D4AF37] mb-3 flex justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-2 font-semibold">Thời gian</p>
                <p className="text-[#0B132B] font-semibold text-xs md:text-sm leading-snug">{formattedDate}</p>
                <p className="text-[#D4AF37] font-display text-base md:text-lg mt-1">{formattedTime} - {formattedEndTime}</p>
              </div>

              {/* Location Card */}
              <div className="bg-[#F6F2EB] rounded-2xl p-5 md:p-6 shadow-soft text-center hover:shadow-lg transition">
                <div className="text-[#D4AF37] mb-3 flex justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-2 font-semibold">Địa điểm</p>
                <p className="text-[#0B132B] font-semibold text-xs md:text-sm">{graduate.venue.name}</p>
                <p className="text-[#0B132B] text-xs opacity-75 mt-1 leading-snug">{graduate.venue.address}</p>
              </div>

              {/* Parking Card */}
              <div className="bg-[#F6F2EB] rounded-2xl p-5 md:p-6 shadow-soft text-center hover:shadow-lg transition">
                <div className="text-[#D4AF37] mb-3 flex justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 11a2 2 0 114 0 2 2 0 01-4 0z" />
                  </svg>
                </div>
                <p className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-2 font-semibold">Nơi gửi xe</p>
                <p className="text-[#0B132B] font-semibold text-xs md:text-sm leading-snug whitespace-pre-line">{graduate.venue.parking}</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="px-6 md:px-12 py-6 md:py-8 bg-gradient-to-br from-[#1F2A44] to-[#0B132B] text-white">
            <p className="text-center text-sm uppercase tracking-widest text-[#FFD97A] font-semibold mb-4">Liên hệ</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-4">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest opacity-70 mb-2 font-semibold">Email</p>
                <a
                  href={`mailto:${graduate.contact.email}`}
                  className="text-[#FFD97A] hover:text-[#D4AF37] font-semibold transition text-xs md:text-sm"
                >
                  {graduate.contact.email}
                </a>
              </div>
              <div className="hidden md:block w-px h-8 bg-[#D4AF37] opacity-30"></div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest opacity-70 mb-2 font-semibold">Điện thoại</p>
                <a
                  href={`tel:${graduate.contact.phone}`}
                  className="text-[#FFD97A] hover:text-[#D4AF37] font-semibold transition text-xs md:text-sm"
                >
                  {graduate.contact.phone}
                </a>
              </div>
            </div>
            
            {/* Chatbot Suggestion */}
            <div className="text-center border-t border-[#D4AF37] border-opacity-30 pt-4">
              <p className="text-xs md:text-sm text-[#FFD97A] font-light">
                Nếu còn thắc mắc gì, hãy hỏi <span className="font-semibold">chatbot</span> 💬 ở góc phải dưới
              </p>
            </div>
          </div>

          {/* Thank You Footer */}
          <div className="px-6 md:px-12 py-8 text-center bg-[#F6F2EB]">
            <p className="text-[#0B132B] text-sm md:text-base leading-relaxed font-light">
              Cảm ơn đã dành thời gian tham dự.<br />
              <span className="font-semibold">Sự hiện diện của {data.guest_name} sẽ làm cho buổi lễ này trở nên ý nghĩa hơn.</span>
            </p>
          </div>
        </div>

        {/* Chatbot Modal Popup - Small Chat Window */}
        {showChat && (
          <>
            {/* Overlay - Click to close */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowChat(false)}
            />
            
            {/* Chat Window */}
            <div className="fixed bottom-24 right-8 z-50 w-96 bg-white rounded-2xl shadow-soft flex flex-col overflow-hidden" style={{ height: '600px' }}>
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0B132B] to-[#1F2A44] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
                <h3 className="font-semibold text-lg">💬 Hỏi Đáp</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="hover:bg-[#2A3A54] w-8 h-8 rounded-full flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>

              {/* ChatBot Component */}
              <div className="flex-1 overflow-hidden">
                <ChatBot graduateId={data.graduate_id} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
