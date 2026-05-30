import React from "react";

const Card = () => {
  const products = [
    {
      img: "https://i.pinimg.com/736x/48/4b/75/484b755cb009e1420b43bcd624dba002.jpg",
      name: "Bathroom",
      items: "4 items",
    },
    {
      img: "https://i.pinimg.com/736x/48/4b/75/484b755cb009e1420b43bcd624dba002.jpg",
      name: "Bathroom",
      items: "4 items",
    },
    {
      img: "https://i.pinimg.com/736x/48/4b/75/484b755cb009e1420b43bcd624dba002.jpg",
      name: "Bathroom",
      items: "4 items",
    },
    {
      img: "https://i.pinimg.com/736x/48/4b/75/484b755cb009e1420b43bcd624dba002.jpg",
      name: "Bathroom",
      items: "4 items",
    },
    {
      img: "https://i.pinimg.com/736x/48/4b/75/484b755cb009e1420b43bcd624dba002.jpg",
      name: "Bathroom",
      items: "4 items",
    },
    {
      img: "https://i.pinimg.com/736x/48/4b/75/484b755cb009e1420b43bcd624dba002.jpg",
      name: "Bathroom",
      items: "4 items",
    },
    {
      img: "https://i.pinimg.com/736x/48/4b/75/484b755cb009e1420b43bcd624dba002.jpg",
      name: "Bathroom",
      items: "4 items",
    },
    {
      img: "https://i.pinimg.com/736x/48/4b/75/484b755cb009e1420b43bcd624dba002.jpg",
      name: "Bathroom",
      items: "4 items",
    },
    {
      img: "https://i.pinimg.com/736x/48/4b/75/484b755cb009e1420b43bcd624dba002.jpg",
      name: "Bathroom",
      items: "4 items",
    },
  ];

  return (
    <div>
    <div className="overflow-scroll grid grid-flow-col">
      {products.map((item) => {
        return (
          <div className=" flex w-64 h-96 m-6  relative">
            <img className="rounded-4xl" src={item.img} />
            <div className="absolute bottom-3 left-3">
              <h1 className="text-white font-bold text-1xl">{item.name}</h1>
              <p className="text-white font-bold">{item.items}</p>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default Card;
