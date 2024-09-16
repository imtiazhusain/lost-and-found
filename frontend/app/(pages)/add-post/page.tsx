'use client'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';
import _axios from '@/app/config/axios.config'
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { IAddPostErrors, IAddPostInputs, } from '@/app/interfaces';
import { validatePostInputs } from '@/lib/validateInputs';
import Image from 'next/image';
import { useGlobalState } from '@/app/context/globalContext';

const page = () => {
    const { state } = useGlobalState()
    const [inputs, setInputs] = useState<IAddPostInputs>({

        description: '',
        image: null,
        status: 'Lost',
        country: '',
        city: '',



    });
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isErrors, setIsErrors] = useState<IAddPostErrors>({
        description: '',
        image: '',
        status: '',
        country: '',
        city: '',
    });

    useEffect(() => {
        console.log(inputs)
    }, [inputs])


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        if (name == "image" && event?.target?.files) {
            setInputs((values) => ({ ...values, [name]: event.target.files![0] }));
        } else {
            const value = event.target.value;
            setInputs((values) => ({ ...values, [name]: value }));
        }
    };

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(name)
        console.log(value)
        setInputs((values) => ({ ...values, [name]: value }));
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);



        // for input validation
        const shouldReturn = validatePostInputs(inputs, setIsErrors);

        if (shouldReturn) {
            setLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append("description", inputs.description);
        formData.append("status", inputs.status);
        formData.append("country", inputs.country);
        formData.append("city", inputs.city);
        if (inputs.image)
            formData.append("image", inputs.image);
        try {
            await _axios.post("/post/create", formData, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                    Authorization: `Bearer ${state?.user?.accessToken}`
                }
            });
            toast.success("Post created successfully")


            setInputs({

                description: '',
                image: null,
                status: 'Lost',
                country: '',
                city: '',



            })

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }


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
        <div className=' flex-grow flex items-center justify-center my-6'>
            <div className=" bg-white w-80 border border-gray-300 md:w-[600px]  p-4 rounded-md my-4 md:my-0">
                <div className="mb-4">
                    <h1 className="font-bold text-base sm:text-2xl md:text-xl tracking-wide text-center">
                        Create Post
                    </h1>
                </div>
                <form action="" className="" onSubmit={handleSubmit}>
                    <div className="grid  md:grid-cols-2 md:gap-4 lg:gap-6 md:gap-y-6   grid-cols-1 gap-2">


                        <div className="space-y-2 overflow-hidden">
                            <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                                Upload Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                ref={fileInputRef}
                                onChange={handleChange}
                                className="  text-sm text-slate-500
                                         file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                             file:bg-slate-50 file:text-slate-700
                                     hover:file:bg-slate-100 file:cursor-pointer  "
                                accept="image/*"
                            />
                            {inputs.image && (

                                <Image src={URL.createObjectURL(inputs.image)} alt="upload image" width={500} height={300} className='w-24' />
                            )}
                            {isErrors.image && (
                                <span className="text-red-600 text-sm block">
                                    {isErrors.image}
                                </span>
                            )}
                        </div>
                        <div className="  space-y-2">
                            <label htmlFor="" className="text-xs sm:text-sm md:text-xl ">
                                Description
                            </label>
                            <textarea
                                onChange={handleTextAreaChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full   p-2.5  outline-none placeholder:italic"

                                name="description"
                                id="description"
                                placeholder="Describe Post"
                                rows={8}
                                value={inputs.description || ""}
                            />

                            {isErrors.description && (
                                <span className="text-red-600 text-sm">{isErrors.description}</span>
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

                            {isErrors.country && (
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
                            {isErrors.city && (
                                <span className="text-red-600 text-sm">{isErrors.city}</span>
                            )}
                        </div>




                        <div className="space-y-2  md:col-span-2">
                            <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                                Status
                            </label>
                            <select
                                name="status"
                                id="status"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full p-2.5 outline-none placeholder:italic "
                                value={inputs.status}
                                onChange={handleStatusChange}
                                required

                            >
                                <option value="Found">Found</option>
                                <option value="Lost">Lost</option>

                            </select>
                            {isErrors.status && (
                                <span className="text-red-600 text-sm">{isErrors.status}</span>
                            )}
                        </div>




                    </div>

                    <div>

                        <Button disabled={loading} className="w-full mt-3">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Please wait..." : "Create Post"}
                        </Button>
                    </div>


                </form>
            </div >
        </div >
    )
}

export default page