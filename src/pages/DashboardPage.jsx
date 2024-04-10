import { Box, Grid, Typography } from "@mui/material";
import useFitnessApi from "../api/useFitnessApi";
import useGamesApi from "../api/useGamesApi";
import useRecipesApi from "../api/useRecipesApi";
import useTonesApi from "../api/useTonesApi";
import useWallpapersApi from "../api/useWallpapersApi";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { data: fitnessData } = useFitnessApi();
  const { data: gamesData } = useGamesApi();
  const { data: recipesData } = useRecipesApi();
  const { data: tonesData } = useTonesApi();
  const { data: wallpapersData } = useWallpapersApi();

  const navigate = useNavigate();

  const boxes = [
    {
      icon: "",
      total: fitnessData?.length,
      label: "Fitness",
      navigateTo: "/fitness",
    },
    {
      icon: "",
      total: gamesData?.length,
      label: "Games",
      navigateTo: "/games",
    },
    {
      icon: "",
      total: recipesData?.length,
      label: "Recipes",
      navigateTo: "/recipes",
    },
    {
      icon: "",
      total: tonesData?.length,
      label: "Tones",
      navigateTo: "/tones",
    },
    {
      icon: "",
      total: wallpapersData?.length,
      label: "Wallpapers",
      navigateTo: "/wallpapers",
    },
  ];

  const handleNavigate = (routeName) => {
    navigate(routeName);
  };
  return (
    <Box>
      <Typography
        sx={{ fontSize: 24, fontWeight: 800, color: "white", mb: 8.4 }}
      >
        Dashboard
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12, lg: 16 }}
      >
        {boxes.map((item, index) => (
          <Grid item={item} xs={2} sm={3} md={4} key={index}>
            <Box
              sx={{
                border: 1,
                borderColor: "#2E2E2E",
                backgroundColor: "#1A1A1A",
                borderRadius: "16px",
                width: "auto",
                minWidth: "180px",
                maxWidth: "252px",
                height: "238px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => handleNavigate(item.navigateTo)}
            >
              <Box
                sx={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "#2C3238",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M19 3H18V2C18 1.45 17.55 1 17 1C16.45 1 16 1.45 16 2V3H8V2C8 1.45 7.55 1 7 1C6.45 1 6 1.45 6 2V3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM18 19H6C5.45 19 5 18.55 5 18V8H19V18C19 18.55 18.55 19 18 19Z"
                    fill="#0E8BFF"
                  />
                  <path
                    d="M8 10H16C16.55 10 17 10.45 17 11C17 11.55 16.55 12 16 12H8C7.45 12 7 11.55 7 11C7 10.45 7.45 10 8 10Z"
                    fill="#0E8BFF"
                    fillOpacity="0.4"
                  />
                  <path
                    d="M8 14H13C13.55 14 14 14.45 14 15C14 15.55 13.55 16 13 16H8C7.45 16 7 15.55 7 15C7 14.45 7.45 14 8 14Z"
                    fill="#0E8BFF"
                    fillOpacity="0.4"
                  />
                </svg>
              </Box>
              <Typography
                sx={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#148bfa",
                  my: 1,
                }}
              >
                {item.total}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#f3f3f3",
                  opacity: 0.72,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
