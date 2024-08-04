import statistics
from .strength import normalised_strength

# Returns the difficulty for a human to sort various moves based on their engine evaluation.
# 
# The returned value is normalized to [0, 100].
#  - A high value (like 100) means extremely difficuly to sort.
#  - A low value (like 0) means extremely easy to sort.
#
# Note: Pairs with the same evaluation are considered to be extremely easy to sort (as they are correct in either order).
# However, pairs with slight differences (i.e. +1 and +2) are considered to be extremely hard to sort (as they are correct only in the right order and have a very small variance).
def get_eval_difficulty(evals):
    # Get normalised centipawn value
    normalized_centipawn_values = normalised_strength(evals)

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
