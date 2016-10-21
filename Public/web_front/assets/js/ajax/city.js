$(function(){
	//获取国家列表
	$.ajax({
		type:"GET",
		url:BASE_URL+"/admin/city/getCountryList",
		data:{token:TOKEN},
		dataType:'json',
	    success:function( data )
        {
	    	if(data.code=='10001'){
				alert('用户尚未登录');
				window.location.href= './login.html';
			}else if(data.code =='10002'){
				alert('无权限访问');
			}else if(data.code =='10000'){
		    	$('.countryList').append('<option value="">请选择</option>');
		        for(var i = 0; i<data.result.length;i++ ){
		        	var countryName = data.result[i].name;
		        	var countryId = data.result[i].id;
		        	$('.countryList').append('<option value="'+countryId+'">'+countryName+'</option>');
		        }
				
			}
	        
	    }
	});
	
	//根据条件查询获取城市列表
	function cityList(page){
		var city_id = $('#cityId').val();
		var city_name = $('#cityName').val();
		var country_id = $('#countryId').val();
		var param={};
		param.city_id = city_id;
		param.city_name = city_name;
		param.country_id = country_id;
		param.page = page;
		param.limit = 10;
		param.token=TOKEN;
		$.ajax({
			type:"get",
			url:BASE_URL+"/admin/city/getCityList",
			data:param,
			success:function(data){
				if(data.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
				}else if(data.code =='10002'){
					alert('无权限访问');
				}else if(data.code =='10000'){
					console.log(data);
					var temp='';
						$('.cityListInfo').html('');
						for(var i=0;i<data.result.data_list.length;i++){
							var status='';
							if(data.result.data_list[i].status==2){
								status = '<a href="javascript:void(0);" class="btn btn-danger-alt btn-s btn-opt" data-status=2>启用</a>';
							}else if(data.result.data_list[i].status==1){
								status = '<a href="javascript:void(0);" class="btn btn-success-alt btn-s btn-opt" data-status=1>禁用</a>';
							};
							temp+='<tr>'
	                                +'<td>'+data.result.data_list[i].city_id+'</td>'	
	                                +'<td>'+data.result.data_list[i].city_name+'</td>'
	                                +'<td data-countryId="'+data.result.data_list[i].country_id+'">'+data.result.data_list[i].country_name+'</td>'
	                                +'<td>'+data.result.data_list[i].commission_rate+'%</td>'
	                                +'<th><a data-toggle="modal" href="#city_map_point" data-core="'+data.result.data_list[i].core_location+'" class="btn btn-info-alt btn-s">点击查看</a></th>'
	                                +'<th><a data-toggle="modal" href="#city_map_point" data-min="'+data.result.data_list[i].min_location+'" data-max="'+data.result.data_list[i].max_location+'" class="btn btn-info-alt btn-s">点击查看</a></th>'
	                                +'<td><a data-toggle="modal" href="#edit_city" class="btn btn-info-alt btn-s">编辑</a> '+status+'</td>'
	                            +'</tr>';
						}
						$('.cityListInfo').append(temp);
						//分页管理
						var pageNum = Math.ceil(parseInt(data.result.count)/(param.limit));
						console.log(pageNum);
						pageStatus = 0;
					
						$('#pagination').twbsPagination({
					        totalPages: pageNum,
					        visiblePages: 6,
					        onPageClick: function (event, page) {
					        	if(pageStatus>0){
					            	cityList(page);
								}
					        }
					    });
						pageStatus++;
						$('body,html').animate({
							scrollTop: 0
						}, 500);
		        		$('body,html').animate({scrollTop:0},500);
						
				}else{
					$("#modalAlert").modal('show');
					$("#modalAlert").find('.modal-title').html('提示');
					$("#modalAlert").find('.modal-body').html('暂无相关城市信息');
					$(".btn-modal-save").on('click',function(){
						$("#modalAlert").modal('hide');
					})
				}
			}
					
		});
	}	
	cityList(1);
	$('#search').on('click',function(){
		$(".pageBox").html('<ul id="pagination" class="pagination m-n"></ul>');
		cityList(1);
		return false;
	});
	
	
	
	//编辑城市
	function cityEdit(parm){
		parm.token=TOKEN;
		var JsonData = JSON.stringify(parm);
		console.log(JsonData);
		$.ajax({
			type:"post",
			url:BASE_URL+"/admin/city/operateCity",
			async:false,
			data: JsonData,
//			contentType: "application/json; charset=utf-8",  
        	dataType: "json",  
			success:function(data){
				$(".btn-modal-cancel").hide();
				if(data.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
				}else if(data.code =='10002'){
					alert('无权限访问');
				}else if(data.code =='10000'){
					$("#modalAlert").modal('show');
					if(parm.type==2){
						$("#modalAlert").find('.modal-title').html('添加成功');
					}else{
						$("#modalAlert").find('.modal-title').html('修改成功');
					}
					$("#modalAlert").find('.modal-body').html(data.msg);
					$(".btn-modal-save").one('click',function(e){
						e.preventDefault();
						$("#modalAlert,#edit_city,#add_city").modal('hide');
						var id = parm.city_id;
						console.log(id);
						$(".cityListInfo tr").each((function(i){
							var _this = $(this).children();
							if(_this.eq(0).html()==id){
								_this.eq(1).html($("#m_CityName").val());
								_this.eq(2).html($("#m_CountryName").find('option:selected').text());
								_this.eq(2).attr('data-countryid',$("#m_CountryName").val());
								_this.eq(3).html($("#m_CommissionRate").val()+'%');
								_this.eq(4).children().attr('data-core',$("#m_CornLocation").html());
								_this.eq(5).children().attr('data-min',$("#m_MinMaxLocation").html().split('~')[0]);
								_this.eq(5).children().attr('data-max',$("#m_MinMaxLocation").html().split('~')[1]);
								
								return false;
							}
						}));
						
//						parm ={};
					})
					
				}else{
					$("#modalAlert").modal('show');
					$("#modalAlert").find('.modal-title').html('修改失败');
					$("#modalAlert").find('.modal-body').html(data.msg);
					$(".btn-modal-save").on('click',function(){
						$("#modalAlert").modal('hide');
					})
				}
			}
		});
	}
	
	//禁用 启用城市
	function cityAble(parm){
		parm.token=TOKEN;
		var JsonData = JSON.stringify(parm);
//		console.log(JsonData);
		$.ajax({
			type:"post",
			url:BASE_URL+"/admin/city/operateCity",
			async:false,
			data: JsonData,
//			contentType: "application/json; charset=utf-8",  
        	dataType: "json",  
			success:function(data){
				$(".btn-modal-cancel").hide();
				if(data.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
				}else if(data.code =='10002'){
					alert('无权限访问');
				}else if(data.code =='10000'){
					$("#modalAlert").modal('show');
					if(parm.status==2){
						$("#modalAlert").find('.modal-title').html('禁用成功');
					}else{
						$("#modalAlert").find('.modal-title').html('启用成功');
					}
					$("#modalAlert").find('.modal-body').html(data.msg);
					$(".btn-modal-save").on('click',function(){
						$("#modalAlert,#edit_city,#add_city").modal('hide');
					})
					
				}else{
					$("#modalAlert").modal('show');
					$("#modalAlert").find('.modal-title').html('修改失败');
					$("#modalAlert").find('.modal-body').html(data.msg);
					$(".btn-modal-save").on('click',function(){
						$("#modalAlert").modal('hide');
					})
				}
			}
		})
	}
	
	
	
	//编辑窗口
	var parm={};
	$('#edit_city').on('shown.bs.modal',function(e){
		var _thisP = e.relatedTarget.parentNode.parentNode;
		var CityId = _thisP.childNodes[0].innerHTML;
		var CityName = _thisP.childNodes[1].innerHTML;
		var CountryName = _thisP.childNodes[2].innerHTML;
		var CountryId = _thisP.childNodes[2].getAttribute('data-countryId');
		var CommissionRate = _thisP.childNodes[3].innerHTML;
		var CornLocation = _thisP.childNodes[4].childNodes[0].getAttribute('data-core');
		var MinLocation = _thisP.childNodes[5].childNodes[0].getAttribute('data-min');
		var MaxLocation = _thisP.childNodes[5].childNodes[0].getAttribute('data-max');
		var Status 		= _thisP.childNodes[6].lastChild.getAttribute('data-status');
		$('.modal #m_CityName').val(CityName);
		$('.modal #m_CountryName').val(CountryId);
		$('.modal #m_CommissionRate').val(CommissionRate.split('%')[0]);
		$('.modal #m_CornLocation').html(CornLocation);
		$('.modal #m_MinMaxLocation').html(MinLocation+'~'+MaxLocation);
		parm.type = 1;
		parm.city_id = CityId;
		parm.city_name = CityName;
		parm.country_id = CountryId;
		parm.commission_rate = CommissionRate;
		parm.corn_location = CornLocation;
		parm.min_location = MinLocation;
		parm.max_location = MaxLocation;
		parm.status = Status;
	});
	//编辑提交
	$('#editCityInfo').on('click',function(){
		var Json = {};
		Json.city_id = parm.city_id;
		Json.type = parm.type;
		Json.status = parm.status;
		Json.city_name = $('.modal #m_CityName').val();
		Json.country_id = $('.modal #m_CountryName').val();
		Json.commission_rate = $('.modal #m_CommissionRate').val();
		Json.corn_location = $('.modal #m_CornLocation').html();
		Json.min_location = $('.modal #m_MinMaxLocation').html().split('~')[0];
		Json.max_location = $('.modal #m_MinMaxLocation').html().split('~')[1];
		console.log(Json)
//		var temp = 0;
		for(var x in Json){
			if($.trim(Json[x]) ==''){
				$("#modalAlert").modal('show');
				$("#modalAlert").find('.modal-title').html('修改失败');
				$("#modalAlert").find('.modal-body').html('修改内容不得为空');
				$(".btn-modal-save").on('click',function(e){
					e.preventDefault();
					$("#modalAlert").modal('hide');
				})
				return false;
			}
		}
		
		cityEdit(Json);
	});
	
	//禁用启用
	$('body').on('click','.btn-opt',function(){
		var sta = $(this).attr('data-status');
		var staText = $(this).html();
		if(sta==1){
			$(this).removeClass('btn-success-alt').addClass('btn-danger-alt');
			$(this).attr('data-status',2).html('启用');
		}else{
			$(this).removeClass('btn-danger-alt').addClass('btn-success-alt');
			$(this).attr('data-status',1).html('禁用');
		};
		var _this = $(this).parents('tr');
		var Json = {};
		Json.type=1;
		Json.status=$(this).attr('data-status');
		Json.city_id = _this.children().eq(0).html();
		Json.city_name = _this.children().eq(1).html();
		Json.country_id = _this.children().eq(2).attr('data-countryid');
		Json.commission_rate = _this.children().eq(3).html().split('%')[0];
		Json.corn_location = _this.children().eq(4).children().attr('data-core');
		Json.min_location = _this.children().eq(5).children().attr('data-min');
		Json.max_location = _this.children().eq(5).children().attr('data-max');
		for(var x in Json){
			if($.trim(Json[x]) ==''){
				$("#modalAlert").modal('show');
				$("#modalAlert").find('.modal-title').html('修改失败');
				$("#modalAlert").find('.modal-body').html('编辑内容不得有空');
				$(".btn-modal-save").on('click',function(e){
					e.preventDefault();
					$("#modalAlert").modal('hide');
				})
				return false;
			}
		}
		cityAble(Json);
	});
	
	//添加城市
	$('#addCityInfo').on('click',function(){
		var Json = {};
		Json.type = 2;
		Json.status = 1;
		Json.city_name = $('.modal #add_cityName').val();
		Json.country_id = $('.modal #add_CountryName').val();
		Json.commission_rate = $('.modal #add_CommissionRate').val();
		Json.corn_location = $('.modal #add_cityCore').html();
		Json.min_location = $('.modal #add_cityMinMax').html().split('~')[0];
		Json.max_location = $('.modal #add_cityMinMax').html().split('~')[1];
		console.log(Json)
//		var temp = 0;
		for(var x in Json){
			if($.trim(Json[x]) ==''){
				$("#modalAlert").modal('show');
				$("#modalAlert").find('.modal-title').html('添加失败');
				$("#modalAlert").find('.modal-body').html('添加内容不得为空');
				$(".btn-modal-save").on('click',function(e){
					e.preventDefault();
					$("#modalAlert").modal('hide');
				})
				return false;
			}
		}
		
		cityEdit(Json);
	})
		
})
