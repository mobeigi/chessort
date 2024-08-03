from enum import Enum

class Color(Enum):
    WHITE = "White"
    BLACK = "Black"
    NEUTRAL = "Neutral"

class EvaluationType(Enum):
    MATE = "Mate"
    CENTIPAWN = "Centipawn"
