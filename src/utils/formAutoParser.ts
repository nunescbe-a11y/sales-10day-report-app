import * as XLSX from 'xlsx';
import type { RegionType, StatusCategory } from '../types';

export interface ParsedSaleData {
  item?: string;
  comName?: string;
  purCost?: number;
  lanCost?: number;
  sellCost?: number;
  advanPay?: number;
  packingCharges?: number;
  forwardingCharges?: number;
  gst?: number;
  inqDate?: string;
  recPayDate?: string;
  purchaserName?: string;
  itemStatus?: string;
  statusCategory?: StatusCategory;
  region?: RegionType;
  notes?: string;
  confidence?: number;
  rawTextPreview?: string;
}

export interface SheetParseResult {
  isMultiRow: boolean;
  totalRows: number;
  rows: ParsedSaleData[];
  primary: ParsedSaleData;
}

// Clean and extract numeric values from strings like "₹ 1,500.00", "1500 INR", "Rs. 2593"
export const parseCleanNumber = (val: any): number | undefined => {
  if (val === null || val === undefined || val === '') return undefined;
  if (typeof val === 'number') return isNaN(val) ? undefined : val;
  const str = String(val).replace(/,/g, '').replace(/[^\d.-]/g, '');
  const n = parseFloat(str);
  return isNaN(n) ? undefined : n;
};

// Normalize date to YYYY-MM-DD
export const parseCleanDate = (val: any): string | undefined => {
  if (!val) return undefined;
  if (val instanceof Date) {
    return val.toISOString().split('T')[0];
  }
  const str = String(val).trim();

  // Excel serial date number
  if (/^\d{5}$/.test(str)) {
    const d = new Date((parseInt(str, 10) - 25569) * 86400 * 1000);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyy = str.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (ddmmyyyy) {
    const day = ddmmyyyy[1].padStart(2, '0');
    const month = ddmmyyyy[2].padStart(2, '0');
    const year = ddmmyyyy[3];
    return `${year}-${month}-${day}`;
  }

  // YYYY-MM-DD
  const yyyymmdd = str.match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})$/);
  if (yyyymmdd) {
    const year = yyyymmdd[1];
    const month = yyyymmdd[2].padStart(2, '0');
    const day = yyyymmdd[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return undefined;
};

// Match status to predefined category
export const matchStatusCategory = (statusText: string): StatusCategory => {
  const s = statusText.toLowerCase();
  if (s.includes('partial') || s.includes('one item supplied')) return 'Partial Supply';
  if (s.includes('order placed') || s.includes('factory')) return 'Order Placed';
  if (s.includes('saled') || s.includes('delivered') || s.includes('received by client')) return 'Delivered / Saled';
  if (s.includes('pending') || s.includes('by ') || s.includes('waiting')) return 'Pending Dispatch';
  return 'Dispatched';
};

// Parse an Excel or CSV file
export const parseSpreadsheetFile = async (file: File): Promise<SheetParseResult> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert to array of objects
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (!rawRows || rawRows.length === 0) {
    throw new Error('Spreadsheet appears to be empty.');
  }

  const parsedRows: ParsedSaleData[] = [];

  for (const row of rawRows) {
    const parsed: ParsedSaleData = {};
    const keys = Object.keys(row);

    for (const key of keys) {
      const lowerKey = key.toLowerCase().trim();
      const val = row[key];

      // Item / Product
      if (
        lowerKey.includes('item') ||
        lowerKey.includes('product') ||
        lowerKey.includes('description') ||
        lowerKey.includes('material') ||
        lowerKey.includes('particular')
      ) {
        if (!parsed.item && val) parsed.item = String(val).trim();
      }

      // Company / Customer
      else if (
        lowerKey.includes('com') ||
        lowerKey.includes('company') ||
        lowerKey.includes('customer') ||
        lowerKey.includes('client') ||
        lowerKey.includes('party') ||
        lowerKey.includes('firm')
      ) {
        if (!parsed.comName && val) parsed.comName = String(val).trim();
      }

      // Selling Cost / Price
      else if (
        lowerKey.includes('sell') ||
        lowerKey.includes('sale') ||
        lowerKey.includes('selling') ||
        lowerKey.includes('quoted') ||
        lowerKey === 'rate' ||
        lowerKey === 'price'
      ) {
        const n = parseCleanNumber(val);
        if (n !== undefined) parsed.sellCost = n;
      }

      // Purchase Cost
      else if (
        lowerKey.includes('pur') ||
        lowerKey.includes('purchase') ||
        lowerKey.includes('buying') ||
        lowerKey.includes('cost price')
      ) {
        const n = parseCleanNumber(val);
        if (n !== undefined) parsed.purCost = n;
      }

      // Landing Cost
      else if (lowerKey.includes('lan') || lowerKey.includes('landing') || lowerKey.includes('freight in')) {
        const n = parseCleanNumber(val);
        if (n !== undefined) parsed.lanCost = n;
      }

      // Advance Payment
      else if (lowerKey.includes('advan') || lowerKey.includes('advance') || lowerKey.includes('paid') || lowerKey.includes('rec pay')) {
        const n = parseCleanNumber(val);
        if (n !== undefined) parsed.advanPay = n;
      }

      // Packing Charges
      else if (lowerKey.includes('pack') || lowerKey.includes('pkg')) {
        const n = parseCleanNumber(val);
        if (n !== undefined) parsed.packingCharges = n;
      }

      // Forwarding Charges
      else if (lowerKey.includes('fwd') || lowerKey.includes('forward') || lowerKey.includes('courier') || lowerKey.includes('transport')) {
        const n = parseCleanNumber(val);
        if (n !== undefined) parsed.forwardingCharges = n;
      }

      // GST %
      else if (lowerKey.includes('gst') || lowerKey.includes('tax')) {
        const n = parseCleanNumber(val);
        if (n !== undefined) parsed.gst = n > 0 && n <= 28 ? n : 18;
      }

      // Inquiry Date
      else if (lowerKey.includes('inq') || lowerKey.includes('order date')) {
        const d = parseCleanDate(val);
        if (d) parsed.inqDate = d;
      }

      // Payment Date
      else if (lowerKey.includes('pay') || lowerKey.includes('rec') || lowerKey.includes('date')) {
        const d = parseCleanDate(val);
        if (d && !parsed.recPayDate) parsed.recPayDate = d;
      }

      // Sales Rep / Purchaser
      else if (
        lowerKey.includes('purchaser') ||
        lowerKey.includes('rep') ||
        lowerKey.includes('staff') ||
        lowerKey.includes('executive') ||
        lowerKey.includes('sales person')
      ) {
        const repStr = String(val).toLowerCase().trim();
        if (repStr.includes('vengatesh') || repStr.includes('tl')) parsed.purchaserName = 'vengateshan';
        else if (repStr.includes('yazhini')) parsed.purchaserName = 'yazhini';
        else if (repStr.includes('janani')) parsed.purchaserName = 'janani';
        else if (val) parsed.purchaserName = String(val).trim();
      }

      // Status
      else if (lowerKey.includes('status')) {
        const st = String(val).trim();
        if (st) {
          parsed.itemStatus = st;
          parsed.statusCategory = matchStatusCategory(st);
        }
      }

      // Region
      else if (lowerKey.includes('region') || lowerKey.includes('country')) {
        const rStr = String(val).toLowerCase();
        parsed.region = rStr.includes('export') || rStr.includes('foreign') ? 'Export' : 'India';
      }

      // Notes
      else if (lowerKey.includes('note') || lowerKey.includes('remark')) {
        parsed.notes = String(val).trim();
      }
    }

    if (parsed.item || parsed.comName || parsed.sellCost !== undefined) {
      parsedRows.push(parsed);
    }
  }

  const primary = parsedRows.length > 0 ? parsedRows[0] : {};

  return {
    isMultiRow: parsedRows.length > 1,
    totalRows: parsedRows.length,
    rows: parsedRows,
    primary,
  };
};

// Parse freeform text from order slips, WhatsApp orders, quotations, emails
export const parseFreeformText = (text: string): ParsedSaleData => {
  const result: ParsedSaleData = {
    rawTextPreview: text.substring(0, 300),
  };

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const lower = line.toLowerCase();

    // 1. Company Name patterns
    const comMatch =
      line.match(/(?:company|customer|client|m\/s|buyer|firm|to|sold to|consignee)[\s:]+([^\n,;]+)/i) ||
      line.match(/([A-Z][A-Za-z0-9\s&]+(?:Private Limited|Pvt\.?\s*Ltd\.?|Ltd\.?|Enterprises|Industries|Engineering|Solutions|Traders|Corp))/i);
    if (comMatch && !result.comName) {
      result.comName = comMatch[1].trim();
    }

    // 2. Item / Product patterns
    const itemMatch =
      line.match(/(?:item|product|description|particulars|material|goods|model)[\s:]+([^\n,;]+)/i) ||
      line.match(/(?:thermometer|gauge|indicator|sensor|tester|compass|scaper|meter|lamp|ast-\w+|caliper|micrometer)[^\n]*/i);
    if (itemMatch && !result.item) {
      result.item = itemMatch[1] ? itemMatch[1].trim() : itemMatch[0].trim();
    }

    // 3. Selling Price / Amount
    const sellMatch =
      line.match(/(?:selling price|sell cost|unit price|sale value|quoted price|rate|price|total amount|amount)[\s:]*[₹Rs.]*\s*([\d,]+(?:\.\d+)?)/i);
    if (sellMatch && result.sellCost === undefined) {
      result.sellCost = parseCleanNumber(sellMatch[1]);
    }

    // 4. Purchase Cost
    const purMatch =
      line.match(/(?:purchase cost|buying cost|pur cost|dealer price|cost price|po value|pur)[\s:]*[₹Rs.]*\s*([\d,]+(?:\.\d+)?)/i);
    if (purMatch && result.purCost === undefined) {
      result.purCost = parseCleanNumber(purMatch[1]);
    }

    // 5. Advance Payment
    const advMatch =
      line.match(/(?:advance payment|advance|paid|rec pay|received)[\s:]*[₹Rs.]*\s*([\d,]+(?:\.\d+)?)/i);
    if (advMatch && result.advanPay === undefined) {
      result.advanPay = parseCleanNumber(advMatch[1]);
    }

    // 6. Packing & Forwarding
    const packMatch = line.match(/(?:packing charges|packing|pkg)[\s:]*[₹Rs.]*\s*([\d,]+(?:\.\d+)?)/i);
    if (packMatch && result.packingCharges === undefined) {
      result.packingCharges = parseCleanNumber(packMatch[1]);
    }
    const fwdMatch = line.match(/(?:forwarding|freight|courier|transport|fwd)[\s:]*[₹Rs.]*\s*([\d,]+(?:\.\d+)?)/i);
    if (fwdMatch && result.forwardingCharges === undefined) {
      result.forwardingCharges = parseCleanNumber(fwdMatch[1]);
    }

    // 7. GST percentage
    const gstMatch = line.match(/(?:gst|tax)[\s:]*(\d{1,2})%/i) || line.match(/(\d{1,2})%\s*gst/i);
    if (gstMatch && result.gst === undefined) {
      const g = parseInt(gstMatch[1], 10);
      if (g > 0 && g <= 28) result.gst = g;
    }

    // 8. Dates
    const dateMatches = line.match(/(\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4})|(\d{4}[/\-.]\d{1,2}[/\-.]\d{1,2})/g);
    if (dateMatches) {
      for (const dm of dateMatches) {
        const cd = parseCleanDate(dm);
        if (cd) {
          if (!result.inqDate) result.inqDate = cd;
          else if (!result.recPayDate) result.recPayDate = cd;
        }
      }
    }

    // 9. Sales Representative
    if (lower.includes('vengateshan') || lower.includes('vengatesh') || lower.includes(' tl')) {
      result.purchaserName = 'vengateshan';
    } else if (lower.includes('yazhini')) {
      result.purchaserName = 'yazhini';
    } else if (lower.includes('janani')) {
      result.purchaserName = 'janani';
    }

    // 10. Status
    if (lower.includes('dispatched') || lower.includes('supplied') || lower.includes('saled') || lower.includes('order placed')) {
      result.itemStatus = line;
      result.statusCategory = matchStatusCategory(line);
    }
  }

  // Count filled fields for confidence rating
  const filledFields = [
    result.item,
    result.comName,
    result.sellCost,
    result.purCost,
    result.advanPay,
    result.inqDate,
    result.purchaserName,
  ].filter((f) => f !== undefined && f !== '').length;

  result.confidence = Math.min(100, Math.round((filledFields / 7) * 100));

  return result;
};

// Universal parser entrypoint for any file
export const parseUploadedFormFile = async (file: File): Promise<SheetParseResult> => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  if (['xlsx', 'xls', 'csv'].includes(extension)) {
    return await parseSpreadsheetFile(file);
  }

  // For text or JSON
  if (['txt', 'text', 'json', 'log'].includes(extension)) {
    const text = await file.text();
    const primary = parseFreeformText(text);
    return {
      isMultiRow: false,
      totalRows: 1,
      rows: [primary],
      primary,
    };
  }

  // For images / PDF: Read filename & metadata heuristics, and read initial text bytes
  const textBuffer = await file.text().catch(() => '');
  let primary = parseFreeformText(textBuffer);

  // If item or company still missing, extract from the file name itself (e.g. "Order_Freeman_IR_Thermometer_Sree_Nidhi.pdf")
  const nameClean = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  if (!primary.item && !primary.comName) {
    const fromFilename = parseFreeformText(nameClean);
    primary = { ...primary, ...fromFilename };
    if (!primary.item) primary.item = nameClean;
  }

  return {
    isMultiRow: false,
    totalRows: 1,
    rows: [primary],
    primary,
  };
};
