import math 

def col_round(x: float):
    """
    colloquial round since python round(0.5) = 0 due to IEEE 754 rounding rules
    """
    frac = x - math.floor(x)
    if frac < 0.5: return math.floor(x)
    return math.ceil(x)
