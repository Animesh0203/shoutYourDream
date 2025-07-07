// ColorPicker.js
export default function ColorPicker({ color, onColorChange }) {

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] bg-gray-50 rounded-lg shadow-md p-6">
            <div
                className="w-24 h-24 rounded-full border-4 border-white shadow mb-4"
                style={{ backgroundColor: color }}
            />
            <p className="mb-4 text-gray-700 font-medium">
                Selected Color: <span className="font-mono">{color}</span>
            </p>

            <input
                id="color-input"
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-12 h-12 p-0 border-gray-300 rounded cursor-pointer transition duration-150 hover:border-blue-400"
            />
        </div>
    );
}
