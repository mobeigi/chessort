import { Chessboard } from "react-chessboard";
import { useGameContext } from '../../context/gameContext';

const customDarkSquareColor = "#b58b69";
const customLightSquareColor = "#f1dec2";
const customArrowColor = "#0f8ca8";

const ChessBoard = () => {
    const { state } = useGameContext();
    
    return (<Chessboard 
        position={state.gameDetails.fen} 
        arePiecesDraggable={false} 
        customDarkSquareStyle={{ backgroundColor: customDarkSquareColor }}
        customLightSquareStyle={{ backgroundColor: customLightSquareColor }}
        customBoardStyle={{ boxShadow: '0 5px 15px rgba(255, 255, 255, 0.1 )'}}
        customArrowColor={customArrowColor}
    />)
};

export default ChessBoard