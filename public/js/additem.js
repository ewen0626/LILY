function post(obj){
/*$(document).ready(function(){
  //  $("button").click(function(){
        $.post("/additem",
        {
          id: $('input[name="id"]').val(),
          name: $('input[name="name"]').val(),
		  price: $('input[name="price"]').val(),
		  local_x: $('input[name="local_x"]').val(),
		  local_y: $('input[name="local_y"]').val(),
		  pic : $('input[name="pic"]').val(),
		  type: $('select[name="type"]').val(),
		  number: $('input[name="number"]').val(),
		  note: $('input[name="note"]').val()
        },
        function(data,status){
			if (data=="ID is repeat"){
				alert(data);
				window.location.href='/admin'; 
			}else if (data == "Success"){
				alert(data);
				window.location.href='/admin'; 
			}
			else{
				window.location.href='/admin'; 
			}
		
        });
		
   // });

});*/

$.ajax({
    url: '/additem',
    type: 'POST',
    cache: false,
    data: new FormData($('#additem')[0]),
    processData: false,
    contentType: false
}).done(function(data) {
			if (data=="ID is repeat"){
				alert(data);
				//window.location.href='/admin'; 
			}else if (data == "Success"){
				alert(data);
				window.location.href='/admin'; 
			}
			else{
				window.location.href='/admin'; 
			}
}).fail(function(res) {});

   return false;
}