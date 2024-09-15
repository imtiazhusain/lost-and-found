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

