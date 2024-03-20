import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import CustomTextField from "./components/CustomTextField";
import PropTypes from "prop-types";

const defaultTheme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#1A1A1A",
              borderRadius: "30px",
              border: "1px",
              borderColor: "#2C2C2C",
              padding: "37px 67px 73px 67px",
              "@media (max-width: 600px)": {
                padding: "30px 30px 50px 30px",
              },
            }}
          >
            <Typography
              sx={{
                color: "#148bfa",
                fontWeight: 900,
                fontSize: 40,
                mb: 3,
              }}
              textAlign="center"
            >
              Ott<span style={{ color: "white" }}>Content (Admin)</span>
            </Typography>
            <Typography sx={{ mb: 1, fontSize: 22, fontWeight: 600 }}>
              Sign In
            </Typography>
            <Typography sx={{ mb: 2, fontSize: 12, opacity: 0.7 }}>
              Enter your details below
            </Typography>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={(values, { setSubmitting }) => {
                alert(JSON.stringify(values));
                setSubmitting(true);
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email().required("Required"),
                password: Yup.string().required("Required"),
              })}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <CustomTextField
                      type="email"
                      name="email"
                      placeholder="Username"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={errors.email && touched.email && errors.email}
                    />
                    <CustomTextField
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.password && touched.password && errors.password
                      }
                    />
                    <FormControlLabel
                      sx={{ marginTop: -1 }}
                      control={<Checkbox value="remember" color="primary" />}
                      label="Remember me"
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isSubmitting}
                      sx={{
                        mt: 1,
                        backgroundColor: "#148bfa",
                        py: 2,
                        borderRadius: "68px",
                        fontSize: 18,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "white",
                      }}
                    >
                      login
                    </Button>
                  </form>
                );
              }}
            </Formik>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

App.propTypes = {
  values: PropTypes.object.isRequired,
  touched: PropTypes.object,
  errors: PropTypes.object,
  isSubmitting: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default App;
