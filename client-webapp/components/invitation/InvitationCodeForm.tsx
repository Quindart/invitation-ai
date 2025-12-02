/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, PlayCircle } from 'lucide-react';
import { UserVerifiedData } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onVerified: (data: UserVerifiedData) => void;
}

// Rèm
const CurtainBottomSVG = ({ color = '#1a1a1a' }: { color?: string }) => (
  <svg
    viewBox="0 0 100 20"
    className="absolute -bottom-[39px] left-0 z-20 h-[40px] w-full lg:-bottom-[79px] lg:h-[80px]"
    preserveAspectRatio="none"
  >
    <path
      d="M0,0 Q5,20 10,0 T20,0 T30,0 T40,0 T50,0 T60,0 T70,0 T80,0 T90,0 T100,0 V20 H0 Z"
      fill="#D4AF37"
      transform="translate(0, 5)"
      opacity="0.6"
    />
    <path
      d="M0,0 Q5,20 10,0 T20,0 T30,0 T40,0 T50,0 T60,0 T70,0 T80,0 T90,0 T100,0 V-5 H0 Z"
      fill={color}
    />
  </svg>
);

export default function InvitationCodeForm({ onVerified }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isCurtainOpened, setIsCurtainOpened] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsCurtainOpened(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    const normalizedCode = code.trim().toUpperCase();

    if (normalizedCode.length !== 6 || !/^\d+$/.test(normalizedCode)) {
      setError('Vui lòng nhập đủ 6 chữ số.');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitation_code: normalizedCode }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Mã mời không chính xác.');
      }
      onVerified(await response.json());
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };
  const velvetStyle = {
    backgroundColor: '#1a1a1a',
    backgroundImage: `
      repeating-linear-gradient(
        90deg,
        #0a0a0a 0%,
        #2a2a2a 10%,
        #0a0a0a 20%
      )
    `,
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)',
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-black font-sans">
      {/* =========================================================
          PHẦN 1: RÈM NHUNG 3D
         ========================================================= */}
      <div className="pointer-events-none absolute inset-0 z-50 flex overflow-hidden">
        {/* Cánh Trái */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: isCurtainOpened ? '-100%' : '0%' }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-1/2"
          style={{
            ...velvetStyle,
            borderRight: '1px solid #000',
            boxShadow: '10px 0 50px rgba(0,0,0,0.8)',
          }}
        >
          <CurtainBottomSVG color="#0a0a0a" />
        </motion.div>

        {/* Cánh Phải */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: isCurtainOpened ? '100%' : '0%' }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-1/2"
          style={{
            ...velvetStyle,
            borderLeft: '1px solid #000',
            boxShadow: '-10px 0 50px rgba(0,0,0,0.8)',
          }}
        >
          <CurtainBottomSVG color="#0a0a0a" />
        </motion.div>

        {/* Logo Loading (Đổi sang tiếng Việt & Màu Vàng Gold) */}
        <motion.div
          animate={{ opacity: isCurtainOpened ? 0 : 1, scale: isCurtainOpened ? 1.5 : 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute h-64 w-64 rounded-full bg-amber-500/10 blur-[80px]" />

          <div className="relative z-10 text-center">
            <div className="mb-4 inline-block rounded-full border-2 border-amber-500/30 p-4 backdrop-blur-sm">
              <PlayCircle className="h-8 w-8 text-amber-500/70" />
            </div>
            <p className="font-serif text-[10px] tracking-[0.3em] text-amber-500/60 uppercase">
              Đang chuẩn bị sân khấu...
            </p>
          </div>
        </motion.div>
      </div>

      {/* =========================================================
          PHẦN 2: SÂN KHẤU (BACKGROUND & TITLE)
         ========================================================= */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/90" />

        <motion.img
          initial={{ scale: 1.4, filter: 'blur(10px)' }}
          animate={{
            scale: isCurtainOpened ? 1 : 1.4,
            filter: isCurtainOpened ? 'blur(0px)' : 'blur(10px)',
          }}
          transition={{ duration: 2.5, ease: 'easeOut', delay: 0.5 }}
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2940&auto=format&fit=crop"
          alt="Background"
          className="h-full w-full object-cover"
        />

        {/* Title Tiếng Việt */}
        <div className="absolute top-[15%] right-0 left-0 z-20 px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={isCurtainOpened ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }}
          >
            <div className="mb-4 inline-flex items-center gap-3 opacity-80">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-200 lg:w-16"></div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-amber-100 uppercase drop-shadow-md lg:text-xs">
                Sự Kiện Đặc Biệt
              </p>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-200 lg:w-16"></div>
            </div>

            {/* Gradient chữ: Trắng -> Bạc -> Xám (Metallic) */}
            <h1 className="bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text font-serif text-[10vw] leading-none font-black tracking-tighter text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] lg:text-8xl">
              LỄ TỐT NGHIỆP
            </h1>
            <p className="mt-3 font-serif text-sm tracking-widest text-white/70 italic lg:text-lg">
              Chào mừng Tân Cử Nhân
            </p>
          </motion.div>
        </div>
      </div>

      {/* =========================================================
          PHẦN 3: FORM NHẬP MÃ (Tinh chỉnh UI: Giảm Rounded, Màu Sang)
         ========================================================= */}
      <motion.div
        initial={{ y: '120%' }}
        animate={isCurtainOpened ? { y: '0%' } : { y: '120%' }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 90,
          delay: 1.8,
        }}
        className="absolute right-0 bottom-0 left-0 z-30 flex justify-center px-4 pb-6 lg:pb-10"
      >
        {/* Container: Giảm rounded từ 3xl xuống xl */}
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          {/* Line trên cùng: Đổi gradient sang Vàng Gold/Amber */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 opacity-80" />
          <div className="p-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 font-serif text-xl font-bold text-white">Xác Thực Khách Mời</h2>
              <p className="text-xs text-gray-400">Vui lòng nhập mã định danh để tiếp tục</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group relative">
                {/* Input: Giảm rounded, đổi màu focus sang Gold/White */}
                <Input
                  value={code}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(val);
                  }}
                  maxLength={6}
                  placeholder="000 000"
                  className="h-16 w-full rounded-lg border border-white/10 bg-white/5 text-center font-mono text-3xl tracking-[0.3em] text-white transition-all placeholder:text-white/10 focus:border-white/50 focus:bg-white/10 focus:ring-0"
                  inputMode="numeric"
                />
                {/* Glow Effect: Đổi sang màu Amber Gold nhẹ nhàng */}
                {isFocused && (
                  <motion.div
                    layoutId="glow"
                    className="pointer-events-none absolute inset-0 rounded-lg border border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                  />
                )}
              </div>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert
                      variant="destructive"
                      className="rounded-lg border-red-500/20 bg-red-900/30 text-red-200 backdrop-blur-sm"
                    >
                      <AlertDescription className="text-center text-xs">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button
                type="submit"
                disabled={loading || code.length !== 6}
                className="h-14 w-full rounded-lg bg-white text-sm font-bold tracking-[0.1em] text-black uppercase shadow-lg shadow-white/5 transition-all hover:-translate-y-0.5 hover:bg-gray-200 hover:shadow-white/10"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Mở Thiệp Ngay'}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
