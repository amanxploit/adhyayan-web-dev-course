import { Box, Car, MessageSquareText, ShieldPlus, Truck } from "lucide-react";
import React from "react";

const SubHero = () => {
  const req = [
    {
      Icons: Truck,
      Text: "Free Shipping Over $50",
    },
    {
      Icons: ShieldPlus,
      Text: "Quality Assurance",
    },
    {
      Icons: Box,
      Text: "Return within 14 days",
    },
    {
      Icons: MessageSquareText,
      Text: "Support 24/7",
    },
  ];
  return (
    <div className="bg-black p-9 grid grid-cols-4">
      {req.map((src) => {
        
        let Icons = src.Icons;
        return (
          <div className="flex gap-5 items-center">            
            <Icons className="text-white" size={35} />
            <p className="text-white">{src.Text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SubHero;
