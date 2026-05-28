import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

const Hero = () => {
  return (
    <>
    <div>
        <img className='w-full h-svh' src='https://www.wa-mare.com/uploads/column_event/0/609/eyecatch_602042edca0bb8f94cbbb8c5a8e26246.jpg'/>
    </div>

    <div className="p-9 absolute top-1/2 flex justify-between w-full">
        <div><ChevronLeft className='text-white' size={35}/></div>
        <div><h1 className='text-white w-56 text-center text-2xl'>The Art of Modern Interior Living</h1></div>
        <div><ChevronRight className='text-white' size={35}/></div>
    </div>
    </>
  )
}

export default Hero 