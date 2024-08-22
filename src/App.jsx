import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCode, FaChrome, FaPlay, FaStop } from 'react-icons/fa'; // Import icons from react-icons
import './App.css';

const serverUrl = 'http://localhost:2354'; // Use localhost or your server IP

const iconMap = {
  'VS Code': <FaCode size={60} />,
  'Chrome': <FaChrome size={60} />,
  'Zoom': <FaPlay size={60} />, // Use appropriate icon
  'Postman': <FaStop size={60} /> // Use appropriate icon
};

function App() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        const response = await axios.get(`${serverUrl}/apps`);
        setApps(response.data);
      } catch (error) {
        console.error('Error fetching apps:', error);
      }
    }

    fetchApps();
  }, []);

  const launchApp = async (appName) => {
    setLoading(true);
    setCurrentApp(appName);
    try {
      await axios.post(`${serverUrl}/launch`, { appName });
    } catch (error) {
      console.error('Error launching app:', error);
    } finally {
      setLoading(false);
    }
  };

  const quitApp = async () => {
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/quit`, { appName: currentApp });
      setCurrentApp(null);
    } catch (error) {
      console.error('Error quitting app:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {loading && <div className="loading">Loading...</div>}
      {currentApp && <button onClick={quitApp} className="quit-button">Quit App</button>}
      <div className="app-container">
        <div className="app-list">
          {apps.map((app) => (
            <div
              key={app.name}
              className="app-icon"
              onClick={() => launchApp(app.name)}
            >
              {iconMap[app.name] || <FaStop size={60} />} {/* Default icon if not found */}
              <span className="app-name">{app.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
