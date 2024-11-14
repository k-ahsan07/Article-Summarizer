import React from "react";
import logo from '../assets/logo1.png'; // Update the path to the logo image

const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        {/* Display Logo with custom CSS class */}
        <img src={logo} alt="sumz_logo" className="logo" />

        {/* GitHub Button */}
        <button
          type="button"
          onClick={() => window.open("https://github.com/k-ahsan07", "_blank")}
          className="black_btn"
        >
          GitHub
        </button>
      </nav>

      {/* Heading Text */}
      <h1 className="head_text">
        Effortlessly Summarize Your Article <br className="max-md:hidden" />
        <span className="orange_gradient">OpenAI GPT-4</span>
      </h1>

      {/* Description Text */}
      <h2 className="desc text-center">
        SummaWise is an open-source tool that helps you simplify long articles into clear, concise summaries.
      </h2>
    </header>
  );
};

export default Hero;
