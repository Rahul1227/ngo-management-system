import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-6">
      <h1 className="text-4xl font-bold text-green-400">
        Tailwind Test
      </h1>

      <button
        onClick={() => setCount(count + 1)}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-lg"
      >
        count is {count}
      </button>

      <p className="text-sm text-gray-400">
        If this is styled, Tailwind is working.
      </p>
    </div>
  )
}

export default App
