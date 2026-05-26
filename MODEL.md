# Database Entity-Relationship Architecture

The backend implements a highly scalable normalized database layout to enforce rigid carbon accounting data integrity and absolute multi-tenant tracking separation.

### Core Architecture Design
* **Tenant**: Manages corporate perimeter isolation, ensuring customer organizational datasets never mix on network queries.
* **IngestionBatch**: Provides comprehensive data lineage tracking back to the ingestion mechanism (SAP Flat Files, Utility Portals, or API payloads).
* **ActivityLog**: The core audit register tracking the actual greenhouse gas records, their scope categorization (Scope 1, 2, or 3), and metadata alert flags (`flags_meta`). 
