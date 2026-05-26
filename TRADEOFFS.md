# Deliberate Trade-offs

1. **Automated PDF Scraping:** Opted for structural parsing of database-friendly portal inputs over complex OCR scraping for electricity bills.
2. **Live Third-Party API Key Integrations:** Simulated the travel platform API integration layer using localized payloads instead of relying on external OAuth pipelines.
3. **Granular User Permission Role Trees:** Enforced row locking states at the database ledger level, but left out extensive role-based access control (RBAC) permission logic.