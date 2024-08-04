from chessortserver.models.chess import Color, EvaluationType
from chessortserver.models.models import Move

def get_advantage(move: Move) -> Color:
    """
    Determine the advantage based on the engine evaluation.
    
    :param move: Move object containing the engine evaluation.
    :return: Color enum indicating the advantage.
    """
    eval_str = move.engine_eval
    if eval_str.startswith('#'):
        # Mate evaluation
        mate_value = int(eval_str[1:])
        if mate_value > 0:
            return Color.WHITE
        else:
            return Color.BLACK
    else:
        # Centipawn evaluation
        eval_value = int(eval_str)
        if eval_value > 0:
            return Color.WHITE
        elif eval_value < 0:
            return Color.BLACK
        else:
            return Color.NEUTRAL

def get_evaluation_type(move: Move) -> EvaluationType:
    """
    Determine the evaluation type (Mate or Centipawn).
    
    :param move: Move object containing the engine evaluation.
    :return: EvaluationType enum indicating the type of evaluation.
    """
    eval_str = move.engine_eval
    if eval_str.startswith('#'):
        return EvaluationType.MATE
    else:
        return EvaluationType.CENTIPAWN

def sort_evals(evals):
    """
    Sort input evals from strongest to weakest
    This returns the eval strings unchanged but in sorted order.
    Example:
      ['+200', '-50', '#-1', '#1'] -> ['#1', '+200', '-50', '#-1']
    """
    white_mates = []
    centipawns = []
    black_mates = []
    
    # Put into right list
    for eval_str in evals:
        if eval_str.startswith("#"):
            mate_value = int(eval_str[1:])
            if mate_value > 0:
                white_mates.append(eval_str)
            else:
                black_mates.append(eval_str)
        else:
            centipawns.append(eval_str)
    
    # Sort each list
    white_mates.sort(key=lambda x: int(x[1:]))
    centipawns.sort(key=lambda x: -int(x))
    black_mates.sort(key=lambda x: int(x[1:]))

    # Combine sorted lists
    sorted_evals = white_mates + centipawns + black_mates
    return sorted_evals

def get_turn_player_from_fen(fen: str) -> Color:
    """
    Get the turn player from a FEN string.

    :param fen: FEN string representing the board state.
    :return: Color.WHITE if it's white's turn, Color.BLACK if it's black's turn.
    """
    # The FEN string is space-separated. The turn player is the second field.
    fen_parts = fen.split(' ')
    if len(fen_parts) < 2:
        raise ValueError("Invalid FEN string")

    turn_player = fen_parts[1]
    if turn_player == 'w':
        return Color.WHITE
    elif turn_player == 'b':
        return Color.BLACK
    else:
        raise ValueError("Invalid turn player in FEN string")
