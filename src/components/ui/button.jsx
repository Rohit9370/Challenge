import * as React from "react";
import './styles.css';

const Button = React.forwardRef(({ 
  className = '', 
  variant = 'default',
  ...props 
}, ref) => {
  const variantClass = variant === 'outline' ? 'ui-button-outline' : 'ui-button-default';
  return (
    <button
      className={`ui-button ${variantClass} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
