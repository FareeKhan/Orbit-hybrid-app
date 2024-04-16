const initialState = {
    loginByEmail:'', signupByEmail:'', authToken:'', updateProfile:'',
    loginByOtp:'', signupByOtp:'', loginByGoogle:'', loginByFacebook:'',
    setPin:'', verifyPin:'', forgetPin:'', checkOtp:'', resetPin:'',
    addFcmToken:'',
};

const auth_Reducer = (state = initialState, action) => {
    switch (action.type) {

        case "FETCH_LOGIN_BY_EMAIL_FULFILLED": {
            return { ...state, is_authed: true, loginByEmail: action.payload, authToken: action.payload.data.access_token}
            break;
          }
          
          case "FETCH_LOGIN_BY_EMAIL_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SIGNUP_BY_EMAIL_FULFILLED": {
            return { ...state, is_authed: true, signupByEmail: action.payload, authToken: action.payload.data.access_token}
            break;
          }
          
          case "FETCH_SIGNUP_BY_EMAIL_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_LOGIN_BY_OTP_FULFILLED": {
            return { ...state, is_authed: true, loginByOtp: action.payload, authToken: action.payload.data.access_token}
            break;
          }
          
          case "FETCH_LOGIN_BY_OTP_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SIGNUP_BY_OTP_REJECTED": {
            return { ...state, is_authed: true, signupByOtp: action.payload, authToken: action.payload.data.access_token}
            break;
          }
          
          case "FETCH_LOGIN_BY_OTP_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_LOGIN_BY_GOOGLE_FULFILLED": {

            console.log('dddd000000000 =====',action.payload.access_token)
            return { ...state, is_authed: true, loginByGoogle: action.payload, authToken: action.payload.access_token}
            break;
          }

          // case "FETCH_LOGIN_BY_GOOGLE_FULFILLED": {
          //   console.log('fareedhhhhhhhhhh======\\\\\\\\---',action.payload.access_token)
          //   return { ...state, is_authed: true, loginByGoogle: action.payload, authToken: action.payload.access_token}
          //   break;
          // }
          
          case "FETCH_LOGIN_BY_GOOGLE_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_LOGIN_BY_FACEBOOK_FULFILLED": {
            return { ...state, is_authed: true, loginByFacebook: action.payload, authToken: action.payload.data.access_token}
            break;
          }
          
          case "FETCH_LOGIN_BY_FACEBOOK_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_UPDATE_PROFILE_FULFILLED": {
            return { ...state, is_authed: true, updateProfile: action.payload}
            break;
          }
          
          case "FETCH_UPDATE_PROFILE_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SET_PIN_FULFILLED": {
            return { ...state, is_authed: true, setPin: action.payload}
            break;
          }
          
          case "FETCH_SET_PIN_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_VERIFY_PIN_FULFILLED": {
            return { ...state, is_authed: true, setPin: action.payload}
            break;
          }
          
          case "FETCH_VERIFY_PIN_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_FORGET_PIN_FULFILLED": {
            return { ...state, is_authed: true, forgetPin: action.payload}
            break;
          }
          
          case "FETCH_FORGET_PIN_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_CHECK_OTP_FULFILLED": {
            return { ...state, is_authed: true, checkOtp: action.payload}
            break;
          }
          
          case "FETCH_CHECK_OTP_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_RESET_PIN_FULFILLED": {
            return { ...state, is_authed: true, resetPin: action.payload}
            break;
          }
          
          case "FETCH_RESET_PIN_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_ADD_FCM_TOKEN_FULFILLED": {
            return { ...state, is_authed: true, addFcmToken: action.payload}
            break;
          }
          
          case "FETCH_ADD_FCM_TOKEN_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }



        default: {
            return state;
          }

    }
    
};



// Exports
export default auth_Reducer;