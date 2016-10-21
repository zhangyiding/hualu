$(function(){
	var Did = localStorage.getItem("id2");
	var shu = {};
	shu.user_id = Did;
	shu.token = TOKEN;
	$.ajax({
		type:"get",
		url:BASE_URL+"/admin/user/userInfo",
		async:true,
		data:shu,
		success:function(call){
			if(call.code=='10001'){
			  alert('用户尚未登录');
			  window.location.href= './login.html';
			  }else if(call.code =='10002'){
			  alert('无权限访问');
			  }else if(call.code =='10000'){
			        console.log(call);
			var My = document.getElementById('My');
			var face = call.result.face;
			var nickname = call.result.nickname;
			var login_time = call.result.login_time;
			var login_type = call.result.login_type;
			My.innerHTML='<img class="img-circle" src="'+face+'"><div class="name">'+nickname+'</div><ul class="list-inline text-center"><li>最后登录：'+login_time+'</li><li>最后登录方式：'+login_type+'</li><li>最后登录地点：El monte, CA</li></ul>'
			var Tbody = document.getElementById('Tbody');
			var email = call.result.email;
			var region_code = call.result.region_code;
			var mobile = call.result.mobile;
			var sale_goods_num = call.result.sale_goods_num;
			var not_sale_goods_num = call.result.not_sale_goods_num;
			var comment_num = call.result.comment_num;
			var like_num = call.result.like_num;
			var attention_num = call.result.attention_num;
			var fans_num = call.result.fans_num;
			var buy_num = call.result.buy_num;
			var sale_num = call.result.sale_num;
			Tbody.innerHTML = '<tr><th>Email</th><td><a href="#">'+email+'</a></td></tr><tr><th>Phone</th><td>'+region_code+'&nbsp;'+mobile+'</td></tr><tr><th>City</th><td>Los angeles</td></tr><tr><th>Status</th><td>正常 <a href="#" class="btn btn-success-alt btn-s">禁用</a></td></tr><tr><td colspan="2"><a href="" class="btn btn-info-alt">交易内容('+sale_goods_num+')</a><a href="" class="btn btn-info-alt">非交易内容('+not_sale_goods_num+')</a> <a href="" class="btn btn-info-alt">关注列表('+attention_num+')</a><a href="" class="btn btn-info-alt">被关注列表('+fans_num+')</a><a href="#" class="btn btn-info-alt">评论('+comment_num+')</a><a href="" class="btn btn-info-alt">喜欢的内容('+like_num+')</a><a href="#" class="btn btn-info-alt">购买订单('+buy_num+')</a><a href="#" class="btn btn-info-alt">卖出订单('+sale_num+')</a><td></tr>';
		}
				}
			
	});

})
