'use client'

import React, { useEffect } from 'react'

const Test = ({ userId, user }) => {

    useEffect(() => {
        console.log("Client-side logic with userId:", userId);
        console.log("Client-side logic with user:", user);
    }, [userId]);

    return (
        <>
            <h1>user id is {userId}</h1>
        </>
    )

}

export default Test