import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import SubHero from "./components/SubHero/SubHero";

const App = () => {
  return (
    <>
      <div className="absolute w-full">
        <Navbar />
      </div>
      <Hero/>
      <SubHero/>
    </>
  );
};

export default App;
