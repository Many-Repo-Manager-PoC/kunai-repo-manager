export const KunaiLogo = ({
  width = 33,
  height = 40,
  logoColor = "text-kunai-blue-900",
  class: className,
}: {
  width?: number;
  height?: number;
  logoColor?: string;
  class?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 33 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.318359 19.9293C0.318359 15.1494 8.88308 13.2673 14.0722 10.4697C21.8295 6.28735 28.5526 -0.508162 31.7575 2.61281C35.5922 6.34534 26.6457 15.0809 26.6457 19.8942C26.6457 24.7074 35.5922 33.4431 31.7575 37.1756C28.5526 40.2966 21.8295 33.5011 14.0722 29.3186C8.88308 26.5209 0.318359 24.6389 0.318359 19.8591V19.9293Z"
      fill="#E85A51"
    />
    <path
      d="M7.08327 4.32649L22.6841 19.912L7.08327 35.4976V4.32649ZM5.28906 0V39.8276L25.2224 19.9137L5.28906 0Z"
      fill={logoColor}
      class={className}
    />
  </svg>
);
