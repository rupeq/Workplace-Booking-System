import React from "react";
import DirectorProfile from "./DirectorProfile";
import {useDispatch, useSelector} from "react-redux";
import {removeAccessToken, selectAccessToken} from "../../access_token/accessTokenSlice";
import {APIService} from "../../../service/APIService";
import {setProfile} from "../profileSlice";
import Grid from "@material-ui/core/Grid";
import {Paper, Typography} from "@material-ui/core";
import User from "../../user/User";
import {selectUser} from "../../user/userSlice";
import ModeratorProfile from "./ModeratorProfile";
import PlatformAdministratorProfile from "./PlatformAdministratorProfile";
import EmployeeSupervisorProfile from "./EmployeeSupervisorProfile";
import WarehouseManagerProfile from "./WarehouseManagerProfile";
import EmployeeProfile from "./EmployeeProfile";
import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
  profileContainer: {
      width: "400px",
      margin: "auto"
  },
  root: {
    "& > div, p": {
        marginBottom: "20px"
    }
  },
}));

export const fieldValidation = (value, validator) => {
    try {
        return !validator(value);
    } catch (e) {
        return true;
    }
};

const Profile = ({openSnackbar}) => {
    const user = useSelector(selectUser);
    const accessToken = useSelector(selectAccessToken);
    const dispatch = useDispatch();

    const renderProfileComponent = () => {
        APIService.getProfile(accessToken).then((profile) => {
            dispatch(setProfile(profile));
        }).catch(() => {
            dispatch(removeAccessToken());
        });
        switch (user.user_role) {
            case 'DR':
                return <DirectorProfile openSnackbar={openSnackbar}/>;
            case 'PA':
                return <PlatformAdministratorProfile openSnackbar={openSnackbar}/>;
            case 'MO':
                return <ModeratorProfile openSnackbar={openSnackbar}/>;
            case 'ES':
                return <EmployeeSupervisorProfile openSnackbar={openSnackbar}/>;
            case 'WM':
                return <WarehouseManagerProfile openSnackbar={openSnackbar}/>;
            case 'EM':
                return <EmployeeProfile openSnackbar={openSnackbar}/>;
            default:
                return;
        }
    };

    return (
        <Paper style={{padding: "30px"}}>
            {user ? (
                <Grid container direction={"column"}>
                    <User/>

                    {renderProfileComponent()}
                </Grid>
            ) : (
                <Typography variant={"h2"}>You need to log in</Typography>
            )}
        </Paper>
    );
};

export default Profile;