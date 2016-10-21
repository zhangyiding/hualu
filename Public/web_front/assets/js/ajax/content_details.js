$(function(){
	$('#city_map_point').on('shown.bs.modal', function(e) {
		var core = $(".l_Core").html();
		var site = $('.l_Site').html();
		$('.moda_citySite').html(site);
		$('#citySite1').val(site);
		initMapCore(core,map1);
	})
	
	$(".btn_citySave").on('click',function(){
		$(".l_Core").html($('#citySite1').val());
		$('.l_Site').html($('.moda_citySite').html());
	})
	
	var search = window.location.search;
	var goods_id = search.split('goods_id=')[1].split('&')[0];
	var is_report = search.split('is_report=')[1].split('&')[0];
	var is_status = search.split('status=')[1].split('&')[0];
	var quan = {};
	quan.token = TOKEN;
	$.ajax({
		type:"get",
		url:BASE_URL+"/admin/goods/details?goods_id="+goods_id,
		async:true,
		data:quan,
		success:function(data){
			if(data.code=='10001'){
			  alert('用户尚未登录');
			  window.location.href= './login.html';
			  }else if(data.code =='10002'){
			  alert('无权限访问');
			  }else if(data.code =='10000'){
			console.log(data);
			var pics = data.result.pics;
			//图片区域
			$(".shareImg").children('img').attr('src',pics.image_path)
			if(pics.imgstyle){
							
				//获取Canvas对象(画布)
				var canvas = document.getElementById("myCanvas");
				//简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
				if (canvas.getContext) {
						
					var ctx = canvas.getContext("2d");
					var w =  document.getElementsByClassName('pic')[0].clientWidth;
					canvas.width = w;
					canvas.height = w;
					ctx.clearRect(0,0,w,w);
					ctx.beginPath();
					ctx.strokeStyle = "rgba(0,0,0,0.5)";
					ctx.lineWidth = '1';
					ctx.fillStyle = 'rgba(255,255,255,0.6)';
					var cir1 = {};
					var cir2 = {};
					var cir3 = {};
					var cir4 = {};
					var word='';
					var color='';
					var fontSize='';
					var fontFamily='';
					document.getElementsByClassName("tags")[0].innerHTML ="";
					
					
					for(var i = 0, l = pics.imgstyle.length; i< l;i++){
						
						cir1.x = w*pics.imgstyle[i].start_coordinate.split(',')[0];
						cir1.y = w*pics.imgstyle[i].start_coordinate.split(',')[1];
						cir2.x = w*pics.imgstyle[i].end_coordinate.split(',')[0];
						cir2.y = w*pics.imgstyle[i].end_coordinate.split(',')[1];
						word = pics.imgstyle[i].words;
						fontSize = pics.imgstyle[i].size;
						color = pics.imgstyle[i].color;
						fontFamily = pics.imgstyle[i].font;
						
						canvasPic(ctx,cir1,cir2,word,w,color,fontSize,fontFamily);
						
					}
				}
			}
			
			//基本信息
			var info = data.result;
			$(".title").html(info.title);
			$(".price").html(info.currency_mark+info.price);
			$(".price_unit").html(info.price_unit);
			var tags = '';
			for(var i = 0; i< info.tag.length;i++){
				tags+='#'+info.tag[i].name+' ';
			}
			$('.tag').html(tags);
			$('.content').html(info.content);
			$('.delivery_type').html(info.delivery_type);
			$('.pay_type').html(info.pay_type);
			$('.nickname').html(info.nickname+'['+info.user_id+']');
			
			$('.goods_id').html(info.goods_id);
			$('.add_time').html(getLocalTime(info.add_time));
			$('.l_Core').html(info.location);
			$(".l_Site").html(info.address);
			$('.commission_rate').html(info.commission_rate+'%');
			if(is_status==1){
				$('.sele').val(1)
			}else{
				$('.sele').val(0)
			}
			if(is_report==1){
				$('.is_report').html('是');
			}else{
				$('.is_report').html('否');
			}
		}
			       
				}
		
	});
	
	//提交
	$('.btn_submit').on("click",function(){
		
		var del_flag = $('.sele').val();
		var datas = {};
		datas.goods_id = goods_id;
		datas.type = 1;
		datas.del_flag = del_flag;
		datas.is_report = is_report;
		datas.location = $('.l_Core').html();
		datas.token = TOKEN;
		datas = JSON.stringify(datas);
		$.ajax({
			type:"post",
			url:BASE_URL+"/admin/goods/operate",
			data:datas,
			dataType: "json",  
			success:function(call){
				
			if(call.code=='10001'){
			  alert('用户尚未登录');
			  window.location.href= './login.html';
			  }else if(call.code =='10002'){
			  alert('无权限访问');
			  }else if(call.code =='10000'){
			       
				alert('修改成功');
				
				var local = window.location.href.split('content_details')[0];
				window.location.href = local+'content.html';
				}
			}
		});
	})
	
	//时间戳转换成日期格式
	function getLocalTime(nS) {  
		var date = new Date(parseInt(nS) * 1000);
		Y = date.getFullYear() + '-';
		M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		D = date.getDate() + ' ';
		h = date.getHours() + ':';
		m = date.getMinutes() + ':';
		s = date.getSeconds(); 
		return Y+M+D+h+m+s ; 
    }  
	
	//编辑城市中央坐标
	function initMapCore(data,mapId){
		//data 城市坐标
		//mapId 地图视图ID
		//zoom 地图 缩放
		var site = data;
		var center = {};
		center.lat = parseFloat(data.split(',')[0]);
		center.lng = parseFloat(data.split(',')[1]);
		console.log(center)
		var map = new google.maps.Map(document.getElementById(mapId.getAttribute('id')), {
			zoom: 12,
			center: center
		});
		var markersArray =[];
		var marker = new google.maps.Marker({
			position: center,
			map: map,
		});
		markersArray.push(marker);
		map.addListener('click', function(e) {
		    addMarker(e.latLng, map);
		    site = e.latLng.lat().toFixed(6)+','+e.latLng.lng().toFixed(6);
			$('#citySite1').val(site);
		    var mlist = {}
		    mlist.token = TOKEN;
		    maplist = JSON.stringify(mlist);
		    
		    $.ajax({
		    	type:"post",
		    	url:"https://maps.googleapis.com/maps/api/geocode/json?latlng="+site+"&location_type=ROOFTOP&result_type=street_address&key=AIzaSyC8IXpNgfA7uD-Xb0jEqhkEdB7j3gbgOiE",
		    	async:true,
		    	data:maplist,
		    	dataType:"json",
		    	success:function(data){
		    		if(data.results.length<1){
		    			var dataSite = '暂无位置信息'
		    		}else{
			    		var dataSite = data.results[0].formatted_address.split(' ')[0];
		    		}
//		    		$('.moda_citySite').html(dataSite);  //存 详细地址
		    		
		    		
		    	}
		    });
		    
		});
		function addMarker(latLng, map) {
			markersArray[0].setMap(null);
			markersArray.shift(marker)
			marker = new google.maps.Marker({
			    position: latLng,
			    map: map
			});
			markersArray.push(marker);
	//			  	map.panTo(latLng);
		}
		
		
	}


// canvas 

	
	function canvasPic(ctx,cir,dot,text,w,color,fontSize,fontFamily){
		ctx.beginPath();
		ctx.arc(cir.x, cir.y, 3, 0, 2*Math.PI , true);
		ctx.moveTo(cir.x,cir.y);
		ctx.lineTo(dot.x,dot.y);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		
		var ElementP = document.createElement('p');
		var CP = document.getElementsByClassName("tags")[0].appendChild(ElementP);
		
		var r = parseInt(color.slice(1,3),16);
		var g = parseInt(color.slice(3,5),16);
		var b = parseInt(color.slice(5,7),16);
		var a = parseInt(color.slice(7,9),16)/255;
		CP.style.background = 'rgba(0,0,0,0.8)';
		CP.style.color= 'rgba('+r+','+g+','+b+','+a+')';
		CP.style.fontSize= fontSize+'px';
		CP.style.fontFamily= fontFamily;
		CP.innerHTML = text;
		CP.style.left= dot.x+'px';	
		if(dot.y<cir.y){
			var h =  w-dot.y;
			CP.style.bottom= h+'px';
		}else{
			CP.style.top= dot.y+'px';
		}
		var CPw = CP.clientWidth;
		CP.style.marginLeft = -CPw/2+"px";
	}


})
