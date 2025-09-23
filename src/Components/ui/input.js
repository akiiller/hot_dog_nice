import React from "react";

export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
        {...props}
      />
    </div>
  );
}
