from ....models.models import Move

class BucketItem:
    """ A bucket item contains a move and additional useful fields for the move. """
    def __init__(self, move: Move) -> None:
        self.move = move
        self.used = False

class Bucket:
    """ A bucket stores a list of bucket items and some other useful fields to track usage. """
    def __init__(self) -> None:
        self._contents: list[BucketItem] = []
        self._total_used = 0

    @property
    def size(self) -> int:
        return len(self._contents)

    @property
    def total_used(self) -> int:
        return self._total_used

    @property
    def available(self) -> int:
        return self.size - self.total_used

    def append(self, move) -> Move:
        bucket_item = BucketItem(move)
        self._contents.append(bucket_item)

    def __getitem__(self, index: int) -> Move:
        if 0 <= index < self.size:
            return self._contents[index].move
        else:
            raise IndexError("Index out of range")
    
    def is_used(self, index: int) -> bool:
        if 0 <= index < self.size:
            return self._contents[index].used
        else:
            raise IndexError("Index out of range")

    def mark_as_used(self, index: int) -> None:
        if 0 <= index < self.size:
            self._contents[index].used = True
            self._total_used += 1
        else:
            raise IndexError("Index out of range")

class SmartBucket:
    def __init__(self, moves: list[Move]) -> None:
        # Buckets must be sorted by the engine overall rank!
        # This is a core requirement that powers the functionality of this class 
        self._buckets = self._init_smart_bucket(moves)
        
        if len(self._buckets) != len(moves):
            raise ValueError('Failed to create SmartBucket of expected size.')

    @property
    def size(self) -> int:
        return len(self._buckets)

    def __getitem__(self, index: int) -> Bucket:
        if 0 <= index < self.size:
            return self._buckets[index]
        else:
            raise IndexError("Index out of range")

    def _init_smart_bucket(self, moves: list[Move]):
        # Early exit
        if len(moves) <= 0:
            return []
        
        # Group moves by evaluation
        grouped_moves = {}
        for move in moves:
            if move.engine_eval not in grouped_moves:
                grouped_moves[move.engine_overall_rank] = Bucket()
            grouped_moves[move.engine_overall_rank].append(move)

        # Sort the keys (engine_overall_rank) and create a list of Bucket objects
        sorted_buckets = [grouped_moves[engine_overall_rank] for engine_overall_rank in sorted(grouped_moves.keys())]
        return sorted_buckets
