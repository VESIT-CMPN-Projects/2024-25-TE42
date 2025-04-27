import re

def validate_email(email):
    """
    Validate email format
    Returns True if valid, False otherwise
    """
    # Basic email validation regex
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None

def validate_password(password):
    """
    Validate password strength
    Returns True if valid, False otherwise
    """
    # Password must be at least 8 characters
    if len(password) < 8:
        return False
    
    # Password must contain at least one letter, one number, and one special character
    has_letter = False
    has_number = False
    has_special = False
    
    for char in password:
        if char.isalpha():
            has_letter = True
        elif char.isdigit():
            has_number = True
        elif not char.isalnum():
            has_special = True
    
    return has_letter and has_number and has_special