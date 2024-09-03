import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { Scrollbar } from "src/components/scrollbar";
import { Items } from "./config";
import { SideNavItem } from "./side-nav-item";

export const SideNav = (props) => {
  const { open, onClose, sideNavWidth } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box     component={NextLink}
            href="/"
sx={{ p: 3, display:"flex", height:"63px", alignItems:"center", gap:"10px", backgroundColor:"#367fa9", color:"#fff", textDecoration:"none" }}>
          <Box
         
            sx={{
              display: "inline-flex",
              overflow: "hidden",
            }}
          >
            <img alt="logo"
src="/assets/logos/SmallLogo.png"
width={50}
height={50}
/> 
          </Box>
<h3>TMA</h3>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 4.6,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {Items &&
              Items()    
            ?.map((item) => {
                  const active =
                    item.subItems && "/"+pathname.split("/")[1] == item.path
                      ? true
                      : pathname === item.path
                      ? true
                      : false;

                  return (
                    <SideNavItem
                      active={active}
                      disabled={item.disabled}
                      external={item.external}
                      icon={item.icon}
                      key={item.title}
                      path={item.subItems ? null : item.path}
                      subItems={item.subItems}
                      title={item.title}
                    />
                  );
                })}
          </Stack>
        </Box>
      </Box>
    </Scrollbar>
  );

  // if (lgUp) {
  //   return (
  //     <Drawer
  //       anchor="left"
  //       open
  //       PaperProps={{
  //         sx: {
  //           backgroundColor: 'neutral.800',
  //           color: 'common.white',
  //           width: 280
  //         }
  //       }}
  //       variant="permanent"
  //     >
  //       {content}
  //     </Drawer>
  //   );
  // }

  return (
    <Drawer
      anchor="left"
      onClose={!lgUp && onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "#222D32",
          color: "#ffffff",
          width: sideNavWidth,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant={lgUp ? "persistent" : "temporary"}
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
