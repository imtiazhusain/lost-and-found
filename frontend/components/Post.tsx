import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { IPost } from '@/app/interfaces'
import convertToDate from '@/lib/convertToDate'
import Image from 'next/image'
import { Building2, Flag, Mail, Phone } from 'lucide-react'

const Post = ({ post }: { post: IPost }) => {
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
                {post.status === "Found" ? (<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {post.status}
                </span>) : (<span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    {post.status}
                </span>)}

            </div>

            <div className='space-y-3'>
                <h3 className='line-clamp-4 text-sm text-gray-500'>{post.description}</h3>
                <h2 className={`${post.status === "Found" ? 'text-green-500' : 'text-red-500'}`}>{post.status} at : <span className='text-gray-500'>{post.country} , {post.city}</span>
                </h2>
                <Image alt='post image' src={post.image} width={200} height={200} className='w-full rounded-lg shadow-md' loading='lazy' />

            </div>

            <div className='space-y-2'>
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
            </div>
        </div>
    )
}

export default Post