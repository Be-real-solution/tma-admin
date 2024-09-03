import { useCallback } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Tab, Tabs, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { useDispatch, useSelector } from "react-redux";
import Content from "src/Localization/Content";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, user } = props;
  const router = useRouter();
  const auth = useAuth();
  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];

  const handleSignOut = useCallback(() => {
    onClose?.();
    auth.signOut();
    router.push("/auth/login");
  }, [onClose, auth, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">
          {user?.fullName}
        </Typography>
        <Typography color="text.secondary"
variant="body2">
  {user?.username}
          {/* {localization.sidebar[user?.role]} */}
        </Typography>
        {/* <Tabs
          value={props.lang}
          onChange={(event, e) => {
            dispatch(props.changeLanguage({ type: e }));
          }}
        >
          <Tab label="UZ"
            value={"uz"} />
          <Tab label="RU"
            value={"ru"} />
          <Tab label="EN"
            value={"en"} />
        </Tabs> */}
      </Box>

      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleSignOut}>{localization.sidebar.exit}</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
