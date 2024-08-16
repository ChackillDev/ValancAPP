
document.getElementById('submitBtn').addEventListener('click', processFile);
function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            const reorderedContent = reorderCSV(content);
            downloadCSV(reorderedContent, 'reordered.csv');
            document.getElementById('result').textContent = 'CSV procesado y descargado.';
        };
        reader.readAsText(file);
    } else {
        document.getElementById('result').textContent = 'Por favor, selecciona un archivo CSV.';
    }
}
function reorderCSV(content) {
    const rows = content.split('\n').map(row => row.split(';'));
    const firstRow = rows[0];
    const headers = rows[1];
    const data = rows.slice(2);
    // Create an array of 41 elements to represent the new order
    const newOrder = Array(41).fill(null);

    // Map the existing columns to their new positions
    firstRow.forEach((value, index) => {
        if (value !== '') {
            const position = parseInt(value) - 1;
            if (position >= 0 && position < 41) {
                newOrder[position] = index;
            }
        }
    });

    // Function to reorder a single row
    const reorderRow = (row) => {
        const newRow = Array(41).fill('');
        newOrder.forEach((oldIndex, newIndex) => {
            if (oldIndex !== null && row[oldIndex] !== undefined) {
                newRow[newIndex] = row[oldIndex];
            }
        });
        return newRow;
    };

    // Reorder headers and data
    const reorderedHeaders = reorderRow(headers);
    const reorderedData = data.map(reorderRow);

    // Prepare the new content
    const newContent = [
        Array.from({ length: 41 }, (_, i) => i + 1).join(';'),
        reorderedHeaders.join(';'),
        ...reorderedData.map(row => row.join(';'))
    ].join('\n');

    return newContent;
}


function downloadCSV(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
