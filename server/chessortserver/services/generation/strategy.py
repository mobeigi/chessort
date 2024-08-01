from ...models.models import Move

class Strategy:
    """
    Base class for all move selection strategies.
    This class should be extended by specific strategy implementations.
    """

    def __init__(self):
        """
        Initialize the strategy.
        This can be extended by subclasses to initialize specific attributes.
        """
        pass

    def select_moves(self, moves: list[Move], num_required_moves: int) -> list[Move]:
        """
        Select moves based on the strategy.
        This method should be implemented by subclasses.
        
        :param moves: List of all available moves.
        :param num_required_moves: The number of moves to select.
        :return: List of the selected moves. Should return len(num_required_moves) moves.
        :raises NotImplementedError: If the method is not implemented in the subclass.
        """
        raise NotImplementedError("This method should be implemented by subclasses.")

    def can_handle(self, moves: list[Move], num_required_moves: int) -> bool:
        """
        Determines if this strategy can select moves for the given moves and number of required moves.
        This method can be overridden by subclasses.
        
        :param moves: List of all available moves.
        :param num_required_moves: The number of moves to select.
        :return: True if the strategy will be able to handle this set of moves and required moves.
        :raises ValueError: If num_required_moves is greater than the number of available moves.
        """
        if len(moves) == 0 or num_required_moves <= 0:
            return False

        if num_required_moves > len(moves):
            return False

        return True
