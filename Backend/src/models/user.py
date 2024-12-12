class User:
    """User model."""

    def __init__(self,
                 name: str,
                 paypal_me_link: str = "",
                 uuid: str = None) -> None:
        self.uuid = uuid
        self.name = name
        self.paypal_me_link = paypal_me_link

    def __str__(self) -> str:
        """
        Returns the string representation of the User object.

        Returns:
            str: The name of the user.
        """
        return self.name
