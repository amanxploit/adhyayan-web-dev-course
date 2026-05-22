function ClickMe() {
  var _TableNumber = document.getElementById("TableNumber");
  var _table = document.getElementById("table");
  var a = _TableNumber.value;

  _table.innerHTML = "";

  for (let i = 1; i <= 10; i++) {
    _table.innerHTML += `${a} x ${i} = ${i * a}<br>`;
  }
}
