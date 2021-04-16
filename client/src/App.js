import React, {useEffect, useState} from "react";
import "./App.css";
import Header from "./Header";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import {Container} from "@material-ui/core";
import OfficesView from "./office_building/officesView";
import {Error404} from "./error";
import "normalize.css/normalize.css";
import InformationalSnackbar from "./office_building/snackbar";
import Main from "./main";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "./features/user/userSlice";
import {
    removeAccessToken,
    selectAccessToken,
} from "./features/access_token/accessTokenSlice";
import {APIService} from "./service/APIService";
import NotificationList from "./notifications/notificationsList";
import BookingView from "./booking/bookingView";
import NotificationAlert from "./notifications/notificationAlert";
import _ from "lodash";
import Profile from "./features/profile/profile/Profile";
import { ThemeProvider } from "@material-ui/styles";
import {
  createMuiTheme
} from "@material-ui/core";
import CssBaseline from '@material-ui/core/CssBaseline';
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import AvailableWorkplacesList from "./office_building/workplaces/availableWorkplaces";

function App() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const [darkState, setDarkState] = useState(prefersDark);
    const palletType = darkState ? "dark" : "light";
    const icon = darkState ? <Brightness7Icon /> : <Brightness3Icon />;

    const darkTheme = createMuiTheme({
        palette: {
            type: palletType,
        }
    });

    const [snackbar, openSnackbar] = useState({
        open: false,
        type: "",
        message: "",
    });
    const [notification, setNotification] = useState(false);

    const accessToken = useSelector(selectAccessToken);
    const dispatch = useDispatch();

    const handleThemeChange = () => {
        setDarkState(!darkState);
    };

    const loadNotification = () => {
        APIService.getNotifications().then((response) => {
            if (typeof response.detail === "undefined") {
                let result = _.filter(response, function (obj) {
                    return !obj.is_checked && (new Date(obj.occurrence_time) <= new Date());
                });

                if (result.length !== 0) {
                    setNotification(true);
                }
            }
        });
    };

    useEffect(() => {
        async function tryGetCurrentUser() {
            if (accessToken)
                await APIService.getCurrentUser(accessToken).then((user) => {
                    if (typeof user.detail !== "undefined") {
                        throw new Error("Access token invalid");
                    }
                    dispatch(setUser(user));
                }).catch(() => {
                    dispatch(removeAccessToken());
                });
        }

        tryGetCurrentUser().then();
        loadNotification();
    }, [accessToken, dispatch]);

    return (
        <ThemeProvider theme={darkTheme}>
            <Router>
                <CssBaseline/>
                <div className="App">
                    <Header theme={darkTheme} changeTheme={handleThemeChange} icon={icon}/>
                    <main style={{margin: "20px 0", minHeight: "800px"}}>
                        <Container>
                            <Switch>
                                <Route exact path="/">
                                    <Main/>
                                </Route>
                                <Route path="/SignUp">
                                    <SignUp openSnackbar={openSnackbar}/>
                                </Route>
                                <Route path="/SignIn">
                                    <SignIn openSnackbar={openSnackbar}/>
                                </Route>
                                <Route path="/profile">
                                    <Profile openSnackbar={openSnackbar}/>
                                </Route>
                                <Route path="/available_workplaces">
                                    <AvailableWorkplacesList/>
                                </Route>
                                <Route path="/offices">
                                    <OfficesView openSnackbar={openSnackbar} snackbar={snackbar}/>
                                </Route>
                                <Route path="/notifications">
                                    <NotificationList openSnackbar={openSnackbar} />
                                </Route>
                                <Route path="/booking">
                                    <BookingView openSnackbar={openSnackbar} snackbar={snackbar}/>
                                </Route>
                                <Route path="*">
                                    <Error404/>
                                </Route>
                            </Switch>
                        </Container>
                    </main>
                    <InformationalSnackbar
                        snackbar={snackbar}
                        openSnackbar={openSnackbar}
                    />
                    <NotificationAlert notification={notification} setOpen={setNotification}/>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
