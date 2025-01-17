// components/layout/AuthLayout.tsx
import SideBar from "../components/layout/sidebar";
import Header from "../components/layout/header";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-container flex flex-wrap">
      <SideBar />
      <div className="main-content flex-1 w-full bg-white">
        <Header />
          <main>{children}</main>
      </div>
    </div>
  );
}
