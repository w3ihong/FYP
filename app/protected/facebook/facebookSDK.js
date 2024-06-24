import React, { useEffect } from 'react';

const FacebookSDK = ({ onLoginSuccess }) => {
  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '2153953224988805', // Replace with your app ID
        xfbml: true,
        version: 'v20.0'
      });
      window.FB.AppEvents.logPageView();

      // Check the login status once the SDK is initialized
      window.FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    };

    // Load the SDK script
    (function(d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); 
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function statusChangeCallback(response) {
      console.log('statusChangeCallback');
      console.log(response);
      if (response.status === 'connected') {
        testAPI();
      } else {
        document.getElementById('status').innerHTML = 'Please log into this webpage.';
      }
    }

    function testAPI() {
      console.log('Welcome!  Fetching your information.... ');
      window.FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!';
        onLoginSuccess(response);
      });
    }

    window.testAPI = testAPI; // Expose testAPI to the window object

  }, [onLoginSuccess]);

  return null; // or return <></> if preferred
};

export default FacebookSDK;
