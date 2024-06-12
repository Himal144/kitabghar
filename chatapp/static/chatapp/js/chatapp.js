
const chatRow=document.querySelector(".chat-row")
function chatFunction(event){ 
    const booked_id =event.target.getAttribute("pid")
    const sendButton=document.getElementById("message-send-button")
    sendButton.setAttribute("pid",booked_id)
    const chatContainer=document.getElementById("chat-container")
    chatContainer.style.display='block';

    
        $.ajax({
           type:"get",
         url:"/chat/",
        data:{
       booked_id:booked_id
        },
        success: (data) => {
          
          while (chatRow.firstChild) {
            chatRow.removeChild(chatRow.firstChild);
          }
          const senderimage=document.getElementById("sender-image")
          senderimage.src=data.sender_info.sender_photo
          const sendername=document.getElementById("sender-name")
          sendername.textContent=data.sender_info.sender_name
          data.conversation.forEach((element) => {

            if (element.sender_id == data.user_id) {
              const messageDiv = document.createElement("div");
              messageDiv.innerText = `${element.message}`;
              messageDiv.classList.add("chat", "buyer");
              chatRow.appendChild(messageDiv);
            } else {
              const messageDiv = document.createElement("div");
              messageDiv.innerText = `${element.message}`;
              messageDiv.classList.add("chat", "seller");
              chatRow.appendChild(messageDiv);
            }
          });
        },
    
      })
}

const crossBtn=document.querySelector("#cross-icon")
crossBtn.addEventListener("mouseover", function () {
  crossBtn.className = "fa-solid fa-circle-xmark"; // Add the solid icon class
});
crossBtn.addEventListener("mouseout", function () {
  crossBtn.className = "fa-regular fa-circle-xmark"; // Add the solid icon class
});


crossBtn.addEventListener("click",()=>{
    
    const chatContainer=document.getElementById("chat-container")
    chatContainer.style.display='none';
   
  })
  
  
  let messageSendButton=document.getElementById("message-send-button")
  messageSendButton.addEventListener("click",(event)=>{

    event.preventDefault();
    const sendButton=document.getElementById("message-send-button")
    const booked_id=sendButton.getAttribute("pid")
    const message=document.getElementById("message").value
    
    $.ajax({
        type:"post",
        url:"/send-chat/",
        data:{
          booked_id:booked_id,
          message:message,
    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
  },
  success:(data)=>{

    const messageDiv = document.createElement("div");
    messageDiv.innerText = `${message}`;
    messageDiv.classList.add("chat", "buyer");
    chatRow.appendChild(messageDiv);
      
    document.getElementById("message").value=''
         
     }
   })
         
})
  
export{chatFunction}