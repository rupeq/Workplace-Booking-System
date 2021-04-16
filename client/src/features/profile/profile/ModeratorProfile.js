import {useDispatch, useSelector} from "react-redux";
import {selectProfile, changeMiddleName, changeEmail} from "../profileSlice";
import Typography from "@material-ui/core/Typography";
import {Button, CircularProgress, TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {useState} from "react";
import EditIcon from '@material-ui/icons/Edit';
import {APIService} from "../../../service/APIService";
import {selectAccessToken} from "../../access_token/accessTokenSlice";
import {selectUser} from "../../user/userSlice";
import {ValidationService} from "../../../service/ValidationService";
import ValidationError from "../../../errors/ValidationError";
import {fieldValidation} from "./Profile";
import {useStyles} from "./Profile";

const ModeratorProfile = ({openSnackbar}) => {
    const profile = useSelector(selectProfile);
    const [edit, setEdit] = useState(false);
    const user = useSelector(selectUser);
    const [middleName, setMiddleName] = useState('');
    const [email, setEmail] = useState('');
    const accessToken = useSelector(selectAccessToken);
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleEditChange = () => {
        setMiddleName(profile.middle_name);
        setEmail(profile.email);
        setEdit(!edit);
    };

    const updateModeratorProfile = async () => {
        try {
            if (ValidationService.validateMiddleName(middleName) && ValidationService.validateEmail(email)) {
                await APIService.updateModerator(accessToken, user.id, middleName, email);
                dispatch(changeMiddleName(middleName));
                dispatch(changeEmail(email));
                handleEditChange();
            }
        } catch (e) {
            if (e instanceof ValidationError) {
                openSnackbar({
                    open: true,
                    message: e.message,
                    type: "error",
                });
            }
        }
    };

    const handleChangeMiddleName = (e) => {
        setMiddleName(e.target.value);
    };

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    return (
        <Grid>
            {profile ? (
                    <Grid className={classes.profileContainer}>
                        {!edit ? (
                            <Grid container direction={"column"} alignItems={"flex-start"} className={classes.root}>
                                <Typography>Middle name: {profile.middle_name}</Typography>
                                <Typography>Email: {profile.email}</Typography>
                                <Button fullWidth={true} onClick={handleEditChange}>
                                    <EditIcon/>
                                    Edit
                                </Button>
                            </Grid>) : (
                            <Grid container direction={"column"} className={classes.root}>
                                <TextField label={"middle name"} onChange={handleChangeMiddleName}
                                           defaultValue={profile.middle_name} error={fieldValidation(middleName, ValidationService.validateMiddleName)}/>
                                <TextField label={"email"} onChange={handleChangeEmail} defaultValue={profile.email} error={fieldValidation(email, ValidationService.validateEmail)}/>
                                <Button onClick={() => updateModeratorProfile()}>Save</Button>
                                <Button onClick={handleEditChange}>Cancel</Button>
                            </Grid>
                        )}
                    </Grid>)

                : <CircularProgress/>}
        </Grid>
    );
};

export default ModeratorProfile;