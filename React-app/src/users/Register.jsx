import React, { useState } from 'react'
import { postData } from '../api/requests'

const Register = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const onSubmit = () => {
        postData('/user/register', {
            'username': username,
            'password': password,
        }).then((data) => {
            setMessage(data['error']);
        });
    }

    return (
        <>
            <h3>New user register</h3>
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
            <button onClick={onSubmit}>Register</button>
        </>
    );

}

export default Register;