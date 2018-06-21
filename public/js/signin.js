function post(obj){
$(document).ready(function(){
  //  $("button").click(function(){
        $.post("/signin",
        {
          account: $('input[name="account"]').val(),
          password:$('input[name="password"]').val()
        },
        function(data,status){
			if (data=="No account"){
				alert(data);
				window.location.href='/signin'; 
			}else if (data=="Account or Password ERROR"){
				alert(data);
				window.location.href='/signin'; 
			}else if (data == "admin"){
				window.location.href='/admin'; 
			}else{
				window.location.href='/'; 
			}
        });
   // });

});
   return false;
}