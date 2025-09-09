import { WebAppProvider } from "@vkruglikov/react-telegram-web-app";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontScreen from "./components/FrontScreen";
import MapScreen from "./components/MapScreen";
import MyCar from "./components/MyCar";
import CarRegistration from "./components/CarRegistration";
import "./index.css";

function App() {
  return (
    <WebAppProvider>
      <Router>
        <div className='App bg-custom-dark min-h-screen'>
          <Routes>
            <Route path='/' element={<FrontScreen />} />
            <Route path='/map' element={<MapScreen />} />
            <Route path='/car' element={<MyCar />} />
            <Route path='/register' element={<CarRegistration />} />
          </Routes>
        </div>
      </Router>
    </WebAppProvider>
  );
}

export default App;
