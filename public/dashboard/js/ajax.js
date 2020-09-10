	$(document).ready(function(){
		$("#vouchercode").val='';
		$("#voucherError").css("display","none");
		$("#voucherRedeem").css("display","none");
		$("#VoucherSuccess").css("display","none");
		$("#voucherExpired").css("display","none");		
		$("#payment-form").removeClass('paymentForm');

		$("#currentpasswordempty").css("display","none");
		$("#passwordempty").css("display","none");
		$("#confirmpasswordempty").css("display","none");

		$("#loader").css("display","none");
	});
	function Voucherinfo(){		 
	  var promocode = $("#vouchercode").val();
      if(promocode==''){
			$("#coursetitle").text();
			$("#coursetitle").text('Please Enter Voucher Code!');
			$(".add-course-btn").attr('disabled',true);
			return false;
	  }else{				
				var dataString='promocode='+promocode;	
				$("#loader").css("display","block");
				$("#coursetitle").text("");
				$.ajax({
					type:'POST',
					data:dataString,
					url:'student/getvoucherinfo',
					success:function(result){
						$("#loader").css("display","none");			 
						if(result.voucherstatus=='Redeem'){
							$("#coursetitle").text();
							$("#coursetitle").text('This Voucher Code is already Redeem ! Please Try New Code');
							$(".add-course-btn").attr('disabled',true);
						}else if(result.invalid =='invalid'){				   
							$("#coursetitle").text();
							$("#coursetitle").text('This Voucher Code is Invalid ! Please Try New Code');
							$(".add-course-btn").attr('disabled',true);			   
						}
						else{
							$(".add-course-btn").attr('disabled',false);  
							$("#courseid").val(result.courseId);
							$("#user_id").val(result.userId);
							$("#coursetitle").text(result.coursename);
						}	 
					}		  
				});
			}	
	}
	
	function AddToCourse(){	
	 //alert('Add to Course Called!');
	  $("#vouchercode").val='';
      $("#myModal").hide();
	  $(".modal-backdrop").hide();
	 
	 var courseid=$("#courseid").val();
	 var userid= $("#user_id").val();
	 var promocode=$("#vouchercode").val();
	 var dataString='UserId='+userid+'&CourseId='+courseid+'&promo='+promocode;
	 //alert(dataString);

	 $.ajax({
		type:'POST',
		data:dataString,
		url:'student/addtocourse',
		success:function(data){			
			alert(data.result);			
		}		  
	});
	
	}

	function Model(){		
		$("#vouchercode").val("");
		$("#coursetitle").text("");
		$(".add-course-btn").attr('disabled',true); 
	}

	function CheckoutVoucherinfo()
	{
		var promocode = $("#vouchercode").val();
		if(promocode==''){
			 alert('Please enter Voucher Code!');
		}else
		{
			var courseid=$("#courseid").val();	
			//var courseid='H8gmdx1ohF';		
			var dataString='Vouchercode='+promocode+'&courseid='+courseid;
			$("#loader").css("display","block");
			$("#voucherRedeem").css("display","none");
			$("#voucherError").css("display","none");
			$("#VoucherSuccess").css("display","none");
            $("#payment-form").addClass('paymentForm');
			$.ajax({
			  type:'POST',
			  data:dataString,			  
			   url:'checkout/getcheckoutVoucherinfo',
			   success:function(data){
				   //alert(data.errormessage);	
				   //alert(data.voucherstatus);	
				   $("#loader").css("display","none");
				   $("#voucherRedeem").css("display","none");
				   $("#voucherError").css("display","none");
				   $("#VoucherSuccess").css("display","none");
				   $("#voucherExpired").css("display","none");

				   if(data.errormessage!= undefined){
					   $("#voucherExpired").css("display","none");
					   $("#voucherRedeem").css("display","none");
					   $("#VoucherSuccess").css("display","none");
					   $("#voucherError").css("display","block");
					   $("#payment-form").removeClass('paymentForm');
				   }else if(data.voucherstatus=='Redeem'){
					    $("#voucherExpired").css("display","none");
					    $("#voucherError").css("display","none");
					    $("#VoucherSuccess").css("display","none");
						$("#voucherRedeem").css("display","block");
						$("#payment-form").removeClass('paymentForm');
				   }else if(data.voucherstatus=='CouponExpired'){
						$("#voucherRedeem").css("display","none");
						$("#voucherError").css("display","none");
						$("#VoucherSuccess").css("display","none");
						$("#voucherExpired").css("display","block");
						$("#payment-form").removeClass('paymentForm');
				   }
				   else{
					    $("#voucherExpired").css("display","none");
						$("#voucherRedeem").css("display","none");
						$("#voucherError").css("display","none");
						$("#VoucherSuccess").css("display","block");
						$("#payment-form").addClass('paymentForm');
				   }		   
				 
			   }			   
			});
		}
	}
	function Email(){
		window.location.href='student/update_email_password';
	}
	function UpdatePassword(){
		var  currentpass = $("#currentpassword").val();
		var  password= $("#password").val();
		var confirmpassword = $("#confirmpassword").val();
		if(currentpass=='' && password=='' && confirmpassword==''){
			$("#currentpasswordempty").css("display","block");
			$("#passwordempty").css("display","block");
			$("#confirmpasswordempty").css("display","block");
			return false;
		}
		if(currentpass!='' && password=='' && confirmpassword==''){
			$("#currentpasswordempty").css("display","none");
			$("#passwordempty").css("display","block");
			$("#confirmpasswordempty").css("display","block");
			return false;
		}
		if(currentpass!='' && password!='' && confirmpassword==''){
			$("#currentpasswordempty").css("display","none");
			$("#passwordempty").css("display","none");
			$("#confirmpasswordempty").css("display","block");
			return false;
		}
		if(password!=confirmpassword){
			if(currentpass==''){
				$("#currentpasswordempty").css("display","block");
			}
			$("#currentpasswordempty").css("display","none");
			$("#passwordempty").css("display","none");
			alert('Confirm Password did not match try again!');
			$("#confirmpassword").val("");
			return false;
		}
		if(currentpass=='' && password==confirmpassword){
			$("#currentpasswordempty").css("display","block");
			$("#confirmpasswordempty").css("display","none");
			$("#passwordempty").css("display","none");
			return false;
		}
		if(currentpass!='' && password==confirmpassword){
		
			var dataString='cpass='+currentpass+'&password='+password;
			alert(dataString);
			$.ajax({
				type:'POST',
				url:'savepassword',
				data:dataString,
				success:function(result){
					console.log(result);
				}
			});

			
		}
		
	}
	function sendMessage()
	{

		 if($(".messages-textarea").val()==""){
			 alert('Please Enter the Message!');
			 return false;
		 }
		
		var instructor = document.getElementById('exampleFormControlSelect1');
		var message=$(".messages-textarea").val();

		 var instructorid=instructor.value;
		 console.log(instructorid);

		var dataString='to='+instructorid+'&message='+message;

		$.ajax({
			type:'POST',
			url:'messageinstructor',
			data:dataString,
			success:function(data){
				alert(data.result);
			}
		});

	}