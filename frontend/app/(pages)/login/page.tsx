'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner';
import { useGlobalState } from '../../context/globalContext';
import _axios from '@/app/config/axios.config'
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'
import Link from 'next/link';
import axios from 'axios'
interface ILoginInputs {
    email: string,
    password: string
}
interface INewErrors {
    email: string,
    password: string
}
const page = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [inputs, setInputs] = useState<ILoginInputs>({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { dispatch } = useGlobalState()

    const [isErrors, setIsErrors] = useState({ email: "", password: "" });


    useEffect(() => {
        const data = searchParams.get('account-created');
        console.log('Data:', data); // Check what data is received
        if (data) {

            toast.success('Account created successfully');
        }
    }, [searchParams]);



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };



    function validateInputs() {
        const newErrors: INewErrors = { email: '', password: '' };
        if (!inputs.email) {
            newErrors.email = "Email is required";
        }
        if (!inputs.password) {
            newErrors.password = "Password is required";
        }

        setIsErrors(newErrors);
        if (Object.values(newErrors).some((error) => error !== "")) {
            setLoading(false);
            return true;
        }
        return false;
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);

        // for input validation
        const shouldReturn = validateInputs();

        if (shouldReturn) {
            return;
        }

        try {
            const response = await _axios.post("/user/login", inputs);
            // Handle the response data here

            localStorage.setItem("userInfo", JSON.stringify(response?.data?.userData));

            dispatch({ type: "SET_USER", payload: response?.data?.userData });

            router.push('/')

            // redirect("/");

        } catch (error) {
            console.log(error);


            // Handle Axios-specific error

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



    return (
        <div className=' flex-grow flex items-center justify-center'>
            <div className="bg-white w-80   p-4 rounded-md shadow-md">
                <h1 className=" text-center font-bold text-2xl tracking-wide ">
                    Welcome Back!
                </h1>
                <form action="" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 mt-9">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="">Email</label>
                            <input
                                type="text"
                                placeholder="name@company.com"
                                value={inputs.email || ""}
                                onChange={handleChange}
                                name="email"
                                className="bg-gray-100 border border-gray-300 text-gray-900  rounded-lg  w-full p-2.5 outline-none"
                            />
                            {isErrors.email && (
                                <span className="text-red-600 text-sm">{isErrors.email}</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={inputs.password || ""}
                                onChange={handleChange}
                                name="password"
                                className="bg-gray-100 border border-gray-300 text-gray-900 s rounded-lg  w-full p-2.5 outline-none"
                            />
                            {isErrors.password && (
                                <span className="text-red-600 text-sm">
                                    {isErrors.password}
                                </span>
                            )}
                        </div>

                        <Button disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Please wait..." : "Login"}
                        </Button>
                        <div>
                            <h3 className="text-gray-500 text-end">
                                Don't have an account ?
                                <Link href="/signup" className="text-slate-900 font-semibold ">
                                    {" "}
                                    Signup
                                </Link>
                            </h3>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default page