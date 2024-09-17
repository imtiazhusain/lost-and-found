'use client'
import { useEffect, useState } from "react";
import _axios from "./config/axios.config";
import { toast } from "sonner";
import axios from "axios";
import Post from "@/components/Post";
import LoadingPosts from "@/components/LoadingPosts";
import { IPost } from "./interfaces";
import Filter from "@/components/Filter";



export default function Home() {
  const [posts, setPosts] = useState<Array<IPost>>([])
  const [loading, setLoading] = useState(false)
  const [openFilter, setOpenFilter] = useState(false)
  const [filterQuery, setFilterQuery] = useState({ status: '', time: 'Latest', place: '', placeValue: '' })



  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {

        const response = await _axios.get(`/post/all?status=${filterQuery.status}&time=${filterQuery.time}&${filterQuery.place}=${filterQuery.placeValue}`)
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

  const placeValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target
    setFilterQuery(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    console.log(filterQuery)
  }, [filterQuery])


  return (

    <div className="mt-16 container mx-auto px-4 sm:px-6 lg:px-8  ">
      <h1 className="text-center text-[4vw] text-gray-600 mb-5">Latest <span className="text-red-500">Posts</span> </h1>

      <Filter setOpenFilter={setOpenFilter} openFilter={openFilter} setFilterValue={setFilterValue} placeValueChange={placeValueChange} filterQuery={filterQuery} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))]    gap-y-6 gap-x-5 lg:gap-x-8 place-content-center  place-items-center ">
        {loading ? <LoadingPosts /> : (
          posts?.length > 0 ?
            posts.map(post => <Post post={post} showActions={false} />) :
            (
              <span className="text-gray-500">No Posts Found</span>

            )
        )}



      </div>
    </div>
  );
}
