export function login(source) { 
const options = { 
auth: { 
sso: false 
},
/* ICON LINK REMOVED FOR PRIVACY */
closable: false 
}; 

return dispatch => { 

const lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain, options); 

// required to indicate that this is a signup 
lock.on('signup success', () => { 
console.log('signup success'); 

}); 

// trigger some action on signup error 
lock.on('signup error', () => { 
console.log('error while trying to signup'); 
}); 

lock.on('authenticated', function(authResult) { 
alert('user is authenticated') 
lock.getProfile(authResult.idToken, function(error, profile) { 
if ( error ) { 
dispatch(lockError(error)); 
return; 
} 
localStorage.setItem('profile', JSON.stringify(profile)); 
localStorage.setItem('id_token', authResult.idToken); 
console.log('+++++++++++++ lock login profile ++++++++++++++') 
console.dir(profile) 
// this can only happen on login 
if ( typeof profile.app_metadata !== typeof undefined ) { 
// user has signed up and created an account 
if ( profile.app_metadata.account ) { 
console.log('this should only happen on login and when account is created') 
dispatch(lockSuccess(profile, authResult.idToken, source)); 
} 
// user has signed up but not created an account yet 
else { 
console.log('this should only happen on login and when account is not yet created') 
dispatch(lockSuccess(profile, authResult.idToken, source)); 
} 
} 
// this can only happen on signup 
//if ( signup ) { 
else { 
console.log('this should only happen on signup') 
dispatch(createRethinkdbUserAccount(source, authResult.idToken, profile)); 
} 
// remove listeners 
lock.removeListener('signup success', () => {console.log('remove signup success listener')}); 
lock.removeListener('signup error', () => {console.log('remove signup error listener')}); 
lock.removeListener('authenticated', () => {console.log('remove authenticated listener')}); 
}); 
}); 

//lock.show();
return lock; //Call show in outer context.
}; 

} 
