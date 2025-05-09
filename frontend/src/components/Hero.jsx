import { curve, heroBackground, robot } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import Generating from "./Generating";
import CompanyLogos from "./CompanyLogos";

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
    Forcasting {" "}
    <img
      src={curve}
      className="absolute top-full left-0 w-full xl:-mt-2"
      width={624}
      height={28}
      alt="Curve"
    />
  </span>
</h1>
          <p className="body-1 max-w-3xl mx-auto mt-4 mb-6 text-n-2 lg:mt-6 lg:mb-8">
  Forcast Demand Manufacture
</p>

<Button 
  className="mt-4 lg:mt-6 text-lg lg:text-xl px-6 lg:px-8 py-3 lg:py-4 bg-cyan-500 hover:bg-transparent transition duration-300 relative border-0 rounded-lg overflow-hidden"
  style={{
    borderRadius: '30px 50px 0 0',
  }}
  href="http://127.0.0.1:2000/login"
>
  <span className="text-black hover:text-white transition duration-300">
    Get Started Today
  </span>
</Button>
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