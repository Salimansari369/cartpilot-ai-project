from app.providers.amazon import AmazonAdapter
from app.providers.flipkart import FlipkartAdapter
from app.providers.meesho import MeeshoAdapter
from app.providers.myntra import MyntraAdapter

def get_platform_adapters():
    return {
        "amazon": AmazonAdapter(),
        "flipkart": FlipkartAdapter(),
        "meesho": MeeshoAdapter(),
        "myntra": MyntraAdapter(),
    }
