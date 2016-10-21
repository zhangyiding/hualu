$(function() {
	var cityList = JSON.parse(localStorage.getItem('cityArr'));
	
	for(var i = 0; i < cityList.length; i++){
		var countryName = cityList[i].name;
    	var countryId = cityList[i].id;
    	$('.cityList').append('<option value="'+countryId+'">'+countryName+'</option>');
	}
	
	var dAta;
	var parameter = {};
	$('.search').click(function() {
		//console.log(cityId);
		$(".pageBox").html('<ul id="pagination" class="pagination m-n"></ul>');
		
		var name = $('#name').val(); //用户名
		
			parameter.content = name;
		
		var cityId = $('.cityList').val();
			parameter.city_id = cityId; //城市id
		
		var orderID = $('#orderID').val(); //订单id
		
			parameter.trade_no = orderID;
		
		var time1 = $('#time1').val(); //开始时间
		if(time1 != '') {
			parameter.start_buy_time = time1;
		}
		var time2 = $('#time2').val(); //结束时间
		if(time2 != '') {
			parameter.end_buy_time = time2;
		}

		var zhifu = $('.zhifu').val(); //支付状态
		switch(zhifu) {
			case '请选择':
				zhifu = -1;
				break;
			case '未付款':
				zhifu = 0;
				break;
			case '付款中':
				zhifu = 1;
				break;
			case '已支付':
				zhifu = 2;
				break;
			case '已完成':
				zhifu = 3;
				break;
			case '已取消':
				zhifu = 4;
				break;
			case '已下单(线下支付)':
				zhifu = 5;
				break;
		}
		if(zhifu != -1) {
			parameter.status = zhifu;
		}
		var priceunit = $('.price_unit').val(); //订单状态
		switch(priceunit) {
			case '请选择':
				priceunit = -1;
				break;
			case '件数':
				priceunit = 1;
				break;
			case '个数':
				priceunit = 2;
				break;
			case '小时':
				priceunit = 3;
				break;
			case '次数':
				priceunit = 4;
				break;
		}
		if(priceunit != -1){
			parameter.price_unit = priceunit;
		}
		
		console.log(parameter);
		pagelist(1)
		return false;
	})

	
	pagelist(1);

	function pagelist(page) {
		parameter.token = TOKEN;
		parameter.page = page;
		$.ajax({
			type: "get",
			url: BASE_URL + "/order/orderlist",
			async: true,
			data: parameter,
			success: function(call) {
				if(call.code=='10001'){
				  alert('用户尚未登录');
				  window.location.href= './login.html';
				  }else if(call.code =='10002'){
				  alert('无权限访问');
				  }else if(call.code =='10000'){
				console.log(call);
				var Tbody = document.getElementById('Tbody');
				Tbody.innerHTML = '';
				var dAta = call.result.data_list;
				console.log(call)
				for(var i = 0; i < dAta.length; i++) {
					var trade = call.result.data_list[i].trade_no;
					var title = call.result.data_list[i].title;
					var buyer = call.result.data_list[i].buyer_name;
					var buyerId = call.result.data_list[i].buyer_id;
					var saler = call.result.data_list[i].saler_name;
					var salerId = call.result.data_list[i].saler_id;
					var buy = call.result.data_list[i].buy_time;
					var status = call.result.data_list[i].status_desc;
					var service = call.result.data_list[i].service_id;
					var currency_mark = call.result.data_list[i].currency_mark;
					switch(service){
						case '0':
						service = '未定义';
						break;
						case '1':
						service = '送货上门';
						break;
						case '2':
						service = '自取';
						break;
					}
					var payway = call.result.data_list[i].pay_way;
					var total = call.result.data_list[i].total_fee;
					Tbody.innerHTML += "<tr><td>" + trade + "</td><td>" + title + "</td><td>" + buyer + "(" + buyerId + ")" + "</td><td>" + saler + "(" + salerId + ")" + "</td><td>" + buy + "</td><td>" + status + "</td><td>" + service + "</td><td>" + payway + "</td><td>" + currency_mark + total + "</td><td><a href='order_Detail.html' style='color: white;'><button id='detail' class='btn btn-primary'>查看详情</button></a>&nbsp;&nbsp;<button class='sty-a rizhi btn btn-primary' data-toggle='modal' data-target='.bs-example-modal-sm'>查看日志</button></td></tr>"
				}
				
				var pageNum = Math.ceil(parseInt(call.result.totalpage)/10);
				console.log(pageNum);
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
				};
			}
		});
	}

	//订单详情
	$('body').on('click', '#detail', function() {
		var dId = $(this).parent().parent().parent().children().eq(0).html();
		console.log(dId);
		localStorage.setItem("id", dId);
	})

})
//日志
$('body').on('click','.rizhi',function(){
			var dId = $(this).parent().parent().children().eq(0).html();
			console.log(dId);
			var dRizhi = {};
			dRizhi.trade_no = dId;
			dRizhi.token = TOKEN;
			$.ajax({
				type: "get",
				url: BASE_URL + "/order/orderlog/trade_no/100000578f30a38b972",
				data: dRizhi,
				async: true,
				success: function(call) {
					//console.log(call.result.data_list);
					if(call.code=='10001'){
					  alert('用户尚未登录');
					  window.location.href= './login.html';
					  }else if(call.code =='10002'){
					  alert('无权限访问');
					  }else if(call.code =='10000'){
					        console.log(call);
					var Tbody2 = document.getElementById('Tbody2');
					Tbody2.innerHTML ='';
					var dataList = call.result.data_list;
					for(var j = 0; j < dataList.length; j++) {
						var time = call.result.data_list[j].time;
						var remark = call.result.data_list[j].remark;
						Tbody2.innerHTML += "<tr><td>" + time + "</td><td>" + remark + "</td></tr>"
					}
						}
	
				}
			});
})
