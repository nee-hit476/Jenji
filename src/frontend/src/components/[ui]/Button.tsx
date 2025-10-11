import React from "react";

type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
};

const backgroundStyle = {
  primary:
    "bg-white text-black font-semibold hover:bg-gray-300 cursor-pointer",
  secondary:
    "bg-black text-white font-semibold hover:bg-gray-700 border border-white cursor-pointer",
};

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-20 py-3 my-5 rounded-lg transition-all hover:hidden duration-200 ease-in-out ${backgroundStyle[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
