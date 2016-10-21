$(function(){
	

var Did = localStorage.getItem("id");
var dRizhi = {};
console.log(Did);
dRizhi.trade_no = Did;
dRizhi.token = TOKEN;
		$.ajax({
			type:"get",
			url:BASE_URL+"/order/detail",
			async:true,
			data:dRizhi,
			success:function(call){
				
			if(call.code=='10001'){
			  alert('用户尚未登录');
			  window.location.href= './login.html';
			  }else if(call.code =='10002'){
			  alert('无权限访问');
			  }else if(call.code =='10000'){
			        console.log(call);
				$('.trade').html(call.result.trade_no);
				$('.Maijia').html(call.result.buyer_name+'('+call.result.buyer_id+')');
				$('.buy_time').html(call.result.buy_time)
				$('.saler_name').html(call.result.saler_name+'('+call.result.saler_id+')')
				var service = call.result.service_id;
				switch(service){
					case '0':
					service = '未选择';
					break;
					case '1':
					service = '送货上门';
					break;
					case '2':
					service = '自取';
					break;
				}
				var dizhi = call.result.address;
				$('.service_id').html(service+'(地址:'+dizhi+')');
				
				var status = call.result.status;
				
				/*switch (status){
					case '0':
						status =0;
						break;
					case '3':
						status =1;
						break;
					case '4':
						status =2;
						break;
					case '5':
						status =3;
						break;
				}*/

				//var sts = document.getElementById('status');
				//sts[status].selected=true;
				$('#status').val(status);
				//$(" select option[value='"+tem+"']").attr("select","selected");  
				$('.pay_way').html(call.result.pay_way);
				$('.total_fee').html(call.result.currency_mark+call.result.total_fee);
				
				
				$('.cover_price').html(call.result.cover_price);
				$('.pay_time').html(call.result.finish_time);
				//商品列表
				var shang = call.result.goods;
				for(var i=0;i<shang.length;i++){
				var shangping = document.getElementById('shangping');
				var goods_pic = shang[i].goods_pic;
				var goods_id = shang[i].goods_id;
				var title = shang[i].title;
				var content = shang[i].content;
				var price = shang[i].price;
				var Number = shang[i].number;
				var currency_mark = call.result.currency_mark;
				var totalfel = shang[i].total_fel
				shangping.innerHTML+='<li><div class="shopImg"><img src='+goods_pic+' alt="" /></div><div class="shopDescribe"><p><span>内容ID：</span><span>'+goods_id+'</span></p><p><span>&nbsp;&nbsp;内容名称：</span><span>'+title+'</span></p>&nbsp;&nbsp;<p>'+content+'</p><p class = "bottdanj"><span>单价：</span><span class="shopPrice">'+currency_mark+price+'</span>&nbsp;&nbsp;<span>数量：</span><span class="shopPrice">'+Number+'</span>&nbsp;&nbsp;<span>总计：</span><span class="shopPrice">'+currency_mark+totalfel+'</span></p></div></li>'
				}
				}
			}
		});	
		$('.del').click(function(){
			if(confirm('确定要删除吗？')){
				$('.delul').html('');
			$.ajax({
				type:"get",
				url:BASE_URL+"/order/delOrder/trade_no/100000578f30a38b972",
				async:true,
				data:dRizhi,
				success:function(call){
				//console.log(call);	
				
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
			window.location.href='order.html';
			}
		})
		$('.bao').click(function(){
			alert('保存成功！');
			window.location.href='order.html';
		})
$('#status').change(function(){
	var sta = $('#status').val();
	//console.log(sta);
	//var status1;
	dRizhi.status = parseInt(sta);
	console.log(dRizhi)
	$.ajax({
		type:"get",
		url:BASE_URL+"/order/updateOrderStatus/trade_no/100000578f30a38b972/status/1",
		async:true,
		data:dRizhi,
		success:function(call){
			//console.log(call);
			
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