'use client'
import React, { Suspense } from 'react'

import Login from './LoginComponent';

const Page = () => {


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Login />
        </Suspense>
    )
}

export default Page