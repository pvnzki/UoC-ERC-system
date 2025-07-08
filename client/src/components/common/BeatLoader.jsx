import React from "react";
import "./BeatLoader.css";

const BeatLoader = () => (
  <svg
    className="beat-loader-svg"
    width="58px"
    height="66px"
    viewBox="0 0 54 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="beat-blue-gradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#1e40af" /> {/* blue-800 */}
        <stop offset="40%" stopColor="#2563eb" /> {/* blue-600 */}
        <stop offset="80%" stopColor="#0ea5e9" /> {/* sky-500 */}
        <stop offset="100%" stopColor="#7dd3fc" />{" "}
        {/* sky-300, very light blue */}
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path
        className="beat-loader"
        d="M0.5,38.5 L16,38.5 L19,25.5 L24.5,57.5 L31.5,7.5 L37.5,46.5 L43,38.5 L53.5,38.5"
        strokeWidth="2.5"
        stroke="url(#beat-blue-gradient)"
        filter="url(#glow)"
      ></path>
    </g>
  </svg>
);

export default BeatLoader;
