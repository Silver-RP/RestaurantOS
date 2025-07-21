import { useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import GlobalModal from "@/components/common/GlobalModal";

interface BirthdayAnimationProps {
  username: string;
  onComplete?: () => void;
  isVisible: boolean;
}

const BirthdayAnimation = ({ username, onComplete, isVisible }: BirthdayAnimationProps) => {
  const [visible, setVisible] = useState(true); 

  const fireRealistic = useCallback(() => {
    Realistic({
    });
  }, []);

  const fireFireworks = useCallback(() => {
    Fireworks({
    });
  }, []);

  const realisticConductorRef = useRef<any>(null);
  const fireworksConductorRef = useRef<any>(null);

  useEffect(() => {
    if (isVisible) {
      setVisible(true); 
      fireRealistic();
      fireFireworks();
      const interval = setInterval(() => {
        fireRealistic();
        fireFireworks();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [fireRealistic, fireFireworks, isVisible]);

  const handleThankYouClick = () => {
    realisticConductorRef.current?.stop();
    fireworksConductorRef.current?.stop();
    setVisible(false);
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && visible && (
        <GlobalModal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="absolute inset-0">
              <Realistic
                autorun={{ speed: 0.3 }}
                onInit={({ conductor }) =>
                  (realisticConductorRef.current = conductor)
                }
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                }}
              />
              <Fireworks
                autorun={{ speed: 3 }}
                onInit={({ conductor }) =>
                  (fireworksConductorRef.current = conductor)
                }
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1 }}
                className="text-center"
              >
                <motion.img
                  src="/assets/birthday/birthday.png"
                  alt="Happy Birthday"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    duration: 1.5,
                  }}
                  className="mb-4 w-[350px] h-[210px] object-cover mx-auto"
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-3xl text-white font-semibold"
                >
                  {username}
                  <p className="mt-2 text-lg text-secondaryColor">
                    Cảm ơn {username} đã đồng hành cùng BeefBeef Restaurant!
                    <br />
                    Nhân dịp sinh nhật, chúng tôi xin gửi đến bạn lời chúc tốt
                    đẹp nhất.
                    <br />
                    Chúc bạn luôn mạnh khỏe, hạnh phúc và thành công !
                    <br />
                    <br />
                  </p>

                  <p className="mt-2 text-[14px] text-[#ffe6b6] text-opacity-75">
                    🎁 BeefBeef đã gửi tặng bạn một món quà nhỏ – hãy kiểm tra
                    phần
                    <br />
                    Voucher trong mục Hồ sơ cá nhân để sử dụng ngay hôm nay nhé”
                  </p>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3 }}
                  onClick={handleThankYouClick}
                  className="mt-8 px-6 py-2 bg-secondaryColor  text-black rounded-full hover:bg-yellow-500 transition-colors"
                >
                  Thank you!
                </motion.button>
              </motion.div>
            </div>
          </div>
        </GlobalModal>
      )}
    </AnimatePresence>
  );
};

export default BirthdayAnimation;
