import React, { useState } from 'react';
import { Search, FileSpreadsheet, Printer, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { exportData } from '../../lib/export';
import { ExportFormat } from '../../types/api';
import { useI18n } from '../../context/I18nContext';

export interface Column<T> {
  key: keyof T | string;
  headerAr: string;
  headerFr: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  titleAr?: string;
  titleFr?: string;
  searchPlaceholderAr?: string;
  searchPlaceholderFr?: string;
  exportFilename?: string;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  titleAr,
  titleFr,
  searchPlaceholderAr = 'بحث في الجدول...',
  searchPlaceholderFr = 'Rechercher dans la table...',
  exportFilename = 'export_eduvora',
  isLoading = false,
  onRowClick,
}: DataTableProps<T>) {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Search filter
  const filteredData = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExport = (format: ExportFormat) => {
    const headersMap: Record<string, string> = {};
    columns.forEach((col) => {
      headersMap[String(col.key)] = isAr ? col.headerAr : col.headerFr;
    });
    exportData(filteredData, exportFilename, format, headersMap as any);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
      {/* Header controls bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {(titleAr || titleFr) && (
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isAr ? titleAr : titleFr}
          </h3>
        )}

        <div className="flex items-center gap-3 w-full md:w-auto ms-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={isAr ? searchPlaceholderAr : searchPlaceholderFr}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('EXCEL')}
              title={isAr ? 'تصدير Excel/CSV' : 'Exporter Excel/CSV'}
              className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-emerald-200 dark:border-emerald-800"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Excel</span>
            </button>

            <button
              onClick={() => handleExport('PDF')}
              title={isAr ? 'طباعة PDF' : 'Imprimer PDF'}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800">
        <table className="w-full text-start text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="p-3.5 text-start border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span>{isAr ? col.headerAr : col.headerFr}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="p-3.5">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="p-3.5 font-medium">
                      {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  {isAr ? 'لا توجد سجلات تطابق البحث' : 'Aucun enregistrement trouvé'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <div>
          {isAr
            ? `عرض ${paginatedData.length} من أصل ${filteredData.length} سجل`
            : `Affichage de ${paginatedData.length} sur ${filteredData.length} éléments`}
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-900 dark:text-white px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
