import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { FormControlLabel, Switch, Box, Typography, Paper } from "@mui/material";

const Settings = () => {
    const { settings, toggleSetting, setSettings, faceCount } = useContext(AppContext);

    return (
        <Paper elevation={3} sx={{ padding: "1rem", }}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
                marginBottom={4}
            >
                <Typography variant="h6" sx={{ marginBottom: '10px' }} align="center">Settings</Typography>
                <Box
                    display="flex"
                    flexDirection="column"
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.cameraEnabled}
                                onChange={() => toggleSetting("cameraEnabled")}
                                color="primary"
                            />
                        }
                        label="Enable Camera"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.faceDetectionEnabled}
                                onChange={() => {
                                    const prevState = settings.faceDetectionEnabled
                                    toggleSetting("faceDetectionEnabled")
                                    if (prevState === true) {
                                        // means now user wants to disable face detection, so disable expression detection as well
                                        setSettings(prev => ({
                                            ...prev,
                                            expressionDetectionEnabled: false
                                        }))
                                    }
                                }}
                                color="primary"
                            />
                        }
                        label="Detect Faces"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.expressionDetectionEnabled}
                                onChange={() => toggleSetting("expressionDetectionEnabled")}
                                disabled={!settings.faceDetectionEnabled}
                                color="primary"
                            />
                        }
                        label="Detect Expression"
                    />

                    <Typography variant="h6" align="center" marginTop={2}>
                        Faces Detected: {faceCount}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default Settings;
