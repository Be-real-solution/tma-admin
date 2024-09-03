
import Head from 'next/head';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";

const Page = () => {
 const { lang } = useSelector((state) => state.localiztion);

 const { localization } = Content[lang];



  const matches = useMediaQuery("(min-width:1200px)");
  const auth = useAuth();
  
  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      login: Yup.string().max(50).min(5).required("Login is required"),
      password: Yup.string().max(50).min(5).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signIn(values.login, values.password);
        // router.push('/');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });


  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          {!matches && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img alt="logo"
src="/assets/logos/SmallLogo.png"
width={200} />
            </Box>
          )}
          <div>
            <Stack spacing={1}
sx={{ mb: 3 }}>
              <Typography variant="h4">{localization.login.title}</Typography>
            </Stack>

            <form noValidate
onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.login && formik.errors.login)}
                  fullWidth
                  helperText={formik.touched.login && formik.errors.login}
                  label={localization.login.title}
                  name="login"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.login}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label={localization.login.password}
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>

              {formik.errors.submit && (
                <Typography color="error"
sx={{ mt: 3 }}
variant="body2">
                  {formik.errors.submit && localization.login.wrongpasswor}
                </Typography>
              )}
              <Button fullWidth
size="large"
sx={{ mt: 3 }}
type="submit"
variant="contained">
                {localization.login.enter}
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
