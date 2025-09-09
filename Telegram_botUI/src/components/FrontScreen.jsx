import { useNavigate, useLocation } from "react-router-dom";
import { useAnimation } from "../hooks/useAnimation";
import { useTelegram } from "../hooks/useTelegram";
import { useEffect } from "react";

const FrontScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { glowValue, pulseValue, floatValue } = useAnimation();
  const { MainButton } = useTelegram();

  const glowColor = glowValue === 0 ? "#00FF7F" : "#40E0D0";
  const floatY = floatValue * 8;
  const pulseScale = pulseValue;

  const isHomeActive = location.pathname === "/";
  const isCarActive = location.pathname === "/car";

  // Telegram MainButton
  useEffect(() => {
    if (MainButton) {
      MainButton.setText("FIND STATIONS");
      MainButton.onClick(() => navigate("/map"));
      MainButton.show();
    }
    return () => {
      if (MainButton) {
        MainButton.offClick();
        MainButton.hide();
      }
    };
  }, [MainButton, navigate]);

  return (
    <div className='relative h-screen w-full overflow-hidden'>
      {/* Background */}
      <div
        className='absolute inset-0 bg-cover bg-center z-0'
        style={{
          backgroundImage: "url('/assets/images/Pa-Station-front1.png')",
        }}
      />
      <div className='absolute inset-0 bg-black bg-opacity-70 z-0' />

      {/* Content */}
      <div className='relative z-10 h-full flex flex-col justify-between px-6 pt-16 pb-24'>
        {/* Hero */}
        <div className='flex flex-col items-center pt-10'>
          <div
            className='text-8xl mb-14'
            style={{
              color: glowColor,
              textShadow: "0 0 20px #00FF7F",
              transform: `translateY(${floatY}px)`,
            }}
          >
            ፖ
          </div>

          <div className='flex flex-col items-center mb-8'>
            <div className='flex items-center gap-4 mb-2'>
              <svg
                className='w-10 h-10 text-green-500'
                fill='currentColor'
                viewBox='0 0 512 512'
              >
                <path d='M296 464h-80a16 16 0 01-16-16v-80.13a16 16 0 00-16-16h-16.17a16 16 0 00-16 16V448a80 80 0 0080 80h80a16 16 0 0016-16v-16.17a16 16 0 00-16-16zm-216-80h16.17a16 16 0 0016-16v-80.13a16 16 0 0116-16h80a16 16 0 0116 16v80.13a16 16 0 0016 16h16.17a16 16 0 0016-16V224c0-79.4-64.6-144-144-144S64 144.6 64 224v160a16 16 0 0016 16zm360-16v-80.13a16 16 0 0116-16h80a16 16 0 0116 16V448a80 80 0 01-80 80h-80a16 16 0 01-16-16v-16.17a16 16 0 0116-16h80a16 16 0 0016-16zm0-160V224c0-79.4-64.6-144-144-144h-80a16 16 0 00-16 16v16.17a16 16 0 0016 16h80a16 16 0 0116 16v80.13a16 16 0 0016 16h16.17a16 16 0 0016-16z' />
              </svg>
              <h1 className='text-5xl font-extrabold text-white tracking-tight'>
                EV Charge
              </h1>
            </div>
          </div>

          <p className='text-base text-center text-gray-300 max-w-xs leading-6'>
            Find and charge your electric vehicle at stations near you
          </p>
        </div>

        {/* Button */}
        <div className='mt-40'>
          <div
            className='w-full rounded-2xl overflow-hidden border border-green-500 border-opacity-30'
            style={{ transform: `scale(${pulseScale})` }}
          >
            <div className='bg-white bg-opacity-10'>
              <div className='bg-green-500 bg-opacity-10'>
                <div
                  className='flex items-center justify-between px-6 py-5 cursor-pointer'
                  onClick={() => navigate("/map")}
                >
                  {/* Map icon */}
                  <svg
                    className='w-6 h-6 text-green-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
                    />
                  </svg>
                  {/* glowing text */}
                  <span className='text-lg font-bold text-green-500 flex-1 text-center text-glow'>
                    Find Stations
                  </span>
                  <svg
                    className='w-5 h-5 text-green-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {(isHomeActive || isCarActive) && (
        <div className='fixed bottom-4 left-4 right-4 z-50'>
          <div className='relative flex flex-row justify-around items-center h-16 rounded-2xl bg-gray-900 bg-opacity-90 shadow-lg shadow-green-500/25'>
            {/* Home */}
            <button
              className='flex flex-col items-center justify-center w-16 h-16'
              onClick={() => navigate("/")}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  isHomeActive
                    ? "bg-green-500/15 shadow-lg shadow-green-500/20"
                    : "bg-white/5"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    isHomeActive ? "text-green-500" : "text-gray-400"
                  }`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                  />
                </svg>
              </div>
              <span
                className={`text-xs mt-1 ${
                  isHomeActive ? "text-green-500 font-bold" : "text-gray-400"
                }`}
              >
                Home
              </span>
            </button>

            {/* Car */}
            <button
              className='flex flex-col items-center justify-center w-16 h-16'
              onClick={() => navigate("/car")}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  isCarActive
                    ? "bg-green-500/15 shadow-lg shadow-green-500/20"
                    : "bg-white/5"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    isCarActive ? "text-green-500" : "text-gray-400"
                  }`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <span
                className={`text-xs mt-1 ${
                  isCarActive ? "text-green-500 font-bold" : "text-gray-400"
                }`}
              >
                My Car
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontScreen;
