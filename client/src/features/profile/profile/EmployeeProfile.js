import {useDispatch, useSelector} from "react-redux";
import {
    selectProfile,
    changeMiddleName,
    changeEmail,
    changeSkype,
    changeBirthday,
    changePhone,
    changePosition, changeGender
} from "../profileSlice";
import Typography from "@material-ui/core/Typography";
import {Button, CircularProgress, NativeSelect, TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {useState} from "react";
import EditIcon from '@material-ui/icons/Edit';
import {APIService} from "../../../service/APIService";
import {selectAccessToken} from "../../access_token/accessTokenSlice";
import {selectUser} from "../../user/userSlice";
import {ValidationService} from "../../../service/ValidationService";
import ValidationError from "../../../errors/ValidationError";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {fieldValidation} from "./Profile";
import {useStyles} from "./Profile";

const EmployeeProfile = ({openSnackbar}) => {
    const profile = useSelector(selectProfile);
    const [edit, setEdit] = useState(false);
    const user = useSelector(selectUser);
    const [middleName, setMiddleName] = useState('');
    const [email, setEmail] = useState('');
    const [skype, setSkype] = useState('');
    const [birthday, setBirthday] = useState('');
    const [position, setPosition] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const accessToken = useSelector(selectAccessToken);
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleEditChange = () => {
        setMiddleName(profile.middle_name);
        setEmail(profile.email);
        setSkype(profile.skype);
        setBirthday(profile.birthdate);
        setGender(profile.gender);
        setPhone(profile.phone);
        setPosition(profile.position);
        setEdit(!edit);
    };

    const updateEmployeeProfile = async () => {
        try {
            if (ValidationService.validateMiddleName(middleName) && ValidationService.validateEmail(email) && ValidationService.validateSkype(skype), ValidationService.validatePosition(position)) {
                await APIService.updateEmployee(accessToken, user.id, middleName, email, skype, birthday, phone, position, gender);
                dispatch(changeMiddleName(middleName));
                dispatch(changeEmail(email));
                dispatch(changeSkype(skype));
                dispatch(changeBirthday(birthday));
                dispatch(changePhone(phone));
                dispatch(changePosition(position));
                dispatch(changeGender(gender));
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

    const handleChangeSkype = (e) => {
        setSkype(e.target.value);
    };

    const handleChangeBirthday = (e) => {
        setBirthday(e.target.value);
    };

    const handleChangePosition = (e) => {
        setPosition(e.target.value);
    };

    const handleChangeGender = (e) => {
        setGender(e.target.value);
    };

    const handleChangePhone = (value) => {
        setPhone("+" + value);
    };

    return (
        <Grid>
            {profile ? (
                    <Grid className={classes.profileContainer}>
                        {!edit ? (
                            <Grid container direction={"column"} alignItems={"flex-start"} className={classes.root}>
                                <Typography>Middle name: {profile.middle_name}</Typography>
                                <Typography>Email: {profile.email}</Typography>
                                <Typography>Gender: {profile.gender}</Typography>
                                <Typography>Birthdate: {profile.birthdate}</Typography>
                                <Typography>Phone: {profile.phone}</Typography>
                                <Typography>Skype: {profile.skype}</Typography>
                                <Typography>Position: {profile.position}</Typography>
                                <Button fullWidth={true} onClick={handleEditChange}>
                                    <EditIcon/>
                                    Edit
                                </Button>
                            </Grid>) : (
                            <Grid container direction={"column"} className={classes.root}>
                                <TextField label={"middle name"} onChange={handleChangeMiddleName}
                                           defaultValue={profile.middle_name} error={fieldValidation(middleName, ValidationService.validateMiddleName)}/>
                                <TextField label={"email"} onChange={handleChangeEmail} defaultValue={profile.email} error={fieldValidation(email, ValidationService.validateEmail)}/>
                                <TextField
                                    id="date"
                                    label="birthdate"
                                    type="date"
                                    value={birthday}
                                    onChange={handleChangeBirthday}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        max: `${new Date().getFullYear()}-${new Date().getMonth().toString().padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`
                                    }}
                                />
                                <NativeSelect
                                    value={gender}
                                    onChange={handleChangeGender}
                                >
                                    <option value={'D'}>Default</option>
                                    <option value={'F'}>Female</option>
                                    <option value={'M'}>Male</option>
                                </NativeSelect>
                                <PhoneInput
                                    country={'by'}
                                    value={profile.phone}
                                    onChange={handleChangePhone}
                                />
                                <TextField label={"skype"} onChange={handleChangeSkype} defaultValue={profile.skype}  error={fieldValidation(skype, ValidationService.validateSkype)}/>
                                <TextField label={"position"} onChange={handleChangePosition}
                                           defaultValue={profile.position}  error={fieldValidation(position, ValidationService.validatePosition)}/>
                                <Button onClick={() => updateEmployeeProfile()}>Save</Button>
                                <Button onClick={handleEditChange}>Cancel</Button>
                            </Grid>
                        )}
                    </Grid>)

                : <CircularProgress/>}
        </Grid>
    );
};

export default EmployeeProfile;