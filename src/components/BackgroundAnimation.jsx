import React from 'react';
import './BackgroundAnimation.css';

export default function BackgroundAnimation() {
  return (
    <div className="nectar-bg" aria-hidden="true">
      {/* Layer 1: Breathing gradient base */}
      <div className="nectar-bg__base" />

      {/* Layer 2: Organic floating blobs */}
      <div className="nectar-bg__blobs">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <span className="blob blob--3" />
        <span className="blob blob--4" />
        <span className="blob blob--5" />
        <span className="blob blob--6" />
      </div>

      {/* Layer 3: Grain + floating particles */}
      <div className="nectar-bg__grain" />
      <div className="nectar-bg__particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={`particle particle--${(i % 4) + 1}`} />
        ))}
      </div>
    </div>
  );
}
