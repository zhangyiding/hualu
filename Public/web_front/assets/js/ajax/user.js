$(function(){
	var cityList = JSON.parse(localStorage.getItem('cityArr'));
	
	for(var i = 0; i < cityList.length; i++){
		var countryName = cityList[i].name;
    	var countryId = cityList[i].id;
    	$('#cityList').append('<option value="'+countryId+'">'+countryName+'</option>');
	}
	
	//搜索
		var sEach = {};
	$('#suo').click(function(){
		$(".pageBox").html('<ul id="pagination" class="pagination m-n"></ul>');
		
		var use_id = $('.use-id').val();
		
			sEach.user_id = parseInt(use_id);
		
		var Nickname = $('.nickname').val();
		
			sEach.nickname = Nickname;	
		
		var frienduserid = $('.friend_user_id').val();
		
			sEach.friend_user_id = parseInt(frienduserid);
		
		var attuserid = $('.att_user_id').val();
		
			sEach.att_user_id = parseInt(attuserid);
		
		var cityList = $('#cityList').val();
		if(cityList != ''){
			sEach.cityid = parseInt(cityList);
		}
		console.log(sEach);
	
		pagelist(1);
		return false;
	})
	//禁用和启用
	$('body').on('click','.jingyong',function(){
		var x;
		var jing = {};
		if($(this).is('.btn-success-alt')){
		$(this).addClass("btn-danger-alt");
		$(this).removeClass('btn-success-alt');
		$(this).html('启用');
		x = 1;
		alert('修改成功!');
		}else{
		$(this).html('禁用');
		$(this).removeClass("btn-danger-alt");
		$(this).addClass('btn-success-alt');
		x = 0;
		alert('修改成功!');
		
		}
		jing.status = x;
		var dId = $(this).parent().parent().children().eq(0).children().html();
		jing.user_id = parseInt(dId);
		jing.token = TOKEN;
		console.log(jing)
		$.ajax({
			type:"get",
			url:BASE_URL+"/admin/user/optionUser/",
			async:true,
			data:jing,
			success:function(call){
				if(call.code=='10001'){
						alert('用户尚未登录');
						window.location.href= './login.html';
					}else if(call.code =='10002'){
						alert('无权限访问');
					}else if(call.code =='10000'){
						console.log(call);
					}
				
			}
		});
		return false;
	})
	//详情
	$('body').on('click','.details',function(){
		var dId2 = $(this).parent().parent().children().eq(0).children().html();
		localStorage.setItem("id2", dId2);
	})
/*function pages(){
		var pageNum =parseInt(call.result.count)/10 ;
					console.log(call.result.count);
					$('#pagination').twbsPagination({
				        totalPages: pageNum,
				        visiblePages: 6,
				        onPageClick: function (event, page) {
				            $('#page-content').text('Page ' + page);
				            pagelist(page);
				        }
				    });
	}*/
pagelist(1);
	function pagelist(page){
		sEach.page = page;
		sEach.token = TOKEN;
		$.ajax({
				type:"get",
				url:BASE_URL+"/admin/User/index",
				async:true,
				data:sEach,
				success:function(call){
					
					if(call.code=='10001'){
					  alert('用户尚未登录');
					  window.location.href= './login.html';
					  }else if(call.code =='10002'){
					  alert('无权限访问');
					  }else if(call.code =='10000'){
					        console.log(call);
			var Tbody = document.getElementById('Tbody');
			Tbody.innerHTML='';
			var data_list = call.result.data_list;
			console.log(call)
			for(var i=0;i<data_list.length;i++){
				var user_id = call.result.data_list[i].user_id;
				var face = call.result.data_list[i].face;
				var nickname = call.result.data_list[i].nickname;
				var not_sale_goods_count = call.result.data_list[i].not_sale_goods_count;
				var sale_goods_count = call.result.data_list[i].sale_goods_count;
				var buy_order_num = call.result.data_list[i].buy_order_num;
				var sale_order_num = call.result.data_list[i].sale_order_num;
				function getLocalTime(nS) {     
	    			return new Date(parseInt(nS) * 1000).toLocaleString()
	    			}
				var last_login_time =parseInt(call.result.data_list[i].last_login_time);
				var time = getLocalTime(last_login_time);
				var attention_num = call.result.data_list[i].attention_num;
				var fans_num = call.result.data_list[i].fans_num;
				var del_flag = call.result.data_list[i].del_flag;
				var jingy;
				if(del_flag=='1'){
				jingy = '<a href="#" class="btn btn-danger-alt btn-s jingyong">启用</a>';
				}else if(del_flag=='0'){
				jingy = '<a href="#" class="btn btn-success-alt btn-s jingyong">禁用</a>';
					
				}
				Tbody.innerHTML +='<tr class="odd gradeX"><td><a href="user_view.html" class = "details">'+user_id+'</a></td><td><img src="'+face+'" widht=32 height=32>'+nickname+'</td><td>'+not_sale_goods_count+'/'+sale_goods_count+'</td><td>'+buy_order_num+'/'+sale_order_num+'</td><td>'+attention_num+' / '+fans_num+'</td><td>'+time+'</td><td><a class="btn btn-info-alt btn-s details" href="user_view.html">详情</a>'+jingy+'</td></tr>'	
				}
					
					var pageNum =Math.ceil(parseInt(call.result.count)/20);
					  pageStatus = 0;
				
				$('#pagination').twbsPagination({
			        totalPages: pageNum,
			        visiblePages: 6,
			        onPageClick: function (event, page) {
			        	if(pageStatus>0){
			            	pagelist(page);
						}
			        }
			    });
				pageStatus++;
					        
						}
				}
			});
	}
})