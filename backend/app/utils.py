import random
import string

def generate_room_code(length: int = 6) -> str:
    """Generate a random room code"""
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for _ in range(length))
