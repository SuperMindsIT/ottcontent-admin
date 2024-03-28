import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Sidebar />
      <Box sx={{ my: 18, mx: 11, width: "100%" }}>{outlet}</Box>
    </Box>
  );
};
