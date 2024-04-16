import axios from "axios";
import { Base_URL } from '../config/index';
import { authConstant as type } from '../constants/index';

export const LoginByEmail = (body) => {
    let url = `${Base_URL}login`
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: `${Base_URL}login`,
            method: 'POST',
            data: body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d"
            }
        }).then(res => {
            // console.log('hhhh', res);
            dispatch({
                type: type.FETCH_LOGIN_BY_EMAIL_FULFILLED,
                payload: res
            })
            return res
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_LOGIN_BY_EMAIL_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const SignupByEmail = (body) => {
    let url = `${Base_URL}register`
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            data: body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d"
            }
        }).then(res => {
            // console.log('Register by email', res);
            dispatch({
                type: type.FETCH_SIGNUP_BY_EMAIL_FULFILLED,
                payload: res
            })
            return res
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SIGNUP_BY_EMAIL_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const LoginByOtp = (body, auth) => {
    let authType = auth;
    // let apiUrl = authType == "login" ? `${Base_URL}firebase-login` : `${Base_URL}firebase-signup`
    let apiUrl =`${Base_URL}firebase-login`
    // console.log('base',apiUrl);
    return (dispatch) => {
        return axios({
            url: apiUrl,
            method: 'POST',
            data: body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d"
            }
        }).then(res => {
            // console.log('otp login res', res);
            dispatch({
                type: type.FETCH_LOGIN_BY_OTP_FULFILLED,
                payload: res
            })
            return res
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_LOGIN_BY_OTP_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const SignupByOtp = (body) => {
    let apiUrl = `${Base_URL}firebase-signup`
    // console.log('base', apiUrl);
    return (dispatch) => {
        return axios({
            url: apiUrl,
            method: 'POST',
            data: body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d"
            }
        }).then(res => {
            // console.log('otp signup res', res);
            dispatch({
                type: type.FETCH_SIGNUP_BY_OTP_FULFILLED,
                payload: res
            })
            return res
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SIGNUP_BY_OTP_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

// export const LoginByGoogle = (body) => {
//     console.log('fareeed',body)
//     // console.log("google api called to save data")
//     let apiUrl = `${Base_URL}google-login`
//     return (dispatch) => {
//         return axios({
//             url: apiUrl,
//             method: 'POST',
//             data: body,
//             headers: {
//                 "Accept": "application/json",
//                 "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
//                 // "Content-Type":"application/x-www-form-urlencoded",
//                 "Content-Type":'multipart/form-data',
                
//             }
//         }).then(res => {
//             console.log('Google login res-->>>==============', res);
//             dispatch({
//                 type: type.FETCH_LOGIN_BY_GOOGLE_FULFILLED,
//                 payload: res
//             })
//             return res
//         })
//             .catch((err) => {
//                 dispatch({
//                     type: type.FETCH_LOGIN_BY_GOOGLE_REJECTED,
//                     payload: err,
//                 })
//                 return err
//             })
//     }
// }

// export const LoginByGoogle = (body) => {
//     console.log('fareeed',body)
//     // console.log("google api called to save data")
//     let apiUrl = `${Base_URL}google-login`
//     return (dispatch) => {
//         return fetch(apiUrl,{
//             method: 'POST',
//             headers: {
//                 "Accept": "application/json",
//                 "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
//                 // "Content-Type":"application/x-www-form-urlencoded",
//                 "Content-Type":'multipart/form-data',
                
//             },
//             data: body,

//         }).then((res)=>{
//             return res.json()
//         }).
//         then(res => {
//             console.log('Google login res-->>>==============', res);
//             dispatch({
//                 type: type.FETCH_LOGIN_BY_GOOGLE_FULFILLED,
//                 payload: res
//             })
//             return res
//         })
//             .catch((err) => {
//                 dispatch({
//                     type: type.FETCH_LOGIN_BY_GOOGLE_REJECTED,
//                     payload: err,
//                 })
//                 return err
//             })
//     }
// }


export const LoginByGoogle = (body) => {
    console.log('fareeed', body);
    let apiUrl = `${Base_URL}google-login`;

    return (dispatch) => {
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "x-api-key": "3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                // No need to set Content-Type here as FormData takes care of it
            },
            body: body,
        })
        .then(res => {
            if (!res.ok) {
                throw Error(res.statusText);
            }
            return res.json(); // Extract JSON from the response
        })
        .then(data => {
            console.log('Google login data:', data);
            dispatch({
                type: type.FETCH_LOGIN_BY_GOOGLE_FULFILLED,
                payload: data // Use the extracted data
            });
            return data;
        })
        .catch((err) => {
            console.error('Google login error:', err);
            dispatch({
                type: type.FETCH_LOGIN_BY_GOOGLE_REJECTED,
                payload: err,
            });
            return err;
        });
    };
};




export const LoginByFacebook = (body) => {
    // console.log("facebook api called to save data")
    let apiUrl = `${Base_URL}facebook-login`
    return (dispatch) => {
        return axios({
            url: apiUrl,
            method: 'POST',
            data: body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Content-Type":"application/x-www-form-urlencoded",
            }
        }).then(res => {
            // console.log('Facebook login res', res);
            dispatch({
                type: type.FETCH_LOGIN_BY_FACEBOOK_FULFILLED,
                payload: res
            })
            return res
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_LOGIN_BY_FACEBOOK_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const updateProfile = (token,body) => {
    let url = `${Base_URL}update-profile`
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            data: body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            }
        }).then(res => {
            // console.log('Update Profile', res);
            dispatch({
                type: type.FETCH_UPDATE_PROFILE_FULFILLED,
                payload: res
            })
            return res
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_UPDATE_PROFILE_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const updatePassword = (token,body) => {
    let url = `${Base_URL}change-password`
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            data: body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            }
        }).then(res => {
            // console.log('Update Profile', res);
            dispatch({
                type: type.FETCH_UPDATE_PASSWORD_FULFILLED,
                payload: res
            })
            return res
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_UPDATE_PASSWORD_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const setPin = (token,body) => {
    let url = `${Base_URL}pin/update-pin`
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            data: body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            }
        }).then(res => {
            // console.log('Set Pin Api response', res);
            dispatch({
                type: type.FETCH_SET_PIN_FULFILLED,
                payload: res
            })
            return res
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SET_PIN_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const verifyPin = (token,code) => {
  
    let url = `${Base_URL}pin/verify-pin/${code}`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'GET',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            }
        }).then(data => {
            // console.log('VERIFY pin Api', data);
            dispatch({
                type: type.FETCH_VERIFY_PIN_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_VERIFY_PIN_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const ForgetPin = (token) => {
  
    let url = `${Base_URL}pin/forgot-pin`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'GET',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            }
        }).then(data => {
            // console.log('Forget pin Api', data);
            dispatch({
                type: type.FETCH_FORGET_PIN_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_FORGET_PIN_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const CheckPin = (token,body) => {
  
    let url = `${Base_URL}pin/check-verify`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            data: body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            }
        }).then(data => {
            // console.log('Check Pin Api', data);
            dispatch({
                type: type.FETCH_CHECK_OTP_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_CHECK_OTP_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const resetPin = (token,body) => {
    let url = `${Base_URL}pin/reset-pin`
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            data: body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            }
        }).then(res => {
            // console.log('ReSet Pin Api response', res);
            dispatch({
                type: type.FETCH_RESET_PIN_FULFILLED,
                payload: res
            })
            return res
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_RESET_PIN_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const addFCMToken = (body,token) => {
    let url = `${Base_URL}add-fcm-tokens`
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            data: body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            }
        }).then(res => {
            // console.log('FCM Token set api', res);
            dispatch({
                type: type.FETCH_ADD_FCM_TOKEN_FULFILLED,
                payload: res
            })
            return res
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_ADD_FCM_TOKEN_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

