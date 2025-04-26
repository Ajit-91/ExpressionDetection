import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { FormControlLabel, Switch, Box } from "@mui/material";

const Settings = () => {
  const { settings, toggleSetting } = useContext(AppContext);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      marginBottom={4}
    >
      <FormControlLabel
        control={
          <Switch
            checked={settings.faceDetectionEnabled}
            onChange={() => toggleSetting("faceDetectionEnabled")}
            color="primary"
          />
        }
        label="Face Detection"
      />

      <FormControlLabel
        control={
          <Switch
            checked={settings.expressionDetectionEnabled}
            onChange={() => toggleSetting("expressionDetectionEnabled")}
            color="primary"
          />
        }
        label="Expression Detection"
      />
    </Box>
  );
};

export default Settings;
