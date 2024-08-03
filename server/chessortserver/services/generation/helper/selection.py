from enum import Enum

from chessortserver.models.chess import Color, EvaluationType

class SearchMethod(Enum):
    TRAVERSAL = "traversal"  # Search items in-order
    RANDOM = "random"        # Search by picking items randomly

class Selection:
    def __init__(self, 
                 start: float, 
                 end: float = None, 
                 search_method = SearchMethod.TRAVERSAL, 
                 max_bucket_usage_count: int = None,
                 evaluation_type: EvaluationType = None,
                 advantage: list[Color] = None
    ):
        """
        Initialize the Selection object with the given parameters.

        :param start: Starting index (as a percentage of total buckets) to begin search at. Inclusive. Can be higher or lower than end.
        :param end: Ending index (as a percentage of total buckets) to end search at. Exclusive. Can be higher or lower than start. None defaults to location of last bucket.
        :param search_method: The search method used when iterating through items.
        :param evaluation_type: The move's evaluation type to pick. None means any.
        :param advantage: A list of acceptable advantages. None means any.
        """
        self.start = start
        self.end = end
        self.search_method = search_method
        self.max_bucket_usage_count = max_bucket_usage_count
        self.evaluation_type = evaluation_type
        self.advantage = advantage

    def __str__(self):
        return (f"Selection(start={self.start}, end={self.end}, search_method={self.search_method.value}, "
                f"max_bucket_usage_count={self.max_bucket_usage_count}, eval_type={self.evaluation_type}, "
                f"advantage_for={self.advantage})")

    def __repr__(self):
        return self.__str__()
