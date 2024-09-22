// // components/ProtectedRoute.tsx
// import { useEffect } from 'react';
// import { useGlobalState } from '@/app/context/globalContext';
// import { useRouter } from 'next/navigation';

// const ProtectedRoute = (Component: React.ComponentType) => {
//     return function ProtectedComponent(props: any) {
//         const { state } = useGlobalState();
//         const { user } = state
//         const router = useRouter();

//         useEffect(() => {
//             if (!user) {
//                 router.push('/login');  // Redirect to login if not authenticated
//             }
//         }, [user, router]);

//         return user ? <Component {...props} /> : null; // Render component only if authenticated
//     };
// };

// export default ProtectedRoute;




// components/ProtectedRoute.tsx
import { useEffect, ComponentType } from 'react';
import { useGlobalState } from '@/app/context/globalContext';
import { useRouter } from 'next/navigation';

const ProtectedRoute = <P extends object>(Component: ComponentType<P>) => {
    return function ProtectedComponent(props: P) {
        const { state } = useGlobalState();
        const { user } = state;
        const router = useRouter();

        useEffect(() => {
            if (!user) {
                router.push('/login');  // Redirect to login if not authenticated
            }
        }, [user, router]);

        return user ? <Component {...props} /> : null; // Render component only if authenticated
    };
};

export default ProtectedRoute;

