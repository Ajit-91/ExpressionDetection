import { Grid, Container, Typography } from "@mui/material";
import Camera from './components/Camera';
import Settings from './components/Settings';
import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "./models";

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setLoading(false)
    };

    loadModels();
  }, []);

  return (
    <>
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        {loading ? <h1 style={{marginTop: '50px', textAlign: 'center'}}>Loading....</h1> : (
          <>
            <Typography variant="h4" align="center" gutterBottom>
              Expression Detection App
            </Typography>

            <Grid container spacing={4}>
              {/* Camera Section */}
              <Grid size={{ xs: 12, lg: 8 }} >
                <Camera />
              </Grid>

              {/* Settings Section */}
              <Grid size={{ xs: 12, lg: 4 }} >
                <Settings />
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  )
}

export default App
