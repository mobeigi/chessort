import math
import statistics

from chessortserver.models.chess import Color

from ..utils.helpers import sort_evals

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

# Returns the difficulty for a human to sort various moves based on their engine evaluation.
# 
# The returned value is normalized to [0, 100].
#  - A high value (like 100) means extremely difficuly to sort.
#  - A low value (like 0) means extremely easy to sort.
#
# Note: Pairs with the same evaluation are considered to be extremely easy to sort (as they are correct in either order).
# However, pairs with slight differences (i.e. +1 and +2) are considered to be extremely hard to sort (as they are correct only in the right order and have a very small variance).
def get_difficulty(evals):
    # Sort input.
    # We rely on natural strength ordering (from mate in 1 for white first to mate in 1 for black last).
    sorted_evals = sort_evals(evals)

    # Get centipawn values
    centipawn_values = [convert_eval_to_normalised(move) for move in sorted_evals]

    # Renormalise all values in [1.5, -0.5] range to bind to [0, 1] range.
    # The scaling here is linear.
    normalized_centipawn_values = normalize(centipawn_values, -0.5, 1.5)

    # Compute adjacent diffs.
    # The adjacent diffs tell us how much difference there is between two adjacent evaluations.
    # The idea is it is easier for humans to sort evaluations if there is a larger gap between them compared to a smaller gap.
    # IMPORTANT: The input must be an ordered and normalised list of values to ensure our assumptions on theoretical maximum / minimum values is sound. 
    adjacent_diffs = [abs(normalized_centipawn_values[i] - normalized_centipawn_values[i + 1]) for i in range(len(normalized_centipawn_values) - 1)]

    # Special case: strip out all values that are zero
    # These are the result of equivalent evaluations and since they are correct in any position, we don't want them to influence the final difficulty
    # Keep in mind that even though they are removed, the original evaluations are all still considerd.
    adjacent_diffs = [num for num in adjacent_diffs if num != 0]

    # If there are no adjacent diffs left, all evaluations were equal and this is 0 difficulty (extremely easy because all orderings are correct)
    if len(adjacent_diffs) == 0:
        return 0

    # The harmonic mean is used (instead of a regular mean) so that smaller values greatly influence the final difficulty.
    # This is because even if 1 pair of comparisons is hard and the rest are easy, the overall difficulty is still hard (to sort all adjacent pairs).
    harmonic_mean = statistics.harmonic_mean(adjacent_diffs)

    # Compute difficulty
    max_harmonic_mean = 1 / len(adjacent_diffs) # Max possible value a harmonic mean can be for ordered, normalised input (based on number of input params)
    difficulty = 100 - (harmonic_mean / max_harmonic_mean) * 100
    
    return difficulty

# TODO: Document
def normalised_strength(evals: list[str], turn_player: Color = Color.WHITE) -> list[float]:
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
