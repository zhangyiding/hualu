$('#city_map_point').on('shown.bs.modal', function(e) {
	var data = e.relatedTarget.getAttribute('data-core');
	var min = e.relatedTarget.getAttribute('data-min');
	var max = e.relatedTarget.getAttribute('data-max');
    initMap(data,min,max);
});
$('#city_map_pointEdit').on('shown.bs.modal', function(e) {
	var _this = e.relatedTarget;
	var site = _this.parentNode.previousElementSibling.innerHTML;
	if(_this.getAttribute('data-edit')=='core'){
		console.log(site)
		initMapCore(site,mapEdit);
	}else if(_this.getAttribute('data-edit')=='minmax'){
		console.log(site);
		var min = site.split('~')[0];
		var max = site.split('~')[1];
		initMapMinMax(min,max,mapEdit);
		
	}
});
$('.saveEdit').on('click',function(){
	var m = $("#citySite1").val();
	if(m!=''){
		$("#m_CornLocation").html(m);
		dis(m);
		console.log(m);
	}
	var n = $("#citySite2").val();
	if(n!='')
		$("#m_MinMaxLocation").html(n);
});
//当前坐标
getLocation();
var curSite = localStorage.getItem('localSite');
console.log(curSite)
if(curSite==null){
	//如果获取不到，就设置默认北京地址
	curSite='39.904015,116.447028';
}
var distance = 0.241132;
var curMin,curMax;
dis(curSite);
//初始化 城市坐标以及范围
function dis(curSite){
	var tempSite = curSite;
	curMin = (parseFloat(tempSite.split(',')[0])-distance).toFixed(6)+','+(parseFloat(tempSite.split(',')[1])-distance).toFixed(6);
	curMax = (parseFloat(tempSite.split(',')[0])+distance).toFixed(6)+','+(parseFloat(tempSite.split(',')[1])+distance).toFixed(6);
	$("#add_cityCore").html(curSite);
	var curMinMax = curMin+'~'+curMax;
	$("#add_cityMinMax").html(curMinMax);
	$("#citySite2").val(curMinMax)
}
$('#city_map_pointAdd').on('shown.bs.modal', function(e) {
	var temp = e.relatedTarget.getAttribute('data-style');
	if(temp=='addCore'){
		var site = $("#add_cityCore").html();
		initMapCore(site,mapAdd);
	}else{
		var site = $("#add_cityMinMax").html();
		var min = site.split('~')[0];
		var max = site.split('~')[1];
		initMapMinMax(min,max,mapAdd);
	}
})

$('.saveAdd').on('click',function(){
	var m = $("#citySite1").val();
	if(m!=''){
		$("#add_cityCore").html(m);
		dis(m);
		console.log(m);
	}
	var n = $("#citySite2").val();
	if(n!='')
		$("#add_cityMinMax").html(n);
});
//$('.btn-addCore').on('click',function(){
//  initMapCore(curSite,mapAdd)
//})


//查看城市坐标以及城市范围
function initMap(data,min,max) {
	
	if(min!=null && max!=null){
		var rectangle;
		var infoWindow;
    	var bounds ={};
    	var center ={};
    	bounds.north = parseFloat(max.split(',')[0]);
    	bounds.south = parseFloat(min.split(',')[0]);
    	bounds.east = parseFloat(max.split(',')[1]);
    	bounds.west = parseFloat(min.split(',')[1]);
    	console.log(bounds);
    	center.lat = (bounds.south+bounds.north)/2;
    	center.lng = (bounds.west+bounds.east)/2;
    	console.log(center);
    	
		var map = new google.maps.Map(document.getElementById('fusion'), {
			zoom: 8,
			center: center
		});
		var marker = new google.maps.Marker({
			position: center,
			map: map,
			title: 'Click to zoom'
		});
		rectangle = new google.maps.Rectangle({
			bounds:bounds,
			map: map,
			strokeColor: '#FF0000',
		    strokeOpacity: 0.6,
		});
		
	}else if(data!=null){
		var myLatlng = {};
    	myLatlng.lat = parseFloat(data.split(',')[0]);
    	myLatlng.lng = parseFloat(data.split(',')[1]);
    	console.log(myLatlng);
		var map = new google.maps.Map(document.getElementById('fusion'), {
			zoom: 10,
			center: myLatlng
		});
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: 'Click to zoom'
		});
	}
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
		zoom: 10,
		center: center
	});
	var markersArray =[];
	var marker = new google.maps.Marker({
		position: center,
		map: map,
	});
	markersArray.push(marker);
	$('#citySite1').val(site);
	map.addListener('click', function(e) {
	    addMarker(e.latLng, map);
	    site = e.latLng.lat().toFixed(6)+','+e.latLng.lng().toFixed(6);
	    $('#citySite1').val(site);
	    
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


//编写城市范围
function initMapMinMax(min,max,mapId){
	var rectangle;
	var infoWindow;
	var bounds ={};
	var center ={};
	bounds.north = parseFloat(max.split(',')[0]);
	bounds.south = parseFloat(min.split(',')[0]);
	bounds.east = parseFloat(max.split(',')[1]);
	bounds.west = parseFloat(min.split(',')[1]);
	console.log(bounds);
	center.lat = (bounds.south+bounds.north)/2;
	center.lng = (bounds.west+bounds.east)/2;
	console.log(center);
	
	var map = new google.maps.Map(document.getElementById(mapId.getAttribute('id')), {
		zoom: 8,
		center: center
	});
	var marker = new google.maps.Marker({
		position: center,
		map: map,
		title: 'Click to zoom'
	});
	rectangle = new google.maps.Rectangle({
		bounds:bounds,
		map: map,
		strokeColor: '#FF0000',
	    strokeOpacity: 0.6,
		editable: true,
//		draggable: true
	});
	
	$("#citySite2").val(min+'~'+max);
	google.maps.event.addListener(rectangle, 'bounds_changed', function() {
		var ne = rectangle.getBounds().getNorthEast();
  		var sw = rectangle.getBounds().getSouthWest();
  		min = sw.lat().toFixed(6) +','+ sw.lng().toFixed(6);
  		max = ne.lat().toFixed(6) +','+ ne.lng().toFixed(6);
  		
		$("#citySite2").val(min+'~'+max);
		
	});
}

//获取当前经纬度

function getLocation()
{
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{
  	alert("浏览器不支持html5来获取地理位置信息");
  }
}
function showPosition(position)
{
	var lng = position.coords.longitude;
    var lat = position.coords.latitude;
    var site = lat.toFixed(6)+','+lng.toFixed(6);
   	localStorage.setItem('localSite',site);
}
    
    
    
    
    