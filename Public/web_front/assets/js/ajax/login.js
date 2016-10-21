window.BASE_URL = 'http://admin-api.dev.etago.com';
//获取用户名和密码提交到后台，把用户名储存到cookie里，设置到期时间。
	var name = $('#name').val();
	$('#name').val(getcookie('Usename'));
	if(getcookie('checked')==1){
	$("#check input").iCheck('check');
	$('.passWord').val(getcookie('password'))	
	}
	$("#check input").on('ifChecked', function(event){
		var passWord = $('.passWord').val();
  		setcookie('password',passWord,30);
  		setcookie('checked',1,30);
	});
	$("#check input").on('ifUnchecked', function(event){
		removecookie('password');
		setcookie('checked',0,30);
	})
$('.btn').click(function(e){
	var uname = $('#name').val();
	console.log(uname);
	var passWord = $('.passWord').val();
	var login = {};
	login.username = uname;
	login.password = passWord;
	if(uname==''){
		alert('用户名不能为空');
	}else if(passWord==''){
		alert('密码不能为空');
	}
	var Login = JSON.stringify(login)
	$.ajax({
		type:"post",
		url:BASE_URL+"/admin/login/index",
		async:false,
		dataType:"json",
		data:Login,
		success:function(call){
			console.log(call);
			if(call.code==10010){
				alert('您输入的用户名或密码不正确!');
			}else if(call.code==10000){
				setcookie('Usename',uname,30);
  		        setcookie('password',passWord,30);
  		        
				window.location.href = "./index.html";
				
				//用户信息
				var inmtion = {};
				var user_id = call.result.user_info.user_id;
				var nickname = call.result.user_info.nickname;
				var email = call.result.user_info.email;
				var region_code = call.result.user_info.region_code;
				var mobile = call.result.user_info.mobile;
				var job_code = call.result.user_info.job_code;
				var face = call.result.user_info.face;
				var add_time = call.result.user_info.add_time;
				var last_login_time = call.result.user_info.last_login_time;
				var last_login_ip = call.result.user_info.last_login_ip;
				var reg_time = call.result.user_info.reg_time;
				inmtion.user_iD = user_id;
				inmtion.Nickname = nickname;
				inmtion.Email = email;
				inmtion.Region_code = region_code;
				inmtion.Mobile = mobile;
				inmtion.Job_code = job_code;
				inmtion.Face = face;
				inmtion.Add_time = add_time;
				inmtion.Last_login_time = last_login_time;
				inmtion.Last_login_ip = last_login_ip;
				inmtion.Reg_time = reg_time;
				inmtion.token = call.result.token;
				
				localStorage.setItem("Inmtion", JSON.stringify(inmtion));
				
				var menu_arr = new Array();
				var menu = call.result.menu_list;
				for(var a=0;a<menu.length;a++){
					var menu_list =  {};
					menu_list.del_flag = menu[a].del_flag;
					menu_list.ico = menu[a].ico;
					menu_list.id = menu[a].id;
					menu_list.url = menu[a].url;
					menu_list.name = menu[a].name;
					menu_list.parent_id = menu[a].parent_id;
					menu_list.permissions = menu[a].permissions;
					menu_list.sort_order = menu[a].sort_order;
					menu_list.status = menu[a].status;
					menu_list.type = menu[a].type;
					if(menu[a].son){
						var sonArr = new Array();
						for(var b=0;b<menu[a].son.length;b++){
							sonArr.push(menu[a].son[b]);
						}
						menu_list.son = sonArr;
					}
					menu_arr.push(menu_list);
					
				}
				console.log(menu_arr);
				localStorage.setItem("menu_arr", JSON.stringify(menu_arr));
			} 
		}
	});
})

function setcookie(name,value,iDay){  //存储cookie
			var oDate = new Date();
			oDate.setDate(oDate.getDate()+iDay);
			document.cookie=name+'='+value+';expires='+oDate;
		}
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
		function removecookie(name){//删除cookie
			setcookie(name,'1',-1)
		}