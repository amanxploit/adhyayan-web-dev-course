import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import SubHero from "./components/SubHero/SubHero";
import Card from "./components/Card/Card";

const App = () => {
  return (
    <>
      <div className="absolute w-full">
        <Navbar />
      </div>
      <Hero/>
      <SubHero/>
     <Card/>
    </>
  );
};

export default App;
