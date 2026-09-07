import * as XLSX from 'xlsx'

/**
 * Exports data to an Excel (.xlsx) file.
 * @param {Object} options
 * @param {string} options.filename - Name of the file (without or with .xlsx)
 * @param {Array<{ name: string, data: Array<Object> }>} options.sheets - Array of sheets with name and array of row objects
 */
export function exportToExcel({ filename, sheets = [] }) {
  try {
    const wb = XLSX.utils.book_new()

    sheets.forEach(({ name, data }) => {
      if (!data || data.length === 0) {
        const emptyWs = XLSX.utils.aoa_to_sheet([['Sin datos disponibles']])
        XLSX.utils.book_append_sheet(wb, emptyWs, (name || 'Hoja1').slice(0, 31))
        return
      }

      const ws = XLSX.utils.json_to_sheet(data)

      // Auto-calculate column widths
      const colWidths = []
      const headers = Object.keys(data[0] || {})
      headers.forEach((h, colIndex) => {
        let maxLen = String(h).length
        data.forEach((row) => {
          const val = row[h] != null ? String(row[h]) : ''
          if (val.length > maxLen) {
            maxLen = val.length
          }
        })
        colWidths[colIndex] = { wch: Math.min(Math.max(maxLen + 3, 12), 45) }
      })
      ws['!cols'] = colWidths

      // Excel sheet names are capped at 31 chars
      const sheetName = (name || 'Hoja1').slice(0, 31).replace(/[:\\/?*\[\]]/g, '')
      XLSX.utils.book_append_sheet(wb, ws, sheetName)
    })

    const cleanFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`

    // Generate binary string and trigger blob download for browser compatibility
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = cleanFilename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error('Error al exportar a Excel:', error)
    alert('No se pudo generar el archivo Excel. Por favor reintente.')
    return false
  }
}
