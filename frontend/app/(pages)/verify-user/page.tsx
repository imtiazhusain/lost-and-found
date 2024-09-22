'use client';  // Ensure this file is treated as a client component

import React, { Suspense } from 'react';
import VerifyUser from './VerifyUser';



const Page = () => {


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyUser />
        </Suspense>
    );
};

export default Page;
