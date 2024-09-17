import React from "react";

const Dialog = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300 z-50">
            <div className=" shadow-lg transition-all transform duration-300 scale-100">
                {children}
            </div>
        </div>
    );
};

export default Dialog;
