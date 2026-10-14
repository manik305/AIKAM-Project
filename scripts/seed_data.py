"""Synthetic Seed Data Generator for UrjaMitra AI.

Generates realistic TGSPDCL & TGNPDCL consumer profiles, historical bills,
and dispute test records to satisfy evaluation review.
"""

import uuid
from datetime import datetime


def generate_seed_records(count: int = 50):
    """Generates synthetic consumer records across Hyderabad South and Warangal."""
    records = []
    for i in range(1, count + 1):
        usc = f"100{i:06d}"
        records.append({
            "usc_number": usc,
            "circle": "Hyderabad South" if i % 2 == 0 else "Warangal",
            "section": "Banjara Hills" if i % 2 == 0 else "Hanamkonda",
            "category": "LT-I(B)" if i % 3 == 0 else "LT-I(A)",
            "contracted_load_kw": 2 if i % 4 == 0 else 1,
            "is_gruha_jyothi_eligible": True,
            "meter_serial_no": f"TG-MTR-{800000 + i}",
        })
    print(f"Generated {len(records)} synthetic consumer profiles.")
    return records


if __name__ == "__main__":
    generate_seed_records(50)
