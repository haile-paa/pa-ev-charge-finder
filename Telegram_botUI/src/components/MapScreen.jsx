import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";

const MapScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const { MainButton } = useTelegram();

  useEffect(() => {
    if (MainButton) {
      MainButton.setText("GO BACK");
      MainButton.onClick(() => navigate("/"));
      MainButton.show();
    }

    // Get user location and redirect to Google Maps
    getLocation();

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 5;
      });
    }, 200);

    return () => {
      clearInterval(progressInterval);
      if (MainButton) {
        MainButton.offClick();
        MainButton.hide();
      }
    };
  }, [navigate, MainButton]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        openGoogleMaps(latitude, longitude);
      },
      (err) => {
        setError("Failed to get your location: " + err.message);
        setLoading(false);
      }
    );
  };

  const openGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/search/?api=1&query=car+charging+stations&query_place_id=&ll=${lat},${lng}`;
    window.open(url, "_blank");

    // After a delay, set loading to false
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const retryLocation = () => {
    setError(null);
    setLoading(true);
    setProgress(0);
    getLocation();
  };

  return (
    <div className='min-h-screen bg-black p-5 flex items-center justify-center'>
      {error ? (
        <div className='text-center'>
          <p className='text-red-500 text-lg mb-5'>{error}</p>
          <button
            className='bg-green-600 text-white px-6 py-3 rounded-lg'
            onClick={retryLocation}
          >
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className='text-center'>
          <div className='text-6xl text-green-500 mb-8'>ፖ</div>

          <div className='my-8 animate-spin'>
            <span className='text-5xl'>📍</span>
          </div>

          <p className='text-white text-lg mb-8'>
            Finding charging stations near you...
          </p>

          <div className='w-full bg-gray-700 rounded-full h-2 mb-8'>
            <div
              className='bg-green-500 h-2 rounded-full'
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className='flex justify-center space-x-2'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className='w-3 h-3 bg-green-500 rounded-full'></div>
            ))}
          </div>
        </div>
      ) : (
        <div className='text-center'>
          <p className='text-green-500 text-2xl mb-4'>Google Maps opened!</p>
          <p className='text-white mb-8'>
            Google Maps has opened with charging stations near your location.
          </p>
        </div>
      )}
    </div>
  );
};

export default MapScreen;
