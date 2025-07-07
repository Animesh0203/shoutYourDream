
export default function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white text-black font-mono py-2 px-4 rounded hover:bg-black hover:border hover:border-white hover:text-white transition duration-300"
    >
      {text}
    </button>
  );
}