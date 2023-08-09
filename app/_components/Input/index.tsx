import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  type?: string;
  label?: string;
  value: string;
  onChange: any;
}

export const Input = ({
  value,
  type,
  onChange,
  fullWidth = false,
  label = "Texto",
  ...rest
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full ">
      <span>{label}</span>
      <input
        {...rest}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${
          fullWidth ? "w-full" : ""
        } shadow appearance-none border rounded p-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
      />
    </div>
  );
};
