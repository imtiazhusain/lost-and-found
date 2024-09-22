'use client'
import React, { useState } from 'react'
import { toast } from 'sonner';
import _axios from '@/app/config/axios.config'
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'
import Link from 'next/link';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { ISignUpErrors, ISignUpInputs } from '@/app/interfaces';
import validateInputs from '@/lib/validateInputs';

const Page = () => {
    const router = useRouter()
    const [inputs, setInputs] = useState<ISignUpInputs>({
        name: '',
        email: '',
        password: '',
        profilePic: null,
        confirmPassword: '',
        country: '',
        city: '',
        phoneNo: ''


    });
    const [loading, setLoading] = useState(false);

    const [isErrors, setIsErrors] = useState<ISignUpErrors>({
        name: '',
        email: '',
        password: '',
        profilePic: '',
        confirmPassword: '',
        country: '',
        city: '',
        phoneNo: ''
    });



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        if (name == "profilePic" && event?.target?.files) {
            setInputs((values) => ({ ...values, [name]: event.target.files![0] }));
        } else {
            const value = event.target.value;
            setInputs((values) => ({ ...values, [name]: value }));
        }
    };



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);



        // for input validation
        const shouldReturn = validateInputs(inputs, setIsErrors);

        if (shouldReturn) {
            setLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append("name", inputs.name);
        formData.append("email", inputs.email);
        formData.append("password", inputs.password);
        formData.append("phoneNo", inputs.phoneNo);
        formData.append("country", inputs.country);
        formData.append("city", inputs.city);
        if (inputs.profilePic)
            formData.append("profilePic", inputs.profilePic);
        try {
            const response = await _axios.post("/user/signup", formData);
            console.log('here is the response')
            console.log(response)
            const responseData = response?.data?.userData



            router.push(`/verify-user?data=${encodeURIComponent(JSON.stringify(responseData))}`);
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
    return (
        <div className=" flex-grow flex items-center justify-center   ">
            <div className=" bg-white w-80  md:w-[600px]  p-4 rounded-md my-4 md:my-0 shadow-md">
                <div className="mb-4">
                    <h1 className="font-bold text-base sm:text-2xl md:text-xl tracking-wide text-center">
                        New Here ? Sign up now!
                    </h1>
                </div>
                <form action="" className="" onSubmit={handleSubmit}>
                    <div className="grid  md:grid-cols-2 md:gap-4 lg:gap-6 md:gap-y-6   grid-cols-1 gap-2">
                        <div className="  space-y-2">
                            <label htmlFor="" className="text-xs sm:text-sm md:text-xl ">
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                name="name"
                                value={inputs.name || ""}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full   p-2.5  outline-none placeholder:italic"
                            />

                            {isErrors.name && (
                                <span className="text-red-600 text-sm">{isErrors.name}</span>
                            )}
                        </div>
                        <div className="space-y-2 ">
                            <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                name="email"
                                value={inputs.email || ""}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full p-2.5 outline-none placeholder:italic"
                            />
                            {isErrors.email && (
                                <span className="text-red-600 text-sm">{isErrors.email}</span>
                            )}
                        </div>

                        <div className="  space-y-2">
                            <label htmlFor="" className="text-xs sm:text-sm md:text-xl ">
                                Country
                            </label>
                            <input
                                type="text"
                                placeholder="Australia"
                                name="country"
                                value={inputs.country || ""}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full   p-2.5  outline-none placeholder:italic"
                            />

                            {isErrors.name && (
                                <span className="text-red-600 text-sm">{isErrors.country}</span>
                            )}
                        </div>
                        <div className="space-y-2 ">
                            <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                                City
                            </label>
                            <input
                                type="text"
                                placeholder="London"
                                name="city"
                                value={inputs.city || ""}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full p-2.5 outline-none placeholder:italic"
                            />
                            {isErrors.email && (
                                <span className="text-red-600 text-sm">{isErrors.city}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                name="password"
                                value={inputs.password || ""}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full p-2.5 outline-none placeholder:italic"
                            />
                            {isErrors.password && (
                                <span className="text-red-600 text-sm">
                                    {isErrors.password}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                name="confirmPassword"
                                value={inputs.confirmPassword || ""}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full p-2.5 outline-none placeholder:italic"
                            />
                            {isErrors.confirmPassword && (
                                <span className="text-red-600 text-sm">
                                    {isErrors.confirmPassword}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2 ">
                            <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                                Phone No
                            </label>
                            <input
                                type="text"
                                placeholder="+92 3029345"
                                name="phoneNo"
                                value={inputs.phoneNo || ""}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full p-2.5 outline-none placeholder:italic"
                            />
                            {isErrors.email && (
                                <span className="text-red-600 text-sm">{isErrors.phoneNo}</span>
                            )}
                        </div>

                        <div className="space-y-2 overflow-hidden">
                            <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                                Upload Profile Pic
                            </label>
                            <input
                                type="file"
                                name="profilePic"
                                onChange={handleChange}
                                className="  text-sm text-slate-500
                                         file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                             file:bg-slate-50 file:text-slate-700
                                     hover:file:bg-slate-100 file:cursor-pointer  "
                                accept="image/*"
                            />
                            {isErrors.profilePic && (
                                <span className="text-red-600 text-sm block">
                                    {isErrors.profilePic}
                                </span>
                            )}
                        </div>


                    </div>

                    <div>

                        <Button disabled={loading} className="w-full mt-3">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Please wait..." : "Create Account"}
                        </Button>
                    </div>

                    <div>
                        <h3 className="text-gray-500 mt-2  md:text-end text-sm md:text-lg">
                            Already having an account ?
                            <Link href="/login" className="text-slate-900 font-semibold ">
                                {" "}
                                Login
                            </Link>
                        </h3>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Page