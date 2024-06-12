const buyButton = document.getElementById("buy");

const submit = document.querySelector(".submit-btn");
  submit.addEventListener("click", () => {
    const book = document.getElementById("book-id");
    const book_id = book.getAttribute("attr");
    
    $.ajax({
      type: "GET",
      url: "/book-book/",
      data: {
        book_id: book_id,
      },
      success: function (data) {
        window.location.href = `/profile/`;
      },
      error: function(xhr, status, error) {
        if (xhr.status === 401) {
          // Redirect to the login page
          window.location.href = '/login/';
        } else {
          // Handle other errors
          console.error('An error occurred:', error);
        }
      }
    });
  });




