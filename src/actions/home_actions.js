import axios from "axios";
import { Base_URL } from '../config/index';
import { homeConstant as type } from '../constants/index';

export const get_Country_Data = () => {
  
    let url = `${Base_URL}login-countries`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'GET',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d"
            }

        }).then(data => {
            // console.log('Login Counttry Data List', data);
            dispatch({
                type: type.FETCH_COUNTRY_LIST_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_COUNTRY_LIST_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_Bank_List = (token) => {
  
    let url = `${Base_URL}remit-banks`
    
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
            // console.log('Remit Banks List', data);
            dispatch({
                type: type.FETCH_BANK_LIST_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_BANK_LIST_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_Recharge_Packages = (body) => {
  
    let url = `${Base_URL}recharge-packages`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            data : body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d"
            }
        }).then(data => {
            // console.log('Recharge Packages Data List', data);
            dispatch({
                type: type.FETCH_RECHARGE_PACKS_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_RECHARGE_PACKS_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_Remit_Packages = () => {
  
    let url = `${Base_URL}remit-packages`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'GET',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d"
            }
        }).then(data => {
            // console.log('Remit Packages Data List', data);
            dispatch({
                type: type.FETCH_REMIT_PACKS_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_REMIT_PACKS_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_RemitSettings = (token) => {
  
    let url = `${Base_URL}RemitRequestSettings`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'GET',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
               // "Authorization": `Bearer ${token}`,
            }
        }).then(data => {
            // console.log('get remit settings', data);
            dispatch({
                type: type.FETCH_REMIT_SETTING_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_REMIT_SETTING_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const stripe_payment_intent = (token, form_data) => {
           
        let url = `${Base_URL}stripe-payment-intent`
       
        // console.log('base', url);
        return (dispatch) => {
            return axios({
                url: url,
                method: 'POST',
                headers: { 
                    "Accept": "appilication/json",
                    "Authorization": `Bearer ${token}`, 
                    "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d"
                },
                data: form_data
            }).then(data => {
                console.log('Create Payment Response Data ', data);
                dispatch({
                    type: type.FETCH_CREATE_PAYMENT_INTENT_FULFILLED,
                    payload: data
                })
                return data
            })
                .catch((err) => {
                    dispatch({
                        type: type.FETCH_CREATE_PAYMENT_INTENT_REJECTED,
                        payload: err,
                    })
                    return err
                })
        }
    }

    // ___________________ SMS MODULE -----------------------

    export const send_sms=(token,form_data) => {
           
        let apiurl = `${Base_URL}sms/process`
       
        // console.log('base', apiurl);
        return (dispatch) => {
            return axios({
                url: apiurl,
                method: 'POST',
                headers: { 
                    "Accept": "appilication/json",
                    "Authorization": `Bearer ${token}`, 
                    "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d"
                },
                data: form_data,
            }).then(data => {
                // console.log('Send SMS Data ', data);
                dispatch({
                    type: type.FETCH_SEND_SMS_FULFILLED,
                    payload: data
                })
                return data
            })
                .catch((err) => {
                    dispatch({
                        type: type.FETCH_SEND_SMS_REJECTED,
                        payload: err,
                    })
                    return err
                })
        }
    }

    export const get_credits = (token,body) => {
  
        let url = `${Base_URL}sms/check-price`
        
        // console.log('base', url);
        return (dispatch) => {
            return axios({
                url: url,
                method: 'POST',
                data : body,
                headers: {
                    "Accept": "appilication/json",
                    "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                    "Authorization": `Bearer ${token}`,
                }
            }).then(data => {
                // console.log('SMS credits', data);
                dispatch({
                    type: type.FETCH_SMS_CREDITS_DETAIL_FULFILLED,
                    payload: data
                })
                return data
            })
                .catch((err) => {
                    dispatch({
                        type: type.FETCH_SMS_CREDITS_DETAIL_REJECTED,
                        payload: err,
                    })
                    return err
                })
        }
    }

    export const get_sms_packages = (token) => {
  
        let url = `${Base_URL}sms/packages`
        
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
                // console.log('SMS Packages', data);
                dispatch({
                    type: type.FETCH_SMS_PACKAGES_FULFILLED,
                    payload: data
                })
                return data
            })
                .catch((err) => {
                    dispatch({
                        type: type.FETCH_SMS_PACKAGES_REJECTED,
                        payload: err,
                    })
                    return err
                })
        }
    }

    export const get_package_detail = (token,slug) => {
  
        let url = `${Base_URL}sms/${slug}/purchase-package`
        
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
                // console.log('SMS Package Detail', data);
                dispatch({
                    type: type.FETCH_SMS_PACKAGES_DETAIL_FULFILLED,
                    payload: data
                })
                return data
            })
                .catch((err) => {
                    dispatch({
                        type: type.FETCH_SMS_PACKAGES_DETAIL_REJECTED,
                        payload: err,
                    })
                    return err
                })
        }
    }
// ========================================================

export const applyCoupon = (coupon) => {
  
    let url = `${Base_URL}apply-coupon/${coupon}`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                // "Authorization": `Bearer ${token}`,
            }
        }).then(data => {
            // console.log('Apply Coupon Api', data);
            dispatch({
                type: type.FETCH_APPLY_COUPON_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_APPLY_COUPON_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

// ============ ====== REQUEST AIRTIME =======================

export const submitRequest = (token,body) => {
  
    let url = `${Base_URL}request-airtime`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            data : body,
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            }
        }).then(data => {
            // console.log('SMS credits', data);
            dispatch({
                type: type.FETCH_SUBMIT_REQUEST_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SUBMIT_REQUEST_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

// ==================== REMIT ///////============>>>>>>>>

export const process_remit=(token,form_data, pack) => {
           
    let apiurl = `${Base_URL}${pack}/remit-receiver-process`
   
    // console.log('base', apiurl);
    return (dispatch) => {
        return axios({
            url: apiurl,
            method: 'POST',
            headers: { 
                "Accept": "appilication/json",
                "Authorization": `Bearer ${token}`, 
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d"
            },
            data: form_data,
        }).then(data => {
            // console.log('Remit Process Data ', data);
            dispatch({
                type: type.FETCH_PROCESS_REMIT_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_PROCESS_REMIT_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const remit_extra_charge = (token) => {
  
    let url = `${Base_URL}remit-extra-charge`
    
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
            // console.log('Remit Extra Charge', data);
            dispatch({
                type: type.FETCH_REMIT_EXTRA_CHARGE_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_REMIT_EXTRA_CHARGE_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

// ============= //////// HISTORY .....>>>>>>>>>>>>>>>>>

export const get_history = (token) => {
  
    let url = `${Base_URL}history`
    
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
            // console.log('History Data List', data);
            dispatch({
                type: type.FETCH_HISTORY_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_HISTORY_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_search_history = (token,form_data) => {
  
    let url = `${Base_URL}search`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Search History Data List', data);
            dispatch({
                type: type.FETCH_SEARCH_HISTORY_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SEARCH_HISTORY_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_sms_history = (token) => {
  
    let url = `${Base_URL}sms/history`
    
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
            // console.log('SMS History Data List', data);
            dispatch({
                type: type.FETCH_SMS_HISTORY_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SMS_HISTORY_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_request_history = (token) => {
  
    let url = `${Base_URL}user/requests`
    
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
            // console.log('Request History Data List', data);
            dispatch({
                type: type.FETCH_REQUEST_HISTORY_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_REQUEST_HISTORY_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_purchase_history = (token) => {
  
    let url = `${Base_URL}sms/purchase-history`
    
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
            // console.log('Purchase History Data List', data);
            dispatch({
                type: type.FETCH_PURCHASE_HISTORY_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_PURCHASE_HISTORY_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}



export const get_search_request = (token,form_data) => {
  
    let url = `${Base_URL}request-history-search`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Search Request Data List', data);
            dispatch({
                type: type.FETCH_SEARCH_REQUEST_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SEARCH_REQUEST_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_search_sms = (token,form_data) => {
  
    let url = `${Base_URL}sms/search`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Search SMS Data List', data);
            dispatch({
                type: type.FETCH_SEARCH_SMS_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SEARCH_SMS_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_search_purchase = (token,form_data) => {
  
    let url = `${Base_URL}sms/purchase-search`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Search Purchase Data List', data);
            dispatch({
                type: type.FETCH_SEARCH_PURCHASE_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SEARCH_PURCHASE_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

///   ,,,,,,,,,,,,,, Request Dashboard

export const get_request_dashboard = (token) => {
  
    let url = `${Base_URL}user/airtime-requests`
    
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
            // console.log('Request Dashboard List', data);
            dispatch({
                type: type.FETCH_REQUEST_DASHBOARD_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_REQUEST_DASHBOARD_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_search_requestDashboard = (token,form_data) => {
  
    let url = `${Base_URL}user/request-dashboard-search`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Request Dashboard Search', data);
            dispatch({
                type: type.FETCH_SEARCH_REQUEST_DASHBOARD_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SEARCH_REQUEST_DASHBOARD_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

///   ,,,,,,,,,,,,,, Remit Dashboard

export const get_remit_dashboard = (token) => {
  
    let url = `${Base_URL}remit-requests`
    
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
            // console.log('Remit Dashboard List', data);
            dispatch({
                type: type.FETCH_REMIT_DASHBOARD_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_REMIT_DASHBOARD_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_search_sentRemit = (token,form_data) => {
  
    let url = `${Base_URL}remit-sender-search`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Remit Sent Search', data);
            dispatch({
                type: type.FETCH_SEARCH_SENT_REMIT_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SEARCH_SENT_REMIT_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const get_search_recieveRemit = (token,form_data) => {
  
    let url = `${Base_URL}remit-reciever-search`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Remit Sent Search', data);
            dispatch({
                type: type.FETCH_SEARCH_RECIEVE_REMIT_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_SEARCH_RECIEVE_REMIT_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

// ================ USER DATA =======>>>>>>>>>>>>>

export const get_SelfInfo = (token) => {
  
    let url = `${Base_URL}user`
    
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
            console.log('User Self Info --->>', data);
            dispatch({
                type: type.FETCH_USER_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_USER_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

//=============== delete data from facebook===========

export const logoutFacebookaccount = (token,fd) => {
  
    let url = `${Base_URL}user/delete-request`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: fd,

        }).then(data => {
            // console.log('User Self Info', data);
            dispatch({
                type: type.DELETE_USER_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.DELETE_USER_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

// ========??..>>>>>>> <<<<<< FAQ ........>>>>>>>>>>>>>>

export const get_faq = (token) => {
  
    let url = `${Base_URL}faq`
    
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
            // console.log('faq data', data);
            dispatch({
                type: type.FETCH_FAQ_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_FAQ_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

// ======???>>>>>>>>>>>>>>>  PAYMENTS <<<<<<<<<<<<>>>>>


export const Stripe_Payment_complete = (token,form_data) => {
  
    let url = `${Base_URL}stripe-recharge-confirm`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Stripe Payment api', data);
            dispatch({
                type: type.FETCH_STRIPE_PAYMENT_API_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_STRIPE_PAYMENT_API_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const Stripe_Remit_Payment_complete = (token,form_data,pack) => {
//   console.log("packkkk is", pack)
    let url = `${Base_URL}${pack}/remit.stripe_confirm`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Stripe Remit Payment api', data);
            dispatch({
                type: type.FETCH_STRIPE_REMIT_PAYMENT_API_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_STRIPE_REMIT_PAYMENT_API_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const gpay_remitPayment_complete = (token,form_data,pack) => {
    // console.log("packkkk is", pack)
      let url = `${Base_URL}${pack}/remit.gpay_confirm`
      
    //   console.log('base', url);
      return (dispatch) => {
          return axios({
              url: url,
              method: 'POST',
              headers: {
                  "Accept": "appilication/json",
                  "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                  "Authorization": `Bearer ${token}`,
              },
              data: form_data,
  
          }).then(data => {
            //   console.log('Gpay Remit Payment api', data);
              dispatch({
                  type: type.FETCH_GPAY_REMIT_PAYMENT_API_FULFILLED,
                  payload: data
              })
              return data
          })
              .catch((err) => {
                  dispatch({
                      type: type.FETCH_GPAY_REMIT_PAYMENT_API_REJECTED,
                      payload: err,
                  })
                  return err
              })
      }
  }

export const Stripe_smsPayment_complete = (token,form_data) => {
  
    let url = `${Base_URL}sms/stripe-sms-confirm`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Stripe SMS Payment api', data);
            dispatch({
                type: type.FETCH_STRIPE_SMS_PAYMENT_API_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_STRIPE_SMS_PAYMENT_API_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const Paypal_Payment_complete = (token,form_data) => {
  
    let url = `${Base_URL}show-capture-payment`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Paypal Payment api', data);
            dispatch({
                type: type.FETCH_PAYPAL_PAYMENT_API_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_PAYPAL_PAYMENT_API_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const Paypal_smsPayment_complete = (token,form_data) => {
  
    let url = `${Base_URL}sms/paypal-sms-confirm`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Paypal SMS Payment api', data);
            dispatch({
                type: type.FETCH_PAYPAL_SMS_PAYMENT_API_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_PAYPAL_SMS_PAYMENT_API_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const gpay_Payment_complete = (token,form_data) => {
  
    let url = `${Base_URL}gpay-recharge-process`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('GPay Payment api', data);
            dispatch({
                type: type.FETCH_GPAY_PAYMENT_API_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_GPAY_PAYMENT_API_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const Applepay_Payment_complete = (token,form_data) => {
  
    let url = `${Base_URL}apay-recharge-confirm`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Apple Pay Payment api', data);
            dispatch({
                type: type.FETCH_APPLE_PAYMENT_API_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_APPLE_PAYMENT_API_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const Gpay_smsPayment_complete = (token,form_data) => {
  
    let url = `${Base_URL}sms/gpay-sms-confirm`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('GPAY SMS Payment api', data);
            dispatch({
                type: type.FETCH_GPAY_SMS_PAYMENT_API_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_GPAY_SMS_PAYMENT_API_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const Apple_smsPayment_complete = (token,form_data) => {
  
    let url = `${Base_URL}sms/apay-sms-confirm`
    
    // console.log('base', url);
    return (dispatch) => {
        return axios({
            url: url,
            method: 'POST',
            headers: {
                "Accept": "appilication/json",
                "x-api-key":"3fd7977b-90b3-435f-b78a-eb53452a9e1d",
                "Authorization": `Bearer ${token}`,
            },
            data: form_data,

        }).then(data => {
            // console.log('Apple SMS Payment api', data);
            dispatch({
                type: type.FETCH_APPLE_SMS_PAYMENT_API_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_APPLE_SMS_PAYMENT_API_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

// ============= //////// NOTIFICATION .....>>>>>>>>>>>>>>>>>

export const get_NotificationList = (token) => {
  
    let url = `${Base_URL}notifications/list`
    
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
            // console.log('Notification Data List', data);
            dispatch({
                type: type.FETCH_NOTIFICATION_LIST_DATA_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_NOTIFICATION_LIST_DATA_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const read_singleNotification = (token,id) => {
  
    let url = `${Base_URL}notifications/do/read/${id}`
    
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
            // console.log('Notification Read Individual', data);
            dispatch({
                type: type.FETCH_NOTIFICATION_SINGLE_READ_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_NOTIFICATION_SINGLE_READ_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const read_allNotification = (token) => {
  
    let url = `${Base_URL}notifications/all/read`
    
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
            // console.log('Notification Read All', data);
            dispatch({
                type: type.FETCH_NOTIFICATION_ALL_READ_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_NOTIFICATION_ALL_READ_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}

export const delete_allNotification = (token) => {
  
    let url = `${Base_URL}notifications/all/delete`
    
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
            // console.log('Notification Delete All', data);
            dispatch({
                type: type.FETCH_NOTIFICATION_DELETE_ALL_FULFILLED,
                payload: data
            })
            return data
        })
            .catch((err) => {
                dispatch({
                    type: type.FETCH_NOTIFICATION_DELETE_ALL_REJECTED,
                    payload: err,
                })
                return err
            })
    }
}