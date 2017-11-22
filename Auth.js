
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCSEZejc76I1fK4FquLpnkYuPyyQRwjSOE",
    authDomain: "eventme-82792.firebaseapp.com",
    databaseURL: "https://eventme-82792.firebaseio.com",
    projectId: "eventme-82792",
    storageBucket: "eventme-82792.appspot.com",
    messagingSenderId: "716562191057"
};
firebase.initializeApp(config);

var FacebookProvider = new firebase.auth.FacebookAuthProvider();

//Facebook login
FacebookLogin = function() {
    $("#fb-login-button").click(function(){
        firebase.auth().signInWithRedirect(FacebookProvider);
    });
};

//Get result of user connection
firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // ...
    }
    // The signed-in user info.
    var user = result.user;
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});

//Initialize FB
window.fbAsyncInit = function() {
    FB.init({
        appId      : '420752561660679',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.11'
    });

    FB.AppEvents.logPageView();

};

//FB functions
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(res) {
    if (res.status == "connected")
    {confirm(res.authResponse.userID);}
    else
    {
        confirm("could not log in.");
        console.log(res);
    }

}
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

//Google Sign In
function GoogleSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}