import React from "react";
import {
  AppBar,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { removeAccessToken } from "./features/access_token/accessTokenSlice";

import { makeStyles } from "@material-ui/core/styles";
import { removeUser, selectUser } from "./features/user/userSlice";

export const useStyles = makeStyles(() => ({
  linkDecoration: {
    textDecoration: "none",
  },
  whiteText: {
    color: "white",
  },
  inline: {
    display: "inline-block",
    margin: "0 5px",
  },
  swapTheme: {
    marginRight: "10px"
  }
}));

function Header({theme, icon, changeTheme}) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const classes = useStyles();

  const logout = () => {
    dispatch(removeAccessToken());
    dispatch(removeUser());
  };

  return (
    <AppBar position={"static"} component={"nav"} >
      <Container>
        <Toolbar>
          <Grid container justify={"space-between"}>
            <Link to={"/"} className={classes.linkDecoration}>
              <Typography variant={"h5"} className={classes.whiteText}>
                Workplace booking system
              </Typography>
            </Link>
            <div>
              <Tooltip title={`Change theme`}>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="mode"
                  onClick={changeTheme}
                  className={classes.swapTheme}
                >
                  {icon}
                </IconButton>
              </Tooltip>
            {!user ? (
              <>
                <Link to={"/SignIn"} className={classes.inline}>
                  <Button variant={"contained"}>Sign In</Button>
                </Link>
                <Link to={"/SignUp"} className={classes.inline}>
                  <Button variant={"contained"}>Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={"/profile"} className={classes.inline}>
                  <Button variant={"contained"}>
                    <AccountCircleIcon />
                    {user.username}
                  </Button>
                </Link>
                <Link to={"/SignIn"} className={classes.inline}>
                  <Button variant={"contained"} onClick={() => logout()}>
                    <ExitToAppIcon />
                    Log out
                  </Button>
                </Link>
              </>
            )}
            </div>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
