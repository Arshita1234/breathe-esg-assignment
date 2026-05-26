 # Development Trade-offs & Future Roadmaps

### Current Prototype State
* **Database Target**: Localized SQLite footprint was utilized over a production-heavy PostgreSQL or MySQL cloud cluster. This minimized configuration overhead during development and facilitated immediate pipeline evaluation testing.
* **Authentication**: Multi-tenancy is demonstrated programmatically via query param matching logic for simplicity, rather than implementing complex JSON Web Token (JWT) identity authorization providers upfront.

### Production Next Steps
1. Transition data storages directly to an enterprise PostgreSQL engine.
2. Implement rigid Role-Based Access Control (RBAC) across data ingestion keys.
