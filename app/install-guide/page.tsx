export default function InstallGuide() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Installation Guide</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How to Install Pokémon Infinite Fusion</h2>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          <li>Download the latest game version from the <a href="https://www.pokecommunity.com/showthread.php?t=347883" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">official thread</a>.</li>
          <li>Extract the downloaded ZIP file to your preferred folder.</li>
          <li>Double-click <span className="font-mono bg-gray-100 px-2 py-1 rounded">Game.exe</span> to start the game.</li>
          <li>If you see missing DLL errors, install the <a href="https://www.microsoft.com/en-us/download/details.aspx?id=48145" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Microsoft Visual C++ Redistributable</a>.</li>
        </ol>
        <p className="mb-4">
          The installer will guide you through the process. If you&apos;re asked about installing additional components like DirectX or .NET runtimes, it&apos;s generally a good idea to install them.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions (FAQ)</h2>
        <div className="mb-4">
          <div className="font-semibold">Q: The game won't start or crashes on launch?</div>
          <div className="text-gray-700">A: Make sure you have extracted all files and installed the required Visual C++ Redistributable. Try running as administrator.</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold">Q: How do I update the game?</div>
          <div className="text-gray-700">A: Download the latest patch from the official thread and overwrite the old files in your game folder.</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold">Q: Where can I find more resources or help?</div>
          <div className="text-gray-700">A: Visit the <a href="https://discord.gg/8G5WqFQ" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">official Discord server</a> or the <a href="https://www.pokecommunity.com/showthread.php?t=347883" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">PokeCommunity thread</a>.</div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Patch & Mod Installation</h2>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          <li>Download the patch or mod ZIP file.</li>
          <li>Extract it into your game folder, overwriting files if prompted.</li>
          <li>Restart the game to apply changes.</li>
        </ol>
      </section>
      <h3 className="text-xl font-semibold mb-2">4. Running the Game</h3>
    </div>
  );
} 