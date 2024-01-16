import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { AccountCircle, Fingerprint, InsertEmoticon } from "@material-ui/icons";
import {
  formatMessage,
  withModulesManager
} from "@openimis/fe-core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Divider,
  IconButton,
  MenuList,
  MenuItem,
  Popover
} from "@material-ui/core";


import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";

const PROFILE_MAIN_MENU_CONTRIBUTION_KEY = "profile.MainMenu";


const useStyles = makeStyles((theme) => ({
  menu: {
    margin: theme.spacing(2),
    color: theme.palette.secondary.main,
  },
}));

const ProfileToolbarContribution = (props) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const classes = useStyles();

  const   redirect = (route) => {
    historyPush(modulesManager, history, route);
  }

  const handleMenuSelect = (e, route) => {
        redirect(route);
  };

  let entries = [
      {
        text: formatMessage(props.intl, "profile", "menu.myProfile"),
        icon: <InsertEmoticon />,
        route: "/profile/myProfile",
      },
      {
        text: formatMessage(props.intl, "profile", "menu.changePassword"),
        icon: <Fingerprint />,
        route: "/profile/changePassword",
      },
    ];
    entries.push(
      ...props.modulesManager
        .getContribs(PROFILE_MAIN_MENU_CONTRIBUTION_KEY)
        .filter((c) => !c.filter || c.filter(rights))
    );


  return (
    <>
      <IconButton 
        className={classes.menu} 
        onClick={handleClick} // Here you trigger the click to open the menu
      >
        <AccountCircle />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuList>
          {entries.map((entry, idx) => (
            <div key={`${props.header}_${idx}_menuItem`}>
              <MenuItem onClick={(e) => {handleMenuSelect(e, entry.route); handleClose();}} component="a"  href={`${process.env.PUBLIC_URL || ""}${entry.route}`} passHref>
                <ListItemIcon>{entry.icon}</ListItemIcon>
                <ListItemText primary={entry.text}/>
              </MenuItem>
              {entry.withDivider && (
                <Divider
                  key={`${props.header}_${idx}_divider`}
                />
              )}
            </div>
          ))}
        </MenuList>
      </Popover>
    </>
  );
};

export default injectIntl(withModulesManager(ProfileToolbarContribution));
