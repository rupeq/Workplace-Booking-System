import React, {useRef, useState} from "react";
import {
    Avatar,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@material-ui/core";
import {APIService} from "./service/APIService";
import {useStyles} from "./loginStyle";
import {useHistory} from "react-router";
import {fieldValidation} from "./office_building/workplaces/workplaceDetail";
import {ValidationService} from "./service/ValidationService";
import {inputFieldValidation} from "./SignIn";

function SignUp({openSnackbar}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const classes = useStyles();
    const history = useHistory();
    const usernameField = useRef();
    const passwordField = useRef();

    const handleChangeUsername = () => {
        setUsername(usernameField.current.value);
    };

    const handleChangePassword = () => {
        setPassword(passwordField.current.value);
    };

    const signUp = async () => {
        if (!inputFieldValidation(username, password, openSnackbar))
            return;

        try {
            await APIService.signUp(username, password).then(response => {
                if (response.username !== username) {
                    throw new Error("User exists");
                }
            });
            openSnackbar({
                open: true,
                message: "Successfully sign un!",
                type: "success",
            });
            history.push("/SignIn");
        } catch (e) {
            openSnackbar({
                open: true,
                message: "Such username already exist!",
                type: "error",
            });
        }
    };

    return (
        <Paper className={classes.root}>
            <Grid container direction={"column"}>
                <Typography variant={"h4"}>Sign Up</Typography>
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
                <Button onClick={() => signUp()} className={classes.button} onKeyPress={(key) => {}}>
                    Sign Up
                </Button>
            </Grid>
        </Paper>
    );
}

export default SignUp;
