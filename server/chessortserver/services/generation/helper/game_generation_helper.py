import random
from ..helper.smart_bucket import Bucket, BucketItem, SmartBucket
from ..helper.selection import SearchMethod, Selection
from ..exception.game_generation_error import GameGenerationError
from ....models.models import Move
from ....utils.math import col_round

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

        if selection.search_method == SearchMethod.TRAVERSAL:
            # Forwards traversal
            if start_index < end_index:
                for i in range(start_index, end_index):
                    bucket = self.smart_bucket[i]

                    if not self._does_bucket_match_selection_criteria(bucket, selection):
                        continue

                    for j in range(0, len(bucket)):
                        bucket_item = bucket[j]
                        if self._does_bucket_item_match_selection_criteria(bucket_item, selection):
                            bucket.mark_as_used(j)
                            return bucket_item.move
            # Backwards traversal
            else:
                for i in range(start_index, end_index, -1):
                    bucket = self.smart_bucket[i]

                    if not self._does_bucket_match_selection_criteria(bucket, selection):
                        continue

                    for j in range(0, len(bucket), -1): # search buckets from bottom upwards
                        bucket_item = bucket[j]
                        if self._does_bucket_item_match_selection_criteria(bucket_item, selection):
                            bucket.mark_as_used(j)
                            return bucket_item.move
        elif selection.search_method == SearchMethod.RANDOM:
            # TODO: Support random selection if using backwards search
            # Create a list of valid bucket indexes to pick from
            valid_bucket_indexes = list(range(start_index, end_index))
            
            seen_indexes_per_bucket = {i: [] for i in valid_bucket_indexes}

            while len(valid_bucket_indexes) > 0:
                random_bucket_index = random.choice(valid_bucket_indexes)
                random_bucket = self.smart_bucket[random_bucket_index]

                if not self._does_bucket_match_selection_criteria(random_bucket, selection):
                    valid_bucket_indexes.remove(random_bucket_index)
                    continue

                random_bucket_item_index = random.choice([i for i in range(len(random_bucket)) if i not in seen_indexes_per_bucket[random_bucket_index]])
                random_bucket_item = random_bucket[random_bucket_item_index]

                if self._does_bucket_item_match_selection_criteria(random_bucket_item, selection):
                    random_bucket.mark_as_used(random_bucket_item_index)
                    return random_bucket_item.move
                else:
                    seen_indexes_per_bucket[random_bucket_index].append(random_bucket_item_index)
                    if len(seen_indexes_per_bucket[random_bucket_index]) == len(random_bucket):
                        valid_bucket_indexes.remove(random_bucket_index)
        
        # Raise an error if we were unable to select any moves
        raise GameGenerationError("Failed to select move matching provided selection.")

    def _does_bucket_match_selection_criteria(self, bucket: Bucket, selection: Selection):
        """
        Check if we the bucket matches the selection criteria.
        """
        if bucket.available <= 0:
            return False
        
        if selection.max_bucket_usage_count and bucket.total_used >= selection.max_bucket_usage_count:
            return False
        
        if selection.advantage and bucket.advantage not in selection.advantage:
            return False
        
        if selection.evaluation_type and bucket.evaluation_type != selection.evaluation_type:
            return False

        return True


    def _does_bucket_item_match_selection_criteria(self, bucket_item: BucketItem, selection: Selection):
        """
        Check if we the bucket item matches the selection criteria.
        """
        if bucket_item.used:
            return False
        
        return True
