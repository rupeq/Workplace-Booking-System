import ValidationError from "../errors/ValidationError";

export class ValidationService {
    static validateMiddleName = (middleName) => {
        if (!middleName.match(/^[a-zA-ZА-Яа-я]{1,50}$/))
            throw new ValidationError("Invalid middle name");
        return true;
    };

    static validatePosition = (position) => {
        if (!position.match(/^[a-zA-ZА-Яа-я0-9]{1,50}$/))
            throw new ValidationError("Invalid position");
        return true;
    };

    static validateSkype = (skype) => {
        if (!skype.match(/^[a-zA-Z][a-zA-Z0-9/.,/-_]{5,31}$/))
            throw new ValidationError("Invalid skype");
        return true;
    };

    static validateUsername = (username) => {
        if (!username.match(/^[a-zA-Z0-9_]{1,32}$/))
            throw new ValidationError("Invalid username");
        return true;
    };

    static validatePassword = (password) => {
        if (!password.match(/^[a-zA-Z0-9_а-яА-Я,./:?!@#$%^&*()+=]{1,64}$/))
            throw new ValidationError("Invalid password");
        return true;
    };

    static validateEmail = (email) => {
        if (email.length > 50 || !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
            throw new ValidationError("Invalid email");
        return true;
    };

    static validateInventoryNumber = (inventoryNumber) => {
        if (!inventoryNumber.match(/^[a-zA-ZА-Яа-я0-9-]{1,20}$/))
            throw new ValidationError("Invalid inventory number");
        return true;
    };

    static validateIndoorLocation = (indoorLocation) => {
        if (!indoorLocation.match(/^[a-zA-ZА-Яа-я0-9., ]{1,30}$/))
            throw new ValidationError("Invalid indoor location");
        return true;
    };

    static validateUniqueNumber = (uniqueNumber) => {
        if (!uniqueNumber.match(/^[a-zA-ZА-Яа-я0-9]{4,6}$/))
            throw new ValidationError("Unique number must be from 4 to 6 letters or numbers");
        return true;
    };

    static validateRoomType = (roomType) => {
        if (!roomType.match(/^[a-zA-ZА-Яа-я ]{4,20}$/))
            throw new ValidationError("Invalid room type");
        return true;
    };

    static validateInteger = (integer) => {
        if (!integer.toString().match(/^[0-9]{1,10}$/))
            throw new ValidationError("Invalid number");
        return true;
    };

    static validateFloatNumber = (floatNumber) => {
        if (!floatNumber.toString().match(/^[0-9]{1,10}\.?[0-9]{1,2}$/))
            throw new ValidationError("Invalid floating point number");
        return true;
    };

    static validateOfficeName = (officeName) => {
        if (!officeName.match(/^[a-zA-ZА-Яа-я0-9., ]{1,30}$/))
            throw new ValidationError("Invalid office name");
        return true;
    };

    static validateName = (name) => {
        if (!name.match(/^[a-zA-ZА-Яа-я-]{1,30}$/))
            throw new ValidationError(`Invalid name`);
        return true;
    };

    static validateAddress = (address) => {
        if (!address.match(/^[a-zA-ZА-Яа-я0-9.,/' -]{1,30}$/))
            throw new ValidationError("Invalid address");
        return true;
    };

    static validateReason = (reason) => {
        if (!reason.match(/^[a-zA-ZА-Яа-я0-9 -.,?!]{0,50}$/))
            throw new ValidationError(`Invalid name`);
        return true;
    };
}