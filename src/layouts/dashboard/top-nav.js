import PropTypes from 'prop-types';
import BellIcon from '@heroicons/react/24/solid/BellIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Select,
  MenuItem,
  Tooltip,
  useMediaQuery
} from '@mui/material';

import { usePopover } from 'src/hooks/use-popover';
import { AccountPopover } from './account-popover';
import { useAuth } from "src/hooks/use-auth";
import { useSelector, useDispatch } from "react-redux";
import { changeLanguage } from "src/slices/localizationReducer";
import Content from "src/Localization/Content";



const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const { onNavOpen, sideNavWidth} = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const accountPopover = usePopover();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const { lang } = useSelector((state) => state.localiztion);

 const { localization } = Content[lang];


  return (
    <>
      <Box
        component="header"
        sx={{
          borderBottom: "1px solid #f9f0f0",
          backgroundColor: "rgb(60, 141, 188)",
          color:"#ffffff",
          position: "sticky",
          left: {
            lg: `${sideNavWidth}px`,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${sideNavWidth}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2,
          }}
        >
          <Stack alignItems="center"
direction="row"
spacing={2}>
            {/* {!lgUp && ( */}
            <IconButton onClick={onNavOpen}>
              <SvgIcon fontSize="small">
                <Bars3Icon  color='#fff'/>
              </SvgIcon>
            </IconButton>
            {/* )} */}
          </Stack>
          <Stack alignItems="center"
direction="row"
spacing={2}>
            {/* <Tooltip title="Contacts">
              <IconButton>
                <SvgIcon fontSize="small">
                  <UsersIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton>
                <Badge badgeContent={4} color="success" variant="dot">
                  <SvgIcon fontSize="small">
                    <BellIcon />
                  </SvgIcon>
                </Badge>
              </IconButton>
            </Tooltip> */}
            <Select 

              sx={{height:40, color:"#ffffff"}}
              value={lang}
            onChange={(e) => { dispatch(changeLanguage({ type: e.target.value }))}}>
              <MenuItem value="uz">UZ</MenuItem>
              <MenuItem value="ru">RU</MenuItem>
              <MenuItem value="en">EN</MenuItem>
            </Select>
            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              sx={{
                cursor: "pointer",
                height: 35,
                width: 35,
                bgcolor:"#cccfff"
              }}
              src="/assets/logos/ic_man.svg"
            />
          </Stack>
        </Stack>
      </Box>
      <AccountPopover
        lang={lang}
        changeLanguage={changeLanguage}
        user={user}
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func
};
