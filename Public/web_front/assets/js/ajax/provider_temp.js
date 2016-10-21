$(function(){
	//获取城市名称
	var quanxiancity = {};
	quanxiancity.token = TOKEN;
	 quanxianCity = JSON.stringify(quanxiancity);
	
		var cityList = JSON.parse(localStorage.getItem('cityArr'));
	
	for(var i = 0; i < cityList.length; i++){
		var countryName = cityList[i].name;
    	var countryId = cityList[i].id;
    	$('#cityListtwo').append('<option value="'+countryId+'">'+countryName+'</option>');
    	$('#cityList').append('<option value="'+countryId+'">'+countryName+'</option>');
    	$('#sele').append('<option value="'+countryId+'">'+countryName+'</option>');
    	$('#bjcity').append('<option value="'+countryId+'">'+countryName+'</option>');
	}
	
//获取城市id
var cityid;
$('.city').change(function(){
	 cityid = $('.city').val();
})
//获取城市id2
var cityid2;
$('.city2').change(function(){
	cityid2 = $('.city2').val()
	/*var City2 = {};
	var city2 =  $('.city2').val();    //城市
	console.log(city2);
	 City2.city_name = city2;
	 $.ajax({
	 	type:"get",
	 	url:BASE_URL+"/admin/city/getCityList",
	 	data:City2,
	 	async:true,
	 	success:function(call){
	 		console.log(call)
	 		if(call.code!=11005){
	 		cityid2 = call.result.data_list[0].city_id;
	 		return cityid;
	 		}else{
	 			return '';
	 		}
	 	}
	 });*/
})
//获取服务地区
$.ajax({
	type:"get",
	url:BASE_URL+"/supplier/getarea",
	async:true,
	data:quanxiancity,
	success:function(call){
		console.log(call.result);
		var getarea = call.result;
		var di = document.getElementById('difnag');
		var bjdiqu = document.getElementById('bjdiqu');
		for(var i=0;i<getarea.length;i++){
			var difang = call.result[i].name;
			var difangid = call.result[i].id;
			di.innerHTML+='<option value="'+difangid+'">'+difang+'</option>';
			bjdiqu.innerHTML+='<option value="'+difangid+'">'+difang+'</option>';
		}
	}
});
//获取负责人列表、
$.ajax({
	type:"get",
	url:BASE_URL+"/supplier/getAdminList",
	async:true,
	data:quanxiancity,
	success:function(call){
		console.log(call);
	var adminlist = call.result;
	var fuzher = document.getElementById('fuzher');
	for(var i=0;i<adminlist.length;i++){
		var adminL = call.result[i].nickname;
		var adminid = call.result[i].id;
		fuzher.innerHTML+='<option value="'+adminid+'" title="'+adminL+'">'+adminL+'</option>'
	}
	}
});
//获取负责人id
var pople
$('#fuzher').change(function(){
	 pople = $('#fuzher').val();
	return pople
})
//获取服务地区id
var fuid;
$('.seltwo').change(function(){
	fuid = $('.seltwo').val();
	return fuid;
})
//数据加载


//搜索
var searchlist = {};
	$('.sarch').click(function(){
	Searchlist={};
	searchlist = {};
	 $(".pageBox").html('<ul id="pagination" class="pagination m-n"></ul>');
	var phonr = $('.phone').val();  //电话
	if(phonr!=''){
	searchlist.phpone = phonr;
	}
	var nameseach = $('.nameseach').val();  //名称
	if(nameseach!=''){
	searchlist.name = nameseach;   
	}
	if(cityid!='nn'){
	searchlist.city_id = cityid;//城市
		
	}
	var tag = $('.tag').val();  //tag
	if(tag!=''){
	searchlist.tag = tag;
	}
	if(pople!=''&&pople!=undefined){  //负责人
	searchlist.admin_id = pople;
	}
	
	
	//console.log(Searchlist);
	 pagelist(1);  //数据加载
	return false;
	})
//添加供应链
var Bian;
$('.tianjia').click(function(){

	bianji();
})




function bianji(){  //编辑
	var bian = {};
var focusedinput = $('#focusedinput').val();  //联系人
bian.name = focusedinput;
var Phone = $('#Phone').val();  //电话
bian.phpone = Phone;
var weixing = $('#weixing').val(); //微信
bian.weixin = weixing;
var lianxi = $('#lianxi').val();//联系人
bian.username = lianxi;
var tag = $('.Tag').val();//tag

bian.tag = tag;
bian.city_id = cityid2;//所属城市
bian.area_id = fuid;//服务地区
bian.token = TOKEN;
if(focusedinput == ''||Phone==''||weixing==''||lianxi==''||tag==''||cityid2=='asd'){
	alert('请填写完整')
	return;
}
//

	//var Tag;
	$.ajax({
		type:"get",
		url:BASE_URL+"/supplier/add",
		async:true,
		data:bian,
		success:function(call){
			if(call.code=='10001'){
		  alert('用户尚未登录');
		  window.location.href= './login.html';
		  }else if(call.code =='10002'){
		  alert('无权限访问');
		  }
			
			if(call.code==10000){
				$('.close').trigger("click");
				window.location.reload()
				/*var id = call.result.id;
				var time= new Date().toLocaleString();
				var html='<tr class="odd gradeX bjtr"><td>'+id+'</td><td>'+focusedinput+'</td><td>'+Phone+'</td><td>'+weixing+'</td><td>'+lianxi+'</td><td>'+cityid2+'</td><td>'+time+'</td><td>'+tag+'</td><td><button class="btn-primary btn bianjilist" data-toggle="modal" data-target=".bs-example-modal-sm">编辑</button>&nbsp;&nbsp;<button class="btn-primary btn del">删除</button></td></tr>';
				//console.log(html);
				$(".Tbody").prepend(html);*/
			}
		}
	});
}
//page
 pagelist(1);
  function pagelist(Page){
  	//var pageList = {};
	 searchlist.page = Page;
	 searchlist.token = TOKEN;
	var Tbody = document.getElementsByClassName('Tbody')[0];
	$.ajax({
		type:"get",
		url:BASE_URL+"/supplier/lists",
		async:true,
		data:searchlist,
		success:function(call){
			
     
     	if(call.code=='10001'){
		  alert('用户尚未登录');
		  window.location.href= './login.html';
		  }else if(call.code =='10002'){
		  alert('无权限访问');
		  }else if(call.code =='10000'){
		        console.log(call);
			var listshu = call.result.data_list;
			//$(".pageBox").html('<ul id="pagination" class="pagination m-n"></ul>');	
			Tbody.innerHTML = '';
			for(var i=0;i<listshu.length;i++){
			var useid = call.result.data_list[i].id;
			var namel = call.result.data_list[i].name;
			var phpone = call.result.data_list[i].phpone;
			var weixin = call.result.data_list[i].weixin;
			var username = call.result.data_list[i].username;
			var cityidl = call.result.data_list[i].city_name;
			//var jiacity = Citylistone[cityidl];
			
			var create_time = call.result.data_list[i].create_time;
			function getLocalTime(nS) {  
	    			return new Date(parseInt(nS) * 1000).toLocaleString()
	    			
	    			}
			var creatime = getLocalTime(create_time);
			var tAg = call.result.data_list[i].tag;
			Tbody.innerHTML += '<tr class="odd gradeX bjtr"><td>'+useid+'</td><td>'+namel+'</td><td>'+phpone+'</td><td>'+weixin+'</td><td>'+username+'</td><td>'+cityidl+'</td><td>'+creatime+'</td><td>'+tAg+'</td><td><button class="btn-primary btn bianjilist" data-toggle="modal" data-target=".bs-example-modal-sm">编辑</button>&nbsp;&nbsp;<button class="btn-primary btn del">删除</button></td></tr>'	
			if(call.result.data_list==''){
				Tbody.style.fontWeight = '600';
				Tbody.innerHTML = '未找到，请重新输入';
				}
			}
		var pageNum =parseInt(call.result.totalpage) ;
		
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

//列表编辑
$('body').on('click','.bianjilist',function(){
	var callid = {};
	var bjid =$(this).parent().parent().children().eq(0).html();
	callid.token = TOKEN;
	callid.id = bjid;
	$.ajax({
		type:"get",
		url:BASE_URL+"/supplier/getOneByid",
		data:callid,
		async:true,
		success:function(call){
			if(call.code=='10001'){
		  alert('用户尚未登录');
		  window.location.href= './login.html';
		  }else if(call.code =='10002'){
		  alert('无权限访问');
		  }else if(call.code =='10000'){
		        console.log(call);
		 $('.bjid').val(call.result.id);
		 $('.bjname').val(call.result.name);
		 $('.bjphone').val(call.result.phpone);
		 $('.bjweixing').val(call.result.weixin);
		 $('.bjusername').val(call.result.username);
		 $('.bjtag').val(call.result.tag);
		 $('.bjcity').val(call.result.city_id);
		 $('.bjfuw').val(call.result.area_id);
		        
			}
			
		}
	});
})
//删除
$('body').on('click','.del',function(){
	var delid = {};
	var bjid =$(this).parent().parent().children().eq(0).html();
	delid.id = bjid;
	delid.token = TOKEN;
	if(confirm('确定要删除吗？')){
	$(this).parent().parent().remove();
	$.ajax({
		type:"get",
		url:BASE_URL+"/supplier/del",
		async:true,
		data:delid,
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
		
	}
})
/*var bjcityid;
$('.bjcity').change(function(){
	  bjcityid = $('.bjcity').val();
	  console.log(bjcityid);
	return bjcityid;
})*/
//保存
$('.bjbaoc').click(function(){
	
	var bjcall = {};
 	 var bjid = $('.bjid').val();
 	 bjcall.id = bjid;
	 var bjname = $('.bjname').val();
 	 bjcall.name = bjname;
	 var bjphone = $('.bjphone').val();
	 bjcall.phpone = bjphone;
	 var bjweixing = $('.bjweixing').val();
	 bjcall.weixin = bjweixing;
	 var bjusername = $('.bjusername').val();
	 bjcall.username = bjusername;
	 var bjtag = $('.bjtag').val();
	 bjcall.tag = bjtag;
	 var bjcityid = $('.bjcity').val();
	 bjcall.city_id = bjcityid;
	 var bjfuw = $('.bjfuw').val();
	 bjcall.area_id = bjfuw;
	 bjcall.token = TOKEN;
	 var Bjcall = JSON.stringify(bjcall);
	 console.log(bjcall)
	 /* var a = $('.bjtr td').eq(0).html();
	 console.log(a)*/
	 $.ajax({
	 	type:"post",
	 	url:BASE_URL+"/supplier/save",
	 	async:true,
	 	dataType:"json",
	 	data:Bjcall,
	 	success:function(call){
	 		if(call.code=='10001'){
			  alert('用户尚未登录');
			  window.location.href= './login.html';
			  }else if(call.code =='10002'){
			  alert('无权限访问');
			  }
	 		
	 		if(call.code==10000){
	 			alert('保存成功!')
				 //$("#modalAlert").modal('hide');
				 $('.close').trigger("click");
				 $('.bjtr td').eq(0).html(bjid);
				 $('.bjtr td').eq(1).html(bjname);
				 $('.bjtr td').eq(2).html(bjphone);
				 $('.bjtr td').eq(3).html(bjweixing);
				 $('.bjtr td').eq(4).html(bjusername);
				 var bjcityhtml = $("#bjcity").find("option:selected").text();
				 $('.bjtr td').eq(5).html(bjcityhtml);
				 $('.bjtr td').eq(7).html(bjtag);
				
				// window.location.reload();
	 		}
	 	}
	 });
	 
})

})