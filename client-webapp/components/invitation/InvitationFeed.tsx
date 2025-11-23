/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Share2,
  Calendar,
  Clock,
  Image as ImageIcon,
  MessageCircle,
  X,
  Heart,
  ExternalLink,
  Navigation,
  Phone,
  Mail,
  Car,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatPopup from './ChatPopup';
import Fireworks from '../effects/Fireworks';
import ReactionFloating, { ReactionItem } from '../effects/ReactionFloating';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface Props {
  data: any;
  guestName: string;
}

// 1. Ảnh mẫu dự phòng (Fallback) nếu user chưa upload đủ 4 ảnh
const stockImages = [
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800',
  'https://demoda.vn/wp-content/uploads/2022/01/hinh-anh-tot-nghiep-chup-bong.jpeg',
  'https://image.slidesdocs.com/responsive-images/background/academic-theme-back-to-school-image-with-degree-cap-and-3d-science-render-powerpoint-background_bfa4589875__960_540.jpg',
  'https://caodangduochoc.edu.vn/wp-content/uploads/5a480ee895bbbd848fd72f7095dbaa56.jpg',
];

const graduationImages = {
  hero: 'https://anhdephd.vn/wp-content/uploads/2022/05/hinh-anh-tot-nghiep.jpg',
  mapPreview:
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop&sat=-100',
};

const GoldenWave = () => (
  <div className="w-full rotate-180 transform overflow-hidden bg-[#111] leading-[0]">
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="relative block h-[60px] w-full lg:h-[80px]"
    >
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        className="fill-[#0a0a0a]"
      ></path>
    </svg>
  </div>
);

const CornerFlourish = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`h-24 w-24 opacity-30 ${className}`}>
    <path d="M10,10 Q60,10 60,60" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
    <path d="M10,20 Q50,20 50,60" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
    <circle cx="10" cy="10" r="2.5" fill="#D4AF37" />
    <circle cx="60" cy="60" r="1.5" fill="#D4AF37" />
  </svg>
);

// --- LIGHTBOX COMPONENT ---
const ImageLightbox = ({ src, onClose }: { src: string | null; onClose: () => void }) => {
  if (!src) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>
      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        src={src}
        className="max-h-[80vh] max-w-full rounded-lg border border-white/10 object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute right-0 bottom-10 left-0 flex justify-center gap-6 text-white">
        <Heart className="h-8 w-8 cursor-pointer transition-colors hover:fill-red-500" />
        <MessageCircle className="h-8 w-8 cursor-pointer transition-colors hover:text-amber-500" />
        <Share2 className="h-8 w-8 cursor-pointer transition-colors hover:text-amber-500" />
      </div>
    </motion.div>
  );
};

export default function InvitationFeed({ data, guestName }: Props) {
  // --- Audio Logic ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio('/song.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // --- Scroll & Animation ---
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.15]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.5]);

  // --- Interaction Logic ---
  const [reactions, setReactions] = useState<ReactionItem[]>([]);
  const [showFireworks, setShowFireworks] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowFireworks(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const triggerReaction = (emoji: string) => {
    const count = 3 + Math.floor(Math.random() * 3);
    const newReactions: ReactionItem[] = [];
    for (let i = 0; i < count; i++) {
      newReactions.push({
        id: Date.now() + i + Math.random(),
        emoji: emoji,
        left: 50 + (Math.random() * 40 - 20),
        speed: 2 + Math.random(),
      });
    }
    setReactions((prev) => [...prev, ...newReactions]);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const removeReaction = useCallback((id: number) => {
    setReactions((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const openGoogleMaps = () => {
    const query = encodeURIComponent(`${data.venue.name}, ${data.venue.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // --- Data Formatting ---
  const dateObj = new Date(data.graduation_datetime);
  const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = dateObj.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const weekdayStr = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });

  // 2. Logic gộp ảnh: Lấy ảnh từ API, nếu thiếu thì bù bằng ảnh mẫu để đủ 4 ảnh hiển thị Grid đẹp
  const galleryImages = [...(data.photo_urls || []), ...stockImages].slice(0, 4);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0a] font-sans text-white selection:bg-amber-500/30">
      <Fireworks active={showFireworks} />

      {/* Chatbot Popup: Truyền ID chuẩn */}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} graduateId={data._id} />

      <AnimatePresence>
        {selectedImage && (
          <ImageLightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.04]"></div>

      <div className="relative mx-auto min-h-screen max-w-xl bg-[#0a0a0a] pb-40 shadow-2xl">
        {/* HEADER */}
        <div className="pointer-events-none fixed top-0 right-0 left-0 z-50 flex items-start justify-between p-6">
          <div className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/20 shadow-lg backdrop-blur-md">
            <span className="font-serif text-sm font-bold text-amber-400 italic">G</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="pointer-events-auto rounded-full border border-white/10 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-white/10 hover:text-amber-400"
            onClick={toggleMusic}
          >
            {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        {/* ================= HERO SECTION ================= */}
        <div className="relative h-[100vh] w-full overflow-hidden">
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0a]" />
            <img
              src={data.photo_urls?.[0] || graduationImages.hero}
              alt="Hero"
              className="h-full w-full object-cover object-center"
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            <AnimatePresence>
              {reactions.map((r) => (
                <ReactionFloating key={r.id} {...r} onComplete={removeReaction} />
              ))}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 z-20 w-full p-8 pb-24">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="h-[1px] w-10 bg-amber-500"></div>
                <span className="text-xs font-bold tracking-[0.4em] text-amber-400 uppercase drop-shadow-md">
                  The Ceremony
                </span>
              </div>

              <h1 className="mb-2 font-serif text-6xl leading-[0.9] font-medium tracking-tight text-white drop-shadow-2xl">
                {data.name}
              </h1>

              {/* 3. Hiển thị Ngành học & Bằng cấp */}
              <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-300">
                <GraduationCap className="h-4 w-4 text-amber-400" />
                <span className="tracking-wide uppercase">
                  {data.degree} • {data.department}
                </span>
              </div>

              {/* 4. Lời mời từ API (invitation_template) */}
              <div className="mb-6 rounded-r-lg border-l-2 border-amber-500/60 bg-black/40 p-4 pl-4 backdrop-blur-sm">
                <p className="mb-3 text-xs leading-relaxed font-light whitespace-pre-line text-gray-200 italic opacity-90">
                  &quot;{data.invitation_template}&ldquo;
                </p>
                <p className="border-t border-white/10 pt-2 text-sm font-medium text-white">
                  Trân trọng kính mời{' '}
                  <span className="ml-1 text-base font-bold text-amber-400 uppercase">
                    {guestName}
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ================= INFO SECTION (Ticket) ================= */}
        <div className="relative z-30 -mt-8 px-2 lg:px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-t-[2.5rem] border border-amber-500/20 bg-[#111] p-6 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] lg:p-10"
          >
            <div className="absolute top-0 left-1/2 h-[2px] w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
            <CornerFlourish className="absolute top-4 left-4 rotate-0" />
            <CornerFlourish className="absolute top-4 right-4 rotate-90" />

            <div className="mt-2 mb-10 text-center">
              <h2 className="mb-2 font-serif text-3xl text-white">Thông Tin Sự Kiện</h2>
              <p className="text-[10px] tracking-[0.3em] text-amber-500/80 uppercase">
                Save The Date
              </p>
            </div>

            <div className="space-y-8">
              {/* Time */}
              <div className="flex items-start gap-6 border-b border-dashed border-white/5 pb-8">
                <div className="flex h-5 w-5 shrink-0 flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-950/30 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <Calendar className="h-7 w-7" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold tracking-wider text-amber-500 uppercase">
                    {weekdayStr}
                  </p>
                  <p className="mb-2 font-serif text-4xl text-white">{dateStr}</p>
                  <div className="flex w-fit items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{timeStr}</span>
                  </div>
                </div>
              </div>

              {/* Location & Map & Parking */}
              <div className="flex items-start gap-6 border-b border-dashed border-white/5 pb-8">
                <div className="w-full">
                  <p className="mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                    Địa điểm
                  </p>
                  <p className="mb-2 font-serif text-xl leading-tight text-white">
                    {data.venue.name}
                  </p>
                  <p className="mb-4 text-sm leading-relaxed font-light text-gray-400">
                    {data.venue.address}
                  </p>

                  {/* 5. Thông tin Bãi giữ xe (Parking) */}
                  {data.venue.parking && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                      <Car className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <div>
                        <p className="mb-1 text-[10px] font-bold tracking-wider text-amber-500 uppercase">
                          Gửi xe tại
                        </p>
                        <p className="text-xs leading-relaxed whitespace-pre-line text-gray-300">
                          {data.venue.parking}
                        </p>
                      </div>
                    </div>
                  )}

                  <div
                    onClick={openGoogleMaps}
                    className="group relative h-32 w-full cursor-pointer overflow-hidden rounded-xl border border-white/10 shadow-lg"
                  >
                    <img
                      src={graduationImages.mapPreview}
                      className="h-full w-full object-cover opacity-60 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-80 group-hover:grayscale-0"
                      alt="Map Preview"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1px] transition-all group-hover:backdrop-blur-none">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 shadow-lg shadow-amber-500/40">
                        <Navigation className="h-5 w-5 fill-black text-black" />
                      </div>
                      <span className="mt-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md">
                        Mở bản đồ
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 rounded-lg bg-black/50 p-1.5 text-white">
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Thông tin liên hệ (Contact) */}
              <div className="flex flex-col gap-3">
                <p className="mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Liên hệ hỗ trợ
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <a
                    href={`tel:${data.contact.phone}`}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:bg-white/10"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-black/40 text-amber-500 transition-transform group-hover:scale-110">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                      {data.contact.phone}
                    </span>
                  </a>

                  <a
                    href={`mailto:${data.contact.email}`}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:bg-white/10"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-black/40 text-amber-500 transition-transform group-hover:scale-110">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="truncate text-sm font-medium text-gray-200 group-hover:text-white">
                      {data.contact.email}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="bg-[#111]">
            <GoldenWave />
          </div>
        </div>

        {/* ================= GALLERY SECTION ================= */}
        <div className="relative z-30 bg-[#0a0a0a] px-6 pt-6 pb-12">
          <div className="mb-8 flex items-center justify-between border-l-4 border-amber-500 pl-4">
            <h2 className="font-serif text-2xl text-white">Khoảnh khắc</h2>
            <ImageIcon className="h-5 w-5 text-amber-500/50" />
          </div>

          {/* 7. Render Grid với galleryImages đã gộp */}
          <div className="grid grid-cols-2 gap-3">
            {/* Ảnh Lớn (Trái) */}
            <motion.div
              className="group relative col-span-2 row-span-2 h-80 cursor-pointer overflow-hidden rounded-[2rem] border border-white/5 sm:col-span-1 sm:h-auto"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(galleryImages[0])}
            >
              <img
                src={galleryImages[0]}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Gallery 1"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </motion.div>

            {/* Ảnh Nhỏ 1 */}
            <motion.div
              className="relative h-40 cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/5"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(galleryImages[1])}
            >
              <img
                src={galleryImages[1]}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Gallery 2"
              />
            </motion.div>

            {/* Ảnh Nhỏ 2 */}
            <motion.div
              className="relative h-40 cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/5"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(galleryImages[2])}
            >
              <img
                src={galleryImages[2]}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Gallery 3"
              />
            </motion.div>

            {/* Ảnh Ngang (Full Width) */}
            <motion.div
              className="relative col-span-2 mt-2 h-48 cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/5"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(galleryImages[3])}
            >
              <img
                src={galleryImages[3]}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Gallery 4"
              />
              <div className="absolute right-4 bottom-4 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur-md">
                <Heart className="h-3 w-3 fill-white" /> 1.2k
              </div>
            </motion.div>
          </div>
        </div>

        {/* ================= REACTION BAR ================= */}
        <div className="fixed right-0 bottom-6 left-0 z-50 flex justify-center px-4">
          <div className="no-scrollbar flex max-w-full items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-black/80 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.9)] ring-1 ring-white/5 backdrop-blur-xl">
            <ReactionBtn emoji="❤️" color="text-red-500" onClick={() => triggerReaction('❤️')} />
            <ReactionBtn emoji="👏" color="text-yellow-500" onClick={() => triggerReaction('👏')} />
            <ReactionBtn emoji="🎉" color="text-purple-500" onClick={() => triggerReaction('🎉')} />
            <div className="mx-2 h-8 w-[1px] bg-white/20"></div>
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition-transform hover:scale-105 active:scale-95"
            >
              <MessageCircle className="h-4 w-4 fill-black" />
              <span>Hỗ trợ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ReactionBtn = ({
  emoji,
  color,
  onClick,
}: {
  emoji: string;
  color: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-xl transition-all hover:bg-white/10 active:scale-90 ${color}`}
  >
    {emoji}
  </button>
);
