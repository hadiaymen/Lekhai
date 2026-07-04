from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lekhai.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    financial_year = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, index=True)
    company_id = Column(String, ForeignKey("companies.id"))
    filename = Column(String)
    doc_type = Column(String) # Bank Statement, Invoice, etc.
    status = Column(String) # Processing, Extracted, Error
    upload_date = Column(DateTime, default=datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    company_id = Column(String, ForeignKey("companies.id"))
    date = Column(DateTime)
    description = Column(String)
    amount = Column(Float)
    type = Column(String) # Credit / Debit
    category = Column(String) # AI Classified Category
    confidence_score = Column(Float)
    is_approved = Column(Boolean, default=False)

def init_db():
    Base.metadata.create_all(bind=engine)
