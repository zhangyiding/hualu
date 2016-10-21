$(function(){
	
	
	//search
	$(".search_btn").on('click',function(){
		$(".pageBox").html('<ul id="pagination" class="pagination m-n"></ul>');
		var member_id = $("#member_id").val();
		var entity_id = $("#entity_id").val();
		logList(1,member_id,entity_id);
	})
	
	logList(1);
	function logList(page,member_id,entity_id){
		var Json = {};
		Json.page = page;
		if(member_id){
			Json.member_id = member_id;
		}
		if(entity_id){
			Json.entity_id = entity_id;
		}
		Json.token = TOKEN;
		
		$.ajax({
		type:"get",
		url:BASE_URL+"/admin/history/index/page",
		async:true,
		data:Json,
		success:function(data){
			if(data.code=='10001'){
				alert('用户尚未登录');
				window.location.href= './login.html';
			}else if(data.code =='10002'){
				alert('无权限访问');
			}else if(data.code =='10000'){
				var dataList = data.result.data;
				console.log(data)
				$(".logList").html('');
				var temp = '';
		        for(var i = 0; i<dataList.length;i++ ){
			        temp +=	'<tr>'+
								'<td>'+dataList[i].id+'</td>'+
								'<td>'+dataList[i].nickname+'['+dataList[i].member_id+']</td>'+
								'<td>['+dataList[i].type+']'+dataList[i].entity_id+'</td>'+
								'<td>'+dataList[i].info+'</td>'+
								'<td>'+
									'<a href="#22">查看目标</a>'+
								'</td>'+
							'</tr>'
		        }
		        $(".logList").append(temp);
		        
				//分页管理
//				var pageNum = Math.ceil(parseInt(data.result.count)/(param.limit));
				var pageNum = data.result.totalpage;
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
				
			}else if(data.code =='10003'){
				alert('暂无数据！');
			}
			
			
		}
	});
	}
})
