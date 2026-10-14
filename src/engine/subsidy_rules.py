"""Government of Telangana Gruha Jyothi Subsidy Validation Engine."""
from typing import Dict, Any


def apply_gruha_jyothi_subsidy(bill_calculation: Dict[str, Any], is_eligible: bool) -> Dict[str, Any]:
    """Apply zero-bill subsidy under Gruha Jyothi scheme if units <= 200."""
    units = bill_calculation["billed_units"]
    gross = bill_calculation["gross_amount"]

    if is_eligible and units <= 200:
        subsidy_amount = gross
        net_payable = 0.0
        status_note = "Full 100% Zero-Bill Subsidy applied under Gruha Jyothi scheme (<= 200 units)."
    elif is_eligible and units > 200:
        subsidy_amount = 0.0
        net_payable = gross
        status_note = f"Gruha Jyothi subsidy cliff reached: Consumption of {units} units exceeds 200 unit threshold."
    else:
        subsidy_amount = 0.0
        net_payable = gross
        status_note = "Consumer not registered or not eligible for Gruha Jyothi scheme."

    result = dict(bill_calculation)
    result["subsidy_amount"] = round(subsidy_amount, 2)
    result["net_payable_amount"] = round(net_payable, 2)
    result["subsidy_status_note"] = status_note
    return result
