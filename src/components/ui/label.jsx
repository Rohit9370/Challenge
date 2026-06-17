import * as React from "react";
import './styles.css';

const Label = React.forwardRef(({ className = '', ...props }, ref) => (
  <label ref={ref} className={`ui-label ${className}`} {...props} />
));
Label.displayName = "Label";

export { Label };
