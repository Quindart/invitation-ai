'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import CodeInputPage from '@/components/CodeInputPage'
import InvitationPage from '@/components/InvitationPage'

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
}

interface InvitationData {
  graduate_id: string
  guest_name: string
  graduate_info: GraduateInfo
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'code' | 'invitation'>('code')
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Get API URL - function to ensure it runs on client side
  const getApiUrl = () => {
    if (typeof window === 'undefined') {
      return 'http://localhost:8000/api'
    }
    
    if (window.location.hostname.includes('azurecontainerapps.io')) {
      return 'https://invitation-backend.jollysea-6ff72832.southeastasia.azurecontainerapps.io/api'
    }
    
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  }

  const handleCodeSubmit = async (code: string) => {
    setLoading(true)
    setError('')
    try {
      const API_URL = getApiUrl()
      console.log('=== CODE VERIFICATION DEBUG ===')
      console.log('Window hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server')
      console.log('Detected API URL:', API_URL)
      console.log('Full request URL:', `${API_URL}/invitations/verify`)
      console.log('Code:', code)
      console.log('===============================')
      
      const response = await axios.post(`${API_URL}/invitations/verify`, {
        invitation_code: code,
      })
      setInvitationData(response.data)
      setCurrentPage('invitation')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Mã không hợp lệ. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setCurrentPage('code')
    setInvitationData(null)
    setError('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {currentPage === 'code' ? (
        <CodeInputPage onSubmit={handleCodeSubmit} loading={loading} error={error} />
      ) : (
        invitationData && (
          <InvitationPage data={invitationData} onBack={handleBack} />
        )
      )}
    </main>
  )
}
