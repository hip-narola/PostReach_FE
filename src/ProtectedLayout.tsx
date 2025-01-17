import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorageType } from './app/constants/pages';
import navigations from './app/constants/navigations';

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem(LocalStorageType.ACCESS_TOKEN) : null;

    useEffect(() => {
        if (!token) {
            // Redirect to login if unauthenticated
            router.push(navigations.login);
        }
    }, [router, token]);

    if (!token) {
        return null; // Show a loader or empty state while redirecting
    }

    return <>{children}</>;
};

export default ProtectedLayout;
