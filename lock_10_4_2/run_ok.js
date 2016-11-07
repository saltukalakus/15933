'use strict';

function login(source) {
    var options = {
        auth: {
            sso: false
        },
        /* ICON LINK REMOVED FOR PRIVACY */
        closable: false
    };

    return function (dispatch) {

        var lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain, options);

        // required to indicate that this is a signup
        lock.on('signup success', function () {
            console.log('signup success');
        });

        // trigger some action on signup error
        lock.on('signup error', function () {
            console.log('error while trying to signup');
        });

        lock.on('authenticated', function (authResult) {
            alert('user is authenticated');
            lock.getProfile(authResult.idToken, function (error, profile) {
                if (error) {
                    dispatch(lockError(error));
                    return;
                }
                localStorage.setItem('profile', JSON.stringify(profile));
                localStorage.setItem('id_token', authResult.idToken);
                console.log('+++++++++++++ lock login profile ++++++++++++++');
                console.dir(profile);
                // this can only happen on login
                if (_typeof(profile.app_metadata) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined))) {
                    // user has signed up and created an account
                    if (profile.app_metadata.account) {
                        console.log('this should only happen on login and when account is created');
                        dispatch(lockSuccess(profile, authResult.idToken, source));
                    }
                    // user has signed up but not created an account yet
                    else {
                        console.log('this should only happen on login and when account is not yet created');
                        dispatch(lockSuccess(profile, authResult.idToken, source));
                    }
                }
                // this can only happen on signup
                //if ( signup ) {
                else {
                    console.log('this should only happen on signup');
                    dispatch(createRethinkdbUserAccount(source, authResult.idToken, profile));
                }
                // remove listeners
                lock.removeListener('signup success', function () {
                    console.log('remove signup success listener');
                });
                lock.removeListener('signup error', function () {
                    console.log('remove signup error listener');
                });
                lock.removeListener('authenticated', function () {
                    console.log('remove authenticated listener');
                });
            });
        });

        //lock.show();
        return lock;
    };
}


window.addEventListener('load', function() {
    // buttons
    var btn_login = document.getElementById('btn-login');

    function dispatch(msg){
        console.log(msg);
    }

    var source = {};
    var lockDispatch = login(source);
    var lock = lockDispatch(dispatch);

    btn_login.addEventListener('click', function() {
        lock.show();
    });
});