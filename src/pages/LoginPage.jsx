import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import CustomTextField from "../components/CustomTextField";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { login } = useAuth();

  const onSubmit = async (values, setSubmitting, resetForm) => {
    if (
      values.username === "adminOttContent" &&
      values.password === "ottContent@123"
    ) {
      setSubmitting(true);
      await login(values.username);
      resetForm();
    } else {
      toast.error("Wrong Credentials");
    }
  };

  return (
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
            initialValues={{ username: "", password: "" }}
            onSubmit={(values, { setSubmitting, resetForm }) =>
              onSubmit(values, setSubmitting, resetForm)
            }
            validationSchema={Yup.object().shape({
              username: Yup.string().required("Required"),
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
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      errors.username && touched.username && errors.username
                    }
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
  );
};

export default LoginPage;
