// src/components/common/Button.jsx
const Button = ({ children, variant = "default", ...props }) => {
  const className =
    variant === "primary"
      ? "btn-primary"
      : variant === "destructive"
        ? "btn-destructive"
        : "";

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
