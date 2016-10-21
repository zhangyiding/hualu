$(function(){
	var grshezhi = {};
	var loca = localStorage.getItem("Inmtion");
	var temp = eval('('+loca+')');
	grshezhi.user_id = temp.user_iD;
	grshezhi.token = TOKEN;
	//loca.Nickname
	shezhi()
	function shezhi(){
	$.ajax({
		type:"get",
		url:BASE_URL+"/admin/contract/setting",
		async:true,
		data:grshezhi,
		success:function(call){
			if(call.code=='10001'){
			  alert('用户尚未登录');
			  window.location.href= './login.html';
			  }else if(call.code =='10002'){
			  alert('无权限访问');
			  }else if(call.code =='10000'){
			       
			console.log(call)
		var szname = $('.szname').html(call.result.nickname);
		var gonghao = $('.gonghao').html(call.result.job_code);
		var zhiwu = $('.zhiwu').html(call.result.post);
		var cityname = $('.cityname').html(call.result.city_name);
		var email = $('.email').val(call.result.email);
		var phone = $('.phone').val(call.result.mobile);
		 var getpass = getcookie('password');
		var password = $('.password').val(getpass);
				}
		}
	});
		
	}
	$('#sub').click(function(){
		
	var szname = $('.szname').html();
	grshezhi.username = szname;
	var gonghao = $('.gonghao').html();
	grshezhi.job_code = gonghao;
	
	var zhiwu = $('.zhiwu').html();
	grshezhi.post = zhiwu;
	var cityname = $('.cityname').html();
	grshezhi.city_name = cityname;
	var email = $('.email').val();
	grshezhi.email = email;
	var phone = $('.phone').val();
	grshezhi.mobile = phone;
	var password1 = $('.password').val();
	grshezhi.password = password1;
	grshezhi.token = TOKEN;
	 huoqu = JSON.stringify(grshezhi);
	console.log(huoqu)
	$.ajax({
		type:"post",
		url:BASE_URL+"/admin/contract/setting",
		async:true,
		dataType:"json",
		data:huoqu,
		success:function(call){
			console.log(call);
			alert('修改成功！')
			window.location.reload();
			
		}
	})
	return false;
	})
	/*var szname = $('.szname').html();
	var gonghao = $('.gonghao').html();
	var zhiwu = $('.zhiwu').html();
	var cityname = $('.cityname').html();
	var email = $('.email').val();
	var phone = $('.phone').val();
	var password1 = $('.password').val();*/
})
function getcookie(name) //获取cookie
		{
			var arr = document.cookie.split('; ');
			for(var i = 0;i<arr.length;i++)
			{
				var arr2 = arr[i].split('=');
				if(arr2[0]==name)
				{
					return arr2[1];
				}
			}
			return '';
		}