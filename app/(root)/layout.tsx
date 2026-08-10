import onboardUser from "@/features/auth/actions/onboard";
import { auth } from "@clerk/nextjs/server";

const onboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await auth.protect(); // double auth check
    await onboardUser();

    return (
        <div>
            {children}
        </div>
    );
}

export default onboardLayout;