# 15933

<b> Test setup for ZD ticket 15933</b> 

Tried to simulate the problem with a basic setup. Didn't provide implementations for some of the functions used but 
could reproduce the problem of non called "authenticated" handler in 10.x lock. To solve the problem 10.x implementation
now returns instance of lock in deep callback function. lock.show called in document context. So solution
requires a small API change in Lock object creator wrapper functions.

run.js and run_ok.js in lock_10_4_2 can be compared to see how the problem is fixed.


<b>01-Login:</b> Official pure js 10.x lock.js sample

<b>lock_9_3_1:</b>  Works out of box. 

* app.js => Received code
* app_converted.js => ES5 converted code of app.js with Babel
* run.js => Modified app_converted.js used in the index.html code.
* config.js => Update this according to your client credentials.            

<b>lock_10_4_2:</b>  Doesn't work out of box. To test good version rename run_ok.js to run.js

* app.js => Received code
* app_ok.js => Solution to problem. Requires show() to be called outside of the function. 
* app_converted.js => ES5 converted code of app.js with Babel
* run.js => Problem can be observed in this version.
* run_ok.js => Here deep callback returns instance of lock. lock.show() is called within application context.
* config.js => Update this according to your client credentials.                 
