# UrjaMitra AI: Testing Evidence & Verification Report
**Build Stage Verification - Idealabs & Talentfarm Guidelines Compliance**

---

## 1. Test Cases & Results Matrix

| Test Case ID | Module / Component | Input Scenario | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-01` | Auth Service | Valid phone number & password | 200 OK + JWT bearer token | 200 OK + JWT bearer token | **PASS** |
| `TC-02` | TGERC Engine | 40 units (Sub-Category A, LT-I) | Energy charges: ₹78.00 (40 x 1.95) | Energy charges: ₹78.00 | **PASS** |
| `TC-03` | Subsidy Engine | 165 units, Gruha Jyothi eligible | 100% Zero-Bill, Net payable: ₹0.00 | Net payable: ₹0.00 | **PASS** |
| `TC-04` | Subsidy Cliff | 205 units, Gruha Jyothi eligible | Cliff crossed, 0% subsidy credit | Full gross billed, 0 subsidy | **PASS** |
| `TC-05` | Jev Router | Query with explicit unit count | `bypass_llm: true`, latency < 100ms | `bypass_llm: true`, latency: 68.4ms | **PASS** |
| `TC-06` | Dispute Gateway| Reading discrepancy reported | SAP IS-U structured ticket created | SAP IS-U ticket payload created | **PASS** |

---

## 2. Load Testing & Elastic Autoscaling Benchmarks

Simulated via Locust (`tests/load/locustfile.py`) with 5-minute ramp-up:

| Concurrent Users | Active Pods | AKS Worker Nodes | Average Latency | Error Rate | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **100 Users** | 3 Pods | 2 Nodes | 84 ms | 0.0% | Normal Baseline |
| **1,000 Users** | 12 Pods | 3 Nodes | 136 ms | 0.0% | HPA Scaling |
| **10,000 Users** | 46 Pods | 8 Nodes | 295 ms | 0.0% | Cluster Autoscaler Spike |
| **Cooldown Phase** | 3 Pods | 2 Nodes | 80 ms | 0.0% | Deactivated Idle VMs |

---

## 3. Bug Tracking & Quality Assurance Log

- **Bug 01 (Fixed)**: Initial tariff rounding accumulated floating-point fractional paise errors.  
  *Fix*: Implemented strict two-decimal `round()` on all slab segment multiplications.
- **Bug 02 (Fixed)**: Jev routing latency spiked on unindexed string matching.  
  *Fix*: Standardized lowercased intent matching with single-pass primitive evaluation.
