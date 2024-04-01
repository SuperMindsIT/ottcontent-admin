import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { LoginLayout } from "./layouts/LoginLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import GamesPage from "./pages/games/GamesPage";
import TonesPage from "./pages/TonesPage";
import AddGamesPage from "./pages/games/AddGamesPage";
import AddTonesPage from "./pages/AddTonesPage";
import EditGamesPage from "./pages/games/EditGamesPage";
import EditTonesPage from "./pages/EditTonesPage";
import FitnessPage from "./pages/fitness/FitnessPage";
import AddFitnessPage from "./pages/fitness/AddFitnessPage";

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
          <Route path="/fitness" element={<FitnessPage />} />
          <Route path="/games/add" element={<AddGamesPage />} />
          <Route path="/tones/add" element={<AddTonesPage />} />
          <Route path="/fitness/add" element={<AddFitnessPage />} />
          <Route path="/games/:gameId" element={<EditGamesPage />} />
          <Route path="/tones/:toneId" element={<EditTonesPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

App.propTypes = {};

export default App;
