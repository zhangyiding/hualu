$(function(){
	function get_unix_time(dateStr) //转化为时间戳
	{
	    var newstr = dateStr.replace(/-/g,'/'); 
	    var date =  new Date(newstr); 
	    var time_str = date.getTime().toString();
	    return time_str.substr(0, 10);
	}
	/*var xian = {};
	xian.limit = 12;
	var limit = JSON.stringify(xian);*/
	

	//删除
	$('body').on('click','.delBtn',function(){
		var _this = $(this);
		$("#modalAlert").modal('show');
		$(".btn-modal-save").one('click',function(e){
			e.preventDefault();
			console.log(_this)
			_this.parent().parent().remove();
			$("#modalAlert").modal('hide');
			var del = {};
			del.del_flag =1;
			del.type = 1;
			var nrid = _this.next().html();
			del.goods_id = parseInt(nrid);
			del.token = TOKEN;
			var data = JSON.stringify(del);
			console.log(data);
			$.ajax({
				type:"post",
				url:BASE_URL+"/admin/goods/operate",
				async:false,
				dataType:"json",
				data:data,
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
		})
		
	})
	//获取城市名称
	/*var quanxiancity = {};
	quanxiancity.token = TOKEN;
	quanxianCity = JSON.stringify(quanxiancity);
	var cityId;
	$.ajax({
		type:"post",
		url:BASE_URL+"/admin/city/getCityList",
		async:true,
		dataType:"json",
		data:quanxianCity,
		success:function(call){
			//console.log(call.result);
			var citylist = call.result.data_list;
			var CityList = document.getElementById('cityList');
			for(var c=0;c<citylist.length;c++){
				var cityname = call.result.data_list[c].city_name;
				//var disid = call.result.data_list[c].goods_id;
				CityList.innerHTML += '<option value="'+cityname+'">'+cityname+'</option>'
			}
		}
	});*/
	var cityList = JSON.parse(localStorage.getItem('cityArr'));
	
	for(var i = 0; i < cityList.length; i++){
		var countryName = cityList[i].name;
    	var countryId = cityList[i].id;
    	$('#cityList').append('<option value="'+countryId+'">'+countryName+'</option>');
	}

	
	
	//搜索
	 var sear = {};
	 var seardata ;
	$('.search').click(function(){
		$(".pageBox").html('<ul id="pagination" class="pagination m-n"></ul>');

		
		var Id =$('.id').val();
		//console.log(parseInt(Id))
			
			sear.id =Id;
		
		var Name = $('.name').val();
		
			sear.name = Name;
		
		var Content = $('.Content').val();
		
			sear.content = Content;
		
		
		var Tag = $('.tag').val();
		
			sear.tag = Tag; //待协商
		var cityId = $('#cityList').val();
		sear.city_id = cityId;
		var addtime = $('.add_time').val();
		var time = get_unix_time(addtime);
		if(addtime!=''){
			sear.add_time = time;
		}
		
		var userid = $('.user_id').val();
		
			
		sear.user_id =userid;
		
		
		var username = $('.user_name').val();
	
			
		sear.user_name = username;
		
		var likeuserid = $('.like_user_id').val();
		
		sear.like_user_id = likeuserid;
		
		if($('.status').prop('checked')){
			sear.status = '1';
		}
		if($('.report').prop('checked')){
			sear.report = 1;
		}else{
			sear.report = 0;
		}
		if($('.sale_type').prop('checked')&&$('.nosale_type').prop('checked')){
			sear.sale_type = '1,2';
		}else if($('.sale_type').prop('checked')){
			sear.sale_type = '2';
		}else if($('.nosale_type').prop('checked')){
			sear.sale_type = '1';
		}
		sear.limit = 12;
		
		
		console.log(sear);
		pagelist(1)
		return false;
	})
	pagelist(1);
	//page
	function pagelist(page){
		sear.page = page;
		sear.limit = 12;
		sear.token = TOKEN;
		$.ajax({
				type:"get",
				url:BASE_URL+"/admin/goods/getGoodsList",
				data:sear,
				success:function(call){
					if(call.code=='10001'){
					  alert('用户尚未登录');
					  
					  window.location.href= './login.html';
					  }else if(call.code =='10002'){
					  alert('无权限访问');
					  }else if(call.code =='10000'){
					console.log(call);
					var res = call.result.data_list;
					var li_pic = document.getElementById('li_pic');
					li_pic.innerHTML='';
					
					console.log(call);
					for(var i=0;i<res.length;i++){
						var image_path =call.result.data_list[i].image_path;
						var is_report = call.result.data_list[i].is_report;
						var jubao='';
						if(is_report==1){
							//$('.jubao').hide();
							jubao = '<p class="jubao">被举报</p>'
						}
						var title = call.result.data_list[i].title;
						console.log(title)
						var titleHtml='';
						if(title!=''){
							titleHtml = '<p class="ImgDetail Title">'+title+'</p>';
						}else{
							titleHtml = '';
							
						}
						var nickname = call.result.data_list[i].nickname;
						var currency_code = call.result.data_list[i].currency_code;
						var price = call.result.data_list[i].price;
						var del_flag = call.result.data_list[i].del_flag;
						var add_time = call.result.data_list[i].add_time;
						function getLocalTime(nS) {     
						   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
						}
						var TIme = getLocalTime(add_time);
						var disid = call.result.data_list[i].goods_id;
						li_pic.innerHTML +='<li><div class="ImgBox"><a href="content_details.html?goods_id='+disid+'&is_report='+is_report+'&status='+del_flag+'"><img src="'+image_path+'"/></a>'+jubao+titleHtml+'</div><div class="nameBox"><span class="cName">'+nickname+'</span><span class="cSprice">'+currency_code+price+'</span></div><div class="nameBox"><span class="cTime">'+TIme+'</span><a href="content_details.html?goods_id='+disid+'&is_report='+is_report+'&status='+del_flag+'" title="详情"><i class="fa fa-arrow-circle-o-right"></i></a><a  class="delBtn" title="删除"><i class="fa fa-trash-o"></i></a><span class="dis">'+disid+'<span></div></li>'
					}
					
					var pageNum = Math.ceil(parseInt(call.result.count)/10);
					console.log(call.result.count);
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
					        
						}else if(call.code =='11011'){
							var li_pic = document.getElementById('li_pic');
							li_pic.innerHTML='你搜索的结果为空，请重新搜索!'
							
						}
				}
			});
	}
	
})
