class Selection:
    def __init__(self, start, end=None, is_mate_white=None, mate_range_white=None, is_mate_black=None, mate_range_black=None, max_used_bucket_count=None):
        """
        Initialize the Selection object with the given parameters.

        :param percent: Percentage of moves to consider for selection.
        :param direction: Direction of selection (forwards/backwards).
        :param limit: Limit for selection based on percentage.
        :param is_mate_white: If only white mate moves should be considered.
        :param mate_range_white: The range of mate values to consider for white.
        :param is_mate_black: If only black mate moves should be considered.
        :param mate_range_black: The range of mate values to consider for black.
        :param max_used_bucket_count: Maximum count a bucket can be used.
        """
        self.start = start
        self.end = end
        # self.is_mate_white = is_mate_white
        # self.is_mate_black = is_mate_black
        # self.max_used_bucket_count = max_used_bucket_count
