import random 

from chessortserver.models.models import Move

def random_engine_overall_rank(limit=50):
    return random.randrange(1, limit)

def random_engine_eval():
    if random.random() < 0.3:
        # Mate eval
        is_white = random.random() <= 0.5
        mate_value = random.randrange(1, 30)
        sign = '-' if is_white else ''
        return f"#{sign}{mate_value}"
    else:
        #Centipawn eval
        centipawns = random.randrange(-1500, 1500)
        return "{:+}".format(centipawns)

def random_uci_move():
    """ Random UCI move. Hardcoded but good enough for now. """
    uci_moves = ["e2e4", "d2d4", "c2c4", "g1f3", "b1c3", "g1h3", "b1a3", "f2f4", "g2g4", "h2h4", "e7e5", "d7d5", "c7c5", "g8f6", "b8c6", "g8h6", "b8a6", "f7f5", "g7g5", "h7h5", "e7e8q", "d7d8r", "c7c8b", "g7g8n"]
    return random.choice(uci_moves)

def random_move(uci_move=None, engine_eval=None, engine_overall_rank=None):
    if uci_move is None:
        uci_move = random_uci_move()
    if engine_eval is None:
        engine_eval = random_engine_eval()
    if engine_overall_rank is None:
        engine_overall_rank = random_engine_overall_rank()
    
    return Move(
        id=random.randrange(1, 50),
        position_id=random.randrange(1, 50),
        uci_move=uci_move,
        engine_eval=engine_eval,
        engine_overall_rank=engine_overall_rank
    )