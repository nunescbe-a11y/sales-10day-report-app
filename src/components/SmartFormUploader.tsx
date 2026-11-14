import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Database,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  parseUploadedFormFile,
  parseFreeformText,
  type ParsedSaleData,
  type SheetParseResult,
} from '../utils/formAutoParser';

interface SmartFormUploaderProps {
  onApplyParsedData: (data: ParsedSaleData) => void;
  onBulkImportRows?: (rows: ParsedSaleData[]) => void;
}

export const SmartFormUploader: React.FC<SmartFormUploaderProps> = ({
  onApplyParsedData,
  onBulkImportRows,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [pastedText, setPastedText] = useState<string>('');
  const [parseResult, setParseResult] = useState<SheetParseResult | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setIsAnalyzing(true);
    setErrorMsg('');
    setSuccessToast('');
    try {
      const result = await parseUploadedFormFile(file);
      setParseResult(result);
      setSelectedRowIndex(0);

      // Immediately auto-apply the primary parsed row into the form
      onApplyParsedData(result.primary);
      setSuccessToast(`Parsed "${file.name}"! Form fields auto-filled.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse file. Please verify format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleParseText = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Please paste your order text or quotation details.');
      return;
    }
    setIsAnalyzing(true);
    setErrorMsg('');
    setTimeout(() => {
      const parsed = parseFreeformText(pastedText);
      const result: SheetParseResult = {
        isMultiRow: false,
        totalRows: 1,
        rows: [parsed],
        primary: parsed,
      };
      setParseResult(result);
      onApplyParsedData(parsed);
      setSuccessToast('Text parsed successfully! Form fields auto-filled.');
      setIsAnalyzing(false);
    }, 300);
  };

  const handleSelectRow = (idx: number) => {
    if (!parseResult || !parseResult.rows[idx]) return;
    setSelectedRowIndex(idx);
    onApplyParsedData(parseResult.rows[idx]);
    setSuccessToast(`Applied row #${idx + 1} to the form.`);
  };

  const handleBulkImport = () => {
    if (!parseResult || !onBulkImportRows) return;
    onBulkImportRows(parseResult.rows);
    setSuccessToast(`Bulk imported all ${parseResult.rows.length} sales into Master Sheet!`);
  };

  return (
    <div className="mb-4 rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 shadow-xs overflow-hidden transition-all">
      {/* Header Banner */}
      <div
        className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              Smart Form Auto-Parser & Document Upload
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] text-indigo-100 bg-white/10 px-2 py-0.5 rounded-full font-medium">
              Excel • CSV • PDF • Images • WhatsApp Order Slips
            </span>
          </div>
        </div>

        <button
          type="button"
          className="text-white/80 hover:text-white p-1 rounded-md transition"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-3 sm:p-4 space-y-3"
          >
            {/* Tabs: Upload File vs Paste Text */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Upload Document / Excel
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'paste'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  Paste Order / Quotation Text
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Auto-fills all inputs instantly
              </span>
            </div>

            {/* TAB 1: FILE DRAG & DROP ZONE */}
            {activeTab === 'upload' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv,.txt,.json,.pdf,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]'
                      : 'border-indigo-200 bg-white/70 hover:border-indigo-400 hover:bg-indigo-50/30'
                  }`}
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 shadow-2xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    Click to browse or drag & drop your order file
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports <span className="font-semibold text-slate-700">.xlsx, .xls, .csv, .pdf, images, or text forms</span>
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: PASTE TEXT AREA */}
            {activeTab === 'paste' && (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste WhatsApp order details, quotation email, or customer PO text here...&#10;Example:&#10;Company: Sree Nidhi Enterprises&#10;Item: Freeman IR Thermometer&#10;Sell Price: 4280, Purchase: 2438, Adv: 5286"
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleParseText}
                    disabled={isAnalyzing || !pastedText.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Auto-Parse & Fill Form
                  </button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {isAnalyzing && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-800 text-xs font-semibold animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Scanning document structure & extracting form fields...</span>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Toast */}
            {successToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successToast}</span>
              </div>
            )}

            {/* PARSE RESULTS & CHIP PREVIEW */}
            {parseResult && (
              <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Detected Form Fields:
                  </span>

                  {parseResult.isMultiRow && onBulkImportRows && (
                    <button
                      type="button"
                      onClick={handleBulkImport}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                    >
                      <Database className="w-3 h-3" />
                      Bulk Import All {parseResult.totalRows} Rows
                    </button>
                  )}
                </div>

                {/* Multi-row selector if sheet has multiple items */}
                {parseResult.isMultiRow && (
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                      Select Row:
                    </span>
                    {parseResult.rows.map((r, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectRow(i)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border cursor-pointer transition ${
                          selectedRowIndex === i
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Row #{i + 1}: {r.item || r.comName || `Item ${i + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                {/* Preview Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {parseResult.rows[selectedRowIndex]?.comName && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-medium">
                      🏢 <b>Company:</b> {parseResult.rows[selectedRowIndex].comName}
                    </span>
                  )}
                  {parseResult.rows[selectedRowIndex]?.item && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-medium">
                      📦 <b>Item:</b> {parseResult.rows[selectedRowIndex].item}
                    </span>
                  )}
                  {parseResult.rows[selectedRowIndex]?.sellCost !== undefined && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                      💰 <b>Sell:</b> ₹{parseResult.rows[selectedRowIndex].sellCost}
                    </span>
                  )}
                  {parseResult.rows[selectedRowIndex]?.purCost !== undefined && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium">
                      🏷️ <b>Purchase:</b> ₹{parseResult.rows[selectedRowIndex].purCost}
                    </span>
                  )}
                  {parseResult.rows[selectedRowIndex]?.advanPay !== undefined && (
                    <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 text-[11px] font-medium">
                      💵 <b>Advance:</b> ₹{parseResult.rows[selectedRowIndex].advanPay}
                    </span>
                  )}
                  {parseResult.rows[selectedRowIndex]?.inqDate && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-medium">
                      📅 <b>Date:</b> {parseResult.rows[selectedRowIndex].inqDate}
                    </span>
                  )}
                  {parseResult.rows[selectedRowIndex]?.purchaserName && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-medium">
                      👤 <b>Rep:</b> {parseResult.rows[selectedRowIndex].purchaserName}
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
