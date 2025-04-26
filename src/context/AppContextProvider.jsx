import React, {  useState } from "react";
import AppContext from "./AppContext";

const AppContextProvider = ({ children }) => {
  const [faceCount, setFaceCount] = useState(0);

  const [settings, setSettings] = useState({
    cameraEnabled: true,
    faceDetectionEnabled: true,
    expressionDetectionEnabled: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <AppContext.Provider 
      value={{ 
        settings, 
        toggleSetting, 
        setSettings,
        faceCount,
        setFaceCount 
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider
