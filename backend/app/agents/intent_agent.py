import re
from typing import Dict, Any, List, Tuple

class IntentAgent:
    """Extracts structured requirements from natural language shopping queries."""

    def __init__(self):
        self.agent_name = "intent"

    def parse(self, raw_query: str) -> Dict[str, Any]:
        q = raw_query.lower()

        # Category detection
        category = "electronics"
        if any(w in q for w in ["book", "books", "novel", "reading", "author", "paperback", "hardcover", "habits", "ikigai", "psychology", "read"]):
            category = "books"
        elif any(w in q for w in ["chair", "purifier", "air", "table", "desk", "home", "furniture", "living", "mattress", "bed", "cooktop", "kitchen", "induction"]):
            category = "home"
        elif any(w in q for w in ["toothbrush", "hair", "dryer", "grooming", "skin", "beauty", "trimmer", "serum", "cleanser", "personal care", "lotion", "soap"]):
            category = "beauty"
        elif any(w in q for w in ["jacket", "clothes", "wear", "winter", "bomber", "hoodie", "shirt", "pant", "fashion", "sneaker", "shoes", "clothing", "apparel", "casual"]):
            category = "fashion"
        elif any(w in q for w in ["headphone", "earphone", "audio", "earbuds", "sound", "headset"]) or re.search(r'\banc\b', q):
            category = "electronics"
        elif any(w in q for w in ["laptop", "notebook", "coding", "macbook", "pc", "computer"]):
            category = "electronics"
        elif any(w in q for w in ["phone", "mobile", "smartphone", "5g", "android", "iphone", "s24", "galaxy"]):
            category = "electronics"
        elif any(w in q for w in ["backpack", "bag", "powerbank", "charger", "cable"]):
            category = "accessories"

        # Budget extraction (e.g., under 5000, below ₹70,000, under 5k, around 3000)
        max_budget = None
        min_budget = None

        # Check for patterns like "under ₹5,000", "under 5000", "under 70k", "below 3000"
        budget_match = re.search(r'(?:under|below|budget of|within|less than|max|up to)\s*(?:\b(?:rs\.?|inr)\b|₹)?\s*(\d[\d,]*(?:\.\d+)?)\s*(k|lakh)?', q)
        if budget_match:
            val_str = budget_match.group(1).replace(",", "")
            multiplier = 1.0
            if budget_match.group(2) == 'k':
                multiplier = 1000.0
            elif budget_match.group(2) == 'lakh':
                multiplier = 100000.0
            max_budget = float(val_str) * multiplier
        else:
            # Check standalone like "5000 rs" or "₹5,000"
            standalone_match = re.search(r'(?:\b(?:rs\.?|inr)\b|₹)\s*(\d[\d,]*(?:\.\d+)?)', q)
            if standalone_match:
                val = standalone_match.group(1).replace(",", "")
                if val:
                    max_budget = float(val)

        # Intended use
        intended_use = "general"
        if any(w in q for w in ["work", "office", "calls", "meeting", "zoom"]):
            intended_use = "work and productivity"
        if any(w in q for w in ["game", "gaming", "bgmi", "valorant", "fps"]):
            intended_use = "work and occasional gaming" if "work" in q else "gaming"
        if any(w in q for w in ["gym", "running", "sports", "workout"]):
            intended_use = "fitness and workout"
        if any(w in q for w in ["code", "coding", "programming", "developer", "development"]):
            intended_use = "software development and multitasking"
        if any(w in q for w in ["travel", "commute", "flight", "train"]):
            intended_use = "travel and noise cancellation"
        if any(w in q for w in ["winter", "cold", "casual"]):
            intended_use = "casual winter warmth"

        # Priority weights extraction
        priorities = []
        if re.search(r'\banc\b', q) or "noise cancel" in q or "quiet" in q:
            priorities.append("active_noise_cancellation")
        if "battery" in q or "long lasting" in q:
            priorities.append("battery_life")
        if "comfort" in q or "soft" in q or "light" in q:
            priorities.append("comfort")
        if "gaming" in q or "latency" in q:
            priorities.append("low_latency")
        if "budget" in q or "cheap" in q or "value" in q or "affordable" in q:
            priorities.append("price_value")

        # Brands
        known_brands = ["jbl", "boat", "noise", "sony", "samsung", "oneplus", "lenovo", "asus", "apple", "hp", "dell", "acer", "fort collins", "roadster", "green soul", "oral-b"]
        brands = [b for b in known_brands if b in q]

        # Check for ambiguity
        clarification_needed = False
        clarification_question = None

        if len(q.split()) <= 1 and not max_budget:
            clarification_needed = True
            clarification_question = (
                f"I noticed you're searching for '{raw_query}'. To recommend the most accurate match across "
                "Amazon, Flipkart, Meesho and Myntra, what is your preferred maximum budget and primary intended use?"
            )

        return {
            "category": category,
            "max_budget": max_budget,
            "min_budget": min_budget,
            "intended_use": intended_use,
            "priorities": priorities,
            "brands": brands,
            "clarification_needed": clarification_needed,
            "clarification_question": clarification_question
        }
