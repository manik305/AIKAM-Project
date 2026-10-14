"""Proactive Consumption Spike & Subsidy Cliff Advisory Agent."""
from typing import Dict, Any


class ProactiveAdvisoryAgent:
    """Predicts consumption trajectory and sends threshold alerts before bill shock."""

    @classmethod
    async def evaluate_subsidy_risk(cls, current_units: float, days_remaining: int) -> Dict[str, Any]:
        """Calculates trajectory towards the 200-unit Gruha Jyothi cliff."""
        projected_units = current_units + (days_remaining * 3.5)
        risk_level = "HIGH" if projected_units > 190 else "NORMAL"

        return {
            "current_units": current_units,
            "days_remaining": days_remaining,
            "projected_units": round(projected_units, 1),
            "subsidy_cliff_risk": risk_level,
            "advisory_message": (
                f"You have used {current_units} units. With {days_remaining} days left, "
                f"you are projected to reach {round(projected_units, 1)} units. "
                "Keep consumption under 200 units to retain your 100% Gruha Jyothi zero bill!"
            )
        }
