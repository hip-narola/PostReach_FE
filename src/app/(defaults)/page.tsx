"use client"
import Login from "../components/authentication/sign-in";
import Dashboard from "../components/dashboard";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <Login />;
}
