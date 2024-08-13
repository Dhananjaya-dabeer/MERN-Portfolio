import React from "react";
import Hero from "./subpages/Hero";
import Timeline from "./subpages/Timeline";
import About from "./subpages/About";
import Skills from "./subpages/Skills";
import Portfolio from "./subpages/Portfolio";
import Apps from "./subpages/Apps";
import Contact from "./subpages/Contact";

function Home() {
  return (
    <article className="px-5 mt-10 sm:mt-14 md:mt-16 lg:mt-24 xl:mt-32 sm:mx-auto w-full max-w-[1050px] flex flex-col gap-14">
      <Hero />
      <Timeline />
      <About />
      <Skills />
      <Portfolio />
      <Apps />
      <Contact />
    </article>
  );
}

export default Home;
