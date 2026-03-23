import { curve, heroBackground, robot } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import Generating from "./Generating";
import CompanyLogos from "./CompanyLogos";

import { Link } from 'react-router-dom';

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
        <h1 className="h1 mb-8 text-6xl md:text-7xl lg:text-8xl">
  <span className="inline-block whitespace-nowrap ml-[-2rem] md:ml-[-3rem] lg:ml-[-4rem]">Explore the Possibilities</span> &nbsp;In&nbsp;Demand {` `}
  <span className="inline-block relative" style={{ marginTop: '1rem' }}>
    Forecasting {" "}
    <img
      src={curve}
      className="absolute top-full left-0 w-full xl:-mt-2"
      width={624}
      height={28}
      alt="Curve"
    />
  </span>
</h1>
          <p className="body-1 max-w-3xl mx-auto mt-4 mb-6 text-n-2 lg:mt-6 lg:mb-8 font-light tracking-wide">
  Predict Future Demand with AI-Powered Insights
</p>

<Link 
  className="inline-flex items-center justify-center mt-4 lg:mt-6 text-lg lg:text-xl px-8 lg:px-10 py-4 lg:py-5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 relative border-0 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]"
  style={{
    borderRadius: '12px',
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: '0.05em'
  }}
  to="/login"
>
  GET STARTED TODAY
</Link>
        </div>
        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            <img
              src={heroBackground}
              className="w-full"
              width={1440}
              height={1800}
              alt="hero"
            />
          </div>

          <BackgroundCircles />
        </div>

        </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;