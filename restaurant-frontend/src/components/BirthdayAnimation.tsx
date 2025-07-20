import { useEffect, useCallback, useRef } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface BirthdayAnimationProps {
  username: string;
  onComplete?: () => void;
  isVisible: boolean;
}

const BirthdayAnimation = ({ username, onComplete, isVisible }: BirthdayAnimationProps) => {
  const refAnimationInstance = useRef<any>(null);

  const getInstance = useCallback((instance: any) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio: number, opts: any) => {
    refAnimationInstance.current?.({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio),
    });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  useEffect(() => {
    if (isVisible) {
      fire();
      const interval = setInterval(fire, 2000); // Fire every 2 seconds
      return () => clearInterval(interval);
    }
  }, [fire, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ReactCanvasConfetti
            refConfetti={getInstance}
            style={{
              position: 'fixed',
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            }}
          />
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.h1
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 1.5
                }}
                className="text-5xl font-bold text-yellow-400 mb-4"
              >
                🎉 Happy Birthday! 🎉
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-3xl text-white font-semibold"
              >
                {username}
              </motion.div>
              {onComplete && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3 }}
                  onClick={onComplete}
                  className="mt-8 px-6 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors"
                >
                  Thank you! 🎈
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BirthdayAnimation;
