$(function(){
	window.BASE_URL = 'http://admin-api.dev.etago.com';
	//获取token
	if(localStorage.getItem('Inmtion')){
		window.TOKEN = JSON.parse(localStorage.getItem('Inmtion')).token;
	}else{
		alert('用户尚未登录');
		window.location.href= './login.html';
	}
	
	var info = JSON.parse(localStorage.getItem('Inmtion'));
	$(".info .username").html(info.Nickname);
	$(".info .useremail").html(info.Email);
	
	//左侧菜单列表
	var menuList = JSON.parse(localStorage.getItem('menu_arr'));
//	console.log(menuList);
	$("#widget-sidebar .acc-menu").html('');
	var menuHtml='';
	for(var i=0;i<100;i++){
		for(var j=0;j<menuList.length;j++){
			if(menuList[j].sort_order==i){
				if(menuList[j].son){
					var menuSon='';
					menuList[j].son.forEach(function(v){
						menuSon+='<li data-id="'+v.id+'"><a href="'+v.url+'.html">'+v.name+'</a></li>'
					})
					menuHtml+='<li data-id="'+menuList[j].id+'" class="hasChild"><a href="javascript:;"><i class="'+menuList[j].ico+'"></i><span>'+menuList[j].name+'</span></a><ul class="acc-menu">'+menuSon+'</ul></li>'
				}else{
					menuHtml+='<li data-id="'+menuList[j].id+'"><a href="'+menuList[j].url+'.html"><i class="'+menuList[j].ico+'"></i><span>'+menuList[j].name+'</span></a></li>'
				}
			}
		}
	}
	$("#widget-sidebar .acc-menu").html(menuHtml);
	$("#widget-sidebar").children('nav').children('ul').append('<li><a href="javascript:;"><i class="ti ti-shift-right"></i><span>退出登录</span></a></li>');
										
	//左侧菜单激活
	$(".acc-menu").on('click','li',function(e){
		var data_id= $(this).attr('data-id');
		if(!$(this).is('.hasChild')){
			sessionStorage.setItem('data_id',data_id);
		}
	});
	
	var curId = sessionStorage.getItem('data_id');
	var curUl = $("#widget-sidebar").children('nav').children('ul');
	curUl.children().removeClass('active');
	if(curId){
		var liId = curUl.find('li');
		liId.each(function(){
			if($(this).attr('data-id')==curId){
				$(this).addClass('active');	
				if($(this).parent().parent().is('.hasChild')){
					$(this).parent().show();
					$(this).parent().parent().addClass('active');
				}
			}
		})
	}else{
		curUl.children().eq(0).addClass('active');		
	}
	
	//存储城市信息
	var cityList = JSON.parse(localStorage.getItem('cityArr'));
	if(!cityList){
		$.ajax({
			type:"get",
			url:BASE_URL+"/admin/city/getCityList",
			data:{token:TOKEN},
			success:function(data){			
				console.log(data)
				if(data.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
					return false;
				}else if(data.code =='10002'){
					alert('无权限访问');
				}else if(data.code =='10000'){
					var list = data.result.data_list;
					var cityArr = new Array();
					for(var i = 0; i<list.length;i++){
						var countryName = list[i].city_name;
			        	var countryId = list[i].city_id;
			        	var cityJson = {
			        		id:countryId,
			        		name:countryName
			        	};
			        	cityArr.push(cityJson);
					}
					localStorage.setItem('cityArr',JSON.stringify(cityArr));
				}
			}
		});
	}
	
	
	
	
	
	//退出登录
	var logout = $("#widget-sidebar").children('nav').children('ul').children('li:last-child').children();
	logout.attr('href','javascript:;');
	logout.on('click',function(){
		if(confirm('是否退出？')){
			$.ajax({
				type:"post",
				url:BASE_URL+"/admin/login/logout",
				data:{token:TOKEN},
				success:function(data){
					console.log(data)
					var timestamp=data.result.timestamp;
					localStorage.setItem('Inmtion','');
					sessionStorage.removeItem('data_id');
					window.location.href='./login.html';						
				}
			});
		}
	})
	
	
})
