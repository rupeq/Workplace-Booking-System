import React, {useRef, useState} from "react";
import {
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
    Avatar,
} from "@material-ui/core";
import {APIService} from "./service/APIService";
import {setAccessToken} from "./features/access_token/accessTokenSlice";
import {useDispatch} from "react-redux";
import {useStyles} from "./loginStyle";
import {setUser} from "./features/user/userSlice";
import {useHistory} from "react-router";
import {fieldValidation} from "./office_building/workplaces/workplaceDetail";
import {ValidationService} from "./service/ValidationService";
import ValidationError from "./errors/ValidationError";
import GoogleLogin from 'react-google-login';

export const inputFieldValidation = (username, password, openSnackbar) => {
    let valid = true;

    try {
          ValidationService.validateUsername(username);
          ValidationService.validatePassword(password);
    } catch (e) {
        if (e instanceof ValidationError) {
            openSnackbar({
                open: true,
                message: e.message,
                type: "error",
            });
            valid = false;
        }
    }

    return valid;
};

function SignIn({openSnackbar}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const classes = useStyles();
    const usernameField = useRef();
    const passwordField = useRef();
    const history = useHistory();
    
    const handleChangeUsername = () => {
        setUsername(usernameField.current.value);
    };

    const handleChangePassword = () => {
        setPassword(passwordField.current.value);
    };

    const signIn = async () => {
        if (!inputFieldValidation(username, password, openSnackbar))
            return;
        
        try {
            let accessToken = await APIService.signIn(username, password).then((data) => {
                return data.access;
            });

            if (typeof accessToken === "undefined") {
                throw new Error("Invalid data");
            }

            await APIService.getCurrentUser(accessToken).then((user) => {
                dispatch(setUser(user));
            });
            dispatch(setAccessToken(accessToken));
            history.push("/profile");
            openSnackbar({
                open: true,
                message: "Successfully sign in!",
                type: "success",
            });
        } catch (e) {
            openSnackbar({
                open: true,
                message: "Either the account does not exist or is inactive",
                type: "error",
            });
        }
    };

    const OAuth2SignIn = async (response) => {
        console.log(response);

        try {
            let accessToken = await APIService.OAuth2SignIn(response.tokenId).then((data) => {
                return data.tokens.access;
            });

            if (typeof accessToken === "undefined") {
                throw new Error("Invalid data");
            }

            await APIService.getCurrentUser(accessToken).then((user) => {
                dispatch(setUser(user));
            });
            dispatch(setAccessToken(accessToken));
            history.push("/profile");
            openSnackbar({
                open: true,
                message: "Successfully sign in!",
                type: "success",
            });
        } catch (e) {
            openSnackbar({
                open: true,
                message: "Either the account does not exist or is inactive",
                type: "error",
            });
        }
    };

    return (
        <Paper elevation={3} className={classes.root}>
            <Grid container direction={"column"}>
                <Typography variant={"h4"}>Sign In</Typography>
                <Avatar className={classes.avatar} id="avatar"/>
                <TextField
                    id="filled-basic"
                    inputRef={usernameField}
                    autoFocus={true}
                    onChange={handleChangeUsername}
                    error={fieldValidation(username, ValidationService.validateUsername)}
                    label="Username"
                    variant="filled"
                    className={classes.textField}
                />
                <TextField
                    id="filled-basic"
                    inputRef={passwordField}
                    onChange={handleChangePassword}
                    error={fieldValidation(password, ValidationService.validatePassword)}
                    label="Password"
                    type={"password"}
                    variant="filled"
                    className={classes.textField}
                />
                <Button onClick={() => signIn()} className={classes.button}>
                    Sign In
                </Button>
                <GoogleLogin
                    clientId="848433141960-ujih6lva7s2us3khg88sirtb5hp92qph.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={OAuth2SignIn}
                    onFailure={OAuth2SignIn}
                    cookiePolicy={'single_host_origin'}
                />
            </Grid>
        </Paper>
    );
}

export default SignIn;
