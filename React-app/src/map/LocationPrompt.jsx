import React, { useState } from 'react';
import { postData } from '../api/requests'

const LocationPrompt = (props) => {

    //get posts for location if they exist

    //else prompt to make a new post at this location

    const [textOpen, setTextOpen] = useState(false);
    const [postText, setPostText] = useState('');
    const [locationName, setLocationName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setTextOpen(false);

        postData('/location/', {
            'name': locationName,
            'text': postText,
        }).then((data) => {
            alert('add somthing here');
        });
        
    };

    return (
        <div style={{ 'textAlign': 'center' }}>
            {textOpen ?
                <>
                    <h3>First post from {locationName || '...'}</h3>
                    <input type='text' placeholder='Name of location...' onChange={e => setLocationName(e.target.value)} value={locationName}/>
                    <textarea placeholder="Location's first post..." onChange={(e) => setPostText(e.target.value)} value={postText}/>
                    <button onClick={handleSubmit}>Post</button>
                </>
                :
                <>
                    <h3>You are here</h3>
                    <p>You can be the first to post at this area!</p>
                    <button onClick={() => setTextOpen(true)}>Create a post</button>
                </>
            }

        </div>
    );

};

export default LocationPrompt;