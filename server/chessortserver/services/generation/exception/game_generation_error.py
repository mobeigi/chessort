class GameGenerationError(Exception):
    """Exception indicating game generation fails."""

    def __init__(self, message):
        self.message = message
        super().__init__(self.message)
