import * as React from "react";
import './styles.css';

const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      className={`ui-input ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
