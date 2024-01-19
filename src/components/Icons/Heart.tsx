import React from "react";

interface IHeartProps {
  size?: number;
  color?: string;
}

export default function Heart({ size = 24, color = "none" }: IHeartProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
    >
      <path
        d="M20.0416 4.20873L20.0437 4.2106C22.7655 6.58184 22.4051 10.5089 20.4441 12.6235L12.8866 20.5954C12.6186 20.8721 12.3111 21 12.0188 21C11.6739 21 11.3689 20.8643 11.1089 20.5963L3.59192 12.6219L3.59046 12.6203C1.59122 10.5084 1.22839 6.58247 3.95092 4.2106L3.95093 4.2106L3.95306 4.20873C5.99871 2.41632 9.21469 2.61913 11.2928 4.81294L12.0254 5.58627L12.751 4.80639C14.7815 2.62381 17.993 2.41377 20.0416 4.20873Z"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
}
