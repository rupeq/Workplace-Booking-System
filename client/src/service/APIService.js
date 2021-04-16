const axios = require("axios").default;


export class APIService {

    static #HOST = process.env.HOST || "0.0.0.0";
    static #PORT = process.env.PORT || 8000;

    static #getHeaders = (accessToken = null) => {
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };
        if (accessToken)
            headers.Authorization = `Bearer ${accessToken}`;
        return headers;
    };

    static #send_request = (method, url, {data, accessToken} = {}) => {
        let headers = this.#getHeaders(accessToken);
        return axios(
            {
                baseURL: `http://${this.#HOST}:${this.#PORT}`,
                method: method,
                url: url,
                data: data,
                headers: headers
            }
        ).then(response => {
                return response.data;
            },
        ).catch(error => {
            return error.response.data;
        });
    };

    static #send_request_with_token = (method, url, {data} = {}) => {
        const token = localStorage.getItem("accessToken");

        return this.#send_request(method, url, {
            accessToken: token,
            data: data
        });
    };

    static signUp = (username, password) => {
        return this.#send_request(
            'POST',
            '/api/v1/users/',
            {
                data: {
                    username: username,
                    password: password,
                },
            }
        );
    };

    static signIn = async (username, password) => {
        return await this.#send_request(
            'POST',
            '/api/token/',
            {
                data: {
                    username: username,
                    password: password,
                },
            }
        );
    };

    static getCurrentUser = (accessToken) => {
        return this.#send_request(
            'GET',
            '/api/v1/users/current_user/',
            {
                accessToken: accessToken,
            }
        );
    };

    static getStatistic = (username, date_start, date_end) => {
		if (username) {
            return this.#send_request_with_token("GET", `api/v1/booking/statistics/?user_stat=${username}&date_start=${date_start}&date_end=${date_end}`);
		} else {
			return this.#send_request_with_token("GET", `api/v1/booking/statistics/?date_start=${date_start}&date_end=${date_end}`);
		}
    }

    static getFreeWorkplaces = (date_start, date_end) => {
        return this.#send_request_with_token("GET", `api/v1/booking/free_workplaces/?date_start=${date_start}&date_end=${date_end}`);
    }

    static getAvailableWorkplaces = () => {
        return this.#send_request_with_token("GET", `api/v1/useroffices/available_workplaces/`);
    }

    static getProfile = (accessToken) => {
        return this.#send_request(
            'GET',
            '/api/v1/users/user_profile/',
            {
                accessToken: accessToken,
            }
        );
    };

    static updateDirector = (accessToken, id, middleName) => {
        return this.#send_request(
            'PUT',
            `/api/v1/directors/${id}/`,
            {
                accessToken: accessToken,
                data: {
                    middle_name: middleName,
                }
            }
        );
    };

    static updatePlatformAdministrator = (accessToken, id, middleName, email) => {
        return this.#send_request(
            'PUT',
            `/api/v1/administrators/${id}/`,
            {
                accessToken: accessToken,
                data: {
                    middle_name: middleName,
                    email: email,
                }
            }
        );
    };

    static updateModerator = (accessToken, id, middleName, email) => {
        return this.#send_request(
            'PUT',
            `/api/v1/moderators/${id}/`,
            {
                accessToken: accessToken,
                data: {
                    middle_name: middleName,
                    email: email,
                }
            }
        );
    };

    static updateEmployeeSupervisor = (accessToken, id, middleName, email, skype, birthdate, phone, position, gender) => {
        return this.#send_request(
            'PUT',
            `/api/v1/supervisors/${id}/`,
            {
                accessToken: accessToken,
                data: {
                    middle_name: middleName,
                    email: email,
                    skype: skype,
                    birthdate: birthdate,
                    position: position,
                    gender: gender,
                    phone: phone,
                }
            }
        );
    };

    static updateEmployee = (accessToken, id, middleName, email, skype, birthdate, phone, position, gender) => {
        return this.#send_request(
            'PUT',
            `/api/v1/employees/${id}/`,
            {
                accessToken: accessToken,
                data: {
                    middle_name: middleName,
                    email: email,
                    skype: skype,
                    birthdate: birthdate,
                    position: position,
                    gender: gender,
                    phone: phone,
                }
            }
        );
    };

    static updateWarehouseManager = (accessToken, id, middleName) => {
        return this.#send_request(
            'PUT',
            `/api/v1/managers/${id}/`,
            {
                accessToken: accessToken,
                data: {
                    middle_name: middleName,
                }
            }
        );
    };

    static getBookingInformation = () => {
        return this.#send_request_with_token("GET", "api/v1/booking/");
    };

    static getBookInformation = (booking_id) => {
        return this.#send_request_with_token("GET", "api/v1/booking/" + booking_id + "/");
    };

    static updateBookInformation = (booking_id, body) => {
        return this.#send_request_with_token("PUT", "api/v1/booking/" + booking_id + "/",
            {
                data: body
            });
    };

    static createBooking = (body) => {
        return this.#send_request_with_token("POST", "api/v1/booking/",
            {
                data: body
            });
    };

    static deleteBooking = (booking_id, body) => {
        return this.#send_request_with_token(
            "DELETE",
            `api/v1/booking/${booking_id}/`,
            {
                data: body
            }
        );
    };

    static getOfficeBuildings = () => {
        return this.#send_request_with_token(
            'GET',
            'api/v1/offices'
        );
    };

    static getOfficeBuilding = (officeId) => {
        return this.#send_request_with_token(
            'GET',
            `api/v1/offices/${officeId}/`
        );
    };

    static updateOfficeBuilding = (officeId, body) => {
        return this.#send_request_with_token(
            'PUT',
            `api/v1/offices/${officeId}/`,
            {
                data: body
            }
        );
    };

    static createOfficeBuilding = (body) => {
        return this.#send_request_with_token(
            'POST',
            `api/v1/offices/`,
            {
                data: body
            }
        );
    };

    static deleteOfficeBuilding = (officeId) => {
        return this.#send_request_with_token(
            'DELETE',
            `api/v1/offices/${officeId}/`
        );
    };

    static updateOfficeState = (officeId, body) => {
        return this.updateOfficeBuilding(officeId, body);
    };

    static getOfficeRooms = (officeId) => {
        return this.#send_request_with_token(
            'GET',
            `api/v1/offices/${officeId}/rooms/`
        );
    };

    static createOfficeRoom = (officeId, body) => {
        return this.#send_request_with_token(
            'POST',
            `api/v1/offices/${officeId}/rooms/`,
            {
                data: body
            }
        );
    };

    static updateOfficeRoom = (officeId, roomId, body) => {
        return this.#send_request_with_token(
            'PUT',
            `api/v1/offices/${officeId}/rooms/${roomId}/`,
            {
                data: body
            }
        );
    };

    static deleteOfficeRoom = (officeId, roomId) => {
        return this.#send_request_with_token(
            'DELETE',
            `api/v1/offices/${officeId}/rooms/${roomId}/`
        );
    };

    static updateRoomState = (officeId, roomId, body) => {
        return this.#send_request_with_token(
            'PATCH',
            `api/v1/offices/${officeId}/rooms/${roomId}/`,
            {
                data: body
            }
        );
    };

    static getOfficeRoom = (officeId, roomId) => {
        return this.#send_request_with_token(
            'GET',
            `api/v1/offices/${officeId}/rooms/${roomId}/`
        );
    };

    static getWorkplaces = (officeId, roomId) => {
        return this.#send_request_with_token(
            'GET',
            `api/v1/offices/${officeId}/rooms/${roomId}/workplaces/`
        );
    };

    static getWorkplace = (officeId, roomId, workplaceId) => {
        return this.#send_request_with_token(
            'GET',
            `api/v1/offices/${officeId}/rooms/${roomId}/workplaces/${workplaceId}/`
        );
    };

    static createWorkplace = (officeId, roomId, body) => {
        return this.#send_request_with_token(
            'POST',
            `api/v1/offices/${officeId}/rooms/${roomId}/workplaces/`,
            {
                data: body
            }
        );
    };

    static updateWorkplace = (officeId, roomId, workplaceId, body) => {
        return this.#send_request_with_token(
            'PUT',
            `api/v1/offices/${officeId}/rooms/${roomId}/workplaces/${workplaceId}/`,
            {
                data: body
            }
        );
    };

    static deleteWorkplace = (officeId, roomId, workplaceId) => {
        return this.#send_request_with_token(
            'DELETE',
            `api/v1/offices/${officeId}/rooms/${roomId}/workplaces/${workplaceId}/`
        );
    };

    static updateWorkplaceState = (officeId, roomId, workplaceId, body) => {
        return this.#send_request_with_token(
            'PATCH',
            `api/v1/offices/${officeId}/rooms/${roomId}/workplaces/${workplaceId}/`,
            {
                data: body
            }
        );
    };

    static getEquipment = (equipment, officeId) => {
        return this.#send_request_with_token(
            'GET',
            `api/v1/offices/${officeId}/${equipment}/`
        );
    };

    static getEquipmentItem = (equipment, officeId, equipmentId) => {
        return this.#send_request_with_token(
            'GET',
            `api/v1/offices/${officeId}/${equipment}/${equipmentId}/`
        );
    };

    static createEquipmentItem = (equipment, officeId, body) => {
        return this.#send_request_with_token(
            'POST',
            `api/v1/offices/${officeId}/${equipment}/`,
            {
                data: body
            }
        );
    };

    static updateEquipmentItem = (equipment, officeId, equipmentId, body) => {
        return this.#send_request_with_token(
            'PUT',
            `api/v1/offices/${officeId}/${equipment}/${equipmentId}/`,
            {
                data: body
            }
        );
    };

    static deleteEquipmentItem = (equipment, officeId, equipmentId) => {
        return this.#send_request_with_token(
            'DELETE',
            `api/v1/offices/${officeId}/${equipment}/${equipmentId}/`
        );
    };

    static updateEquipmentItemWorkplace = (equipment, officeId, equipmentId, body) => {
        return this.#send_request_with_token(
            'PATCH',
            `api/v1/offices/${officeId}/${equipment}/${equipmentId}/`,
            {
                data: body
            }
        );
    };

    static getNotifications = () => {
        return this.#send_request_with_token(
            'GET',
            `api/v1/notifications/`
        );
    };

    static deleteNotifications = (notificationId) => {
        return this.#send_request_with_token(
            'DELETE',
            `api/v1/notifications/${notificationId}/`
        );
    };

    static updateNotificationStatus = (notification_id, body) => {
        return this.#send_request_with_token(
            'PATCH',
            `api/v1/notifications/${notification_id}/`,
            {
                data: body
            }
        );
    };

    static OAuth2SignIn = (authToken) => {
        return this.#send_request(
            'POST',
            'api/v1/google/',
            {
                data: {
                    auth_token: authToken,
                },
            }
        );
    };
}