import { Grid, Container, Typography } from "@mui/material";
// import './App.css'
import Camera from './components/Camera';
import Settings from './components/Settings';

function App() {

  return (
    <>
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
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
      </Container>
    </>
  )
}

export default App
