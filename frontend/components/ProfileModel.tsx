import React, { useEffect, useRef, useState } from "react";
import Dialog from "./Dialog";
import { toast } from "sonner";
import { Camera, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import _axios from "@/app/config/axios.config";

import { useGlobalState } from "@/app/context/globalContext";
import { IEditUser, IUser } from "@/app/interfaces";
import axios from "axios";



const ProfileModel = ({ setOpenProfileModel }: { setOpenProfileModel: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { state, dispatch } = useGlobalState()
    const { user } = state
    const [userInputs, setUserInputs] = useState<IEditUser>({
        name: '',
        email: '',
        profilePic: null,
        _id: '',
        password: ''

    });
    const [hovered, setHovered] = useState(false);

    const [imagePreviewUrl, setImagePreviewUrl] = useState(user?.profilePic);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (file && file.type.match("image.*")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
                setUserInputs((values) => ({ ...values, profilePic: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (user)
            setUserInputs({
                name: user?.name,
                email: user?.email,
                profilePic: user?.profilePic,
                password: "",
                _id: user?._id,
            });
    }, [user]);

    const handleButtonClick = () => {
        if (fileInputRef.current)
            fileInputRef.current.click();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setUserInputs((values) => ({ ...values, [name]: value }));
    };

    const EditProfile = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", userInputs?.name);
        formData.append("email", userInputs?.email);
        if (userInputs.profilePic)
            formData.append("profilePic", userInputs?.profilePic);
        formData.append("_id", userInputs?._id);
        if (userInputs?.password) {
            formData.append("password", userInputs?.password);
        }
        try {
            const response = await _axios.patch("/user/edit-user", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${user?.accessToken}`,
                },
            });

            toast.success("User updated Successfully");

            const dataFromApi = response?.data?.data;

            if (user) {

                const tempUser: IUser = {
                    ...user,
                    profilePic: dataFromApi.profilePic,
                    email: dataFromApi.email,
                    name: dataFromApi.name,
                };

                localStorage.setItem("userInfo", JSON.stringify(tempUser));

                dispatch({ type: "SET_USER", payload: tempUser });
            }

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
        <div>
            <Dialog>
                <div className="bg-white w-80  h-auto p-2 rounded-md ">
                    <div className="grid place-content-end">
                        <X
                            onClick={() => setOpenProfileModel(false)}
                            className="cursor-pointer bg-red-500 rounded-full p-1 text-white"
                            size={25}
                        />
                    </div>
                    <div className="flex items-center flex-col gap-3">
                        <div
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            className="relative w-40 h-40"
                        >
                            {/* <Avatar
                alt={userInputs?.name}
                src={imagePreviewUrl}
                sx={{ width: 156, height: 156 }}
                className={` w-full h-full object-cover rounded-full shadow-lg ${
                  hovered ? "blur-sm " : ""
                } transition duration-300`}
              /> */}

                            <Avatar className="w-40 h-40 rounded-full overflow-hidden">
                                <AvatarImage
                                    src={imagePreviewUrl}
                                    className={` w-full h-full object-cover rounded-full shadow-lg ${hovered ? "blur-sm " : ""
                                        } transition duration-300`}
                                />
                                <AvatarFallback>
                                    {userInputs?.name
                                        ? userInputs?.name.substring(0, 2).toUpperCase()
                                        : null}
                                </AvatarFallback>
                            </Avatar>

                            {hovered && (
                                <div
                                    onClick={handleButtonClick}
                                    className="absolute inset-0 flex items-center justify-center  text-white text-sm font-bold cursor-pointer rounded-full "
                                >
                                    <Camera size={30} />
                                </div>
                            )}

                            <input
                                type="file"
                                id="fileInput"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="mt-3 gap-2 flex flex-col">
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={userInputs.name || ""}
                                onChange={handleChange}
                                name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg  w-full p-2 outline-none"
                            />

                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={userInputs.email || ""}
                                onChange={handleChange}
                                name="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg  w-full p-2 outline-none"
                            />

                            <input
                                type="password"
                                placeholder="••••••••"
                                value={userInputs.password || ""}
                                onChange={handleChange}
                                name="password"
                                className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg  w-full p-2 outline-none"
                            />

                            <button
                                className="w-full bg-slate-900  py-2.5 text-white tracking-wider hover:bg-slate-950 transition-colors duration-300  rounded-lg mt-2 disabled:cursor-not-allowed"
                                onClick={EditProfile}
                                disabled={loading}
                            >
                                {loading ? "Loading..." : " Edit Profile"}
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ProfileModel;
