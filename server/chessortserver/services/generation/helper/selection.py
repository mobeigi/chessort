from enum import Enum
class SearchMethod(Enum):
    TRAVERSAL = "traversal" # Search items in-order
    RANDOM = "random" # Search by picking items randomly

class Selection:
    def __init__(self, start: float, end: float = None, search_method = SearchMethod.TRAVERSAL, max_bucket_usage_count: int = None):
        """
        Initialize the Selection object with the given parameters.

        :param start: Starting index (as a percentage of total buckets) to begin search at. Inclusive. Can be higher or lower than end.
        :param end: Ending index (as a percentage of total buckets) to end search at. Exclusive. Can be higher or lower than start.
        :param search_method: The search method used when iterating through items.
        :param max_bucket_usage_count: The maximum number of times the same bucket can be used. Optional parameter.
        """
        self.start = start
        self.end = end
        self.search_method = search_method
        self.max_bucket_usage_count = max_bucket_usage_count

    def __str__(self):
        return (f"Selection(start={self.start}, end={self.end}, search_method={self.search_method.value}, "
                f"max_bucket_usage_count={self.max_bucket_usage_count})")

    def __repr__(self):
        return self.__str__()
