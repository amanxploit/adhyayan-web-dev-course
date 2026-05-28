import { Box, Heart, Search, User } from "lucide-react";

const NavIcons = () => {
  return (
    <div>
        <ul className="flex gap-2">
          <li>
            <Search />
          </li>
          <li>
            <User />
          </li>
          <li className="relative">
            <Heart />
            <p className="absolute -top-2 -right-2 bg-black rounded-full h-5 w-5 text-white flex justify-center items-center">
              1
            </p>
          </li>
          <li className="relative">
            <Box />
            <p className="absolute -top-2 -right-2 bg-black rounded-full h-5 w-5 text-white flex justify-center items-center">
              1
            </p>
          </li>
        </ul>
      </div>
  )
}

export default NavIcons