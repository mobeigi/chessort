import { Chessboard } from "react-chessboard";

const customDarkSquareColor = "#b58b69";
const customLightSquareColor = "#f1dec2";
const customArrowColor = "#0f8ca8";

const ChessBoard = () => <Chessboard 
    position="2kr3r/pp4p1/2pb2p1/4qp2/3p2P1/3Q3P/PP2PBB1/R2R2K1 w - - 0 21" 
    arePiecesDraggable={false} 
    customDarkSquareStyle={{ backgroundColor: customDarkSquareColor }}
    customLightSquareStyle={{ backgroundColor: customLightSquareColor }}
    customBoardStyle={{ boxShadow: '0 5px 15px rgba(255, 255, 255, 0.1 )'}}
    customArrowColor={customArrowColor}
/>

export default ChessBoard