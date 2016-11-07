# 15933

15933 - temporary will be removed shortly

Tried to simulate the problem with a basic setup. Didn't provide implementations for some of the functions used but 
could reproduce the problem of not called "authenticated" handler in 10.x lock.

01-Login:
Official pure js lock.js sample

loc_9_3_1:   
Works out of box. 

* app.js => Received code
* app_converted.js => ES5 converted code of app.js with Babel
* run.js => Modified app_converted.js used in the index.html code.
* config.js => Update this according to your client credentials.            

lock_10_4_2:  
Doesn't work out of box. To test good version rename run_ok.js to run.js

* app.js => Received code
* app_converted.js => ES5 converted code of app.js with Babel
* run.js => Problem can be observed in this version.
* run_ok.js =>  Here deep callback returns instance of lock. lock.show() is called within applicaion context.
* config.js => Update this according to your client credentials.                 
