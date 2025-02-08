-- database.sql
CREATE TABLE IF NOT EXISTS "user" (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  validity BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS committee (
  committee_id SERIAL PRIMARY KEY,
  committee_name VARCHAR(255) NOT NULL,
  committee_type VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS committee_member (
  member_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(user_id),
  committee_id INTEGER REFERENCES committee(committee_id),
  role VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, committee_id)
);

CREATE TABLE IF NOT EXISTS applicant (
  applicant_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(user_id),
  contact_details TEXT,
  applicant_category VARCHAR(100) NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application (
  application_id SERIAL PRIMARY KEY,
  applicant_id INTEGER REFERENCES applicant(applicant_id),
  research_type VARCHAR(100) NOT NULL,
  application_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_extension BOOLEAN DEFAULT false,
  expiry_date DATE
);

CREATE TABLE IF NOT EXISTS document (
  document_id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES application(application_id),
  document_type VARCHAR(100) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_mandatory BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS payment (
  payment_id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES application(application_id),
  amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(50) NOT NULL,
  payment_evidence VARCHAR(255),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS review (
  review_id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES application(application_id),
  reviewer_id INTEGER REFERENCES "user"(user_id),
  comments TEXT,
  outcome VARCHAR(50),
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date DATE NOT NULL
);