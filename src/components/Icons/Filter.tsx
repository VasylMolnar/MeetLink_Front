interface IFilterIconProps {
  size?: string;
  color?: string;
}

export default function FilterIcon({
  size = "20",
  color = "none"
}: IFilterIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 6C2 5.44772 2.44772 5 3 5H17C17.5523 5 18 5.44772 18 6C18 6.55228 17.5523 7 17 7H3C2.44772 7 2 6.55228 2 6ZM5 10C5 9.44772 5.44772 9 6 9H14C14.5523 9 15 9.44772 15 10C15 10.5523 14.5523 11 14 11H6C5.44772 11 5 10.5523 5 10ZM9 13C8.44772 13 8 13.4477 8 14C8 14.5523 8.44772 15 9 15H11C11.5523 15 12 14.5523 12 14C12 13.4477 11.5523 13 11 13H9Z"
        fill="black"
      />
    </svg>
  );
}
