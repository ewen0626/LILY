function post(obj){
/*$(document).ready(function(){
  //  $("button").click(function(){
        $.post("/edititem",
        {
          id: $('input[name="id"]').val(),
          name: $('input[name="name"]').val(),
		  price: $('input[name="price"]').val(),
		  local_x: $('input[name="local_x"]').val(),
		  local_y: $('input[name="local_y"]').val(),
		  type: $('select[name="type"]').val(),
		  number: $('input[name="number"]').val(),
		  note: $('input[name="note"]').val()
        },
        function(data,status){
			if (data=="Edit Success"){
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
    url: '/edititem',
    type: 'POST',
    cache: false,
    data: new FormData($('#edititem')[0]),
    processData: false,
    contentType: false
}).done(function(data) {
			if (data=="Edit Success"){
				alert(data);
				window.location.href='/admin'; 
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