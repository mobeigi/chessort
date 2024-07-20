import { useContext } from 'react';
import { GameContext } from '../context/gameContext'; // Adjust the import path accordingly

export const useGameContext = () => useContext(GameContext);
