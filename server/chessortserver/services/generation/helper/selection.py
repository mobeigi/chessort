from enum import Enum

from chessortserver.models.chess import Color, EvaluationType

class SearchMethod(Enum):
    TRAVERSAL = "traversal"  # Search items in-order
    RANDOM = "random"        # Search by picking items randomly

class Selection:
    def __init__(self, 
                 start: float, 
                 end: float = None, 
                 bucket_search_method = SearchMethod.TRAVERSAL, 
                 bucket_item_search_method = SearchMethod.TRAVERSAL, 
                 max_bucket_usage_count: int = None,
                 min_bucket_size: int = 0,
                 evaluation_type: EvaluationType = None,
                 advantage: list[Color] = None,
                 max_norm_eval_strength: int = None
    ):
        """
        Initialize the Selection object with the given parameters.

        :param start: Starting index (as a percentage of total buckets) to begin search at. Inclusive. Can be higher or lower than end.
        :param end: Ending index (as a percentage of total buckets) to end search at. Exclusive. Can be higher or lower than start. None defaults to location of last bucket.
        :param bucket_search_method: The search method used to find the bucket.
        :param bucket_item_search_method: The search method used to find items in the bucket.
        :param max_bucket_usage_count: The max number of times a bucket is allowed to be used.
        :param min_bucket_size: The minimum size of a bucket.
        :param evaluation_type: The move's evaluation type to pick. None means any.
        :param advantage: A list of acceptable advantages. None means any.
        :param max_norm_eval_strength: The maximum normalised eval strength to allow for the move. Relative to the turn player.
        """
        self.start = start
        self.end = end
        self.bucket_search_method = bucket_search_method
        self.bucket_item_search_method = bucket_item_search_method
        self.max_bucket_usage_count = max_bucket_usage_count
        self.min_bucket_size = min_bucket_size
        self.evaluation_type = evaluation_type
        self.advantage = advantage
        self.max_norm_eval_strength = max_norm_eval_strength

    def __str__(self):
        return (f"Selection(start={self.start}, end={self.end}, bucket_search_method={self.bucket_search_method}, "
                f"bucket_item_search_method={self.bucket_item_search_method}, max_bucket_usage_count={self.max_bucket_usage_count}, "
                f"min_bucket_size={self.min_bucket_size}, evaluation_type={self.evaluation_type}, advantage={self.advantage}, "
                f"max_norm_eval_strength={self.max_norm_eval_strength})")

    def __repr__(self):
        return self.__str__()
