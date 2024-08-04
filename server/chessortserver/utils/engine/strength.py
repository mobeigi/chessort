import math

from chessortserver.models.chess import Color

from ..chess import sort_evals

# Downscales factors are used to divide the centipawn equivalent values before passing into sigmoid functions
# They influence the rate of decay in the sigmoid functions output
mate_downscale_factor = 2 # relative to mate values 1,2,3,4 etc
centipawn_downscale_factor = 400 # relative to 1 pawn (100 centipawns)

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def normalize(list, min_val, max_val):
    if min_val == max_val:
        raise ValueError("min_val and max_val cannot be the same.")

    normalized_list = [(x - min_val) / (max_val - min_val) for x in list]
    return normalized_list

def mate_to_normalised(mate_value):
    base_mate_value = abs(mate_value) - 1
    base_mate_value = base_mate_value / mate_downscale_factor
    normalised_mate_value = sigmoid(-1 * base_mate_value)

    # Transform normalised range
    if mate_value > 0:
        # [0.5, 1] -> [1, 1.5] 
        normalised_mate_value = 1 + normalised_mate_value
    else:
        # [0.5, 1] -> [0, -0.5] 
        normalised_mate_value = 0 - normalised_mate_value

    return normalised_mate_value

def centipawn_to_normalised(centipawn_value):
    return sigmoid(centipawn_value / centipawn_downscale_factor)

# Converts an eval string into a normalised value between [-1.5, -0.5]
# Supports mates and centipawn eval strings
def convert_eval_to_normalised(eval_str):
    if eval_str.startswith('#'):
        mate_value = int(eval_str[1:])
        return mate_to_normalised(mate_value)
    else:
        return centipawn_to_normalised(int(eval_str))

def normalised_strength(evals: list[str], turn_player: Color = Color.WHITE) -> list[float]:
    """
    Get the normalised strength for input evaluations in [0,1] range.
    If a turn player is passed in, the normalised strength will be relative to that turn player.
    """
    # Sort input.
    # We rely on natural strength ordering (from mate in 1 for white first to mate in 1 for black last).
    sorted_evals = sort_evals(evals)

    # Get centipawn values
    centipawn_values = [convert_eval_to_normalised(move) for move in sorted_evals]

    # Renormalise all values in [1.5, -0.5] range to bind to [0, 1] range.
    # The scaling here is linear.
    normalized_centipawn_values = normalize(centipawn_values, -0.5, 1.5)
    
    # Convert to relative if needed
    if turn_player == Color.BLACK:
        normalized_centipawn_values = [ 1 - x for x in normalized_centipawn_values]

    return normalized_centipawn_values
