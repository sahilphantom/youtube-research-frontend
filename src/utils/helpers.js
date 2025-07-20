// utils/downloadCSV.js

/**
 * Downloads a CSV string as a .csv file in the browser.
 *
 * @param {Blob | string} data - The CSV content (can be a string or a Blob).
 * @param {string} filename - The name for the downloaded file (e.g., 'report.csv').
 */
export const downloadCSV = (data, filename) => {
  const blob = data instanceof Blob ? data : new Blob([data], { type: 'text/csv' });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
