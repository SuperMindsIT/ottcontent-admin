import { Link, Navigate, useNavigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box, Popper, Fade, Paper } from "@mui/material";
import Sidebar from "../components/Sidebar";
import AccountLogo from "../assets/AccountLogo.svg";
import { useState } from "react";

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState();

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Navigate to login page after logout
    window.location.reload();
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Sidebar />
      <Box sx={{ my: 18, mx: 11, width: "100%" }}>
        <Box sx={{ position: "absolute", top: "6%", right: "7%" }}>
          <img
            src={AccountLogo}
            alt="AccountLogo"
            style={{ cursor: "pointer" }}
            onClick={handleClick("bottom-end")}
          />
        </Box>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper
                sx={{
                  backgroundColor: "#2C3238",
                  borderRadius: "12px",
                  px: 5,
                  py: 2,
                }}
              >
                <Link
                  style={{ textDecoration: "none", color: "#F3F3F3" }}
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </Paper>
            </Fade>
          )}
        </Popper>
        <div>{outlet}</div>
      </Box>
    </Box>
  );
};
