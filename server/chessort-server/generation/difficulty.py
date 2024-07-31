import math
import statistics

mate_centipawn_value = 3900 # What is a mate in 1 (#1) is worth
mate_decay_constant = 0.2 # How rapidly the centipawn value of a mate decays as we move away from #1 to #2, to #3 etc.

# Downscales factors are used to divide the centipawn equivalent values
# before passing into sigmoid functions
mate_downscale_factor = 800
centipawn_downscale_factor = 400

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def exponential_decay(x, decay_constant=0.1):
    return math.exp(-decay_constant * x)

# Converts a mate into a centipawn value
# Mates for white are positive, mates for black are negative
def mate_to_centipawn(mate_value):
    mate_index_value = abs(mate_value) - 1

    # Compute exponential decay factor
    decay_factor = exponential_decay(mate_index_value, decay_constant=mate_decay_constant)
    
    # Apply decay to mate value
    decayed_mate_centipawns = mate_centipawn_value * decay_factor

    return decayed_mate_centipawns if mate_value > 0 else -decayed_mate_centipawns

# Converts a evaluation string to a centipawn value.
# Also applies the respective downscale factors. 
# 
# Supported input is:
# - Mates: (#1, #2, #-2, #-1)
# - Centipawn values: +200, +100, 0, -100, -200
def convert_eval_to_downscaled_centipawn(eval_str):
    if eval_str.startswith('#'):
        mate_value = int(eval_str[1:])
        return mate_to_centipawn(mate_value) / mate_downscale_factor
    else:
        return int(eval_str)  / centipawn_downscale_factor

# Sort input evals from strongest to weakest
# This returns the strings as in.
# Example:
#   ['+200', '-50', '#-1', '#1'] -> ['#1', '+200', '-50', '#-1']
def sort_evals(evals):
    """Convert and sort evaluations from strongest to weakest."""
    def convert_eval(eval_str):
        """Convert evaluation string to an integer value for sorting."""
        if eval_str.startswith('#'):
            mate_value = int(eval_str[1:])
            if mate_value > 0:
                return 32000 - mate_value  # Mate in N for white
            else:
                return -32000 - mate_value  # Mate in N for black
        else:
            return int(eval_str)
    
    evals_sorted = sorted(evals, key=convert_eval, reverse=True)
    return evals_sorted


# Returns the difficulty for a human to sort various moves based on their engine evaluation.
# 
# The returned value is normalized to [0, 100].
#  - A high value (like 100) means extremely difficuly to sort.
#  - A low value (like 0) means extremely easy to sort.
#
# Note: Pairs with the same evaluation are considered to be extremely easy to sort (as they are correct in either order).
# However, pairs with slight differences (i.e. +1 and +2) are considered to be extremely hard to sort (as they are correct only in the right order and have a very small variance).
def get_difficulty(evals):
    # Sort input
    # We rely on natural strength ordering (from mate in 1 for white first to mate in 1 for black last)
    sorted_evals = sort_evals(evals)

    # Get centipawn values
    centipawn_values = [convert_eval_to_downscaled_centipawn(move) for move in sorted_evals]

    # Pass through sigmoid to bind to [0, 1] range
    normalized_centipawn_values = [sigmoid(value) for value in centipawn_values]

    # Compute adjacent diffs
    # The adjacent diffs tell us how much difference there is between two adjacent evaluations
    # The idea is it is easier for humans to sort evaluations if there is a larger gap between them compared to a smaller gap.
    adjacent_diffs = [abs(normalized_centipawn_values[i] - normalized_centipawn_values[i + 1]) for i in range(len(normalized_centipawn_values) - 1)]

    # Special case: strip out all values that are zero
    # These are the result of equivalent evaluations and since they are correct in any position, we don't want them to influence the final difficulty
    # Keep in mind that even though they are removed, the original evaluations are all still considerd.
    adjacent_diffs = [num for num in adjacent_diffs if num != 0]

    # If there are no adjacent diffs left, all evaluations were equal and this is a 0 difficulty (extremely easy)
    if len(adjacent_diffs) == 0:
        return 0

    # The harmonic mean is used (over regular mean) so that smaller values greatly influence the final difficulty
    # This is because even if 1 pair comparison is hard and the rest are easy, the overall difficulty is still hard (to sort all adjacent pairs) 
    harmonic_mean = statistics.harmonic_mean(adjacent_diffs)

    # Compute difficulty
    max_harmonic_mean = 1 / len(adjacent_diffs) # Max possible value a harmonic mean can be depends on number of input params
    difficulty = 100 - (harmonic_mean / max_harmonic_mean) * 100

    return difficulty
