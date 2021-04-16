import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
    name: "profile",
    initialState: {
        value: null,
    },
    reducers: {
        setProfile: (state, action) => {
            state.value = action.payload;
        },
        changeMiddleName: (state, action) => {
            state.value.middle_name = action.payload;
        },
        changeEmail: (state, action) => {
            state.value.email = action.payload;
        },
        changeSkype: (state, action) => {
            state.value.skype = action.payload;
        },
        changeGender: (state, action) => {
            state.value.gender = action.payload;
        },
        changePhone: (state, action) => {
            state.value.phone = action.payload;
        },
        changePosition: (state, action) => {
            state.value.position = action.payload;
        },
        changeBirthday: (state, action) => {
            state.value.birthdate = action.payload;
        },
        removeProfile: (state) => {
            state.value = null;
        },
    },
});

export const { setProfile, changeEmail, changeMiddleName, changeSkype, changeGender, changePhone, changePosition, changeBirthday, removeProfile } = profileSlice.actions;

export const selectProfile = (state) => state.profile.value;

export default profileSlice.reducer;
