const notificationButton = document.getElementById("notification-button");
const notificationDropdown=document.querySelector( "#notification-dropdown")
const menu=document.querySelector(".notification-menu ")
var notificationIcon = document.getElementById("notification-icon");



notificationButton.addEventListener("show.bs.dropdown", function() {
  // Change the icon to solid when dropdown is shown
  notificationIcon.className = "fa-solid fa-bell text-black m-1 fs-3";
});

// Handle the Bootstrap dropdown hide event
notificationButton.addEventListener("hide.bs.dropdown", function() {
  // Revert to the regular icon when dropdown is hidden
  notificationIcon.className = "fa-regular fa-bell text-black m-1 fs-3";
});
notificationButton.addEventListener("click", () => {
 
  var notificationCountSpan = document.getElementById("notification-count");
    if (notificationCountSpan) {
      notificationCountSpan.remove();
    }
  // Handle the Bootstrap dropdown show event
  

  if(window.innerWidth>=992){
    if(menu.classList.contains("dropdown-menu-start")){
      menu.classList.remove("dropdown-menu-start")
    }
    menu.classList.add("dropdown-menu-end")
  }
  else if(window.innerWidth<992){
    if(menu.classList.contains("dropdown-menu-end"))
    {
      menu.classList.remove("dropdown-menu-end")
    }
    menu.classList.add("dropdown-menu-start")
  }

 
  while (notificationDropdown.firstChild) {
    notificationDropdown.removeChild(notificationDropdown.firstChild);
}

  $.ajax({
    type: "GET",
    url: "/notification/",
    data: {},
    success: function (notification_data) {

     const firstchild=document.createElement("li");
     firstchild.textContent="Notifications"
     firstchild.className=" text-center fw-bold fs-6"
     notificationDropdown.appendChild(firstchild)


     if((notification_data.search_notification.length+notification_data.pending_notification.length)==0){

      const secondchild=document.createElement("li");
     secondchild.textContent="No new notifications"
     secondchild.className=" text-center fw-bold fs-6"
     notificationDropdown.appendChild(secondchild)
     }

      notification_data.search_notification.forEach((element) => {
        const notificationDropdownList = document.createElement("li");
        notificationDropdownList.setAttribute("book_id", element.book_id);
        notificationDropdownList.setAttribute("search_id", element.search_id);
        notificationDropdownList.className = "border-r border notification-list";
        notificationDropdownList.addEventListener(
          "click",
          handleSearchNotificationClick
        );

        const notificationContent = document.createElement("p");
        notificationContent.className="dropdown-item"
        notificationContent.textContent = `${element.title} book is now available you may like this.`;

        

        notificationDropdownList.appendChild(notificationContent);
        notificationDropdown.appendChild(notificationDropdownList);
      });

      notification_data.pending_notification.forEach((element) => {
        const notificationDropdownList = document.createElement("li");
        notificationDropdownList.setAttribute("pending_id", element.pending_id);
        notificationDropdownList.className = "border-r border notification-list dropdown-item";
        notificationDropdownList.addEventListener(
          "click",
          handlePendingNotificationClick
        );

        const notificationContent = document.createElement("p");
        notificationContent.textContent = ` ${element.buyer_name} wants to buy the ${element.book_name} posted by you.`;

      
        notificationDropdownList.appendChild(notificationContent);
        notificationDropdown.appendChild(notificationDropdownList);
      });
    },
  });


  
});
function handleSearchNotificationClick(event)
{
  listElement=event.target;
  listElement=listElement.closest("li")
  const searchId=listElement.getAttribute("search_id")
  listElement=listElement.closest("li");
  book_id=listElement.getAttribute("book_id");

$.ajax({
  method:"post",
  url:"/notification/",
  data:{"searchId":searchId},
  success:function(){
    window.location.href = `/book-detail/${book_id}`;
  },
  error:function(){
    window.location.href = `/`;
  }
})
}

async function handlePendingNotificationClick(event) {
  // Navigate to the "/profile/" page
  window.location.href = "/profile/";

  // Use a flag to control whether to execute the code
  let shouldExecuteCode = false;

  // Listen for the "DOMContentLoaded" event
  document.addEventListener("DOMContentLoaded", function() {
    // This code will run when the "/profile/" page is fully loaded
    shouldExecuteCode = true;
  });

  // Use window.onload to ensure the page is fully loaded
  window.onload = function() {
    // Check if the code should be executed
    if (shouldExecuteCode) {
      alert("Page has loaded");
      let activeBookButton = document.getElementById("active-books");
      console.log(activeBookButton);
      if (activeBookButton) {
        activeBookButton.click();
      }
    }
  };
}
// code for the message displaying the 
