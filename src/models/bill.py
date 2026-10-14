from sqlalchemy import Column, String, Float, Integer, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from src.core.database import Base


class ElectricityBill(Base):
    __tablename__ = "electricity_bills"

    bill_id = Column(String(36), primary_key=True, index=True)
    usc_number = Column(String(20), ForeignKey("consumer_connections.usc_number"), nullable=False)
    billing_month = Column(String(7), nullable=False) # e.g., '2026-09'
    billed_units = Column(Float, nullable=False)
    previous_reading = Column(Float, nullable=False)
    present_reading = Column(Float, nullable=False)
    meter_status = Column(String(20), default="NORMAL") # NORMAL, DOOR_LOCK, DEFECTIVE

    # Itemized Breakdown Computed Deterministically
    energy_charges = Column(Float, nullable=False)
    customer_charges = Column(Float, nullable=False)
    fixed_charges = Column(Float, nullable=False)
    electricity_duty = Column(Float, nullable=False)
    subsidy_amount = Column(Float, default=0.0)
    net_payable_amount = Column(Float, nullable=False)

    slab_breakdown = Column(JSON, nullable=True) # Full verifiable line item JSON
    is_disputed = Column(String(10), default="NO")

    connection = relationship("ConsumerConnection", back_populates="bills")
