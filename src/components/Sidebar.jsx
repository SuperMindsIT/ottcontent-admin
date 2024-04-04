import { Link } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useLocation } from "react-router-dom";

const drawerWidth = 318;

const links = [
  {
    id: 1,
    label: "Dashboard",
    navigate: "/dashboard",
  },
  {
    id: 2,
    label: "Games",
    navigate: "/games",
  },
  {
    id: 3,
    label: "Tones",
    navigate: "/tones",
  },
  {
    id: 4,
    label: "Wallpapers",
    navigate: "/wallpapers",
  },
  {
    id: 5,
    label: "Fitness",
    navigate: "/fitness",
  },
  {
    id: 6,
    label: "Recipes",
    navigate: "/recipes",
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "30%",
            maxWidth: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1A1A1A",
            borderRight: "1px solid rgba(0, 0, 0, 0.24)",
            p: 6,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Link
          sx={{
            textDecoration: "none",
            fontSize: 40,
            fontWeight: 900,
            color: "#148bfa",
            mb: 5,
          }}
        >
          Ott<span style={{ color: "#ECEBF8" }}>Content</span>
        </Link>
        <List>
          {links.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.navigate}
                selected={
                  location.pathname === item.navigate ||
                  location.pathname.startsWith(item.navigate)
                }
                sx={{
                  backgroundColor:
                    location.pathname === item.navigate ||
                    location.pathname.startsWith(item.navigate)
                      ? "rgba(14, 139, 255, 0.12)"
                      : "transparent",
                  borderRadius:
                    location.pathname === item.navigate ||
                    location.pathname.startsWith(item.navigate)
                      ? "8px"
                      : "0px",
                }}
              >
                <ListItemText
                  sx={{
                    color:
                      location.pathname === item.navigate ||
                      location.pathname.startsWith(item.navigate)
                        ? "#148bfa"
                        : "#fff",
                    "& .MuiTypography-root": {
                      fontWeight: 800,
                    },
                  }}
                  primary={item.label}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
