$(function(){
	$.ajax({
		type: "get",
		url: BASE_URL+"/admin/BaseConfig/getBaseConfig",
		data:{token:TOKEN},
		async: true,
		success: function(call) {
			//console.log(call);
			if(call.code=='10001'){
				alert('用户尚未登录');
				window.location.href= './login.html';
			}else if(call.code =='10002'){
				alert('无权限访问');
			}else if(call.code =='10000'){
				
				var commission = $('.commission'); //佣金设定
				commission.val(call.result.commission_rate);
				var limit = $('.limit'); //最小放款额度
				limit.val(call.result.drawing_amount_min);
				var cycle = $('.cycle'); //放款周期
				cycle.val(call.result.drawing_data);
				var interval = $('.interval'); //发布内容间隔时间设定
				interval.val(call.result.add_goods_interval);
			}
		}
	});
	//提交
	var Submit = $('.btn-primary')
	var record = {};
	
	$('.commission').blur(function(){
		var commission = $('.commission').val(); //佣金设定
		if(commission>=100){
			$('.commission').val(100)
		}
	})
	$('.limit').blur(function(){
	var limit = $('.limit').val(); //最小放款额度
		if(limit<-1){
		$('.limit').val(1);
		}	
	})
	$('.cycle').blur(function(){
		
	var cycle = $('.cycle').val(); //放款周期
		if(cycle>=31){
		$('.cycle').val('31');	
		}
	})
	
	Submit.click(function() {
		record.type = 1;
		var commission = $('.commission').val(); //佣金设定
		record.commission_rate = parseInt(commission);
		var limit = $('.limit').val(); //最小放款额度
		record.drawing_amount_min = parseInt(limit);
		var cycle = $('.cycle').val(); //放款周期
		record.drawing_data = cycle;
		var interval = $('.interval').val(); //发布内容间隔时间设定
		record.add_goods_interval = parseInt(interval);
		record.token=TOKEN;
		console.log(record);
		$.ajax({
			type: "get",
			url: BASE_URL+"/admin/BaseConfig/changeBaseConfig",
			async: true,
			data: record,
			success: function(call){
				if(call.code=='10001'){
					alert('用户尚未登录');
					window.location.href= './login.html';
				}else if(call.code =='10002'){
					alert('无权限访问');
				}else if(call.code =='10000'){
					alert('修改成功!');
					window.location.reload();
					//var alert = $('.tishi');
					//console.log(alert);
					/*console.log(call.result.is_success)
					if(call.result.is_success==1){
						alert.attr('class','alert alert-info')
						alert.html('修改成功');
					}else{
						alert.attr('class','alert alert-danger')			
						alert.html('修改失败');
						
					}*/
				}
			}
		});
		return false;
	})
})
