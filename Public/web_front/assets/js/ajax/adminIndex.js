$(function(){
	var optHtml = '';
	$.ajax({
		type:'get',
		url:BASE_URL+'/admin/member/history',
		data:{token:TOKEN},
		success:function(data){
			console.log(data);
			var opt = data.result.data;
			$("#historyOpera").html('');
			for(var i = 0; i< opt.length;i++){
				var timedata =  moment.unix(opt[i].add_time);
//				console.log(timedata)
				var timeout = moment(timedata, "YYYYMMDD").fromNow();
				console.log(timeout)
				optHtml+= '<li class="mini-timeline-indigo">'+
	                            '<div class="timeline-icon"><i class="ti ti-user"></i></div>'+
	                            '<div class="timeline-body">'+
	                                '<div class="timeline-content">'+opt[i].title+opt[i].info+'</div>'+
	                            '</div>'+
	                            '<span class="timeline-time">'+timeout+'</span>'+
	                        '</li>'
			}
			$("#historyOpera").html(optHtml);
		}
	})
})
