$(function() {
	//获取城市名称

	var cityList = JSON.parse(localStorage.getItem('cityArr'));
	
	for(var i = 0; i < cityList.length; i++){
		var countryName = cityList[i].name;
    	var countryId = cityList[i].id;
    	$('#cityList').append('<option value="'+countryId+'">'+countryName+'</option>');
	}
	//搜索
	var searchpage = {};
	var searchpages = {};
	$('.search').click(function() {
			$(".pageBox").html('<ul id="pagination" class="pagination m-n"></ul>');
			var gongh = $('.gongh').val();
				searchpage.job_code = $('.gongh').val();
			//$('.sname').val('')
			var sname = $('.sname').val();
				searchpage.nickname = sname;
			//$('.email').val('')
			var email = $('.email').val();
				searchpage.email = email;
			//$('.phone').val('');
			var phone = $('.phone').val();
				searchpage.mobile = phone;
			//$('#cityList').val('');
			var cityList = $('#cityList').val();
			console.log(cityList)

			searchpage.city_id = cityList;

			
			console.log(searchpages);
			pagelist(1);
			return false;
		})
		//页码
	pagelist(1);

	function pagelist(Page) {
		searchpage.page = Page;
		searchpage.token = TOKEN;
		
		var Tbody = document.getElementsByClassName('Tbody')[0];
		$.ajax({
			type: "get",
			url: BASE_URL + "/admin/contract/index",
			async: true,
			data: searchpage,
			success: function(call) {
				if(call.code=='10001'){
				  alert('用户尚未登录');
				  window.location.href= './login.html';
				  }else if(call.code =='10002'){
				  alert('无权限访问');
				  }else if(call.code =='10000'){
				Tbody.innerHTML = '';
				console.log(call);

				var listshu = call.result.data;
				if(listshu == '') {
					Tbody.innerHTML = '你搜索的内容未找到';
				}
				for(var i = 0; i < listshu.length; i++) {
					var job_code = call.result.data[i].job_code;
					var username = call.result.data[i].nickname;
					var city_name = call.result.data[i].city_name;
					var post = call.result.data[i].post;
					var email = call.result.data[i].email;
					var mobile = call.result.data[i].mobile;

					var wechat = call.result.data[i].wechat;
					Tbody.innerHTML += '<tr class="odd gradeX bjtr"><td>' + job_code + '</td><td>' + username + '</td><td>' + city_name + '</td><td>' + post + '</td><td>' + email + '</td><td>' + mobile + '</td><td>' + wechat + '</td></tr>'
				}
				var pageNum = Math.ceil(parseInt(call.result.count) / 20);
				console.log(pageNum)
				pageStatus = 0;

				$('#pagination').twbsPagination({
					totalPages: pageNum,
					visiblePages: 6,
					onPageClick: function(event, page) {
						if(pageStatus > 0) {
							pagelist(page);
							
						}
					}
				});
				$('html, body').animate({scrollTop:0}, 'slow');
				pageStatus++;
				    
				}
			}
		});
	}

})