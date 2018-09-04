import * as actionTypes from './actionTypes.js';
import axios            from 'axios';

export const authStart = () => {
    return {
        type:actionTypes.AUTH_START
    };
}

export const authSucces = (token,userId) => {
    return {
        type:actionTypes.AUTH_SUCCESS,
        idToken:token,
        userId:userId
    };
}

export const authFail = (error) => {
    return {
        type:actionTypes.AUTH_FAIL,
        error:error
    };
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type:actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() =>{
            dispatch(logout);
        },expirationTime*1000)
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type:actionTypes.SET_AUTH_REDIRECT_PATH,
        path:path
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token){
            dispatch(logout());
        }else{
            const expirationDate = new Date(localStorage.getItem("expirationDate"));
            if(expirationDate <= new Date()){
                dispatch(logout());
            }else{
                const userId = localStorage.getItem('userId');
                dispatch(authSucces(token,userId));

                const expirationTime = (expirationDate.getTime() - new Date().getTime())/1000;
                dispatch(checkAuthTimeout(expirationTime));
            }
        }
    }
}

export const auth = (email,password,isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email:email,
            password:password,
            returnSecureToken:true
        };
        var url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBFPS_mk1oUERWGJ3pE0RzxPnWjqHaVBmg'
        var mex = 'registrazione utente';
        if(isSignup){
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBFPS_mk1oUERWGJ3pE0RzxPnWjqHaVBmg'
            mex = 'login utente già iscritto'
        }
        console.log(mex);
        axios.post(url,authData)
            .then(response => {
                console.log(response);
                var expirationDate = new Date(new Date().getTime() + response.data.expiresIn*1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate',expirationDate);
                localStorage.setItem('userId',response.data.localId);
                dispatch(authSucces(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn)); //serve per fare il logout automatico 
            })
            .catch(err => {
                console.log(err)
                dispatch(authFail(err));
            })
    };
}