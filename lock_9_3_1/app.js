export function login(source) { 
const lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain); 

// required to indicate that this is a signup 
lock.on('signup success', () => { 
console.log('signup success'); 

}); 

// trigger some action on signup error 
lock.on('signup error', () => { 
console.log('error while trying to signup'); 
}); 

return dispatch => { 
lock.show({ 
sso: false
/* ICON LINK REMOVED FOR PRIVACY,
closable: false, 
authParams: { 
scope: 'openid email user_metadata' 
}*/ 
}, (err, profile, token) => { 
if ( err ) { 
dispatch(lockError(err)); 
return; 
} 
localStorage.setItem('profile', JSON.stringify(profile)); 
localStorage.setItem('id_token', token); 
console.log('+++++++++++++ lock login profile ++++++++++++++') 
console.dir(profile) 
// this can only happen on login 
if ( typeof profile.app_metadata !== typeof undefined ) { 
// user has signed up and created an account 
if ( profile.app_metadata.account ) { 
console.log('this should only happen on login and when account is created') 
dispatch(lockSuccess(profile, token, source)); 
} 
// user has signed up but not created an account yet 
else { 
console.log('this should only happen on login and when account is not yet created') 
dispatch(lockSuccess(profile, token, source)); 
} 
} 
// this can only happen on signup 
//if ( signup ) { 
else { 
console.log('this should only happen on signup') 
dispatch(createRethinkdbUserAccount(source, token, profile)); 

} 
// remove listeners 
lock.removeListener('signup success', () => {console.log('remove signup success listener')}); 
lock.removeListener('signup error', () => {console.log('remove signup error listener')}); 
}); 
}; 
} 
