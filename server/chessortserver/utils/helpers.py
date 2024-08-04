from chessortserver.utils.engine.difficulty import get_eval_difficulty
from ..models.difficulty import Difficulty

def to_move_hash(uci_moves):
    """
    Convert a list of UCI moves into a sorted comma-separated move hash.
    
    Args:
        moves (list): A list of UCI moves.
    
    Returns:
        str: A sorted comma-separated move hash.
    """
    sorted_moves = sorted(uci_moves)
    return ','.join(sorted_moves)

def from_move_hash(move_hash):
    """
    Convert a move hash into a sorted list of moves.
    
    Args:
        move_hash (str): A comma-separated string of UCI moves.
    
    Returns:
        list: A sorted list of UCI moves.
    """
    return move_hash.split(',')

def get_difficulty(evals: list[str]) -> Difficulty:
    difficulty = get_eval_difficulty(evals)

    if not (0 <= difficulty <= 100):
        raise ValueError("Difficulty must be within the range of 0 to 100.")
    
    if difficulty < 50:
        return Difficulty.BEGINNER
    elif 50 <= difficulty < 70:
        return Difficulty.EASY
    elif 70 <= difficulty < 91:
        return Difficulty.MEDIUM
    elif 91 <= difficulty < 98.5:
        return Difficulty.HARD
    else:
        return Difficulty.MASTER
