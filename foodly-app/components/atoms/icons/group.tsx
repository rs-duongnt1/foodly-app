import { IconSvgProps } from "@/types";

export const Group: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 2C1.44772 2 1 2.44772 1 3V7C1 7.55228 1.44772 8 2 8H6C6.55228 8 7 7.55228 7 7V3C7 2.44772 6.55228 2 6 2H2ZM3 6V4H5V6H3Z"
      fill="#FE724C"
    />
    <path
      d="M9 5C9 4.44772 9.44771 4 10 4H22C22.5523 4 23 4.44772 23 5C23 5.55228 22.5523 6 22 6H10C9.44771 6 9 5.55228 9 5Z"
      fill="#FE724C"
    />
    <path
      d="M10 11C9.44771 11 9 11.4477 9 12C9 12.5523 9.44771 13 10 13H22C22.5523 13 23 12.5523 23 12C23 11.4477 22.5523 11 22 11H10Z"
      fill="#FE724C"
    />
    <path
      d="M10 18C9.44771 18 9 18.4477 9 19C9 19.5523 9.44771 20 10 20H22C22.5523 20 23 19.5523 23 19C23 18.4477 22.5523 18 22 18H10Z"
      fill="#FE724C"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 16C1.44772 16 1 16.4477 1 17V21C1 21.5523 1.44772 22 2 22H6C6.55228 22 7 21.5523 7 21V17C7 16.4477 6.55228 16 6 16H2ZM3 20V18H5V20H3Z"
      fill="#FE724C"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 10C1 9.44772 1.44772 9 2 9H6C6.55228 9 7 9.44772 7 10V14C7 14.5523 6.55228 15 6 15H2C1.44772 15 1 14.5523 1 14V10ZM3 11V13H5V11H3Z"
      fill="#FE724C"
    />
  </svg>
);
