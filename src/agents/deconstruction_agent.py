"""Bill Deconstruction & Telescopic Slab Breakdown Agent."""
from typing import Dict, Any
from src.engine.tgerc_tariff import calculate_tgerc_bill
from src.engine.subsidy_rules import apply_gruha_jyothi_subsidy


class BillDeconstructionAgent:
    """Explains monthly bills line-by-line in clear vernacular language."""

    @classmethod
    async def analyze_bill(cls, units: float, is_gruha_jyothi: bool = True, language: str = "te") -> Dict[str, Any]:
        """Calculates bill with zero hallucination and generates vernacular breakdown."""
        raw_calc = calculate_tgerc_bill(units)
        subsidized = apply_gruha_jyothi_subsidy(raw_calc, is_gruha_jyothi)

        # Empathetic vernacular explanation
        if language == "te":
            if subsidized["net_payable_amount"] == 0.0:
                explanation = f"మీరు ఈ నెల {units} యూనిట్లు వాడారు. గృహజ్యోతి పథకం కింద మీ మొత్తం బిల్లు రూ. 0.00."
            else:
                explanation = f"మీరు ఈ నెల {units} యూనిట్లు వాడారు. 200 యూనిట్ల పరిమితి దాటడం వల్ల రూ. {subsidized['net_payable_amount']} బిల్లు వచ్చింది."
        else:
            if subsidized["net_payable_amount"] == 0.0:
                explanation = f"You consumed {units} units. Under Gruha Jyothi scheme, your net payable amount is ₹0.00."
            else:
                explanation = f"You consumed {units} units. Since it exceeds the 200-unit threshold, total bill is ₹{subsidized['net_payable_amount']}."

        return {
            "calculation": subsidized,
            "vernacular_explanation": explanation,
            "language": language
        }
