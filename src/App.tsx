import PlayerSection from "./components/PlayerSection";
import Scoreboard from "./components/Scoreboard";
import { GameProvider } from "./provider/GameProvider";
import StartGame from "./components/StartGame";
import "./App.css";

function App() {
  return (
    <GameProvider>
      <main className="h-screen w-screen grid grid-rows-[auto_auto] lg:grid-cols-2 lg:grid-rows-1 ">
        <Scoreboard />
        <StartGame />
        <PlayerSection index={0} />
        <PlayerSection index={1} />
      </main>
    </GameProvider>
  );
}

export default App;
