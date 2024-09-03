import PropTypes from 'prop-types';
import { Box, Unstable_Grid2 as Grid, useMediaQuery } from "@mui/material";

// TODO: Change subtitle text

export const Layout = (props) => {
  const { children } = props;
  const matches = useMediaQuery("(min-width:1200px)");

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: "1 1 auto",
      }}
    >
      <Grid container
sx={{ flex: "1 1 auto" }}>
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {children}
        </Grid>
        {matches && (
          <Grid
            xs={12}
            lg={6}
            sx={{
              alignItems: "center",
              background: "radial-gradient(50% 50% at 50% 50%, #222D32 0%, #222D32 100%)",
              color: "white",
              display: "flex",
              justifyContent: "center",
              "& img": {
                maxWidth: "100%",
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <img alt="logo"
src="/assets/logos/SmallLogo.png"
width={500} />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node
};