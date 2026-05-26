# Architectural Decisions

1. **SAP Ingestion Format:** Handled as flat-file extracts (CSV), assuming custom enterprise processing paths where unit fields vary wildly (e.g., Liters vs Gallons).
2. **Utility Processing:** Modeled as portal CSV data downloads. This bypasses inconsistent calendar-month alignment using calculated pro-rata date distributions.
3. **Travel Telemetry:** Navigated corporate travel tracking via individual platform API chunks, converting IATA flight segments directly into unified distance footprints.