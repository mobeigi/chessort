from ..helper.smart_bucket import SmartBucket
from ..helper.selection import Selection
from ..exception.game_generation_error import GameGenerationError
from ....models.models import Move

class GameGenerationHelper:
    def __init__(self, moves: list[Move]):
        """
        Initialize the GameGenerationHelper with a list of moves.
        """
        self.moves = moves
        self.smart_bucket: SmartBucket = SmartBucket(self.moves)

    def select_move(self, selection: Selection):
        """
        Select a move based on the given selection criteria.
        """
        
        # Get the number of buckets
        num_buckets = self.smart_bucket.size
        total_available = sum(bucket.available for bucket in self.smart_bucket)

        if num_buckets <= 0:
            raise GameGenerationError("No buckets available to select moves from.")
        elif total_available <= 0:
            raise GameGenerationError("No moves available to select from in any bucket.")
        
        # Calculate start index
        start_index = round((num_buckets - 1) * selection.start)

        # Calculate end index
        end_index = start_index
        if selection.end is not None:
            end_index = round((num_buckets - 1) * selection.end)

        # Iterate through the buckets and select a move
        if start_index <= end_index:
            for i in range(start_index, end_index):
                bucket = self.smart_bucket[i]
                for j in range(0, bucket.size):
                    # Check the criteria for the move
                    move = bucket[j]
                    if self._is_valid_move(bucket, j, move, selection):
                        # Mark move as selected in bucket
                        bucket.mark_as_used(j)
                        return move
        else:
            for i in range(start_index, end_index, -1):
                bucket = self.smart_bucket[i]
                for j in range(0, bucket.size):
                    # Check the criteria for the move
                    move = bucket[j]
                    if self._is_valid_move(bucket, j, move, selection):
                        # Mark move as selected in bucket
                        bucket.mark_as_used(j)
                        return move
        
        # Raise an error if no move was selected
        raise GameGenerationError("Failed to select move matching provided selection.") 

    def _is_valid_move(self, bucket, moveIndex, move, selection):
        # TODO: finish
        if bucket.is_used(moveIndex):
            return False
        
        return True
