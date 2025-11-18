import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Cake, Gift, Music, Dog, Calendar, Flower2, GraduationCap, PartyPopper, X, ChevronLeft, ChevronRight, Camera, Play, Pause } from 'lucide-react';

export default function VidhiBirthdayWebsite() {
    // Track which chapters have revealed photos
    const [revealedPhotoChapters, setRevealedPhotoChapters] = useState([]);
    const [openedViaRevealChapter, setOpenedViaRevealChapter] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);
  const [revealedMemories, setRevealedMemories] = useState([]);
  const [messageRevealed, setMessageRevealed] = useState(false);
  const [showBirthdayCake, setShowBirthdayCake] = useState(false);
  const [balloons, setBalloons] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Photo Collections for Each Chapter
  const photoCollections = {
    0: [ // Tobby's Magic
      'PHOTO-2025-06-06-10-42-39.jpg',
      '424dc68a-4408-4a2c-9a70-97798ddddb7e 2.JPG',
      'eddbed64-0ef9-4cb6-a909-464023e3299e.jpg'
    ],
    1: [ // First Adventures
      'PHOTO-2025-03-15-14-27-31 2.jpg',
      'PHOTO-2025-03-15-14-27-32.jpg',
      'AAC753F9-60EB-4F33-AB12-2F51CAEB071E.JPG'
    ],
    2: [ // Stadium Proposal - placeholder until you add photos
      'IMG_2328.JPG',
      'IMG_2348.JPG',
      'cbe1afe1-69b1-4b99-9e5c-ad2379b4f5ac.JPG'
    ],
    3: [ // Falling in Love
      'PHOTO-2025-03-28-11-47-49.jpg',
      'PHOTO-2025-03-30-00-10-15.jpg',
      'PHOTO-2025-03-30-00-12-48.jpg',
      'PHOTO-2025-04-26-03-42-22.jpg'
    ],
    4: [ // The Ring
      'IMG_3477.JPG',
      '0365ac52-5016-442f-8d7f-812e33d3e142.jpg',
      'IMG_2317.JPG'
    ],
    5: [ // Dr. Vidhi Dave
      'Screenshot_2023-10-13-14-45-36-96_1c337646f29875672b5a61192b9010f9.JPG',
      'e10014a2-eb6e-49ca-aea4-6a4d3faff601.JPG'
    ],
    6: [ // Navratri
      'IMG_2328.JPG',
      'IMG_3051.JPG',
      'IMG_9439.JPG',
      'cbe1afe1-69b1-4b99-9e5c-ad2379b4f5ac.JPG'
    ],
    7: [ // Birthday
      'PHOTO-2025-09-14-10-06-23.jpg',
      'PHOTO-2025-09-14-10-06-26.jpg',
      'PHOTO-2025-09-14-10-06-27 2.jpg',
      'PHOTO-2025-09-14-10-06-29 3.jpg',
      'IMG_8613.JPG',
      'IMG_8631.JPG',
      'IMG_8678.JPG'
    ]
  };

  // --- Audio Player Component (Our Song) ---
  const AudioPlayer = () => {
    // Use the actual filename in `public/audio/` (underscores, no spaces)
    const audioFile = 'Ek_Din_Aap.mp3';
    const [audioError, setAudioError] = useState(false);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
      const a = audioRef.current;
      if (!a) return;

      const onLoaded = () => setDuration(a.duration || 0);
      const onTime = () => setCurrentTime(a.currentTime || 0);
      const onEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0); // Reset seeker to 0:00
      };

      const onError = (e) => {
        setAudioError(true);
        console.error('Audio failed to load', e);
      };

      a.addEventListener('loadedmetadata', onLoaded);
      a.addEventListener('timeupdate', onTime);
      a.addEventListener('ended', onEnded);
      a.addEventListener('error', onError);

      return () => {
        a.removeEventListener('loadedmetadata', onLoaded);
        a.removeEventListener('timeupdate', onTime);
        a.removeEventListener('ended', onEnded);
        a.removeEventListener('error', onError);
      };
    }, []);

    const togglePlay = async () => {
      const a = audioRef.current;
      if (!a) return;
      try {
        if (isPlaying) {
          a.pause();
          setIsPlaying(false);
        } else {
          await a.play();
          setIsPlaying(true);
        }
      } catch (err) {
        setAudioError(true);
        console.error('Audio play error', err);
      }
    };

    const handleSeek = (e) => {
      const a = audioRef.current;
      if (!a) return;
      a.currentTime = parseFloat(e.target.value);
      setCurrentTime(parseFloat(e.target.value));
    };

    const formatTime = (t) => {
      if (!t || isNaN(t)) return '0:00';
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };

    return (
      <div className="mt-6 flex flex-col items-center w-full max-w-xl mx-auto">
        <audio
          ref={audioRef}
          src={encodeURI(`/audio/${audioFile}`)}
          preload="metadata"
          style={{ display: 'none' }}
        />

        {audioError ? (
          <div className="text-red-600 font-semibold mt-4">Audio failed to load. Please check the file path and refresh the page.</div>
        ) : (
          <div className="flex items-center gap-4 w-full px-4">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="bg-pink-500 text-white p-3 rounded-full shadow-md hover:brightness-95 flex items-center justify-center"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <div className="flex-1 flex items-center gap-3">
              <span className="text-sm text-gray-600 w-12 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                step="0.01"
                className="w-full h-2 rounded-lg appearance-none"
                aria-label="Seek"
                style={{
                  background: `linear-gradient(90deg, #fb7185 ${duration ? (currentTime / duration) * 100 : 0}%, #e5e7eb ${duration ? (currentTime / duration) * 100 : 0}%)`
                }}
              />
              <span className="text-sm text-gray-600 w-12 text-left">{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Birthday Story
  const story = {
    title: "Happy Birthday Vidhi! 🎂",
    subtitle: "A Love Story Written in the Stars",
    herName: "Vidhi",
    hisName: "Batu",
    birthday: "November 20, 2002",
    age: "23",
    
    chapters: [
      {
        id: 0,
        title: "The Beginning - Tobby's Magic",
        emoji: "🐕",
        icon: Dog,
        content: "It all started with a furry little matchmaker named Tobby...",
        detail: "May 2022 - I never imagined that bringing my mom to your house would change my life forever. When you met Tobby, the way your eyes lit up, the way you instantly fell in love with him - I knew you were special. Tobby became your most lovable creature on the planet, and watching you two together made my heart skip a beat. Little did I know, this was just the beginning of our beautiful journey.",
        date: "May 2022",
        color: "from-pink-400 to-rose-400",
        memory: "That first moment when Tobby ran to you, and you smiled - I knew something magical was about to happen."
      },
      {
        id: 1,
        title: "First Adventures Together",
        emoji: "🎬",
        icon: Sparkles,
        content: "Movie nights, first drinks, and endless conversations...",
        detail: "The next day, we went for Bhool Bhulaiyaa 2 with friends, followed by dinner. That night, you had your first beer, and I got to witness such a beautiful moment. Everything felt perfect - the laughter, the conversations, the comfort. Later that night, we spent quality time together, and it was the best time of my life. Hours felt like minutes when I was with you.",
        date: "Our First Date",
        color: "from-purple-400 to-pink-400",
        memory: "Your nervous smile when you had your first beer, and how we talked until the stars came out."
      },
      {
        id: 2,
        title: "The Stadium Proposal",
        emoji: "🏟️",
        icon: Heart,
        content: "IPL Final 2022 - The day my world changed forever...",
        detail: "GT vs RR - Among thousands of fans, you did something that took my breath away. In front of the entire stadium, YOU PROPOSED TO ME! I was shocked, overwhelmed, and honestly, a bit scared. I said it would be hard for us, that the journey wouldn't be easy. But looking into your eyes, seeing your courage and determination - how could I resist? That day, you showed me what fearless love looks like.",
        date: "IPL Final 2022",
        color: "from-orange-400 to-red-400",
        memory: "The roar of the crowd, the beating of my heart, and your brave words that changed everything."
      },
      {
        id: 3,
        title: "Falling in Love",
        emoji: "💕",
        icon: Heart,
        content: "1.5 years of exploring, laughing, and falling deeper...",
        detail: "After that day, we spent the next year and a half creating the most beautiful memories. We explored countless restaurants, celebrated every festival together, and made ordinary days extraordinary. Walking Tobby became our therapy sessions - we'd talk about everything, plan our future, and just be US. Even when we fought, Tobby would bring us back together because he needed both his parents united!",
        date: "May 2022 - Nov 2023",
        color: "from-pink-400 to-purple-400",
        memory: "Those Tobby walks where we'd fight over who he loves more, only to laugh about it seconds later."
      },
      {
        id: 4,
        title: "The Ring - November 20, 2023",
        emoji: "💍",
        icon: Gift,
        content: "On your birthday, I made a promise...",
        detail: "November 20, 2023 - Your 22nd birthday. I knew this was the day. After everything we'd been through, after falling so deeply in love with you, I wanted to show you that you're my forever. I gave you a ring, not just as a gift, but as a promise - a promise that no matter where life takes us, no matter the distance, you'll always be my one.",
        date: "November 20, 2023",
        color: "from-yellow-400 to-pink-400",
        memory: "Your eyes sparkling brighter than the ring itself."
      },
      {
        id: 5,
        title: "Dr. Vidhi Dave! 🩺",
        emoji: "👩‍⚕️",
        icon: GraduationCap,
        content: "2025 - When you made your dreams come true...",
        detail: "This year, you became Dr. Vidhi Dave - a dentist! I watched you work tirelessly, studying late nights, never giving up. Even though I was thousands of miles away in the USA, when I got the news, I celebrated like it was Diwali! I am SO incredibly proud of you, Dumbo. Your dedication, your passion, your hard work - it all paid off. You're not just my love, you're my inspiration.",
        date: "2025",
        color: "from-blue-400 to-purple-400",
        memory: "Celebrating your success from across the world, wishing I could hug you tight."
      },
      {
        id: 6,
        title: "Navratri Nights - Missing You",
        emoji: "💃",
        icon: Sparkles,
        content: "Dancing in memories of your white chaniya choli...",
        detail: "Navratri is YOUR festival, and mine too - because you're my favorite. For two years now, I've missed playing Garba with you. Being here in the USA, when I see couples dancing, my mind instantly goes to you in that stunning white chaniya choli. You look too pretty, too gorgeous, too perfect. I smile from deep inside remembering how you dance, how you light up the night. I promise, next Navratri, we'll dance together again.",
        date: "Every Navratri",
        color: "from-yellow-400 to-orange-400",
        memory: "You in white chaniya choli, twirling under the lights - the most beautiful sight I've ever seen."
      },
      {
        id: 7,
        title: "Today & Forever",
        emoji: "🎂",
        icon: Cake,
        content: "Happy 23rd Birthday, My Love!",
        detail: "November 20, 2025 - Here we are, another year, another birthday, and my love for you has only grown stronger. Distance can't dim what we have. Every day, I think of you, miss you, and count down until we're together again. You're my Dumbo, my Bachaaa, my Ruhi - and I'm your Batu, forever and always. This website is just a small way to show you how much you mean to me.",
        date: "November 20, 2025",
        color: "from-rose-400 to-pink-400",
        memory: "Every moment with you is a gift. Happy Birthday, my love! 🎂💕"
      }
    ],
    
    specialMemories: [
      { id: 1, icon: "🐕", title: "Tobby - Our Cupid", description: "The jealousy is real! You give him more attention than me, and I'm not even mad about it anymore 😂" },
      { id: 2, icon: "🚶‍♂️", title: "Tobby Walks", description: "Our therapy sessions, deep talks, silly fights, and the best quality time - all thanks to our furry baby" },
      { id: 3, icon: "💃", title: "Navratri Queen", description: "You in that white chaniya choli, dancing under the lights - pure magic that I dream about" },
      { id: 4, icon: "🍺", title: "First Beer", description: "Your first time trying beer - you were nervous, I was excited, and the moment was perfect" },
      { id: 5, icon: "🍽️", title: "Restaurant Hopping", description: "From fancy dinners to street food - we've explored so many places and made each one special" },
      { id: 6, icon: "🎉", title: "Festival Love", description: "Diwali, Navratri, Holi - every festival became more colorful because I celebrated it with you" },
      { id: 7, icon: "🏟️", title: "Stadium Magic", description: "GT vs RR - The day you proposed in front of thousands! My brave, fearless Vidhi" },
      { id: 8, icon: "💌", title: "Long Distance", description: "USA to India - Miles apart but hearts connected. Missing you every single day" },
      { id: 9, icon: "🌹", title: "Flower Bundles", description: "Your love for flowers, especially those beautiful pink lily bundles that make your eyes sparkle" },
      { id: 10, icon: "🩺", title: "Dr. Vidhi Dave", description: "The proudest moment - watching you achieve your dreams through dedication and hard work" },
      { id: 11, icon: "🎵", title: "Ek Din Aap", description: "Our song by Alka Yagnik & Kumar Sanu - every word reminds me of us" },
      { id: 12, icon: "💍", title: "The Ring", description: "November 20, 2023 - The day I gave you a ring and promised you my forever" }
    ]
  };

  // Lightbox Functions
  const openLightbox = (chapterId, photoIndex) => {
    setOpenedViaRevealChapter(null);
    setLightboxImage({ chapterId, photoIndex });
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage(null);
    // If the lightbox was opened via the Reveal button, restore hidden state
    if (openedViaRevealChapter !== null) {
      setRevealedPhotoChapters((prev) => prev.filter((id) => id !== openedViaRevealChapter));
      setOpenedViaRevealChapter(null);
    }

  };

  const revealPhotos = (chapterId) => {
    setRevealedPhotoChapters((prev) => prev.includes(chapterId) ? prev : [...prev, chapterId]);
    setLightboxImage({ chapterId, photoIndex: 0 });
    setLightboxOpen(true);
    setOpenedViaRevealChapter(chapterId);
  };

  const nextPhoto = () => {
    if (lightboxImage) {
      const photos = photoCollections[lightboxImage.chapterId];
      const nextIndex = (lightboxImage.photoIndex + 1) % photos.length;
      setLightboxImage({ ...lightboxImage, photoIndex: nextIndex });
    }
  };

  const prevPhoto = () => {
    if (lightboxImage) {
      const photos = photoCollections[lightboxImage.chapterId];
      const prevIndex = (lightboxImage.photoIndex - 1 + photos.length) % photos.length;
      setLightboxImage({ ...lightboxImage, photoIndex: prevIndex });
    }
  };

  // Effects
  useEffect(() => {
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
    const balloonColors = ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493', '#FF69B4'];
    const newBalloons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 5,
      color: balloonColors[Math.floor(Math.random() * balloonColors.length)]
    }));
    setBalloons(newBalloons);
    return () => clearTimeout(confettiTimer);
  }, []);

  const nextChapter = () => {
    if (currentChapter < story.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const revealMemory = (id) => {
    if (!revealedMemories.includes(id)) {
      setRevealedMemories([...revealedMemories, id]);
    }
  };

  // Photo Gallery Component
  const PhotoGallery = ({ chapterId }) => {
    const photos = photoCollections[chapterId] || [];
    const [activeIndex, setActiveIndex] = useState(0);
    const isRevealed = revealedPhotoChapters.includes(chapterId);
    if (photos.length === 0) return null;
    return (
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Camera className="text-pink-500" size={20} />
          <h4 className="text-lg font-bold text-gray-800">Our Memories 📸</h4>
          <Camera className="text-pink-500" size={20} />
        </div>
        {!isRevealed ? (
          <div className="relative bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-8 mb-3 text-center">
            <div className="h-64 flex flex-col items-center justify-center bg-white/60 rounded-xl p-6">
              <p className="text-2xl font-semibold text-pink-600 mb-2">Hidden Memories</p>
              <p className="text-sm text-gray-600 mb-4">These photos are hidden so your birthday is a surprise. Click to reveal!</p>
              <button
                onClick={() => revealPhotos(chapterId)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Reveal Memories
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Main Photo Display */}
            <div className="relative bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-2 mb-3">
              <img
                src={`/photos/${photos[activeIndex]}`}
                alt={`Memory ${activeIndex + 1}`}
                className="w-full h-64 object-cover rounded-xl cursor-pointer shadow-lg"
                onClick={() => openLightbox(chapterId, activeIndex)}
              />
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {activeIndex + 1} / {photos.length}
              </div>
            </div>
            {/* Thumbnail Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={`/photos/${photo}`}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all duration-300 ${
                    idx === activeIndex
                      ? 'ring-4 ring-pink-500 scale-110'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => setActiveIndex(idx)}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-3 italic">
              Tap on photo to view full screen ✨
            </p>
          </>
        )}
      </div>
    );
  };

  // Lightbox Modal
  const Lightbox = () => {
    // Touch gesture refs (must be called unconditionally)
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    if (!lightboxOpen || !lightboxImage) return null;

    const photos = photoCollections[lightboxImage.chapterId];
    const currentPhoto = photos[lightboxImage.photoIndex];

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX.current = e.touches[0].clientX;
        touchEndX.current = null;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length === 1) {
        touchEndX.current = e.touches[0].clientX;
      }
    };

    const handleTouchEnd = () => {
      if (touchStartX.current == null || touchEndX.current == null) return;
      const deltaX = touchEndX.current - touchStartX.current;
      const SWIPE_THRESHOLD = 50; // px
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0) {
          nextPhoto(); // swipe left -> next
        } else {
          prevPhoto(); // swipe right -> prev
        }
      }
      touchStartX.current = null;
      touchEndX.current = null;
    };

    return (
      <div
        className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-label="Photo viewer"
      >
        {/* Close Button */}
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
          aria-label="Close photo viewer"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <img
          src={`/photos/${currentPhoto}`}
          alt={`Memory ${lightboxImage.photoIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain rounded-lg touch-action-pan-y"
        />

        {/* Counter and Switcher */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white/20 text-white px-4 py-2 rounded-full">
          <button
            onClick={prevPhoto}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="mx-2 text-lg font-semibold">{lightboxImage.photoIndex + 1} / {photos.length}</span>
          <button
            onClick={nextPhoto}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  };

  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {showConfetti && [...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493', '#FFD700'][Math.floor(Math.random() * 5)]
            }}
          />
        </div>
      ))}
    </div>
  );

  const FloatingBalloons = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="absolute animate-float-up"
          style={{
            left: `${balloon.left}%`,
            bottom: '-100px',
            animationDelay: `${balloon.delay}s`,
            animationDuration: `${balloon.duration}s`,
          }}
        >
          <div
            className="w-12 h-14 rounded-full opacity-60"
            style={{
              backgroundColor: balloon.color,
              clipPath: 'ellipse(50% 60% at 50% 40%)'
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <Confetti />
      <FloatingBalloons />
      <Lightbox />
      
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          100% { transform: translateY(-120vh) rotate(180deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti linear infinite; }
        .animate-float-up { animation: float-up linear infinite; }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 105, 180, 0.5); }
          50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(255, 105, 180, 0.8); }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.8s ease-out; }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
      `}</style>

      {/* Birthday Header */}
      <div className="text-center pt-8 pb-6 px-4">
        <div className="animate-bounce-gentle inline-block mb-4">
          <Cake className="text-pink-500 mx-auto" size={48} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-transparent bg-clip-text">
          {story.title}
        </h1>
        <p className="text-gray-600 text-lg mb-2">{story.subtitle}</p>
        
        <div className="flex items-center justify-center gap-2 text-pink-500 font-semibold text-xl mb-4">
          <Calendar size={20} />
          <span>November 20, 2025 • Turning {story.age}! 🎉</span>
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-4">
          <PartyPopper className="text-yellow-500" size={32} />
          <Heart className="text-pink-500 animate-pulse" fill="currentColor" size={32} />
          <Sparkles className="text-purple-500" size={32} />
        </div>
        
        <p className="text-gray-700 italic max-w-xl mx-auto">
          "For my Dumbo, my Bachaaa, my Ruhi - the one who lights up my world 💖"
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          {story.chapters.map((chapter, idx) => (
            <div
              key={chapter.id}
              className={`flex-1 h-2 mx-1 rounded-full transition-all duration-500 ${
                idx <= currentChapter
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-500">
          Chapter {currentChapter + 1} of {story.chapters.length}
        </p>
      </div>

      {/* Main Story Chapter */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden fade-in">
          {/* Chapter Header */}
          <div className={`bg-gradient-to-r ${story.chapters[currentChapter].color} p-8 text-white text-center relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              <Flower2 className="absolute top-4 left-4" size={60} />
              <Flower2 className="absolute bottom-4 right-4" size={80} />
              <Heart className="absolute top-1/2 left-1/4" size={40} fill="currentColor" />
            </div>
            
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-bounce-gentle">
                {story.chapters[currentChapter].emoji}
              </div>
              <h2 className="text-3xl font-bold mb-3">
                {story.chapters[currentChapter].title}
              </h2>
              <div className="flex items-center justify-center text-sm opacity-90">
                <Calendar size={16} className="mr-2" />
                {story.chapters[currentChapter].date}
              </div>
            </div>
          </div>

          {/* Chapter Content */}
          <div className="p-8">
            <p className="text-xl text-pink-600 mb-6 leading-relaxed font-semibold italic text-center">
              {story.chapters[currentChapter].content}
            </p>

            {/* PHOTO GALLERY */}
            <PhotoGallery chapterId={currentChapter} />
            
            <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-pink-200">
              <p className="text-gray-700 leading-relaxed text-lg">
                {story.chapters[currentChapter].detail}
              </p>
            </div>

            {/* Special Memory Quote */}
            {story.chapters[currentChapter].memory && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-5 mb-6 border-l-4 border-pink-500">
                <p className="text-gray-700 italic flex items-start">
                  <Heart className="text-pink-500 mr-3 mt-1 flex-shrink-0" size={20} fill="currentColor" />
                  <span>{story.chapters[currentChapter].memory}</span>
                </p>
              </div>
            )}

            {/* Interactive Buttons */}
            <div className="text-center mb-6">
              <button
                onClick={() => setShowConfetti(true)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center animate-pulse-glow"
              >
                <Heart className="mr-2" fill="currentColor" size={20} />
                Send Love & Confetti 💖
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-between">
              <button
                onClick={previousChapter}
                disabled={currentChapter === 0}
                className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                  currentChapter === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                }`}
              >
                ← Previous
              </button>
              
              <button
                onClick={nextChapter}
                disabled={currentChapter === story.chapters.length - 1}
                className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                  currentChapter === story.chapters.length - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Special Memories Grid */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold text-center mb-3 text-gray-800">
            Our Beautiful Memories 💕
          </h3>
          <p className="text-center text-gray-600 mb-6 flex items-center justify-center">
            <Sparkles className="text-yellow-500 mr-2" size={20} />
            Tap each memory to unlock our special moments
            <Sparkles className="text-yellow-500 ml-2" size={20} />
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {story.specialMemories.map((memory) => (
              <div
                key={memory.id}
                onClick={() => revealMemory(memory.id)}
                className={`bg-white rounded-2xl p-5 shadow-lg cursor-pointer transition-all duration-500 transform hover:scale-105 border-2 ${
                  revealedMemories.includes(memory.id)
                    ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-300'
                    : 'border-gray-200'
                }`}
              >
                <div className="text-4xl mb-3 text-center">
                  {memory.icon}
                </div>
                <h4 className="font-bold text-center mb-2 text-gray-800 text-sm">
                  {memory.title}
                </h4>
                {revealedMemories.includes(memory.id) ? (
                  <p className="text-xs text-gray-600 text-center fade-in leading-relaxed">
                    {memory.description}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 text-center italic">
                    Tap to reveal ✨
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Birthday Cake Animation */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowBirthdayCake(!showBirthdayCake)}
            className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-white px-10 py-5 rounded-full font-bold shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
          >
            🎂 Make a Wish! 🎂
          </button>
          
          {showBirthdayCake && (
            <div className="mt-8 bg-white rounded-3xl p-8 shadow-2xl fade-in">
              <div className="text-8xl mb-4 animate-bounce-gentle">🎂</div>
              <h3 className="text-2xl font-bold text-pink-600 mb-4">Happy 23rd Birthday, Vidhi!</h3>
              <p className="text-gray-600 text-lg mb-4">
                Blow the candles and make a wish! 🕯️✨
              </p>
              <div className="flex justify-center gap-4">
                <span className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🕯️</span>
                <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🕯️</span>
                <span className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🕯️</span>
              </div>
            </div>
          )}
        </div>

        {/* Birthday Message Section */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 rounded-3xl p-8 text-white shadow-2xl">
            <div className="text-center mb-6">
              <Gift size={48} className="mx-auto mb-4 animate-bounce-gentle" />
              <h3 className="text-3xl font-bold mb-4">A Special Message for You 💌</h3>
            </div>
            
            {!messageRevealed ? (
              <button
                onClick={() => setMessageRevealed(true)}
                className="w-full bg-white text-pink-500 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                💝 Open Your Birthday Gift 💝
              </button>
            ) : (
              <div className="fade-in">
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6 mb-6">
                  <div className="text-xl leading-relaxed mb-6 font-medium">
                    <p className="mb-4 text-2xl font-bold">Dear Vidhi,</p>
                    
                    <div className="text-left space-y-3 text-lg">
                      <p className="flex items-start">
                        <span className="text-yellow-300 font-bold text-2xl mr-3">V</span>
                        <span>ibrant heart that lights my world</span>
                      </p>
                      <p className="flex items-start">
                        <span className="text-yellow-300 font-bold text-2xl mr-3">I</span>
                        <span>n every moment, you're my calm and thrill</span>
                      </p>
                      <p className="flex items-start">
                        <span className="text-yellow-300 font-bold text-2xl mr-3">D</span>
                        <span>reams feel closer when I'm with you</span>
                      </p>
                      <p className="flex items-start">
                        <span className="text-yellow-300 font-bold text-2xl mr-3">H</span>
                        <span>olding your hand is my favorite place</span>
                      </p>
                      <p className="flex items-start">
                        <span className="text-yellow-300 font-bold text-2xl mr-3">I</span>
                        <span> love you—happy birthday, Vidhi!</span>
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t-2 border-white/30">
                      <p className="mb-4">
                        From the day Tobby brought us together to this very moment, every second with you has been a blessing. You've become Dr. Vidhi Dave, you've achieved your dreams, and I couldn't be prouder.
                      </p>
                      <p className="mb-4">
                        Miles may separate us, but nothing can diminish what we have. When I see you in that white chaniya choli, when I remember our Tobby walks, when I think of that brave proposal at the stadium - my heart swells with love.
                      </p>
                      <p className="mb-4">
                        Happy 23rd Birthday, my Dumbo, my Bachaaa, my Ruhi. You are my yesterday, my today, and all of my tomorrows.
                      </p>
                      <p className="text-2xl font-bold">
                        Forever yours, Batu 💕
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center text-lg font-semibold">
                    <Heart size={20} className="mr-2" fill="currentColor" />
                    November 20, 2025
                    <Heart size={20} className="ml-2" fill="currentColor" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Music Reference */}
        <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 text-center shadow-lg">
          <Music className="text-pink-500 mx-auto mb-4" size={40} />
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Song 🎵</h3>
          <p className="text-lg text-gray-700 mb-2 font-semibold">
            "Ek Din Aap"
          </p>
          <p className="text-gray-600">
            by Alka Yagnik & Kumar Sanu (1997)
          </p>
            <p className="text-gray-600 italic mt-3">
              Every word of this song reminds me of us 💕
            </p>

            {/* Audio Player Controls */}
            <AudioPlayer />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 pb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flower2 className="text-pink-400" size={24} />
            <Heart className="text-pink-400 animate-pulse" size={20} fill="currentColor" />
            <Flower2 className="text-pink-400" size={24} />
          </div>
          <p className="text-lg mb-2">Made with endless love for Dr. Vidhi Dave</p>
          <p className="text-sm">From your Batu, with all my heart 💖</p>
          <p className="text-xs mt-4 text-gray-400">Happy Birthday, my love! May this year bring you everything you've ever dreamed of 🎂✨</p>
        </div>
      </div>
    </div>
  );
}