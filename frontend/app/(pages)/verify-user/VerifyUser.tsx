'use client';  // Ensure this file is treated as a client component

import _axios from '@/app/config/axios.config';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface IUser {
    email: string,
    _id: string
}


const VerifyUser = () => {
    const router = useRouter()

    const [otpValue, setOtpValue] = useState('');
    const searchParams = useSearchParams();
    const [userData, setUserData] = useState<IUser | null>(null);
    const [componentIsLoading, setComponentIsLoading] = useState(true);
    const [loading, setLoading] = useState(false)
    const [resendCodeLoading, setResendCodeLoading] = useState(false);


    useEffect(() => {
        const data = searchParams.get('data');

        if (data) {
            try {
                // Decode and parse the data
                const decodedData = decodeURIComponent(data);
                const parsedData = JSON.parse(decodedData);
                setUserData(parsedData);
            } catch (error) {
                console.error("Failed to parse data:", error);
            }
        }

        setComponentIsLoading(false);
    }, [searchParams]);

    if (componentIsLoading) {
        return <p>Loading...</p>;
    }



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtpValue(event.target.value);
    };

    const verifyUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (otpValue === undefined) {
                toast.error("Please provide OTP");
                setLoading(false);

                return;
            }
            if (!userData) {
                toast.error("User Data Not found")
                setLoading(false)
                return
            }
            const data = {
                userId: userData._id,
                OTP: otpValue,
            };

            const response = await _axios.post("/user/verify_user", data);

            console.log(response);



            router.push(`/login?account-created=true`);
        } catch (error) {
            console.log(error);


            if (axios.isAxiosError(error)) {
                // Handle Axios-specific error
                console.error('Error fetching data:', error?.message);

                if (error?.response?.data?.message) {
                    toast.error(
                        error?.response?.data?.message
                        || "Something went wrong"

                    );
                } else if (error?.message) {
                    toast.error(
                        error?.message
                        || "Something went wrong"

                    );
                } else {
                    toast.error('Something went wrong please refresh the page')
                }
            } else {
                // Handle unexpected errors
                console.error('Unexpected error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async () => {
        setResendCodeLoading(true);
        try {
            if (!userData) {
                toast.error("User Data not found")
                return
            }
            const data = {
                userId: userData?._id,
                userEmail: userData?.email,
            };

            const response = await _axios.post("/user/send_otp", data);

            console.log(response);

            toast.success("Code resent successfully");
        } catch (error) {
            console.log(error);

            if (axios.isAxiosError(error)) {
                // Handle Axios-specific error
                console.error('Error fetching data:', error?.message);

                if (error?.response?.data?.message) {
                    toast.error(
                        error?.response?.data?.message
                        || "Something went wrong"

                    );
                } else if (error?.message) {
                    toast.error(
                        error?.message
                        || "Something went wrong"

                    );
                } else {
                    toast.error('Something went wrong please refresh the page')
                }
            } else {
                // Handle unexpected errors
                console.error('Unexpected error:', error);
            }
        } finally {
            setResendCodeLoading(false);
        }
    };


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className='min-h-svh flex justify-center items-center'>
                <div className="bg-white w-72 md:w-[512px]  p-4 rounded-md mt-3 ">
                    <h1 className="text-center font-medium text-lg mb-3">
                        User Verification
                    </h1>
                    <h2 className="mb-3">
                        We have send an OTP at{" "}
                        {userData?.email?.substring(0, 3) +
                            "*****" +
                            userData?.email?.substring(userData?.email.indexOf("@"))}
                    </h2>
                    <form action="" onSubmit={verifyUser}>
                        <label htmlFor="" className="text-xs sm:text-sm md:text-xl ">
                            Enter Verification Code
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            name="otp"
                            value={otpValue || ""}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full p-2.5 outline-none placeholder:italic"
                        />

                        <Button disabled={loading} className="w-full mt-3">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Please wait..." : "Verify"}
                        </Button>
                    </form>

                    <Button
                        disabled={resendCodeLoading}
                        className="w-full mt-3"
                        onClick={resendCode}
                    >
                        {resendCodeLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {resendCodeLoading ? "Please wait..." : "Resend Code"}
                    </Button>
                </div>
            </div>
        </Suspense>
    );
};

export default VerifyUser;
