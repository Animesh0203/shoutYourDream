export default function ColorPicker({ color, onColorChange }) {
    return (
        <div className="flex flex-col items-center justify-center g-full bg-white rounded-xl border border-gray-200 p-4">
            <div
                className="w-16 h-16 rounded-full mb-3 border border-gray-300"
                style={{ backgroundColor: color }}
            />
            <p className="text-xs text-gray-500 mb-2">
                <span className="font-mono">{color}</span>
            </p>
            <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-8 h-8 p-0 border border-gray-300 rounded cursor-pointer"
            />
        </div>
    );
}
