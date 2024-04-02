import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { LoginLayout } from "./layouts/LoginLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import GamesPage from "./pages/games/GamesPage";
import AddGamesPage from "./pages/games/AddGamesPage";
import EditGamesPage from "./pages/games/EditGamesPage";
import TonesPage from "./pages/tones/TonesPage";
import AddTonesPage from "./pages/tones/AddTonesPage";
import EditTonesPage from "./pages/tones/EditTonesPage";
import WallpapersPage from "./pages/wallpapers/WallpapersPage";
import AddWallpapersPage from "./pages/wallpapers/AddWallpapersPage";
import EditWallpapersPage from "./pages/wallpapers/EditWallpapersPage";
import FitnessPage from "./pages/fitness/FitnessPage";
import AddFitnessPage from "./pages/fitness/AddFitnessPage";
import EditFitnessPage from "./pages/fitness/EditFitnessPage";

const defaultTheme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/tones" element={<TonesPage />} />
          <Route path="/wallpapers" element={<WallpapersPage />} />
          <Route path="/fitness" element={<FitnessPage />} />
          {/* add section */}
          <Route path="/games/add" element={<AddGamesPage />} />
          <Route path="/tones/add" element={<AddTonesPage />} />
          <Route path="/wallpapers/add" element={<AddWallpapersPage />} />
          <Route path="/fitness/add" element={<AddFitnessPage />} />
          {/* id section */}
          <Route path="/games/:gameId" element={<EditGamesPage />} />
          <Route path="/tones/:toneId" element={<EditTonesPage />} />
          <Route
            path="/wallpapers/:wallpaperId"
            element={<EditWallpapersPage />}
          />
          <Route path="/fitness/:fitnessId" element={<EditFitnessPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

App.propTypes = {};

export default App;
