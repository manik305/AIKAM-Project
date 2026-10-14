import enum
from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from src.core.database import Base


class UserRole(str, enum.Enum):
    CITIZEN = "CITIZEN"
    SECTION_OFFICER = "SECTION_OFFICER"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    phone_number = Column(String(15), unique=True, index=True, nullable=False)
    email = Column(String(120), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default=UserRole.CITIZEN.value)
    preferred_language = Column(String(10), default="te") # 'te' for Telugu, 'en' for English
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    connections = relationship("ConsumerConnection", back_populates="user")


class ConsumerConnection(Base):
    __tablename__ = "consumer_connections"

    usc_number = Column(String(20), primary_key=True, index=True) # Unique Service Connection No
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    circle = Column(String(50), nullable=False) # e.g., 'Hyderabad South', 'Warangal'
    section = Column(String(50), nullable=False)
    category = Column(String(20), nullable=False) # LT-I(A), LT-I(B), LT-I(C)
    contracted_load_kw = Column(Integer, default=1)
    is_gruha_jyothi_eligible = Column(Boolean, default=True)
    meter_serial_no = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="connections")
    bills = relationship("ElectricityBill", back_populates="connection")
    disputes = relationship("DisputeTicket", back_populates="connection")
