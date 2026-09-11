// src/components/common/Loader.jsx
const Loader = ({ size = 24 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: "3px solid var(--color-border)",
        borderTopColor: "var(--color-accent)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
};

export default Loader;
