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
