import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Sidebar />
      <Box sx={{ my: 17, mx: 11 }}>{outlet}</Box>
    </Box>
  );
};
