import React, { useContext } from 'react';
import { globalSnackbarContext } from '../GlobalSnackbarWrapper';

const Logout = (props) => {

    const openSnackbar = useContext(globalSnackbarContext);

    let message;

    if(localStorage.getItem('jwt')) {
        localStorage.removeItem('jwt');
        message = 'Logout successfull.'
    } else {
        message = 'No user is currentley logged in.';
    }
    openSnackbar(message, 'success');
    props.history.push('/');
    return (null);
}

export default Logout;