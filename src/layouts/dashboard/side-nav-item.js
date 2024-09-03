import NextLink from "next/link";
import PropTypes from "prop-types";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import {
  Box,
  ButtonBase,
  SvgIcon,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Drawer,
} from "@mui/material";
import { useState } from "react";
import { usePathname } from "next/navigation";

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, subItems } = props;
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const handleSubItemClick = () => {
    setOpen(!open);
  };

  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  return (
    <li>
      <ButtonBase
        onClick={subItems && handleSubItemClick}
        sx={{
          alignItems: "center",
          borderRadius: 1,
          display: "flex",
          justifyContent: "flex-start",
          pl: "16px",
          pr: "16px",
          py: "6px",
          textAlign: "left",
          width: "100%",
          ...(active && {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          }),
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          },
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: "center",
              color: "neutral.400",
              display: "inline-flex",
              justifyContent: "center",
              mr: 2,
              ...(active && {
                color: "#ffffff",
              }),
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: "neutral.400",
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            textTransform:"capitalize",
            lineHeight: "24px",
            whiteSpace: "nowrap",
            ...(active && {
              color: "common.white",
            }),
            ...(disabled && {
              color: "neutral.500",
            }),
          }}
        >
          {title}
        </Box>
        {subItems && (
          <SvgIcon fontSize="extra-small">
            {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </SvgIcon>
        )}
      </ButtonBase>
      {subItems &&
        subItems
          // .filter((el) => el?.accessRole?.includes("owner"))
          .map((item, index) => {
            const subLinkProps = {
              component: NextLink,
              href: item.path,
            };

            const active = item.path ? pathname === item.path : false;

            return (
              <Collapse key={index}
in={open}
timeout="auto"
unmountOnExit>
                <List component="div"
disablePadding>
                  <ListItem {...subLinkProps}
button>
                    {item.icon && (
                      <Box
                        sx={{
                          alignItems: "center",
                          color: "neutral.400",
                          display: "inline-flex",
                          justifyContent: "center",
                          mx: 2,
                          ...(active && {
                            color: "primary.main",
                          }),
                        }}
                      >
                        {item.icon}
                      </Box>
                    )}
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          textTransform="capitalize"
                          style={
                            active ? { fontSize: "14px", fontWeight: 600 } : { fontSize: "14px" }
                          }
                        >
                          {item.title}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Collapse>
            );
          })}
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
};
