import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PlayerSection from "./components/PlayerSection";
import Scoreboard from "./components/Scoreboard";
import { GameProvider } from "./provider/GameProvider";
import StartGame from "./components/StartGame";
import EndGame from "./components/EndGame";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <main className="h-screen w-screen grid grid-rows-[auto_auto] lg:grid-cols-2 lg:grid-rows-1 ">
          <Scoreboard />
          <StartGame />
          <EndGame />
          <PlayerSection player="player1" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
             text-5xl font-bold text-white"
            style={{
              fontFamily: '"Fredoka One", cursive',
              textShadow: `
      -2px -2px 0 #000,
       2px -2px 0 #000,
      -2px  2px 0 #000,
       2px  2px 0 #000
    `,
            }}
          >
            VS
          </div>
          <PlayerSection player="player2" />
        </main>
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
