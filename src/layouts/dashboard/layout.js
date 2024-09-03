import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { withAuthGuard } from 'src/hocs/with-auth-guard';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import { useMediaQuery } from '@mui/material';
// const sideNavWidth = 0;



const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
});

export const Layout = withAuthGuard((props) => {
  const { children } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(lgUp ? true : false);
  const [sideNavWidth, setSideNavWidth] = useState(lgUp ? 230 : 0);

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft:  sideNavWidth,
    
  },
}));

  const handlePathnameChange = useCallback(
    () => {
    if (!lgUp) {
      if (openNav) {
        setSideNavWidth(0);
        setOpenNav(false);
      }
    }
    },
    [lgUp, openNav]
  );

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  return (
    <>
      <TopNav
        sideNavWidth={sideNavWidth}
        onNavOpen={() => {
          setOpenNav(!openNav);
          setSideNavWidth(openNav ? 0 : 230);
        }}
      />
      <SideNav
        sideNavWidth={sideNavWidth}
        onClose={() => {
          setOpenNav(false);
          setSideNavWidth(0);
        }}
        open={openNav}
      />
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
});
