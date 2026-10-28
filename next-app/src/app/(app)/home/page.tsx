import type { Metadata } from "next";
import HomeContent from "./_components/HomeContent";

export const metadata: Metadata = { title: "Home" };

const HomePage = () => {
  return <HomeContent />;
};

export default HomePage;