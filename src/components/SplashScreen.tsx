import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const VIDEO_URL =
  'https://ilhzsadfwezqljvrbpwt.supabase.co/storage/v1/object/public/vinclub/Video%20banner_1672911651.mp4';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);

  // Auto-end: if video ends or after 8s max, close splash
  useEffect(() => {
    const timer = setTimeout(() => {
      handleEnd();
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnd = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <video
            ref={videoRef}
            src={VIDEO_URL}
            autoPlay
            muted
            playsInline
            onEnded={handleEnd}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Skip button */}
          <button
            onClick={handleEnd}
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '24px',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(6px)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              padding: '8px 18px',
              borderRadius: '20px',
              cursor: 'pointer',
              letterSpacing: '0.5px',
            }}
          >
            Bỏ qua &#8250;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
