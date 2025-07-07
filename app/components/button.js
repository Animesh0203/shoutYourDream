export default function Button({ text, onClick, className = "" }) {
  const defaultClasses =
    "text-gray-800 border font-mono py-2 px-4 rounded transition duration-300 hover:bg-gray-400 hover:border hover:border-white ";

  return (
    <button
      onClick={onClick}
      className={`${defaultClasses} ${className}`}
    >
      {text}
    </button>
  );
}
