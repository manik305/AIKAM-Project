"""Deterministic TGERC Retail Supply Tariff Calculation Engine.

Implements exact gazette formulas according to the Telangana State
Electricity Regulatory Commission (TGERC) Tariff Orders.
Zero LLM arithmetic. 100% deterministic, testable Python code.
"""

from typing import Dict, Any, List


def calculate_tgerc_bill(units: float, contracted_load_kw: int = 1) -> Dict[str, Any]:
    """Calculate domestic (LT-Category I) electricity bill with slab breakdown."""
    if units < 0:
        raise ValueError("Consumption units cannot be negative.")

    slab_lines: List[Dict[str, Any]] = []
    energy_charges = 0.0

    # Sub-Category A: <= 100 units/month
    if units <= 100:
        if units <= 50:
            c1 = units * 1.95
            slab_lines.append({"slab": "0-50 units", "units": units, "rate": 1.95, "amount": round(c1, 2)})
            energy_charges += c1
        else:
            c1 = 50 * 1.95
            c2 = (units - 50) * 3.10
            slab_lines.append({"slab": "0-50 units", "units": 50, "rate": 1.95, "amount": round(c1, 2)})
            slab_lines.append({"slab": "51-100 units", "units": units - 50, "rate": 3.10, "amount": round(c2, 2)})
            energy_charges += (c1 + c2)
        customer_charges = 40.0

    # Sub-Category B: 101 to 200 units/month
    elif units <= 200:
        c1 = 100 * 3.40
        c2 = (units - 100) * 4.80
        slab_lines.append({"slab": "0-100 units", "units": 100, "rate": 3.40, "amount": round(c1, 2)})
        slab_lines.append({"slab": "101-200 units", "units": units - 100, "rate": 4.80, "amount": round(c2, 2)})
        energy_charges += (c1 + c2)
        customer_charges = 60.0

    # Sub-Category C: > 200 units/month (Telescopic Brackets)
    else:
        remaining = units
        brackets = [
            ("0-100 units", 100, 5.10),
            ("101-200 units", 100, 7.70),
            ("201-300 units", 100, 9.00),
            ("301-400 units", 100, 9.50),
            ("401-800 units", 400, 10.00),
            ("Above 800 units", float("inf"), 11.00),
        ]
        for label, limit, rate in brackets:
            if remaining <= 0:
                break
            chunk = min(remaining, limit)
            amt = chunk * rate
            slab_lines.append({"slab": label, "units": chunk, "rate": rate, "amount": round(amt, 2)})
            energy_charges += amt
            remaining -= chunk
        customer_charges = 80.0

    # Fixed Charges & Electricity Duty
    fixed_charges = contracted_load_kw * 10.0
    electricity_duty = round(units * 0.06, 2)
    gross_amount = round(energy_charges + customer_charges + fixed_charges + electricity_duty, 2)

    return {
        "billed_units": units,
        "energy_charges": round(energy_charges, 2),
        "customer_charges": customer_charges,
        "fixed_charges": fixed_charges,
        "electricity_duty": electricity_duty,
        "gross_amount": gross_amount,
        "slab_lines": slab_lines,
    }
