let editProfile = document.querySelector(".edit-profile");
let editProfileContainer = document.querySelector("#edit-form-container");
let activeBook = document.querySelector("#active-books");
let activeBookContainer = document.querySelector("#active-books-container");
let editBookContainer = document.querySelector("#book-form-container");
let wholeActiveBookContainer = document.querySelector(
  "#whole-active-books-container"
);
let soldBookContainer = document.querySelector("#sold-books-container");
let bookedBookContainer = document.getElementById("booked-book-container");
let pendingBookContainer = document.getElementById("pending-books-container");
let restoreButton;
let soldButton;
let editButton;
let pendingButton;
bookedBookContainer.style.display = "none";
editProfileContainer.style.display = "none";
editBookContainer.style.display = "none";
wholeActiveBookContainer.style.display = "none";
soldBookContainer.style.display = "none";

editProfile.addEventListener("click", () => {
  bookedBookContainer.style.display = "none";
  wholeActiveBookContainer.style.display = "none";
  editBookContainer.style.display = "none";
  soldBookContainer.style.display = "none";
  editProfileContainer.style.display = "block";
  const element = document.getElementById("edit-form-container");
  element.scrollIntoView();
});

$("#save-change-button").click(function () {
  var Name = document.getElementById("id_Name").value;
  var Phone_Number = document.getElementById("id_Phone_Number").value;
  var latitude = document.getElementById("id_latitude").value;
  var address = document.getElementById("id_Address").value;
  var longitude = document.getElementById("id_longitude").value;

  $.ajax({
    type: "post",
    url: "/edit-profile/",
    data: {
      Name: Name,
      Phone_Number: Phone_Number,
      address: address,
      latitude: latitude,
      longitude: longitude,
    },
    success: function (data) {
      window.location.href = "/profile/";
    },
  });
});

//code for sending ajax request to the backend for edit books info

const handleEditButtonClick = (event) => {
  const id = event.target.getAttribute("pid");
  $.ajax({
    type: "GET",
    url: "/editbook/",
    data: {
      book_id: id,
    },
    success: function (data) {
      editProfileContainer.style.display = "none";
      wholeActiveBookContainer.style.display = "none";
      bookedBookContainer.style.display = "none";
      soldBookContainer.style.display = "none";
      editBookContainer.style.display = "block";
      const imageInputElement = document.getElementById("id_bookform-image");
      imageInputElement.removeAttribute("required");
      document.getElementById("id_bookform-title").value = data.title;
      document.getElementById("id_bookform-description").value =
        data.description;
      document.getElementById("id_bookform-selling_price").value =
        data.selling_price;
      document.getElementById("id_bookform-condition").value = data.condition;
      document.getElementById("id_bookform-latitude").value = data.latitude;
      document.getElementById("id_bookform-longitude").value = data.longitude;
      document.getElementById("image-preview").src = data.image_url;
      var location = document.getElementById("id_bookform-location");
      location.value = data.location;
      var map = L.map("edit-profile-book-map").setView(
        [28.26689, 83.96851],
        13
      );
      var marker = null;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      var lat = data.latitude;
      var lng = data.longitude;
      marker = new L.marker([lat, lng]).addTo(map);

      map.on("click", async function (e) {
        if (marker !== null) {
          map.removeLayer(marker);
        }
        marker = new L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        var lat = document.getElementById("id_bookform-latitude");
        lat.value = e.latlng.lat;
        var lng = document.getElementById("id_bookform-longitude");
        lng.value = e.latlng.lng;

        var address = await getAddressFromCoordinates(
          e.latlng.lat,
          e.latlng.lng
        );
        var trimmedData = address.substring(0, address.lastIndexOf(",")).trim();
        var trimmedData = trimmedData
          .substring(0, trimmedData.lastIndexOf(","))
          .trim();
        var trimmedData = trimmedData
          .substring(0, trimmedData.lastIndexOf(","))
          .trim();
        location.value = trimmedData;

        async function getAddressFromCoordinates(lat, lng) {
          var url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
          try {
            const response = await fetch(url);
            const data = await response.json();
            const address = data.display_name;

            return address;
          } catch (error) {
            console.error("Error:", error);
            return null; // Return a default value or handle the error in your specific way
          }
        }
      });
      editBookContainer.scrollIntoView({
        behaviour: "smooth",
        block: "center",
      });
    },
  });
};

let editBookSubmitButton = document.getElementById("edit-book-submit-button");
editBookSubmitButton.addEventListener("click", () => {
  $.ajax({
    method: "post",
    url: "edit-books",
  });
});

//code for sending ajax request to the backend for handling pending request accept
const handlePendingButtonClick = (event) => {
  const button = event.target;
  const id = button.getAttribute("pid");

  $.ajax({
    type: "GET",
    url: "/pending-request/",
    data: {
      book_id: id,
    },
    success: function (data) {
      restoreButton = document.createElement("button");
      restoreButton.className =
        "col btn btn-sm restore-book-request my-0 w-50 my-1 border border-r";
      restoreButton.type = "button";
      restoreButton.setAttribute("pid", id);
      restoreButton.textContent = "Restore";
      restoreButton.addEventListener("click", handleRestoreButtonClick);

      soldButton = document.createElement("button");
      soldButton.className =
        "col btn btn-sm sold-book-request my-0 w-50 border  border-r";
      soldButton.type = "button";
      soldButton.setAttribute("pid", id);
      soldButton.textContent = "Sold";
      soldButton.addEventListener("click", handleSoldButtonRequest);

      let changeStatusCell = event.target.parentNode;
      while (changeStatusCell.firstChild) {
        changeStatusCell.removeChild(changeStatusCell.firstChild);
      }

      let buttonContainer = document.createElement("div");
      buttonContainer.appendChild(restoreButton);
      buttonContainer.appendChild(soldButton);
      changeStatusCell.appendChild(buttonContainer);
    },
  });
};


//code for sending the ajax request to the backend for handling the restore request
const handleRestoreButtonClick = (event) => {

    const restoreButtonModalOkButton=document.querySelector("#restore-book-modal-ok-btn")
    restoreButtonModalOkButton.addEventListener("click",()=>{
      const button = event.target;
      const id = button.getAttribute("pid");
      $.ajax({
        type: "GET",
        url: "/restore-request/",
        data: {
          book_id: id,
        },
        success: (data) => {
          var pendingTableBody = document.querySelector("#pending-book-table tbody");
          let tableCell = event.target.parentNode;
          let tableRow = tableCell.closest("tr");
          pendingTableBody.removeChild(tableRow);
        },
      });
    });
};

// function for handling the sold button click request

function handleSoldButtonRequest(event) {

  const soldButtonModalOkButton=document.querySelector("#sold-book-modal-ok-btn")
  soldButtonModalOkButton.addEventListener("click",()=>{
  let book_id = event.target.getAttribute("pid");
  $.ajax({
    method: "post",
    url: "/sold-book/",
    data: { book_id: book_id },
    success: function (data) {
      var pendingTableBody = document.querySelector("#pending-book-table tbody");
      let tableCell = event.target.parentNode;
      let tableRow = tableCell.closest("tr");
      pendingTableBody.removeChild(tableRow);
      
    },
  });
});
}

//code for the booked book

const bookedBookButton = document.getElementById("booked-books");

bookedBookButton.addEventListener("click", () => {
  editProfileContainer.style.display = "none";
  wholeActiveBookContainer.style.display = "none";
  editBookContainer.style.display = "none";
  soldBookContainer.style.display = "none";
  bookedBookContainer.style.display = "block";
  bookedBookContainer.scrollIntoView();
  let cancelButton;
  $.ajax({
    type: "GET",
    url: "/booked-book/",
    data: {},
    success: function (data) {
      if (data.data.length == 0) {
        bookedBookContainer.innerHTML = ` <h3 class="text-center mb-5"> You  haven't buy any books. Fell free to buy the books. </h3>`;
      }
      var tableBody = document.querySelector("#booked-data-table tbody");
      var rows = tableBody.getElementsByTagName("tr");

      // Remove each row
      for (var i = rows.length - 1; i >= 0; i--) {
        var row = rows[i];
        tableBody.removeChild(row);
      }
      let chatButton;
      data.data.forEach(async function (item) {
        cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.setAttribute("pid", item.booked_id);
        cancelButton.className = " btn btn-danger";
        cancelButton.setAttribute("data-bs-toggle", "modal");
        cancelButton.setAttribute("data-bs-target", "#staticBackdrop");

        var disabledCancelButton = document.createElement("button");
        disabledCancelButton.textContent = "Cancel";
        disabledCancelButton.className = "  btn btn-danger"; // Add your own CSS class if needed
        disabledCancelButton.setAttribute("data-bs-toggle", "modal");
        disabledCancelButton.setAttribute("data-bs-target", "#cancelStaticBackdrop");
       

        var row = tableBody.insertRow();

        var titleCell = row.insertCell(0);
        var sellerCell = row.insertCell(1);
        var contactCell = row.insertCell(2);
        var addressCell = row.insertCell(3);
        var priceCell = row.insertCell(4);
        var bookedStatusCell = row.insertCell(5);
        var contactSellerCell = row.insertCell(6);

        titleCell.textContent = item.title;
        sellerCell.textContent = item.seller;
        contactCell.textContent = item.contact_no;
        priceCell.textContent = item.price;
        addressCell.textContent = item.location;

        // code for the chat function
        const icon = document.createElement("i");
        icon.setAttribute("pid", item.booked_id);
        const notHoverClass = "fa-regular fa-comments chat-icon";
        const hoverClass = "fa-solid fa-comments chat-icon";
        icon.className = notHoverClass; // Set the initial class to the regular icon
        icon.style.fontSize = "30px";

        var dotIcon = document.createElement("i");
        dotIcon.className = "fa-solid fa-circle";
        dotIcon.style = "color: #f50a0a;";
        if (item.chat_notification_count > 0) {
          icon.appendChild(dotIcon);
        }
        contactSellerCell.appendChild(icon);

        icon.addEventListener("mouseover", function () {
          icon.className = hoverClass; // Add the solid icon class
        });

        icon.addEventListener("mouseout", function () {
          icon.className = notHoverClass; // Add the regular icon class
        });

        icon.addEventListener("click", handleChatRequest);

        contactSellerCell.appendChild(icon);
        if (item.booked_status) {
          bookedStatusCell.appendChild(disabledCancelButton);
        } else {
          bookedStatusCell.appendChild(cancelButton);
          cancelButton.addEventListener("click", function (event) {
            handleCancelRequest(event, item.booked_id);
          });
        }
      });
    },
  });
  bookedBookContainer.scrollIntoView({
    behaviour: "smooth",
    block: "center",
  });
});



function handleCancelRequest(event, booked_id) {
  const bookCancelModalOkButton = document.querySelector(
    "#booked-book-cancel-btn"
  );
  bookCancelModalOkButton.addEventListener("click", () => {
    $.ajax({
      type: "GET",
      url: "/cancel-book/",
      data: {
        booked_id: booked_id,
      },
      success: (data) => {
        var row = event.target.closest("tr");
        row.remove();
      },
    });
  });
}

//code for the profile picture change

$(document).ready(function () {
  $("#upload-button").click(function () {
    const popupWrapper = document.querySelector(".edit-profile-popup-wrapper");
    const close = document.querySelector(".edit-profile-close");
    const popup = document.querySelector(".edit-profile-popup");
    const uploadPhoto = document.querySelector(".edit-profile-submit-btn");
    let uploadButton;
    let parentOfUploadButton;
    popupWrapper.style.display = "block";

    close.addEventListener("click", () => {
      popupWrapper.style.display = "none";
    });

    popup.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    uploadPhoto.addEventListener("click", (event) => {
      const saveButton = document.createElement("Button");
      saveButton.className = "edit-profile-submit-btn";
      saveButton.textContent = "Save";

      const imageInput = document.querySelector("#image-input");
      imageInput.click();
      imageInput.addEventListener("change", () => {
        uploadButton = event.target;
        const imgElement = document.querySelector(
          ".edit-profile-popup-content .user-photo img"
        );
        parentOfUploadButton = uploadButton.parentNode;
        parentOfUploadButton.removeChild(uploadButton);
        parentOfUploadButton.appendChild(saveButton);
        var file = imageInput.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = function (e) {
            imgElement.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
        saveButton.addEventListener("click", () => {
          var formData = new FormData();
          formData.append("image", imageInput.files[0]);
          $.ajax({
            url: "/edit-profile-photo/", // Replace with your API endpoint URL
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
              const image_url = response.image_url;
              popupWrapper.style.display = "none";
              const imgTag = document.querySelector(
                ".user-details .user-photo-container .user-photo img"
              );
              imgTag.src = image_url;
              const headerImgTag = document.querySelector(
                "#header-user-image #navbarDropdown img"
              );
              headerImgTag.src = image_url;
            },
            error: function () {
              alert("Image upload failed");
            },
          });
        });
      });
    });
  });
});

//code for the image field in the form
document.addEventListener("DOMContentLoaded", function () {
  var imageInput = document.getElementById("id_bookform-image"); // Replace with your image field ID
  var imagePreview = document.getElementById("image-preview");

  imageInput.addEventListener("change", function () {
    var file = imageInput.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
});
// code for chatapp
import { chatFunction } from "../../chatapp/js/chatapp.js";

function handleChatRequest(event) {
  removeChatNotification(event);
  chatFunction(event); // Call the function immediately
  // setInterval(function() {
  //   chatFunction(event); // Call the function every 5 seconds
  // }, 5000);
}

function removeChatNotification(event) {
  parent = event.target;
  if (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

var pendingCount = 0;
var activeCount = 0;
activeBook.addEventListener("click", () => {
  editProfileContainer.style.display = "none";
  bookedBookContainer.style.display = "none";
  editBookContainer.style.display = "none";
  soldBookContainer.style.display = "none";
  wholeActiveBookContainer.style.display = "block";

  $.ajax({
    type: "GET",
    url: "/activebooks",
    data: {},
    success: function (data) {
      var activeTableBody = document.querySelector("#active-book-table tbody");
      var pendingTableBody = document.querySelector(
        "#pending-book-table tbody"
      );
      var activeRows = activeTableBody.getElementsByTagName("tr");
      var pendingRows = pendingTableBody.getElementsByTagName("tr");

      for (var i = activeRows.length - 1; i >= 0; i--) {
        var activeRow = activeRows[i];
        activeTableBody.removeChild(activeRow);
      }
      for (var i = pendingRows.length - 1; i >= 0; i--) {
        var pendingRow = pendingRows[i];
        pendingTableBody.removeChild(pendingRow);
      }

      if (data.length == 0) {
        wholeActiveBookContainer.innerHTML = ` <h3 class="text-center mb-3"> You don't have posted any books. Fell free to post the books. </h3>`;
      }

      data.forEach((activeBookData) => {
        let chatButton;
        let editButton;
        let deleteButton;

        chatButton = document.createElement("button");
        chatButton.textContent = "Chat";
        chatButton.setAttribute("pid", activeBookData.booked_id);
        chatButton.className = "chat-button";
        chatButton.addEventListener("click", handleChatRequest);

        editButton = document.createElement("button");
        editButton.className =
          "btn edit-books my-0 my-0 w-100 border border-r btn-sm";
        editButton.type = "button";
        editButton.setAttribute("pid", activeBookData.id);
        editButton.textContent = "Edit";
        editButton.addEventListener("click", handleEditButtonClick);

        pendingButton = document.createElement("button");
        pendingButton.className =
          "btn btn-sm pending-book-request my-0 w-100 border border-r";
        pendingButton.type = "button";
        pendingButton.setAttribute("pid", activeBookData.id);
        pendingButton.textContent = "Pending";
        pendingButton.addEventListener("click", handlePendingButtonClick);

        restoreButton = document.createElement("button");
        restoreButton.className =
          "col btn btn-sm restore-book-request my-0 w-50 my-1 ";
        restoreButton.type = "button";
        restoreButton.setAttribute("pid", activeBookData.id);
        restoreButton.textContent = "Restore";
        restoreButton.addEventListener("click", handleRestoreButtonClick);
        restoreButton.setAttribute("data-bs-toggle", "modal");
        restoreButton.setAttribute("data-bs-target", "#restoreStaticBackdrop");

        soldButton = document.createElement("button");
        soldButton.className =
          "col btn btn-sm sold-book-request my-0 w-50 ";
        soldButton.type = "button";
        soldButton.setAttribute("pid", activeBookData.id);
        soldButton.textContent = "Sold";
        soldButton.addEventListener("click", handleSoldButtonRequest);
        soldButton.setAttribute("data-bs-toggle", "modal");
        soldButton.setAttribute("data-bs-target", "#soldStaticBackdrop");

        deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("pid", activeBookData.id);
        deleteButton.className =
          "delete-button my-0 btn btn-danger my-0 w-100 border border-r btn-sm";
        deleteButton.setAttribute("data-bs-toggle", "modal");
        deleteButton.setAttribute("data-bs-target", "#deleteStaticBackdrop");
        deleteButton.addEventListener("click", handleDeleteBookRequest);

        if (activeBookData.status === true || activeBookData.status === false) {
          pendingCount = pendingCount + 1;
          let row = pendingTableBody.insertRow();
          let titleCell = row.insertCell(0);
          let postedDateCell = row.insertCell(1);
          let priceCell = row.insertCell(2);
          let buyerNamecell = row.insertCell(3);
          let changeStatusCell = row.insertCell(4);
          let contactBuyerCell = row.insertCell(5);
          titleCell.textContent = activeBookData.title;
          postedDateCell.textContent = activeBookData.posted_date;
          priceCell.textContent = activeBookData.price;
          buyerNamecell.textContent = activeBookData.buyer_name;
          if (activeBookData.status === false) {
            changeStatusCell.appendChild(pendingButton);
          } else {
            let buttonContainer = document.createElement("div");
            buttonContainer.className='btn-container'
            buttonContainer.appendChild(restoreButton);
            buttonContainer.appendChild(soldButton);
            changeStatusCell.appendChild(buttonContainer);
          }

          const icon = document.createElement("i");
          icon.setAttribute("pid", activeBookData.booked_id);
          const notHoverClass = "fa-regular fa-comments chat-icon";
          const hoverClass = "fa-solid fa-comments chat-icon";
          icon.className = notHoverClass; // Set the initial class to the regular icon
          icon.style.fontSize = "30px";

          var dotIcon = document.createElement("i");
          dotIcon.className = "fa-solid fa-circle";
          dotIcon.style = "color: #f50a0a;";
          if (activeBookData.chat_notification_count > 0) {
            icon.appendChild(dotIcon);
          }
          contactBuyerCell.appendChild(icon);

          icon.addEventListener("mouseover", function () {
            icon.className = hoverClass; // Add the solid icon class
          });

          icon.addEventListener("mouseout", function () {
            icon.className = notHoverClass; // Add the regular icon class
          });

          icon.addEventListener("click", handleChatRequest);
        } else {
          activeCount = activeCount + 1;
          let row = activeTableBody.insertRow();
          let titleCell = row.insertCell(0);
          let postedDateCell = row.insertCell(1);
          let priceCell = row.insertCell(2);
          let editCell = row.insertCell(3);
          let deleteCell = row.insertCell(4);
          titleCell.textContent = activeBookData.title;
          postedDateCell.textContent = activeBookData.posted_date;
          priceCell.textContent = activeBookData.price;
          editCell.appendChild(editButton);
          deleteCell.appendChild(deleteButton);
        }
      });
      if (pendingCount == 0) {
        pendingBookContainer.innerHTML = ` <h4 class="text-center mb-5"> You  don't have any  pending request. When someone want's to buy your books it will display here. </h4>`;
      }

      if (activeCount == 0) {
        activeBookContainer.innerHTML = ` <h4 class="text-center mb-5"> You  don't have any  pending request. When you posted some books it will display here. </h4>`;
      }
    },
  });
  activeBookContainer.scrollIntoView({
    behaviour: "smooth",
    block: "center",
  });
});

function handleDeleteBookRequest(event) {
  let book_id = event.target.getAttribute("pid");
  let deleteModalOkButton=document.querySelector("#delete-active-book-btn")
  deleteModalOkButton.addEventListener("click",()=>{
  $.ajax({
    method: "POST",
    url: "/delete-book/",
    data: { book_id: book_id },
    success: function (data) {
      var activeTableBody = document.querySelector("#active-book-table tbody");
      let tableCell = event.target.parentNode;
      let tableRow = tableCell.closest("tr");
      activeTableBody.removeChild(tableRow);
    },
  });
})
}

const soldBookButton = document.getElementById("sold-books");
soldBookButton.addEventListener("click", () => {
  editProfileContainer.style.display = "none";
  bookedBookContainer.style.display = "none";
  editBookContainer.style.display = "none";
  wholeActiveBookContainer.style.display = "none";
  soldBookContainer.style.display = "block";

  $.ajax({
    method: "get",
    url: "/sold-book/",
    data: {},
    success: function (data) {
      if (data.data.length == 0) {
        soldBookContainer.innerHTML = ` <h3 class="text-center mb-5"> You  haven't sold any books. Fell free to Post and sold the books. </h3>`;
      }

      let tableBody = document.querySelector("#sold-data-table tbody");
      let rows = tableBody.getElementsByTagName("tr");

      // Remove each row
      for (let i = rows.length - 1; i >= 0; i--) {
        let row = rows[i];
        tableBody.removeChild(row);
      }
      data.data.forEach((data) => {
        var row = tableBody.insertRow();

        var bookNameCell = row.insertCell(0);
        var postedDurationCell = row.insertCell(1);
        var sellingPriceCell = row.insertCell(2);
        var buyerNamCell = row.insertCell(3);

        bookNameCell.textContent = data.bookname;
        postedDurationCell.textContent = data.postedduration;
        sellingPriceCell.textContent = data.sellingprice;
        buyerNamCell.textContent = data.buyername;
      });
    },
  });
  soldBookContainer.scrollIntoView({
    behaviour: "smooth",
    block: "center",
  });
});


// code for handle delete user info 

const deleteUserModalOkButton=document.querySelector("#delete-user-modal-ok-btn")
deleteUserModalOkButton.addEventListener("click",()=>{
$.ajax({

  method:"get",
  url:"/delete-profile/",
  success:function(){
    window.location.href=`/`

  }
})


})
