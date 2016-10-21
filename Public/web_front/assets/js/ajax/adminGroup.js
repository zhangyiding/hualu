$(function() {
	Pagelist(1)

	function Pagelist(page) {
		var pagelist = {};
		pagelist.page = page;
		pagelist.token = TOKEN;

		var temp = '';
		$.ajax({
			type: "get",
			url: BASE_URL + "/admin/role/index",
			data: pagelist,
			success: function(call) {
				if(call.code == '10001') {
					alert('用户尚未登录');
					window.location.href = './login.html';
				} else if(call.code == '10002') {
					alert('无权限访问');
				} else if(call.code == '10000') {
					console.log(call);
					$('.groupList').html('');
					var data = call.result.data;
					for(var i = 0; i < data.length; i++) {
						var id = data[i].id;
						var add_time = data[i].members;
						var del_flag = data[i].del_flag;
						var name = data[i].name;
						var permissions = data[i].permissions;
						//console.log(del_flag);
						var del_Status = '';
						if(del_flag == "0") {
							del_Status = '<a href="#" class="btn btn-success-alt btn-s del">删除</a></td>'
						} else {
							del_Status = '<a href="#" class="btn btn-danger-alt btn-s del">恢复</a></td>'
						}
						temp += '<tr>' +
							'<td>' + id + '</td>' +
							'<td>' + name + '</td>' +
							'<td>' + add_time + '</td>' +
							'<td><a data-toggle="modal" href="#edit_admin_group" class="btn btn-info-alt btn-s bianji">编辑</a> <a data-toggle="modal" href="#admin_group_access" data-posstion="' + permissions + '" href="#" class="btn btn-info-alt btn-s quanxian">权限</a> ' + del_Status +
							'</tr>';
					}
					$('.groupList').append(temp);
					var super1 = $('.groupList').children('tr').eq(0).children();
					if(super1.eq(0).html()=='1'){
						super1.eq(3).html('系统初始化创建，不可删除，不可编辑，拥有全部权限，保持本组只有一个管理员');
					}
//					var pageNum = Math.ceil(parseInt(call.result.count) / call.result.limit);
					var pageNum = call.result.totalpage;
					pageStatus = 0;

					$('#pagination').twbsPagination({
						totalPages: pageNum,
						visiblePages: 6,
						onPageClick: function(event, page) {
							if(pageStatus > 0) {
								Pagelist(page);
							}
						}
					});
					pageStatus++;
					$('body,html').animate({
						scrollTop: 0
					}, 500);
				}
			}
		});
	}
	//编辑
	var _this;
	$('body').on('click', '.bianji', function() {
		//bianjiglz
		_this = $(this)
		var bianjimz = $(this).parent().parent().children().eq(1).html();
		$('.bianjiglz').val(bianjimz);
	})
	$('.queding').click(function() {
		var update = {};
		var bianjiid = _this.parent().parent().children().eq(0).html();
		update.id = bianjiid;
		var bianjiglz = $('.bianjiglz').val();
		update.name = bianjiglz;
		update.token = TOKEN;
		Update = JSON.stringify(update);
		console.log(Update);
		$.ajax({
			type: "post",
			url: BASE_URL + "/admin/role/update",
			dataType: "json",
			data: Update,
			async: true,
			success: function(call) {
				if(call.code == '10001') {
					alert('用户尚未登录');
					window.location.href = './login.html';
				} else if(call.code == '10002') {
					alert('无权限访问');
				} else if(call.code == '10000') {

					var a = $('.bianjiglz').val();
					if(a != '') {
						//console.log(call);
						alert('编辑成功')
						_this.parent().parent().children().eq(1).html(a);
						//$('.disnone').hide();
						$('.close').trigger("click");
					} else {
						alert('组名不能为空')
					}
				}

			}
		});
	})

	//删除
	$('body').on('click', '.del', function() {
		var x;
		
		var _this = $(this);
		if(_this.is('.btn-success-alt')) {
			x = 0;
		} else {
			x = 1;
		}
		var jing = {};
		jing.status = x;
		var bianjiid = $(this).parent().parent().children().eq(0).html();
		jing.id = bianjiid;
		jing.token=TOKEN;
		//console.log(jing);
		var delchu={};
		delchu = JSON.stringify(jing);
//		delchu.token=TOKEN;
		console.log(delchu);
		$.ajax({
			type: "post",
			url: BASE_URL + "/admin/role/status",
			async: true,
			dataType: "json",
			data: delchu,
			success: function(call) {
				console.log(call);
				if(call.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
				}else if(call.code =='10002'){
					alert('无权限访问');
				}else if(call.code =='10000'){
					if(_this.is('.btn-success-alt')) {
						_this.addClass("btn-danger-alt").removeClass('btn-success-alt').html('恢复');
					} else {
						_this.removeClass("btn-danger-alt").addClass('btn-success-alt').html('删除');
					}
					alert('编辑成功');
				}
			}
		});
		return false;
	})

	//添加管理组
	$('.tianjia').click(function() {
		var tianjia2 = {};
		var tianjiaval = $('.tianjiaval').val();
		if(tianjiaval == '') {
			alert('组名不能为空!');
			return false;
		}
		tianjia2.name = tianjiaval;
		tianjia2.token=TOKEN;
		Tianjia = JSON.stringify(tianjia2);
		console.log(Tianjia);
		$.ajax({
			type: "post",
			url: BASE_URL + "/admin/role/add",
			async: true,
			dataType: "json",
			data: Tianjia,
			success: function(call) {
				if(call.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
				}else if(call.code =='10002'){
					alert('无权限访问');
				}else if(call.code =='10000'){
					
					console.log(call);
					alert('添加成功');
					window.location.reload();
				}else{
					alert(call.msg);
				}
			}
		});
	})

	//权限
	$('body').on('click', '.quanxian', function() {
			var a = $(this).parent().parent().children().eq(0).html();
			localStorage.setItem("quanxian", a)
			console.log(a);
			$('.check').attr("checked", false);
			var b = $(this).attr('data-posstion');
			console.log(b);
			$.ajax({
				type: "get",
				url: BASE_URL + "/admin/permissions/index",
				data:{token:TOKEN},
				async: true,
				success: function(call) {
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
						quanxianbianji.innerHTML = '';
						for(var i = 0; i < zuo.length; i++) {
							var quanname = zuo[i].name;
							var quanId = zuo[i].id;
							var permissionsHtml = '';
							//console.log(quanname);
							you.forEach(function(v) {
								if(quanId == v.module_id) {
									permissionsHtml += '<label class="checkbox-inline"><input type="checkbox" id="inlinecheckbox' + v.id + '" class="check" value="' + v.id + '">' + v.name + '</label>'
								}
							})
	
							quanxianbianji.innerHTML += '<div class="form-group">' +
								'<label class="col-sm-2 control-label">' + quanname + '</label>' +
								'<div class="col-sm-8">' + permissionsHtml + '</div>' +
								'</div>';
						}
	
						$("#quanxianbianji").children('.form-group:last-child').find('input').attr("checked", true);
						if(b == '*') {
							$('.check').attr("checked", true);
						}
	
						var l = b.split(',');
						$(".check").each(function(index, element) {
							var i = $(this).val();
							//console.log(i)
							if($.inArray(i, l) >= 0) {
								$(this).attr('checked', true)
							}
						})
					}

				}
			});

		})
		//添加权限
	$('.quanxiantj').click(function() {
		var tianjiaqx = {}
		var quanxianId = localStorage.getItem('quanxian');
		tianjiaqx.id = quanxianId;
		//console.log(_this);
		//console.log(bianjiid);
		var lbiao = [];
		$(".check").each(function(index) {
				//var d = $(this).attr('checked');
				if($(this).is(":checked")) {
					var a = $(this).val();
					lbiao.push(a);
				}
			})
			//console.log(lbiao);
		var zifu = lbiao.join(",");
		tianjiaqx.permissions = zifu;
		tianjiaqx.token=TOKEN;
		console.log(tianjiaqx);
		Tianjiaqx = JSON.stringify(tianjiaqx);
		$.ajax({
			type: "post",
			url: BASE_URL + "/admin/role/permissions",
			async: true,
			data: Tianjiaqx,
			dataType: "json",
			success: function(call) {
				if(call.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
				}else if(call.code =='10002'){
					alert('无权限访问');
				}else if(call.code == '10000') {
					alert('修改成功');
					window.location.reload();
					$('.close').trigger("click");
				} else {
					alert('修改失败')
				}
			}
		});
	})
})