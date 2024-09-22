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
import { NotebookText } from "lucide-react";

import Link from "next/link";
import Filter from "@/components/Filter";
import ProtectedRoute from "@/components/ProtectedRoutes";



const Page = () => {
    const [posts, setPosts] = useState<Array<IPost>>([])
    const [loading, setLoading] = useState(false)
    const { state } = useGlobalState()
    const [openFilter, setOpenFilter] = useState(false)
    const [filterQuery, setFilterQuery] = useState({ status: '', time: 'Latest', place: '', placeValue: '' })

    console.log(filterQuery)

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            try {

                const response = await _axios.get(`/post/user-posts?status=${filterQuery.status}&time=${filterQuery.time}&${filterQuery.place}=${filterQuery.placeValue}`, {
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


    }, [filterQuery, state.user?.accessToken])




    function setFilterValue(query: string) {


        const [name, value] = query.split(':')
        setFilterQuery(pre => ({ ...pre, [name]: value }))


    }

    const placeValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target
        setFilterQuery(pre => ({ ...pre, [name]: value }))
    }



    const [deletePostLoading, setDeletePostLoading] = useState(false)


    const deletePost = async (ID: string) => {
        try {
            setDeletePostLoading(true)
            await _axios.delete(`/post/delete-post/${ID}`, {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${state.user?.accessToken}`
                }
            })

            setPosts(pre => pre.filter(post => post._id !== ID))
            toast.success("Post deleted successfully")
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
            setDeletePostLoading(false)
        }
    }


    return (

        <div className="mt-16 container mx-auto px-4 sm:px-6 lg:px-8  ">
            <div className="grid place-content-end ">
                <Link href="/add-post">
                    <Button className="bg-green-500 hover:bg-green-600"  >
                        <NotebookText className="mr-2 h-4 w-4" /> Create a Post
                    </Button>
                </Link>
            </div>

            <h1 className="text-center text-[4vw] text-gray-600 mb-5">Your <span className="text-red-500">Posts</span> </h1>



            {/* <Filter setOpenFilter={setOpenFilter} openFilter={openFilter} setFilterValue={setFilterValue} /> */}
            <Filter setOpenFilter={setOpenFilter} openFilter={openFilter} setFilterValue={setFilterValue} placeValueChange={placeValueChange} filterQuery={filterQuery} />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))]    gap-y-6 gap-x-5 lg:gap-x-8 place-content-center  place-items-center mb-6">
                {loading ? <LoadingPosts /> : (
                    posts?.length > 0 ?
                        posts.map(post => <Post post={post} showActions={true} key={post._id} deletePost={deletePost} deletePostLoading={deletePostLoading} />) :
                        (
                            <span className="text-gray-500">No Posts Found</span>

                        )
                )}



            </div>
        </div>
    );
}



export default ProtectedRoute(Page);
