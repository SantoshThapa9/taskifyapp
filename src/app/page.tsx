// Home.tsx
"use client";

import { useState, useEffect } from "react";
import { auth } from "./firebaseConfig"; // Ensure this path is correct
import { useRouter } from "next/navigation";
import Hero from "./pages/hero"; // Ensure this path is correct
import Sidebar from "./pages/sidebar"; // Ensure this path is correct

const Home: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <div>
      <Sidebar
        isOpen={isOpen} // Correctly passing the prop
        toggleSidebar={toggleSidebar} // Correctly passing the prop
        onLogout={handleLogout} // Correctly passing the prop
      />
      <Hero />
    </div>
  );
};

export default Home;
