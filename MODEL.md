# Data Model Architecture

### Multi-Tenant Isolation
Every record tracks a strict `Tenant` ForeignKey. This ensures absolute separation of corporate perimeters at the root entity layer, preventing any data cross-contamination between different client operations.

### Data Lineage & Scope Tracking
Data provenance is achieved by routing all raw inputs through an `IngestionBatch` mapping. This links entries back to their specific origin system (SAP, UTILITY, CONCUR). Individual rows map explicitly to Scope 1, 2, or 3 categories.

### Unit Normalization Matrix
To prevent unit mismatches, the model maintains original input values ('Liters', 'IATA_Segment') alongside a computed field `normalized_quantity_kwh`. This guarantees uniform downstream audit reporting.