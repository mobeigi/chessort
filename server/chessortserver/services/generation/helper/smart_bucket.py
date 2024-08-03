from chessortserver.utils.move import get_advantage, get_evaluation_type
from ....models.models import Move
from ....models.chess import Color, EvaluationType

class BucketItem:
    """ A bucket item contains a move and additional useful fields for the move. """
    def __init__(self, move: Move) -> None:
        self._move = move
        self._used = False

    @property
    def move(self) -> Move:
        return self._move

    @property
    def used(self) -> bool:
        return self._used

class Bucket:
    """ A bucket stores a list of bucket items and some other useful fields to track usage. """
    def __init__(self) -> None:
        self._contents: list[BucketItem] = []
        self._total_used = 0
    
    @property
    def total_used(self) -> int:
        return self._total_used

    @property
    def available(self) -> int:
        return len(self) - self.total_used

    @property
    def advantage(self) -> Color:
        if len(self) <= 0:
            raise IndexError("Not enough elements")
        # Advantage of every item in bucket is the same
        return get_advantage(self._contents[0].move)

    @property
    def evaluation_type(self) -> EvaluationType:
        if len(self) <= 0:
            raise IndexError("Not enough elements")
        # Evaluation type of each item in bucket is the same
        return get_evaluation_type(self._contents[0].move)

    def __len__(self) -> int:
        return len(self._contents)

    def __getitem__(self, index: int) -> BucketItem:
        if 0 <= index < len(self):
            return self._contents[index]
        else:
            raise IndexError("Index out of range")

    def append(self, move: Move) -> None:
        bucket_item = BucketItem(move)
        self._contents.append(bucket_item)

    def mark_as_used(self, index: int) -> None:
        if 0 <= index < len(self):
            self._contents[index]._used = True
            self._total_used += 1
        else:
            raise IndexError("Index out of range")

class SmartBucket:
    def __init__(self, moves: list[Move]) -> None:
        # Buckets must be sorted by the engine overall rank!
        # This is a core requirement that powers the functionality of this class 
        self._buckets = self._init_smart_bucket(moves)

    def __len__(self) -> int:
        return len(self._buckets)

    def __getitem__(self, index: int) -> Bucket:
        if 0 <= index < len(self):
            return self._buckets[index]
        else:
            raise IndexError("Index out of range")

    def _init_smart_bucket(self, moves: list[Move]) -> list[Bucket]:
        # Early exit if no moves are provided
        if len(moves) <= 0:
            return []
        
        # Group moves by evaluation
        grouped_moves = {}
        for move in moves:
            if move.engine_eval not in grouped_moves:
                # Initialize the bucket with the engine overall rank for sorting
                grouped_moves[move.engine_eval] = (Bucket(), move.engine_overall_rank)
            grouped_moves[move.engine_eval][0].append(move)
        
        # Sort the buckets by the overall rank
        sorted_buckets = [grouped_move for grouped_move, _ in sorted(grouped_moves.values(), key=lambda item: item[1])]
        return sorted_buckets
