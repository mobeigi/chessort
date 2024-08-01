class Selection:
    def __init__(self, start, end=None):
        """
        Initialize the Selection object with the given parameters.

        :param start: Starting index (as a percentage of total buckets) to begin search at. Can be higher or lower than end.
        :param end: Ending index (as a percentage of total buckets) to end search at. Can be higher or lower than start.
        """
        self.start = start
        self.end = end
