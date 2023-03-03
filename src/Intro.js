import { useState } from 'react';
import './Intro.css';
import vanlifeSrc from './vanlife.jpg';

export default function Intro() {
  const [hidden, setHidden] = useState(false);

  return (
    <div
      className="intro-overlay" style={{
        backgroundImage: `url('${vanlifeSrc}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: hidden ? 'none' : 'block'
      }}>
      <div className="board text-center">
        <h1 className="heading">
          The World is Your Vinyard App
        </h1>
        <div className="note">
          Plan your perfect Van Life route. Through Farms,
          Wineries, Breweries, Attractions, and More!
        </div>
        <div className="text-center">
          <button onClick={_ => setHidden(true)}>Lets GO!</button>
        </div>
      </div>
    </div>
  )
}