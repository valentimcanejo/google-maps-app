"use client";

interface AuthInputProps {
  id?: string;
  label: string;
  value: string;
  type?: "text" | "email" | "password";
  onChange: (newValue: string) => void;
}

const AuthInput = ({ id, label, value, type, onChange }: AuthInputProps) => {
  return (
    <div className="flex flex-col mt-4  w-full">
      <label>{label}</label>
      <input
        id={id}
        type={type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className={`px-4 py-3 rounded-lg text-black bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none`}
      />
    </div>
  );
};

export default AuthInput;
