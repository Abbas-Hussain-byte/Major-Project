# BenefitLens Test Data Policy

## 1. Prohibition on Real Sensitive Data
During development, testing, and academic demonstration of BenefitLens, **no real user financial documents, Aadhaar cards, PAN cards, or live bank statements** may be uploaded or stored in the database.

## 2. Test Fixtures and Mock Profiles
All profile testing must be done using synthetic identities. 
- Example profiles (e.g., "Ramesh, 35, gig worker, ₹15,000/mo") are acceptable.
- Do not use real names combined with real contact numbers.
- Use `0000000000` or standard dummy formats for phone numbers in test fixtures.

## 3. Financial Document Mocks
For the Financial Document Explainer module, developers must use:
- Publicly available blank forms.
- Sanitized templates with fictitious names (e.g., "Acme Insurance", "John Doe").
- Synthetic loan agreements generated for testing purposes.

## 4. LLM Log Retention
When using the Gemini or Groq APIs during testing, ensure that prompts containing test data do not leak any inadvertently real identifiers. Though test data is synthetic, treat the prompt generation pipeline as if it handles real data to validate security measures.
