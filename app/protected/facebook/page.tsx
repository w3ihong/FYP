"use client"
import React, { useEffect } from 'react';
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const FacebookLogin: React.FC = () => {
  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : '2153953224988805', // Replace with your app ID
        cookie     : true,
        xfbml      : true,
        version    : 'v20.0' // Replace with your API version
      });

      window.FB.getLoginStatus(function(response: any) {
        statusChangeCallback(response);
      });
    };

    // Load the SDK script
    (function(d, s, id){
      const element = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      js.crossOrigin = "anonymous";
      element.parentNode!.insertBefore(js, element);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  function statusChangeCallback(response: any) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      testAPI();
    } else {
      document.getElementById('status')!.innerHTML = 'Please log into this webpage.';
    }
  }

  function checkLoginState() {
    window.FB.getLoginStatus(function(response: any) {
      statusChangeCallback(response);
    });
  }

  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    window.FB.api('/me', function(response: any) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status')!.innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }

  return (
    <div>
      <div
        className="fb-login-button"
        data-scope="public_profile,email"
        data-onlogin="checkLoginState();"
      ></div>
      <div id="status"></div>
    </div>
  );
};

export default FacebookLogin;
