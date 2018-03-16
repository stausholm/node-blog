function formatDate(date) {
  var monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hours + ':' + minutes;
}

if (document.getElementsByClassName('date-time').length > 0) {
  var x = document.getElementsByClassName('date-time');
  for (var i = 0; i < x.length; i++) {
    var d = new Date(x[i].textContent);
    x[i].textContent = formatDate(d);
  }
}
