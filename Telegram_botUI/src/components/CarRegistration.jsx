import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";

const CarRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    carType: "Tesla",
    carModel: "Model X",
    licensePlate: "",
    color: "",
    ownerNote: "",
    insurance: "",
    batteryCapacity: "100",
    tirePressure: "32",
  });
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { MainButton } = useTelegram();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    if (MainButton) {
      MainButton.setText("GO BACK");
      MainButton.onClick(() => navigate("/"));
      MainButton.show();
    }

    return () => {
      if (MainButton) {
        MainButton.offClick();
        MainButton.hide();
      }
    };
  }, [navigate, MainButton]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = isLogin ? "/login" : "/registerCar";
      const payload = isLogin
        ? { email: formData.email, phone: formData.phone }
        : formData;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userCar", JSON.stringify(data.car));
        setMessage(
          isLogin ? "Login successful!" : "Car registered successfully!"
        );

        // Navigate to car screen after successful registration/login
        setTimeout(() => navigate("/car"), 1500);
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setMessage("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen p-5 bg-custom-dark'>
      <h2 className='text-2xl font-bold text-center mb-8'>
        Register / Login Your Car
      </h2>

      <div className='flex justify-center mb-8'>
        <div className='flex bg-custom-dark-secondary rounded-lg p-1'>
          <button
            className={`px-4 py-2 rounded-lg ${
              !isLogin ? "bg-green-600" : "bg-transparent"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              isLogin ? "bg-yellow-500" : "bg-transparent"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-gray-400 mb-2'>Email *</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full bg-custom-dark-secondary text-white rounded-lg p-3'
          />
        </div>

        <div>
          <label className='block text-gray-400 mb-2'>Phone Number *</label>
          <input
            type='tel'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            required
            className='w-full bg-custom-dark-secondary text-white rounded-lg p-3'
          />
        </div>

        {!isLogin && (
          <>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-gray-400 mb-2'>Car Type</label>
                <select
                  name='carType'
                  value={formData.carType}
                  onChange={handleChange}
                  className='w-full bg-custom-dark-secondary text-white rounded-lg p-3'
                >
                  <option value='Tesla'>Tesla</option>
                  <option value='BMW'>BMW</option>
                  <option value='Audi'>Audi</option>
                  <option value='Mercedes'>Mercedes</option>
                  <option value='Other'>Other</option>
                </select>
              </div>

              <div>
                <label className='block text-gray-400 mb-2'>Model</label>
                <input
                  type='text'
                  name='carModel'
                  value={formData.carModel}
                  onChange={handleChange}
                  className='w-full bg-custom-dark-secondary text-white rounded-lg p-3'
                />
              </div>
            </div>

            <div>
              <label className='block text-gray-400 mb-2'>
                License Plate *
              </label>
              <input
                type='text'
                name='licensePlate'
                value={formData.licensePlate}
                onChange={handleChange}
                required
                className='w-full bg-custom-dark-secondary text-white rounded-lg p-3 uppercase'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-gray-400 mb-2'>
                  Battery Capacity (%)
                </label>
                <input
                  type='number'
                  name='batteryCapacity'
                  value={formData.batteryCapacity}
                  onChange={handleChange}
                  className='w-full bg-custom-dark-secondary text-white rounded-lg p-3'
                />
              </div>

              <div>
                <label className='block text-gray-400 mb-2'>
                  Tire Pressure (PSI)
                </label>
                <input
                  type='number'
                  name='tirePressure'
                  value={formData.tirePressure}
                  onChange={handleChange}
                  className='w-full bg-custom-dark-secondary text-white rounded-lg p-3'
                />
              </div>
            </div>

            <div>
              <label className='block text-gray-400 mb-2'>Color</label>
              <input
                type='text'
                name='color'
                value={formData.color}
                onChange={handleChange}
                className='w-full bg-custom-dark-secondary text-white rounded-lg p-3'
              />
            </div>

            <div>
              <label className='block text-gray-400 mb-2'>Owner Note</label>
              <textarea
                name='ownerNote'
                value={formData.ownerNote}
                onChange={handleChange}
                rows='3'
                className='w-full bg-custom-dark-secondary text-white rounded-lg p-3'
              />
            </div>

            <div>
              <label className='block text-gray-400 mb-2'>Insurance</label>
              <input
                type='text'
                name='insurance'
                value={formData.insurance}
                onChange={handleChange}
                className='w-full bg-custom-dark-secondary text-white rounded-lg p-3'
              />
            </div>
          </>
        )}

        <button
          type='submit'
          disabled={loading}
          className={`w-full rounded-lg p-4 text-center font-bold ${
            isLogin ? "bg-yellow-500" : "bg-green-600"
          } ${loading ? "opacity-50" : ""}`}
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Register Car"}
        </button>

        {message && (
          <div
            className={`p-3 rounded-lg text-center ${
              message.includes("uccess")
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CarRegistration;
