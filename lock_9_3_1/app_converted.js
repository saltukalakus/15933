'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.login = login;
function login(source) {
    var lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain);

    // required to indicate that this is a signup
    lock.on('signup success', function () {
        console.log('signup success');
    });

    // trigger some action on signup error
    lock.on('signup error', function () {
        console.log('error while trying to signup');
    });

    return function (dispatch) {
        lock.show({
            sso: false
            /* ICON LINK REMOVED FOR PRIVACY, ,
             closable: false,
             authParams: {
             scope: 'openid email user_metadata'
             }*/
        }, function (err, profile, token) {
            if (err) {
                dispatch(lockError(err));
                return;
            }
            localStorage.setItem('profile', JSON.stringify(profile));
            localStorage.setItem('id_token', token);
            console.log('+++++++++++++ lock login profile ++++++++++++++');
            console.dir(profile);
            // this can only happen on login
            if (_typeof(profile.app_metadata) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined))) {
                // user has signed up and created an account
                if (profile.app_metadata.account) {
                    console.log('this should only happen on login and when account is created');
                    dispatch(lockSuccess(profile, token, source));
                }
                // user has signed up but not created an account yet
                else {
                    console.log('this should only happen on login and when account is not yet created');
                    dispatch(lockSuccess(profile, token, source));
                }
            }
            // this can only happen on signup
            //if ( signup ) {
            else {
                console.log('this should only happen on signup');
                dispatch(createRethinkdbUserAccount(source, token, profile));
            }
            // remove listeners
            lock.removeListener('signup success', function () {
                console.log('remove signup success listener');
            });
            lock.removeListener('signup error', function () {
                console.log('remove signup error listener');
            });
        });
    };
}