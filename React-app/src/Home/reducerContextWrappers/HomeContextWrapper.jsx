/*
    This is a wrapper that wraps the Home componant with all its context wrappers and providers
 */

import React from 'react';
import Home from '../Home';

import LocationContextWrapper from './LocationContextWrapper';
import PostContextWrapper from '../reducerContextWrappers/ExpandedContextWrapper';
import ReplyingToContextWrapper from '../reducerContextWrappers/ReplyingToContextWrapper';
import PostsContextWrapper from '../reducerContextWrappers/PostsContextWrapper';

export default function HomeWrapper() {
    return (
        <PostContextWrapper>
            <ReplyingToContextWrapper>
                <LocationContextWrapper>
                    <PostsContextWrapper>
                        <Home />
                    </PostsContextWrapper>
                </LocationContextWrapper>
            </ReplyingToContextWrapper>
        </PostContextWrapper>
    );
};