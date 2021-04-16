import React from "react";
import {useSelector} from "react-redux";
import {selectUser} from "./userSlice";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";

function roleMapping(role) {
    const roles = {
      "DR": "Director",
      "PA": "Platform administrator",
      "MO": "Moderator",
      "EM": "Employee",
      "ES": "Employee supervisor",
      "WM": "Warehouse manager",
    };

    return roles[role];
}

function User() {
    const user = useSelector(selectUser);

    return (
        <Grid container direction={"column"} style={{marginBottom: "30px"}}>
            <Typography
                variant={"h2"}
                style={{textTransform: "uppercase", margin: "auto"}}
            >
                {user.username}
            </Typography>
            <Typography variant="h6">{roleMapping(user.user_role)}</Typography>
        </Grid>
    );
}

export default User;
