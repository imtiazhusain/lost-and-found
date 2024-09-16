'use client'
import { useEffect, useState } from "react";
import _axios from "../../config/axios.config";
import { toast } from "sonner";
import axios from "axios";
import Post from "@/components/Post";
import LoadingPosts from "@/components/LoadingPosts";
import { IPost } from "../../interfaces/index";
import { useGlobalState } from "@/app/context/globalContext";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



export default function Home() {
    const [posts, setPosts] = useState<Array<IPost>>([])
    const [loading, setLoading] = useState(false)
    const { state } = useGlobalState()
    const [OpenFilter, setOpenFilter] = useState(false)
    const [filterQuery, setFilterQuery] = useState({ status: '', time: 'Latest' })


    console.log(filterQuery)

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            try {

                const response = await _axios.get(`/post/user-posts?status=${filterQuery.status}&time=${filterQuery.time}`, {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: `Bearer ${state.user?.accessToken}`
                    }
                })
                console.log(response)
                setPosts(response.data.postsData)
            } catch (error) {
                console.log(error)
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
                setLoading(false)
            }

        }

        fetchPosts()


    }, [filterQuery])


    function setFilterValue(query: string) {
        const [name, value] = query.split(':')
        setFilterQuery(pre => ({ ...pre, [name]: value }))
    }

    return (

        <div className="mt-16 container mx-auto px-4 sm:px-6 lg:px-8  ">


            <h1 className="text-center text-[4vw] text-gray-600 mb-5">Your <span className="text-red-500">Posts</span> </h1>

            <div className="space-y-2 mb-5">

                <div className=" grid place-content-end">
                    {/* <Button variant='outline' onClick={() => setOpenFilter(pre => !pre)} className="bg-transparent border border-gray-400">
                        <SlidersHorizontal className="mr-2 h-4 w-4" /> Filter
                    </Button> */}
                    <Button className=" " onClick={() => setOpenFilter(pre => !pre)} >
                        <SlidersHorizontal className="mr-2 h-4 w-4" /> Filter
                    </Button>
                </div>
                {OpenFilter && (<div className="grid grid-cols-1 md:grid-cols-3 gap-4">





                    {/* <div className="relative w-full">
                        <input
                            type="search"
                            placeholder="Search here..."
                            name="search"
                            value={""}
                            // onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full pl-10 p-2.5 outline-none placeholder:italic"
                        />
                        <Search className="absolute left-3 top-2 text-gray-400" />
                    </div> */}

                    <Select onValueChange={setFilterValue}  >
                        <SelectTrigger className="" >
                            <SelectValue placeholder="Search By Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="status:Lost">Lost</SelectItem>
                            <SelectItem value="status:Found">Found</SelectItem>
                        </SelectContent>
                    </Select>


                    <Select onValueChange={setFilterValue} value="time:Latest" >
                        <SelectTrigger className="" >
                            <SelectValue placeholder="Search By Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="time:Latest">Latest</SelectItem>
                            <SelectItem value="time:Oldest">Oldest</SelectItem>
                        </SelectContent>
                    </Select>



                </div>)}
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))]    gap-y-6 gap-x-5 lg:gap-x-8 place-content-center  place-items-center ">
                {loading ? <LoadingPosts /> : (
                    posts?.length > 0 ?
                        posts.map(post => <Post post={post} />) :
                        (
                            <span className="text-gray-500">No Posts Found</span>

                        )
                )}



            </div>
        </div>
    );
}
