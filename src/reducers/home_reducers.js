const initialState = {
    countryList :[], bankList:[], rechargePacks:[], remitPacks:[], stripeIntent:'',
    smsCredits:'', sendSMS:'', smsPackages:[],packDetails:'',
    applyCoupon:'', submitRequest:'', processRemit:'', remitExtraCharge:'',
    histotyData:'', searchHistory:'', smsHistotyData:'', requestHistory:'', searchRequest:'', searchSMS:'',
    purchaseHistotyData:'', searchPurchase:'', requestDashboard:'', remitDashboard:'',
    userData:'', faq:'', stripePayApi:'', paypalPayApi:'',
    notificationList:'',eraseFBData : ''
};

const home_Reducer = (state = initialState, action) => {
    switch (action.type) {

        case "FETCH_COUNTRY_LIST_FULFILLED": {
            return { ...state, is_authed: true, countryList: action.payload}
            break;
          }
          
          case "FETCH_COUNTRY_LIST_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_BANK_LIST_FULFILLED": {
            return { ...state, is_authed: true, bankList: action.payload}
            break;
          }
          
          case "FETCH_BANK_LIST_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_RECHARGE_PACKS_FULFILLED": {
            return { ...state, is_authed: true, rechargePacks: action.payload}
            break;
          }
          
          case "FETCH_RECHARGE_PACKS_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_REMIT_PACKS_FULFILLED": {
            return { ...state, is_authed: true, remitPacks: action.payload}
            break;
          }
          
          case "FETCH_REMIT_PACKS_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_CREATE_PAYMENT_INTENT_FULFILLED": {
            return { ...state, is_authed: true, stripeIntent: action.payload}
            break;
          }
          
          case "FETCH_CREATE_PAYMENT_INTENT_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SMS_CREDITS_DETAIL_FULFILLED": {
            return { ...state, is_authed: true, smsCredits: action.payload}
            break;
          }
          
          case "FETCH_SMS_CREDITS_DETAIL_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SEND_SMS_FULFILLED": {
            return { ...state, is_authed: true, sendSMS: action.payload}
            break;
          }
          
          case "FETCH_SEND_SMS_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SMS_PACKAGES_FULFILLED": {
            return { ...state, is_authed: true, smsPackages: action.payload}
            break;
          }
          
          case "FETCH_SMS_PACKAGES_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SMS_PACKAGES_DETAIL_FULFILLED": {
            return { ...state, is_authed: true, packDetails: action.payload}
            break;
          }
          
          case "FETCH_SMS_PACKAGES_DETAIL_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_APPLY_COUPON_FULFILLED": {
            return { ...state, is_authed: true, applyCoupon: action.payload}
            break;
          }
          
          case "FETCH_APPLY_COUPON_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SUBMIT_REQUEST_FULFILLED": {
            return { ...state, is_authed: true, submitRequest: action.payload}
            break;
          }
          
          case "FETCH_SUBMIT_REQUEST_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_PROCESS_REMIT_FULFILLED": {
            return { ...state, is_authed: true, processRemit: action.payload}
            break;
          }
          
          case "FETCH_PROCESS_REMIT_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_REMIT_EXTRA_CHARGE_FULFILLED": {
            return { ...state, is_authed: true, remitExtraCharge: action.payload}
            break;
          }
          
          case "FETCH_REMIT_EXTRA_CHARGE_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_HISTORY_DATA_FULFILLED": {
            return { ...state, is_authed: true, histotyData: action.payload}
            break;
          }
          
          case "FETCH_HISTORY_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SEARCH_HISTORY_DATA_FULFILLED": {
            return { ...state, is_authed: true, searchHistory: action.payload}
            break;
          }
          
          case "FETCH_SEARCH_HISTORY_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_USER_DATA_FULFILLED": {
            return { ...state, is_authed: true, userData: action.payload}
            break;
          }
          
          case "FETCH_USER_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SMS_HISTORY_DATA_FULFILLED": {
            return { ...state, is_authed: true, smsHistotyData: action.payload}
            break;
          }
          
          case "FETCH_SMS_HISTORY_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_REQUEST_HISTORY_DATA_FULFILLED": {
            return { ...state, is_authed: true, requestHistory: action.payload}
            break;
          }
          
          case "FETCH_REQUEST_HISTORY_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SEARCH_REQUEST_DATA_FULFILLED": {
            return { ...state, is_authed: true, searchRequest: action.payload}
            break;
          }
          
          case "FETCH_SEARCH_REQUEST_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SEARCH_SMS_DATA_FULFILLED": {
            return { ...state, is_authed: true, searchSMS: action.payload}
            break;
          }
          
          case "FETCH_SEARCH_SMS_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_PURCHASE_HISTORY_DATA_FULFILLED": {
            return { ...state, is_authed: true, purchaseHistotyData: action.payload}
            break;
          }
          
          case "FETCH_PURCHASE_HISTORY_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_SEARCH_PURCHASE_DATA_FULFILLED": {
            return { ...state, is_authed: true, searchPurchase: action.payload}
            break;
          }
          
          case "FETCH_SEARCH_PURCHASE_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_FAQ_DATA_FULFILLED": {
            return { ...state, is_authed: true, faq: action.payload}
            break;
          }
          
          case "FETCH_FAQ_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_REQUEST_DASHBOARD_FULFILLED": {
            return { ...state, is_authed: true, requestDashboard: action.payload}
            break;
          }
          
          case "FETCH_REQUEST_DASHBOARD_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_REMIT_DASHBOARD_FULFILLED": {
            return { ...state, is_authed: true, remitDashboard: action.payload}
            break;
          }
          
          case "FETCH_REMIT_DASHBOARD_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_STRIPE_PAYMENT_API_FULFILLED": {
            return { ...state, is_authed: true, stripePayApi: action.payload}
            break;
          }
          
          case "FETCH_STRIPE_PAYMENT_API_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_PAYPAL_PAYMENT_API_FULFILLED": {
            return { ...state, is_authed: true, paypalPayApi: action.payload}
            break;
          }
          
          case "FETCH_PAYPAL_PAYMENT_API_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }

          case "FETCH_NOTIFICATION_LIST_DATA_FULFILLED": {
            return { ...state, is_authed: true, notificationList: action.payload}
            break;
          }
          
          case "FETCH_NOTIFICATION_LIST_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }


          case "DELETE_USER_DATA_FULFILLED": {
            return { ...state, is_authed: true, eraseFBData: action.payload}
            break;
          }
          
          case "DELETE_USER_DATA_REJECTED": {
            return { ...state, is_authed: false, error: action.payload }
            break;
          }



        default: {
            return state;
          }

    }
    
};



// Exports
export default home_Reducer;