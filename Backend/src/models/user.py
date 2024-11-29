class User:
    def __init__(self,
                 name: str,
                 paypal_me_link: str = "",
                 uuid: str = None) -> None:
        self.uuid = uuid
        self.name = name
        self.paypal_me_link = paypal_me_link
