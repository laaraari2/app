import { ExportFormat } from '../types/api';

/**
 * Universal Data Exporter utility supporting CSV/Excel with UTF-8 BOM
 * for perfect Arabic and French characters rendering.
 */
export const exportData = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  format: ExportFormat,
  headersMap?: Record<keyof T, string>
) => {
  if (!data || data.length === 0) {
    alert('Aucune donnée à exporter / لا توجد معطيات للتصدير');
    return;
  }

  if (format === 'EXCEL' || format === 'CSV') {
    const keys = Object.keys(data[0]) as (keyof T)[];
    const headerRow = keys
      .map((k) => `"${headersMap ? (headersMap[k] || String(k)) : String(k)}"` )
      .join(';');

    const rows = data.map((item) =>
      keys
        .map((k) => {
          const val = item[k];
          const sanitized = val !== undefined && val !== null ? String(val).replace(/"/g, '""') : '';
          return `"${sanitized}"`;
        })
        .join(';')
    );

    const csvContent = '\uFEFF' + [headerRow, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (format === 'PDF') {
    window.print();
  }
};
