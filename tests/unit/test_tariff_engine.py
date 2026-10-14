"""Unit Tests for Deterministic TGERC Tariff and Subsidy Logic."""
import pytest
from src.engine.tgerc_tariff import calculate_tgerc_bill
from src.engine.subsidy_rules import apply_gruha_jyothi_subsidy


def test_domestic_slab_sub_category_a():
    """Test Sub-Category A (<= 100 units): 40 units."""
    calc = calculate_tgerc_bill(units=40, contracted_load_kw=1)
    assert calc["energy_charges"] == 40 * 1.95 # 78.0
    assert calc["customer_charges"] == 40.0
    assert calc["fixed_charges"] == 10.0
    assert calc["electricity_duty"] == 2.4


def test_gruha_jyothi_zero_bill_entitlement():
    """Test Gruha Jyothi: <= 200 units must result in zero net payable."""
    calc = calculate_tgerc_bill(units=165, contracted_load_kw=1)
    subsidized = apply_gruha_jyothi_subsidy(calc, is_eligible=True)
    assert subsidized["net_payable_amount"] == 0.0
    assert subsidized["subsidy_amount"] == calc["gross_amount"]


def test_gruha_jyothi_cliff_overage():
    """Test Gruha Jyothi cliff: 201 units must lose 100% zero bill."""
    calc = calculate_tgerc_bill(units=205, contracted_load_kw=1)
    subsidized = apply_gruha_jyothi_subsidy(calc, is_eligible=True)
    assert subsidized["net_payable_amount"] > 0.0
    assert subsidized["subsidy_amount"] == 0.0
