class Selection:
    def __init__(self, start, end=None, max_bucket_usage_count=None):
        """
        Initialize the Selection object with the given parameters.

        :param start: Starting index (as a percentage of total buckets) to begin search at. Can be higher or lower than end.
        :param end: Ending index (as a percentage of total buckets) to end search at. Can be higher or lower than start.
        :param max_bucket_usage_count: The maximum number of times the same bucket can be used. Optional parameter.
        """
        self.start = start
        self.end = end
        self.max_bucket_usage_count = max_bucket_usage_count
