import React from 'react';

const Logout = () => {
    let message;

    if(sessionStorage.getItem('login_token')) {
        sessionStorage.removeItem('login_token');
        message = 'Logout successfull.'
    } else {
        message = 'No user is currentley logged in.';
    }
    return <h3>{message}</h3>
}

export default Logout;