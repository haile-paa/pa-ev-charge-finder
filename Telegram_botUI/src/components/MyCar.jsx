import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";

const MyCar = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Car Status");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const { MainButton } = useTelegram();

  useEffect(() => {
    if (MainButton) {
      MainButton.setText("REGISTER CAR");
      MainButton.onClick(() => navigate("/register"));
      MainButton.show();
    }

    const savedCar = localStorage.getItem("userCar");
    if (savedCar) {
      setCarData(JSON.parse(savedCar));
    }
    setLoading(false);

    return () => {
      if (MainButton) {
        MainButton.offClick();
        MainButton.hide();
      }
    };
  }, [navigate, MainButton]);

  useEffect(() => {
    if (activeTab === "Climate") {
      getWeatherData();
    }
  }, [activeTab]);

  const getWeatherData = async () => {
    setWeatherLoading(true);
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation not supported");
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`
      );
      const data = await response.json();

      const weatherIcons = {
        0: { condition: "Clear Sky", icon: "☀️" },
        1: { condition: "Mainly Clear", icon: "🌤️" },
        2: { condition: "Partly Cloudy", icon: "⛅" },
        3: { condition: "Overcast", icon: "☁️" },
        45: { condition: "Fog", icon: "🌫️" },
        48: { condition: "Rime Fog", icon: "🌫️" },
        51: { condition: "Drizzle", icon: "🌧️" },
        61: { condition: "Rain", icon: "🌧️" },
        71: { condition: "Snow", icon: "❄️" },
        95: { condition: "Thunderstorm", icon: "⛈️" },
      };

      const code = data.current_weather.weathercode;
      const iconData = weatherIcons[code] || weatherIcons[0];

      setWeather({
        temperature: data.current_weather.temperature,
        windSpeed: data.current_weather.windspeed,
        condition: iconData.condition,
        icon: iconData.icon,
        location: `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`,
        humidity: data.hourly.relativehumidity_2m[0] || 0,
      });
    } catch (error) {
      console.error("Weather fetch error:", error);
    } finally {
      setWeatherLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
      </div>
    );
  }

  if (!carData) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center p-5'>
        <h2 className='text-2xl font-bold mb-4'>No Car Registered</h2>
        <p className='text-gray-400 mb-8'>
          Please register your car to view its status
        </p>
        <button
          className='bg-green-600 text-white px-6 py-3 rounded-lg'
          onClick={() => navigate("/register")}
        >
          Register Car
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-5 bg-custom-dark'>
      <h2 className='text-2xl font-bold text-center mb-5'>{carData.carType}</h2>

      <img
        src='/assets/images/car.png'
        alt='Car'
        className='w-full h-48 object-contain my-5'
      />

      <div className='flex justify-around mb-8'>
        <button
          className={`px-4 py-2 ${
            activeTab === "Car Status"
              ? "text-green-500 border-b-2 border-green-500 font-bold"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("Car Status")}
        >
          Car Status
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "Climate"
              ? "text-green-500 border-b-2 border-green-500 font-bold"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("Climate")}
        >
          Climate
        </button>
      </div>

      {activeTab === "Car Status" ? (
        <div className='bg-custom-dark-secondary rounded-xl p-5 mb-8'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-custom-dark p-3 rounded-lg'>
              <div className='text-green-400 mb-1'>🏷️</div>
              <div className='text-gray-400 text-sm'>Plate Number</div>
              <div className='font-bold'>{carData.licensePlate}</div>
            </div>

            <div className='bg-custom-dark p-3 rounded-lg'>
              <div className='text-green-400 mb-1'>🚗</div>
              <div className='text-gray-400 text-sm'>Car Model</div>
              <div className='font-bold'>{carData.carModel}</div>
            </div>

            {carData.color && (
              <div className='bg-custom-dark p-3 rounded-lg'>
                <div className='text-green-400 mb-1'>🎨</div>
                <div className='text-gray-400 text-sm'>Color</div>
                <div className='font-bold'>{carData.color}</div>
              </div>
            )}

            {carData.ownerNote && (
              <div className='bg-custom-dark p-3 rounded-lg'>
                <div className='text-green-400 mb-1'>📝</div>
                <div className='text-gray-400 text-sm'>Owner Note</div>
                <div className='font-bold'>{carData.ownerNote}</div>
              </div>
            )}

            {carData.insurance && (
              <div className='bg-custom-dark p-3 rounded-lg'>
                <div className='text-green-400 mb-1'>🛡️</div>
                <div className='text-gray-400 text-sm'>Insurance</div>
                <div className='font-bold'>{carData.insurance}</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='bg-custom-dark-secondary rounded-xl p-5 mb-8'>
          {weatherLoading ? (
            <div className='text-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto mb-4'></div>
              <p>Loading weather...</p>
            </div>
          ) : weather ? (
            <div className='text-center'>
              <div className='text-4xl mb-2'>{weather.icon}</div>
              <div className='text-3xl font-bold mb-1'>
                {weather.temperature}°C
              </div>
              <div className='text-gray-400 mb-4'>{weather.condition}</div>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>Humidity: {weather.humidity}%</div>
                <div>Wind: {weather.windSpeed} m/s</div>
              </div>
              <div className='text-gray-500 text-xs mt-4'>
                {weather.location}
              </div>
            </div>
          ) : (
            <div className='text-center py-8 text-gray-400'>
              Weather data unavailable
            </div>
          )}
        </div>
      )}

      <div className='bg-custom-dark-secondary rounded-xl p-5'>
        <p className='text-gray-400'>Registered to: {carData.email}</p>
        <p className='text-gray-400 mt-2'>Contact: {carData.phone}</p>
      </div>
    </div>
  );
};

export default MyCar;
