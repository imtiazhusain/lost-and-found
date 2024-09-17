import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { IPost } from '@/app/interfaces'
import convertToDate from '@/lib/convertToDate'
import Image from 'next/image'
import { Building2, Edit, EllipsisVertical, Flag, Mail, Phone, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import Link from 'next/link'
import { useGlobalState } from '@/app/context/globalContext'






interface PostProps {
    post: IPost;
    showActions: boolean;
    deletePost: (id: string) => void;
    deletePostLoading: boolean
}

const Post: React.FC<PostProps> = ({ post, showActions, deletePost, deletePostLoading }) => {
    const { state } = useGlobalState()
    const { user } = state

    return (
        <div className="rounded-md   bg-white  shadow-md transition-all duration-300 animate-fadeIn  p-4 space-y-3 max-w-[450px]">
            <div className='flex items-center justify-between'>

                <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 rounded-full overflow-hidden">
                        <AvatarImage src={post.author?.profilePic} className="object-cover" />
                        {/* <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback> */}
                        <AvatarFallback>{post.author?.name}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <h3 className="text-sm">{post.author?.name}</h3>
                        <h4 className="text-gray-400 text-xs">{convertToDate(post.createdAt)}</h4>
                    </div>
                </div>
                <div className='flex items-center'>

                    {post.status === "Found" ? (<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {post.status}
                    </span>) : (<span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        {post.status}
                    </span>)}

                    {showActions && (<DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical className='text-gray-500' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator /> */}
                            <DropdownMenuItem className="cursor-pointer " onClick={() => deletePost(post._id)}>
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                <span className='text-red-500'>{deletePostLoading ? "Deleting..." : "Delete"}</span>
                            </DropdownMenuItem>
                            <Link href={`/posts/${post._id}`}>
                                <DropdownMenuItem className="cursor-pointer" >
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                            </Link>

                        </DropdownMenuContent>
                    </DropdownMenu>)}

                </div>

            </div>



            <div className='space-y-3'>
                <h3 className='line-clamp-4 text-sm text-gray-500'>{post.description}</h3>
                <h2 className={`${post.status === "Found" ? 'text-green-500' : 'text-red-500'}`}>{post.status} at : <span className='text-gray-500'>{post.country} , {post.city}</span>
                </h2>
                <Image alt='post image' src={post.image} width={200} height={200} className='w-full rounded-lg shadow-md' loading='lazy' />

            </div>


            {user ? (<div className='space-y-2'>
                <h3>Contact Details</h3>
                <div className='flex justify-between items-center '>
                    <div className='flex items-center gap-3'>
                        <div className='bg-green-100 size-7 rounded-full grid place-content-center'>

                            <Mail className='text-xs text-green-700' size={15} />
                        </div>
                        <span className='text-sm text-gray-400'>{post.author?.email}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='bg-green-100 size-7 rounded-full grid place-content-center'>

                            <Phone className='text-xs text-green-700' size={15} />
                        </div>
                        <span className='text-sm text-gray-400'>{post.author?.phoneNo}</span>
                    </div>
                </div>


                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-green-100 size-7 rounded-full grid place-content-center'>

                            <Flag className='text-xs text-green-700' size={15} />
                        </div>
                        <span className='text-sm text-gray-400'>{post.author?.country}</span>
                    </div>
                    <div className='flex items-center gap-3 '>
                        <div className='bg-green-100 size-7 rounded-full grid place-content-center'>

                            <Building2 className='text-xs text-green-700' size={15} />
                        </div>
                        <span className='text-sm text-gray-400 '>{post.author?.city}</span>
                    </div>
                </div>
            </div>) :
                (
                    <>




                        <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                            <div className="flex">
                                <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" /></svg></div>
                                <div>
                                    <p className="font-bold">Our privacy policy has changed</p>
                                    <p className="text-sm">Make sure you are <Link href='/login' className='underline font-semibold '>
                                        Login
                                    </Link>  to view contact details  </p>
                                </div>
                            </div>
                        </div>

                    </>
                )}


        </div>
    )
}

export default Post