import React from 'react';
import Explore  from '../Explore/Explore';
import { Footer } from '../Footer/Footer';


export const Home = () => {
  return (
    <>
    <div className='text-2xl mt-24 text-center font-bold'>
      <h1>Pin your location in map</h1>
    </div>
    <Explore/>
    <Footer/>
    </>
  )
}
