/* Label table cells so narrow tables can stack into readable rows on phones. */
(function () {
  document.querySelectorAll('.table-wrap table, table').forEach(function (table) {
    var head = table.querySelector('thead tr');
    if (!head) {
      var rows = table.querySelectorAll('tr');
      var twoCol = rows.length && Array.prototype.every.call(rows, function (r) { return r.children.length === 2; });
      if (twoCol) table.classList.add('stack');
      return;
    }
    var labels = Array.prototype.map.call(head.children, function (c) { return c.textContent.trim(); });
    if (labels.length > 4) return; // wide tables keep horizontal scroll
    table.classList.add('stack');
    table.querySelectorAll('tbody tr').forEach(function (row) {
      Array.prototype.forEach.call(row.children, function (cell, i) {
        if (cell.tagName === 'TD' && labels[i]) cell.setAttribute('data-label', labels[i]);
      });
    });
  });
})();
