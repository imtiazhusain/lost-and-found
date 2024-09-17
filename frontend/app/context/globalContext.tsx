'use client'
import { createContext, ReactNode, useContext, useReducer } from 'react'
import { IActionType, IGlobal, IUser } from '../interfaces';





// interface IUser {
//     _id: string;
//     name: string;
//     email: string;
//     profilePic: string;
//     accessToken: string;
// }

// interface IGlobal {
//     user: IUser | null;
// }

// interface IActionType {
//     type: string;
//     payload?: IUser | null;
// };


const defaultState: IGlobal = { user: null };
const GlobalStateContext = createContext<{ state: IGlobal; dispatch: React.Dispatch<IActionType> }>({ state: defaultState, dispatch: () => { } });

export const useGlobalState = () => {
    return useContext(GlobalStateContext)
}

// Reducer function for updates
const globalReducer = (state: IGlobal, action: IActionType): IGlobal => {
    switch (action.type) {
        case "SET_USER":
            // Ensure the payload is of type IUser or null before setting it
            return { ...state, user: action.payload as IUser | null };
        case "LOGOUT_USER":
            localStorage.removeItem('userInfo')
            return { ...state, user: null };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {


    const userInfoString = localStorage.getItem("userInfo");
    const userInfo = userInfoString !== null ? JSON.parse(userInfoString) as IUser : null;

    const [state, dispatch] = useReducer(globalReducer, {
        user: userInfo,
    });

    // Value to be passed to context consumers
    const value = { state, dispatch };

    return (
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>
    );
};




























