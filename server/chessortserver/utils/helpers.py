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

def map_difficulty(difficulty):
    if not (0 <= difficulty <= 100):
        raise ValueError("Difficulty must be within the range of 0 to 100.")
    
    if difficulty < 50:
        return Difficulty.BEGINNER
    elif 50 <= difficulty < 75:
        return Difficulty.EASY
    elif 75 <= difficulty < 87.5:
        return Difficulty.MEDIUM
    elif 87.5 <= difficulty < 95:
        return Difficulty.HARD
    else:
        return Difficulty.MASTER
