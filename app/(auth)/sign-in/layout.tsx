import React from "react";

const AuthLayout = ({ children } : { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="max-w-fit">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;