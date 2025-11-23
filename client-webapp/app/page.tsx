'use client';
import { useState } from 'react';
import InvitationCodeForm from '@/components/invitation/InvitationCodeForm';
import InvitationFeed from '@/components/invitation/InvitationFeed';
import { UserVerifiedData } from './types';

export default function Page() {
  const [verifiedData, setVerifiedData] = useState<UserVerifiedData | null>(null);
  if (!verifiedData) {
    return <InvitationCodeForm onVerified={(data) => setVerifiedData(data)} />;
  }
  return <InvitationFeed data={verifiedData.graduate_info} guestName={verifiedData.guest_name} />;
}
