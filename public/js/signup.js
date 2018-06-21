function post(obj){
$(document).ready(function(){
  //  $("button").click(function(){
        $.post("/signup",
        {
          account: $('input[name="account"]').val(),
		  name: $('input[name="name"]').val(),
          password:$('input[name="password"]').val(),
		  email:$('input[name="email"]').val()
        },
        function(data,status){
			if (data=="Account is Registered"){
				alert(data);
				window.location.href='/signup'; 
			}else{
				alert(data);
				window.location.href='/'; 
			}
        });
   // });

});
   return false;
}