import random
from typing import Optional

from chessortserver.models.chess import Color
from chessortserver.utils.engine.strength import normalised_strength
from chessortserver.utils.chess import get_turn_player_from_fen
from ..helper.smart_bucket import Bucket, BucketItem, SmartBucket
from ..helper.selection import SearchMethod, Selection
from ..exception.game_generation_error import GameGenerationError
from ....models.models import Position, Move
from ....utils.math import col_round

class GameGenerationHelper:
    def __init__(self, position: Position, moves: list[Move]):
        """
        Initialize the GameGenerationHelper.
        """
        self.position = position
        self.moves = moves
        self.smart_bucket: SmartBucket = SmartBucket(self.moves)

    def select_move(self, selection: Selection):
        """
        Select a move based on the given selection criteria.
        """
        
        # Check selection start & end
        if not (0 <= selection.start <= 1):
            raise GameGenerationError(f"Start must be within [0,1]. Start: {selection.start}.")

        if selection.end is not None and not (0 <= selection.end <= 1):
            raise GameGenerationError(f"End must be within [0,1]. End: {selection.end}.")

        # Get the number of buckets
        num_buckets = len(self.smart_bucket)
        total_available = sum(bucket.available for bucket in self.smart_bucket)

        if num_buckets <= 0:
            raise GameGenerationError("No buckets available to select moves from.")
        elif total_available <= 0:
            raise GameGenerationError("No moves available to select from in any bucket.")

        # Calculate start index
        start_index = col_round(num_buckets * selection.start)

        # Calculate end index
        end_index = num_buckets # we search to the last bucket by default
        if selection.end is not None:
            end_index = col_round(num_buckets * selection.end)

        if start_index == end_index:
            raise GameGenerationError(f"Unable to search index range of [{start_index}, {end_index}].")

        # Adjust indexes for backwards searches
        if end_index < start_index:
            start_index = start_index - 1
            end_index = end_index - 1 

        move = None
        if selection.bucket_search_method == SearchMethod.TRAVERSAL:
            move = self._pick_via_traversal(start_index, end_index, selection)
        elif selection.bucket_search_method == SearchMethod.RANDOM:
            move = self._pick_via_random(start_index, end_index, selection)
        
        # Raise an error if we were unable to select any moves
        if move is None:
            raise GameGenerationError("Failed to select move matching provided selection.")
        return move

    def _pick_via_traversal(self, start_index: int, end_index: int, selection: Selection) -> Optional[Move]:
        # Forwards traversal
        if start_index < end_index:
            for i in range(start_index, end_index):
                bucket = self.smart_bucket[i]

                if not self._does_bucket_match_selection_criteria(bucket, selection):
                    continue

                move = None
                if selection.bucket_item_search_method == SearchMethod.TRAVERSAL:
                    move = self._traverse(True, selection, bucket)
                elif selection.bucket_item_search_method == SearchMethod.RANDOM:
                    move = self._random(selection, bucket)

                if move is not None:
                    return move
        # Backwards traversal
        else:
            for i in range(start_index, end_index, -1):
                bucket = self.smart_bucket[i]

                if not self._does_bucket_match_selection_criteria(bucket, selection):
                    continue

                move = None
                if selection.bucket_item_search_method == SearchMethod.TRAVERSAL:
                    move = self._traverse(False, selection, bucket)
                elif selection.bucket_item_search_method == SearchMethod.RANDOM:
                    move = self._random(selection, bucket)

                if move is not None:
                    return move
        return None

    def _pick_via_random(self, start_index: int, end_index: int, selection: Selection) -> Optional[Move]:
        # TODO: Support random selection if using backwards search
        # Create a list of valid bucket indexes to pick from
        valid_bucket_indexes = list(range(start_index, end_index + 1))

        while valid_bucket_indexes:
            random_bucket_index = random.choice(valid_bucket_indexes)
            random_bucket = self.smart_bucket[random_bucket_index]

            if not self._does_bucket_match_selection_criteria(random_bucket, selection):
                valid_bucket_indexes.remove(random_bucket_index)
                continue

            random_move = None
            if selection.bucket_item_search_method == SearchMethod.TRAVERSAL:
                random_move = self._traverse(True, selection, random_bucket) # TODO: handle backwards
            elif selection.bucket_item_search_method == SearchMethod.RANDOM:
                random_move = self._random(selection, random_bucket)
            
            if random_move is not None:
                return random_move
            else:
                valid_bucket_indexes.remove(random_bucket_index)
        return None
    
    def _traverse(self, forwards: bool, selection: Selection, bucket: Bucket) -> Optional[Move]:
        # Forwards traversal
        if forwards:
            for j in range(0, len(bucket)):
                bucket_item = bucket[j]
                if self._does_bucket_item_match_selection_criteria(bucket_item, selection):
                    bucket.mark_as_used(j)
                    return bucket_item.move
        # Backwards traversal
        else:
            for j in range(len(bucket)-1, -1, -1): # search buckets in reverse
                bucket_item = bucket[j]
                if self._does_bucket_item_match_selection_criteria(bucket_item, selection):
                    bucket.mark_as_used(j)
                    return bucket_item.move
        return None
    
    def _random(self, selection: Selection, bucket: Bucket) -> Optional[Move]:
        available_indexes = list(range(len(bucket)))
        random.shuffle(available_indexes)

        for random_bucket_item_index in available_indexes:
            random_bucket_item = bucket[random_bucket_item_index]

            if self._does_bucket_item_match_selection_criteria(random_bucket_item, selection):
                bucket.mark_as_used(random_bucket_item_index)
                return random_bucket_item.move
        
        return None

    def _does_bucket_match_selection_criteria(self, bucket: Bucket, selection: Selection):
        """
        Check if we the bucket matches the selection criteria.
        """
        if bucket.available <= 0:
            return False
        
        if selection.max_bucket_usage_count and bucket.total_used >= selection.max_bucket_usage_count:
            return False
        
        if len(bucket) < selection.min_bucket_size:
            return False
        
        if selection.advantage and bucket.advantage not in selection.advantage:
            return False
        
        if selection.evaluation_type and bucket.evaluation_type != selection.evaluation_type:
            return False
        
        if selection.max_norm_eval_strength is not None:
            turn_player = get_turn_player_from_fen(self.position.fen)
            # All bucket items have the same eval so any will do
            bucket_normalised_strength = normalised_strength([bucket[0].move.engine_eval], turn_player)[0]
            if bucket_normalised_strength > selection.max_norm_eval_strength:
                return False

        return True


    def _does_bucket_item_match_selection_criteria(self, bucket_item: BucketItem, selection: Selection):
        """
        Check if we the bucket item matches the selection criteria.
        """
        if bucket_item.used:
            return False
        
        return True
