// var map = L.map("book-map").setView([28.26689, 83.96851], 13);
// L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   maxZoom: 19,
//   attribution:
//     '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// }).addTo(map);
// alert("done")
// map.on("click", function (e) {
//   var marker = new L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
//   var lat = document.getElementById("id_latitude");
//   lat.value = e.latlng.lat;
//   var lng = document.getElementById("id_longitude");
//   lng.value = e.latlng.lng;
//   var user = document.getElementById("id_seller");
//   user.value = "{{request.user.username}}";
//   var date = new Date();
//   var year = date.getFullYear();
//   var month = date.getMonth() + 1; // Note: Month is zero-based, so we add 1
//   var day = date.getDate();
//   var formattedDate =
//     year +
//     "-" +
//     month.toString().padStart(2, "0") +
//     "-" +
//     day.toString().padStart(2, "0");
//   var added_date = document.getElementById("id_added_date");
//   added_date.value = formattedDate;
// });


