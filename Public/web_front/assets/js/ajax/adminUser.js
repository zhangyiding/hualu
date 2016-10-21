$(function(){
	//获取城市列表
	var cityList = JSON.parse(localStorage.getItem('cityArr'));
	$('#u_city_id,#s_city_id,#add_city_id').append('<option value="">Select City</option>');
	for(var i = 0; i < cityList.length; i++){
		var countryName = cityList[i].name;
    	var countryId = cityList[i].id;
    	$('#u_city_id,#s_city_id,#add_city_id').append('<option value="'+countryId+'">'+countryName+'</option>');
	}
	//获取管理组信息
	$('#s_group,#add_group').append('<option value="">Select Group</option>');
	$.ajax({
		type:"get",
		url:BASE_URL+"/admin/role/index",
		data:{token:TOKEN},
		success:function(call){
			if(call.code=='10001'){
				alert('用户尚未登录');
				window.location.href= './login.html';
			}else if(call.code =='10002'){
				alert('无权限访问');
			}else if(call.code =='10000'){
				var groupList = call.result.data;
				for(var i = 0; i<groupList.length;i++){
		        	var groupId = groupList[i].id;
					var groupName = groupList[i].name;
			    	$('#s_group,#add_group').append('<option value="'+groupId+'">'+groupName+'</option>');
				}
			}
		}
	});
	
	
	
	//编辑按钮 获取数据赋值到表单
	$('.userList').on('click','.edit_btn',function(){
		var editData =JSON.parse($(this).attr('data-edit')) ;
		console.log(editData);
		var _this = $(this).parent().parent().children();
		$("#nickname").val(_this.eq(2).html());
		$("#job_code").val(_this.eq(1).html());
		$("#email").val(_this.eq(3).html());
		$("#tel").val(_this.eq(4).html());
		$("#post").val(_this.eq(6).html());
		$("#password").val(editData.password);
		$("#s_group").val(editData.s_group);
		$("#s_city_id").val(_this.eq(5).attr('data-cityid'));
		$("#s_id").val(editData.id);
		$("#s_password").val(editData.password);
		$("#password,#add_password").attr('type','password');
		
	});
	
	//生成密码
	$(".createPwd").on('click',function(){
		$.ajax({
			type:"get",
			data:{token:TOKEN},
			url:BASE_URL+"/admin/member/generatePassword",
			async:true,
			success:function(data){
				if(data.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
				}else if(data.code =='10002'){
					alert('无权限访问');
				}else if(data.code =='10000'){
					var pass = data.result.password
					$("#password,#add_password").val(pass);
					$("#password,#add_password").attr('type','text');
				}

			}
		});
	})
	
	
	//确定 保存 
	$('.save_Btn').on('click',function(){
		if($('#nickname').val()==''){
			alert('姓名不得为空！');
		}else if($('#job_code').val()==''){
			alert('工号不得为空！');
		}else if($('#email').val()==''){
			alert('邮箱不得为空！');
		}else if($('#tel').val()==''){
			alert('电话不得为空！');
		}else if($('#post').val()==''){
			alert('职务不得为空！');
		}else if($('#password').val()==''){
			alert('密码不得为空！');
		}else if($('#s_group').val()==''){
			alert('所属组不得为空！');
		}else if($('#s_city_id').val()==''){
			alert('所属城市不得为空！');
		}else if(!recodeTel($("#tel").val())){
			alert('请输入正确的电话格式,如：+1 12345');
		}else if(!testEmail($("#email").val())){
			alert('请输入正确 的邮箱！')
		}else if($("#password").val().length<6){
			alert('密码长度不得低于6位！');
		}else {
			var dataJson = {};
			dataJson.id=$("#s_id").val();
			dataJson.nickname=$("#nickname").val();
			dataJson.job_code=$("#job_code").val();
			dataJson.email=$("#email").val();
			dataJson.region_code=$("#tel").val().split(' ')[0].split('+')[1];
			dataJson.mobile=$("#tel").val().split(' ')[1];
			dataJson.city_id=$("#s_city_id").val();
			dataJson.role_id=$("#s_group").val();
			dataJson.post=$("#post").val();
			dataJson.token=TOKEN;
			if($('#password').val()!=$("#s_password").val()){
				dataJson.password=$("#password").val();
			}else{
				delete dataJson["password"];
			}
			console.log(dataJson);
			$.ajax({
				type:"post",
				url:BASE_URL+"/admin/member/update",
				data:JSON.stringify(dataJson),
				dataType:'json',
				success:function(data){
					console.log(data);
					if(data.code=='10001'){
						alert('用户尚未登录');
						window.location.href= './login.html';
					}else if(data.code =='10002'){
						alert('无权限访问');
					}else if(data.code =='10000'){
						$(".userList").children('tr').each(function(){
							if($(this).attr('data-id')==dataJson.id){
								$(this).children().eq(1).html(dataJson.job_code);
								$(this).children().eq(2).html(dataJson.nickname);
								$(this).children().eq(3).html(dataJson.email);
								$(this).children().eq(4).html($("#tel").val());
								$(this).children().eq(5).html($("#s_city_id").find("option:selected").text());
								$(this).children().eq(6).html(dataJson.post);
							}
						})
						alert('编辑成功！')
						$("#edit_admin_user").modal('hide');
						
					}
					
				}
			});
		}
		
	});
	
	//添加管理员 弹出框
	$(".btn_add_admin").on("click",function(){
		$("#add_password").val('');
	})
	
	//确定添加管理员
	$(".btn_Create").on('click',function(){
		if($('#add_nickname').val()==''){
			alert('姓名不得为空！');
		}else if($('#add_job_code').val()==''){
			alert('工号不得为空！');
		}else if($('#add_email').val()==''){
			alert('邮箱不得为空！');
		}else if($('#add_tel').val()==''){
			alert('电话不得为空！');
		}else if($('#add_post').val()==''){
			alert('职务不得为空！');
		}else if($('#add_password').val()==''){
			alert('密码不得为空！');
		}else if($('#add_group').val()==''){
			alert('所属组不得为空！');
		}else if($('#add_city_id').val()==''){
			alert('所属城市不得为空！');
		}else if(!recodeTel($("#add_tel").val())){
			alert('请输入正确的电话格式,如：+1 12345,区号:1~4位,电话号:6~15位');
		}else if(!testEmail($("#add_email").val())){
			alert('请输入正确 的邮箱！')
		}else if($("#add_password").val().length<6){
			alert('密码长度不得低于6位！');
		}else{
			var dataNew ={};
			dataNew.nickname = $("#add_nickname").val();
			dataNew.job_code = $("#add_job_code").val();
			dataNew.email = $("#add_email").val();
			dataNew.region_code=$("#add_tel").val().split(' ')[0].split('+')[1];
			dataNew.mobile=$("#add_tel").val().split(' ')[1];
			dataNew.city_id=$("#add_city_id").val();
			dataNew.role_id=$("#add_group").val();
			dataNew.post=$("#add_post").val();
			dataNew.password=$("#add_password").val();
			dataNew.token=TOKEN;
			
			$.ajax({
				type:"post",
				url:BASE_URL+"/admin/member/add",
				dataType:'json',
				data:JSON.stringify(dataNew),
				success:function(data){
					if(data.code=='10001'){
						alert('用户尚未登录');
						window.location.href= './login.html';
					}else if(data.code =='10002'){
						alert('无权限访问');
					}else if(data.code=='10000'){
						alert('添加成功');
						window.location.reload();
						$("#add_admin_user").modal('hide');
					}else{
						alert(data.msg)
					}
				}
			});
		}
		
	})
	
	
	
	//编辑管理组用户状态
	$(".userList").on('click','.btn_uStatus',function(){
		var s = parseInt($(this).attr('data-uStatus'));
		var _this = $(this);
		var s_id = $(this).parent().parent().attr('data-id');
		var sjson = {};
		sjson.id = s_id;
		sjson.status = !s;
		sjson.token=TOKEN;
		
		$.ajax({
			type:"post",
			url:BASE_URL+"/admin/member/status",
			dataType:'json',
			data:JSON.stringify(sjson),
			success:function(data){
				if(data.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
				}else if(data.code =='10002'){
					alert('无权限访问');
				}else if(data.code=='10000'){
					if(s==1){
						_this.removeClass('btn-success-alt').addClass('btn-danger-alt').html('启用');
						_this.attr('data-uStatus',0);
					}else{
						_this.removeClass('btn-danger-alt').addClass('btn-success-alt').html('禁用');
						_this.attr('data-uStatus',1);
					}
					alert('编辑成功');
				}
			}
		});
		
	})
	
	
	
	
	
	
	//搜索
	userList(1);
	$("#u_sub").on('click',function(){
		$(".pageBox").html('<ul id="pagination" class="pagination m-n"></ul>');
		userList(1);
		return false;
	})
	
	
	function userList(page){
		var Json = {};
		Json.id = $("#u_id").val();
		Json.job_code = $("#u_job_code").val();
		Json.nickname = $("#u_username").val();
		Json.email = $("#u_email").val();
		Json.mobile = $("#u_tel").val();
		Json.city_id = $("#u_city_id").val();
		Json.page = page;
		Json.token=TOKEN;
//		Json.pagesize = 10;
		
		
		
		$.ajax({
			type:"get",
			url:BASE_URL+"/admin/member/index/",
			data:Json,
			success:function(call){
				if(call.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
				}else if(call.code =='10002'){
					alert('无权限访问');
					console.log(111)
				}else if(call.code=='10000'){
					var data = call.result.data;
					$(".userList").html('');
					var temp = '';
					for(var i = 0; i <data.length; i++){
						var id = data[i].id;
						var job_code = data[i].job_code;
						var nickname = data[i].nickname;
						var email = data[i].email;
						var tel = "+" + data[i].region_code + " " + data[i].mobile;
						var city_id = data[i].city_id;
						var city_name = '';
						var post = data[i].post;
						cityList.forEach(function(val,index){
							if(val.id == city_id){
								city_name=val.name;
							}
						})
						
						var status = data[i].status;
						var statusHtml = '';
						if(status==1){
							statusHtml =' <a href="javascript:;" data-uStatus="'+status+'" class="btn btn-success-alt btn-s btn_uStatus">禁用</a>';
						}else{
							statusHtml =' <a href="javascript:;" data-uStatus="'+status+'" class="btn btn-danger-alt btn-s btn_uStatus">启用</a>';
						}
						var dataEdit = {};
						dataEdit.id = data[i].id;
						dataEdit.password = data[i].password;
						dataEdit.s_group = data[i].role_id;
						var permissions = data[i].permissions;
						var role_permissions = data[i].role_permissions;
						var editData = JSON.stringify(dataEdit);
						temp += '<tr data-id='+dataEdit.id+'>'
			                        +'<td>'+id+'</td>'
			                        +'<td>'+job_code+'</td>'
			                        +'<td>'+nickname+'</td>'
			                        +'<td>'+email+'</td>'
			                        +'<td>'+tel+'</td>'
			                        +'<td data-cityId='+city_id+'>'+city_name+'</td>'
			                        +'<td>'+post+'</td>'
			                        +'<td><a data-toggle="modal" href="#edit_admin_user" data-edit='+editData+' class="btn btn-info-alt btn-s edit_btn">编辑</a> <a data-toggle="modal" data-role_permissions="'+role_permissions+'" data-posstion="'+permissions+'" href="#admin_user_access" class="btn btn-info-alt btn-s quanxian">权限</a> '+statusHtml+'</td>'
			                    +'</tr>';
					}
					
					$(".userList").append(temp);
					var super1 = $('.userList').children('tr').eq(0).children();
					if(super1.eq(0).html()=='1'){
						super1.eq(7).html('系统初始化创建，不可删除，不可编辑，拥有全部权限');
					}
					
					//分页管理
//					var pageNum = Math.ceil(parseInt(call.result.pagesize)/(call.result.pagesize));
					var pageNum = call.result.totalpage;
					console.log(call.result);
					
					pageStatus = 0;
					
					$('#pagination').twbsPagination({
				        totalPages: pageNum,
				        visiblePages: 6,
				        onPageClick: function (event, page) {
				        	if(pageStatus>0){
				            	userList(page);
							}
				        }
				    });
					pageStatus++;
		        	$('body,html').animate({scrollTop:0},500);
				}else{
					alert('暂无查询结果');
				}
			}
		});
	}
	
	//权限
	$('body').on('click','.quanxian',function(){
		var a = $(this).parent().parent().children().eq(0).html();
		localStorage.setItem("quanxian", a)
		console.log(a);
		$('.check').attr("checked", false);
		var b = $(this).attr('data-posstion');
		var c = $(this).attr('data-role_permissions'); 
		console.log(c);
	$.ajax({
		type:"get",
		url:BASE_URL+"/admin/permissions/index",
		async:true,
		data:{token:TOKEN},
		success:function(call){
			if(call.code=='10001'){
				alert('用户尚未登录');
				window.location.href= './login.html';
			}else if(call.code =='10002'){
				alert('无权限访问');
			}else if(call.code =='10000'){
				
				console.log(call);
				var zuo = call.result.module;
				var you = call.result.permissions;
				var quanxianbianji = document.getElementById('quanxianbianji');
				quanxianbianji.innerHTML='';
				for(var i=0;i<zuo.length;i++){
					var quanname = zuo[i].name;
					var quanId = zuo[i].id;
					var permissionsHtml = '';
					//console.log(quanname);
					you.forEach(function(v){
						if(quanId==v.module_id){
							permissionsHtml += '<label class="checkbox-inline"><input type="checkbox" id="inlinecheckbox'+v.id+'" class="check" value="'+v.id+'">'+v.name+'</label>'
						}
					})
					
					
					quanxianbianji.innerHTML += '<div class="form-group">'+
													'<label class="col-sm-2 control-label">'+quanname+'</label>'+
													'<div class="col-sm-8">'+permissionsHtml+'</div>'+
												'</div>';
				}
				
				if(b=='*'){
					$('.check').attr("checked", true);
				}
				if(c=='*'){
					$('.check').attr("checked", true);
					$('.check').attr("disabled", true);
				}
				$("#quanxianbianji").children('.form-group:last-child').find('input').attr("checked", true);
				var l = b.split(',');
				$(".check").each(function(index,element){
					var i = $(this).val();
					//console.log(i)
					if($.inArray(i,l) >= 0){
						$(this).attr('checked',true)
					}
				})
				var lc = c.split(',');
				$(".check").each(function(index,element){
					var i = $(this).val();
					//console.log(i)
					if($.inArray(i,lc) >= 0){
						$(this).attr('checked',true)
						$(this).attr("disabled", true);
					}
				})
			}
			
		}
	});	
		
		
		
		
	})
	//添加权限
	$('.quanxiantj').click(function(){
		var tianjiaqx = {}
		var quanxianId = localStorage.getItem('quanxian');
		tianjiaqx.id = quanxianId;
		//console.log(_this);
		//console.log(bianjiid);
		var lbiao =[];
		$(".check").each(function(index){
			//var d = $(this).attr('checked');
			if($(this).is(":checked")){
				var a = $(this).val();
				lbiao.push(a);
			}
		})
		//console.log(lbiao);
		var zifu = lbiao.join(",");
		tianjiaqx.permissions = zifu;
		console.log(tianjiaqx);
		tianjiaqx.token=TOKEN;
		Tianjiaqx = JSON.stringify(tianjiaqx);
		$.ajax({
			type:"post",
			url:BASE_URL+"/admin/member/permissions",
			async:true,
			data:Tianjiaqx,
			dataType:"json",
			success:function(call){
				if(call.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
				}else if(call.code =='10002'){
					alert('无权限访问');
				}else if(call.code =='10000'){
					alert('修改成功');
					window.location.reload();
					$('.close').trigger("click");
				}else{
					alert('修改失败')
				}
			}
		});
	})
	
	
	//匹配国家码手机号
	function recodeTel(tel){
		var reg = new RegExp("");
		if(tel.startsWith('+')){
			var l = tel.split(' ')[0];
			var lr = tel.split(' ')[1];
			if(l.length<=1||l.length>5 ||lr.length<6||lr.length>15|| !/^[0-9]*$/.test(lr)){
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	}
	//邮箱验证
	function testEmail(email){
		var reg =  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(reg.test(email)){
			return true;
		}else{
			return false;
		}
	}

})
