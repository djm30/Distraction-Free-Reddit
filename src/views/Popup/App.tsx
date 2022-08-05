import React from 'react'
import "./App.css"

function App() {
  return (
    <div className="w-full h-full">
      <h1 className="bg-neutral-800 text-white">Hello Chrome!</h1>
      <h3 className="text-red-500">Secondary Hello!</h3>
      <button onClick={()=>chrome.runtime.openOptionsPage(()=>console.log("opened options page"))}>Open Options</button>
    </div>
  );
}

export default App
