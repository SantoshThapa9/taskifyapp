
"use client";

import { useState, useEffect } from "react";
import { auth } from "./firebaseConfig"; 
import { useRouter } from "next/navigation";
import Hero from "./pages/hero";

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
      <Hero />
    </div>
  );
};

export default Home;
