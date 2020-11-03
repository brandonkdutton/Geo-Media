import React, { useState } from 'react'
import { postData } from '../api/requests'

const Login = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const onSubmit = () => {
        postData('/user/login', {
            'username': username,
            'password': password,
        }).then((data) => {
            console.log(data.login_token);
            setMessage(data.error);
            if(data.error !== null && data.login_token) {
                sessionStorage.setItem('login_token', data.login_token);
            }   
        });
    }

    return (
        <>
            <h3>Login</h3>
            <span>{message}</span>
            <form>
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </form>
            <button onClick={onSubmit}>Login</button>
        </>
    );

}

export default Login;