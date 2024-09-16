export interface ISignUpInputs {
    name: string
    email: string,
    password: string,
    confirmPassword: string,
    profilePic: File | null,
    country:string,
    city:string,
    phoneNo:string
}

export interface ISignUpErrors {
    name: string
    email: string,
    password: string,
    confirmPassword: string,
    profilePic: string,
    city:string,
    country:string ,
    phoneNo:string
}



export interface IAddPostInputs {
    image: File | null,
    description: string
    status: string,
    country:string,
    city:string,
    
}


export interface IEditPostInputs {
    image: File | string |null,
    description: string
    status: string,
    country:string,
    city:string,
    
}

export interface IAddPostErrors {
    image: string,
    description: string
    status: string,
    country:string,
    city:string,
    
}


export interface IAuthor{
    id: string,
    name:string,
    profilePic: string,
    country:string,
    city: string,
     email:string,
    phoneNo: string,
}
export interface IPost{
     
            _id: string,
            author:IAuthor,
            image: string,
            description: string,
            country: string,
            city: string,
            status: string,
            createdAt:string,
            updatedAt: string
        
}