import React from 'react';

export const FilledStar: React.FC = () => (
  <svg
    className="w-5 h-5 text-secondaryColor"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l2.95 6h6.32l-5.14 4.32 1.64 6.44L12 15.77 6.23 18.76l1.64-6.44L2.73 8h6.32z" />
  </svg>
);

export const HalfStar: React.FC = () => (
  <svg
    className="w-5 h-5 text-secondaryColor"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <defs>
      <linearGradient id="half">
        <stop offset="50%" stopColor="currentColor" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <path
      fill="url(#half)"
      d="M12 2l2.95 6h6.32l-5.14 4.32 1.64 6.44L12 15.77 6.23 18.76l1.64-6.44L2.73 8h6.32z"
    />
  </svg>
);

export const EmptyStar: React.FC = () => (
  <svg
    className="w-5 h-5 text-secondaryColor"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l2.95 6h6.32l-5.14 4.32 1.64 6.44L12 15.77 6.23 18.76l1.64-6.44L2.73 8h6.32z" />
  </svg>
);