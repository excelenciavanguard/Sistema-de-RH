import * as React from 'react';
import './Logo.css';

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <span className={`alpha-logo-lockup ${className ?? ''}`.trim()}>
      <img
        className="alpha-logo-image"
        src="/assets/alpha-rh-logo.png"
        alt="Alpha RH"
      />
    </span>
  );
}
