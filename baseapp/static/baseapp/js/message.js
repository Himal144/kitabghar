function getMessages(){
   
    $.ajax({
      method:"get",
      url:"/get-messages/",
      data:{},
      success:function(data){
        data.messages.forEach((data)=>{
          let messageContainer=document.getElementById('message-container')
          messageContainer.innerHTML = `
          <div class="alert alert-info hide mt-3 pt-1" id="alert-message-container">
            <span class="fas fa-exclamation-circle"></span>
            <span class="msg fw-light">
              <div class="messages">
                <div class="message" id="alert-message"></div>
              </div>
            </span>
            <div class="close-btn">
              <span class="fas fa-times"></span>
            </div>
          </div>
        `;
        const messageSpan=document.querySelector('.alert span')
        $('.alert').addClass("show");
        $('.alert').removeClass("hide");
        let alertContainer=document.getElementById('alert-message-container')
        $('#alert-message').text(data.message);
        if(data.header=="success"){
          alertContainer.style.backgroundColor = "#4af72b";
        }
        if(data.header=="info"){
          alertContainer.style.backgroundColor = "aqua";
        }
        if(data.header=="warning"){
          alertContainer.style.backgroundColor = "rgb(244, 58, 145)";
        }
  
          setTimeout(function(){
            $('.alert').removeClass("show");
            $('.alert').addClass("hide");
            messageContainer.innerHTML=``;
          },3000);
        
        $('.close-btn').click(function(){
          $('.alert').removeClass("show");
          $('.alert').addClass("hide");
          messageContainer.innerHTML=``;
        });
      })
      }
    })
  }
  
  getMessages();
  setInterval(()=>{
    getMessages();
  },2000)