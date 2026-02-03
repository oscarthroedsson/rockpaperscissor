import { createContext } from "react";

import type { GameContextType } from "../provider/GameProvider";

export const GameContext = createContext<GameContextType | undefined>(undefined);
