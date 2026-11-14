import json, os

db_path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\server_storage\permanent_sales_db.json'

sales = [
  {
    "id": "sale-oct-1",
    "slNo": 1,
    "inqDate": "2026-10-14",
    "recPayDate": "2026-10-23",
    "region": "India",
    "item": "silicon trowel scaper",
    "comName": "handy home solutions private limited",
    "purCost": 32000,
    "lanCost": 0,
    "sellCost": 100000,
    "advanPay": 0,
    "balance": 118000,
    "packingCharges": 0,
    "forwardingCharges": 0,
    "gst": 18,
    "overallAmount": 118000,
    "grossProfit": 68000,
    "purchaserName": "yazhini",
    "itemStatus": "item dispatched by supplier",
    "statusCategory": "Dispatched",
    "cycleId": "2026-10-C2",
    "isDraft": false,
    "updatedAt": "2026-10-23T10:00:00.000Z"
  },
  {
    "id": "sale-oct-2",
    "slNo": 2,
    "inqDate": "2026-10-07",
    "recPayDate": "2026-10-17",
    "region": "India",
    "item": "tabulate hardness tester",
    "comName": "ashtavaidyan thaikkattumooss pollachi",
    "purCost": 1500,
    "lanCost": 0,
    "sellCost": 2593,
    "advanPay": 0,
    "balance": 6296,
    "packingCharges": 0,
    "forwardingCharges": 0,
    "gst": 18,
    "overallAmount": 6296,
    "grossProfit": 1093,
    "purchaserName": "naveena",
    "itemStatus": "dispatched by 30/10/26",
    "statusCategory": "Dispatched",
    "cycleId": "2026-10-C1",
    "isDraft": false,
    "updatedAt": "2026-10-17T10:00:00.000Z"
  },
  {
    "id": "sale-oct-3",
    "slNo": 3,
    "inqDate": "2026-10-08",
    "recPayDate": "2026-10-26",
    "region": "India",
    "item": "prismatic compass",
    "comName": "pranesh",
    "purCost": 0,
    "lanCost": 0,
    "sellCost": 4700,
    "advanPay": 0,
    "balance": 4700,
    "packingCharges": 0,
    "forwardingCharges": 0,
    "gst": 18,
    "overallAmount": 4700,
    "grossProfit": 4700,
    "purchaserName": "ready stock",
    "itemStatus": "saled",
    "statusCategory": "Delivered / Saled",
    "cycleId": "2026-10-C1",
    "isDraft": false,
    "updatedAt": "2026-10-26T10:00:00.000Z"
  },
  {
    "id": "sale-oct-4",
    "slNo": 4,
    "inqDate": "2026-10-23",
    "recPayDate": "2026-10-24",
    "region": "India",
    "item": "Magnifying Lamps Ast-6022",
    "comName": "TSUJI IPPEI INDIA PVT. LTD",
    "purCost": 4950,
    "lanCost": 0,
    "sellCost": 8000,
    "advanPay": 0,
    "balance": 9440,
    "packingCharges": 0,
    "forwardingCharges": 0,
    "gst": 18,
    "overallAmount": 9440,
    "grossProfit": 3050,
    "purchaserName": "janani",
    "itemStatus": "item dispatched by supplier",
    "statusCategory": "Dispatched",
    "cycleId": "2026-10-C3",
    "isDraft": false,
    "updatedAt": "2026-10-24T10:00:00.000Z"
  },
  {
    "id": "sale-oct-5",
    "slNo": 5,
    "inqDate": "2026-10-28",
    "recPayDate": "2026-10-29",
    "region": "India",
    "item": "themo hygro meter & beetech B-M2",
    "comName": "Aquasub Engineering / Aquapump Industries",
    "purCost": 1500,
    "lanCost": 0,
    "sellCost": 2912,
    "advanPay": 0,
    "balance": 4380,
    "packingCharges": 0,
    "forwardingCharges": 0,
    "gst": 18,
    "overallAmount": 4380,
    "grossProfit": 1412,
    "purchaserName": "janani",
    "itemStatus": "one item supplied and another the item will order by today",
    "statusCategory": "Partial Supply",
    "cycleId": "2026-10-C3",
    "isDraft": false,
    "updatedAt": "2026-10-29T10:00:00.000Z"
  }
]

reps = [
  {
    "id": "yazhini",
    "username": "yazhini",
    "password": "yazhini123",
    "name": "yazhini",
    "displayName": "Yazhini S.",
    "email": "yazhini@company.com",
    "pin": "1234",
    "avatarColor": "bg-indigo-600",
    "targetAmount": 150000
  },
  {
    "id": "naveena",
    "username": "naveena",
    "password": "naveena123",
    "name": "naveena",
    "displayName": "Naveena R.",
    "email": "naveena@company.com",
    "pin": "1234",
    "avatarColor": "bg-emerald-600",
    "targetAmount": 120000
  },
  {
    "id": "janani",
    "username": "janani",
    "password": "janani123",
    "name": "janani",
    "displayName": "Janani M.",
    "email": "janani@company.com",
    "pin": "1234",
    "avatarColor": "bg-purple-600",
    "targetAmount": 100000
  },
  {
    "id": "ready stock",
    "username": "stock",
    "password": "stock123",
    "name": "ready stock",
    "displayName": "Ready Stock / Direct",
    "email": "stock@company.com",
    "pin": "1234",
    "avatarColor": "bg-cyan-600",
    "targetAmount": 50000
  }
]

cycles = [
  {
    "id": "2026-10-C1",
    "name": "Oct 01 - Oct 10, 2026 (Cycle 1)",
    "startDate": "2026-10-01",
    "endDate": "2026-10-10",
    "isCurrent": False,
    "isLocked": True
  },
  {
    "id": "2026-10-C2",
    "name": "Oct 11 - Oct 20, 2026 (Cycle 2)",
    "startDate": "2026-10-11",
    "endDate": "2026-10-20",
    "isCurrent": False,
    "isLocked": True
  },
  {
    "id": "2026-10-C3",
    "name": "Oct 21 - Oct 31, 2026 (Cycle 3)",
    "startDate": "2026-10-21",
    "endDate": "2026-10-31",
    "isCurrent": False,
    "isLocked": True
  },
  {
    "id": "2026-11-C1",
    "name": "Nov 01 - Nov 10, 2026 (Cycle 1 - Active)",
    "startDate": "2026-11-01",
    "endDate": "2026-11-10",
    "isCurrent": True,
    "isLocked": False
  }
]

status_options = [
  { "id": "st-1", "label": "item dispatched by supplier", "category": "Dispatched", "color": "bg-blue-100 text-blue-800" },
  { "id": "st-2", "label": "dispatched by 30/10/26", "category": "Dispatched", "color": "bg-blue-100 text-blue-800" },
  { "id": "st-3", "label": "saled", "category": "Delivered / Saled", "color": "bg-emerald-100 text-emerald-800" },
  { "id": "st-4", "label": "one item supplied and another the item will order by today", "category": "Partial Supply", "color": "bg-purple-100 text-purple-800" },
  { "id": "st-5", "label": "Ordered from Supplier", "category": "Processing", "color": "bg-amber-100 text-amber-800" },
  { "id": "st-6", "label": "Advance Received", "category": "Processing", "color": "bg-indigo-100 text-indigo-800" },
  { "id": "st-7", "label": "Payment Pending", "category": "Pending", "color": "bg-rose-100 text-rose-800" }
]

payload = {
  "version": "1.0",
  "lastUpdated": "2026-11-04T09:10:00.000Z",
  "system": "Nunes 10-Day Sales Reporting Suite",
  "sales": sales,
  "reps": reps,
  "cycles": cycles,
  "statusOptions": status_options
}

os.makedirs(os.path.dirname(db_path), exist_ok=True)
with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(payload, f, indent=2)

print('Successfully restored permanent_sales_db.json with 5 October records!')
