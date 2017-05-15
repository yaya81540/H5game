function showMsg(str,delay){var alert_msg=document.getElementById("alert_msg");var delay=delay?delay:2000;if(!alert_msg){return}alert_msg.addEventListener("click",function(e){alert_msg.className="";alert_msg.innerHTML="";alert_msg.setAttribute("data-state","false");e.stopPropagation()});if(alert_msg.getAttribute("data-state")=="false"){alert_msg.setAttribute("data-state","true");alert_msg.innerHTML=str;alert_msg.className="alert_msg_show";setTimeout(function(){alert_msg.className="";alert_msg.innerHTML="";alert_msg.setAttribute("data-state","false")},delay)}}
//url字符串
function getQueryString(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)","i");var r=window.location.search.substr(1).match(reg);if(r!=null){return unescape(r[2])}return""};
//获得cookie
//cookie 
function addCookie(e,a,d){var f=e+"="+escape(a);if(d>0){var c=new Date();var b=d*24*3600*1000;c.setTime(c.getTime()+b);f+="; expires="+c.toGMTString()}if(d===Infinity){f+="; expires=Fri, 31 Dec 9999 23:59:59 GMT"}f+="; path=/";document.cookie=f}function getCookie(c){var d=document.cookie.split("; ");for(var b=0;b<d.length;b++){var a=d[b].split("=");if(a[0]==c){return unescape(a[1])}}}function clearCookie(a){addCookie(a,"",-1)};
function debounce(a,c){var b=0;return function(){var d=+new Date();if(d-b>c){a.apply(this,arguments);b=d}}};
//删除左右两端的空格
var trim=function (str){
　     return str.replace(/(^\s*)|(\s*$)/g, "");
}
var clientHeight=document.documentElement.clientHeight;
document.getElementById('wrap').style.height=clientHeight+'px';
var score=0;
$('.spirit').click(debounce(function(){
	$(this).removeClass('spiritAnimated');
	$(this).addClass('catch');
	var that=this;
	setTimeout(function(){
		$(that).removeClass('catch')
	},200)
	score++;
},50))
function start(){
	$('#mask').show();
	$('#djs').show();
	$('#tenner').hide();
	$('#share').hide();
	var djs=3;
	score=0;
	$('#djs').css('background-image','url(images/zjlgame/'+djs+'.png)');
	var timer=setInterval(function(){
		if(djs<=0){
			begin();
			clearInterval(timer);
			$('#mask').hide();
			$('#djs').hide();
			return
		}
		djs--;
		$('#djs').css('background-image','url(images/zjlgame/'+djs+'.png)');
	},1000)
}
function begin(){
	var mark=0,time=20;
	var timer=setInterval(function(){
		if(time<=0){
			clearInterval(timer);
			$('.spirit').removeClass('spiritAnimated');
			getResult(score);
			return
		}
		getSpirit();
		mark++;
		time--;
		$('#gameDjs').html(time);
	},1000)
}
function getSpirit(){
	for(var i=0;i<9;i++){
		if(Math.random()<0.3||(i>6&&$('.spiritAnimated').length<3)){
			$('.spirit').eq(i).addClass('spiritAnimated');		
		}
	}
}
function getResult(score){
	var successStr='<div class="success">'
			+'<div id="score"></div><p><input type="text" name="taobaoId" id="taobaoId" value="" placeholder="输入淘宝昵称"/></p>'
			+'<div id="toTurnplate"><img src="images/zjlgame/turnplate.png"/></div></div>';
	var loseStr='<div class="lose">'
			+'<div id="score">10</div><div id="again"><img src="images/zjlgame/again.png"/></div>'
			+'<a id="toKnow" href="know.html"><img src="images/zjlgame/know.png"/></a></div>'
	if(score>=40){
		$('#tenner').html(successStr);
		postID();
	}else{
		$('#tenner').html(loseStr);
		$('#again').click(debounce(function(){
			start();
		},320))
	}
	$('.close').click(debounce(function(){
		$('#mask').hide();
		$('#tenner').hide();
	},320))
	$('#score').html(score);
	$('#mask').show();
	$('#tenner').show();
}
//上传淘宝ID
function postID(){
	$('#toTurnplate').click(debounce(function(){
		var taobaoId=trim($('#taobaoId').val());
		if(taobaoId==''){
			showMsg('请输入淘宝ID');
			return;
		}
		$.ajax({
			type:"post",
//			url:"http://192.168.0.103:8080/app/inter/brand/activity/add_activity_user_info.hh?appVer=3.2.0&appKey=6581235709&taobaoId="+taobaoId+"&activityName=sooryehan&score="+score+"&openid="+openid,
			url:"http://lrlzapp.wx.jaeapp.com/app/inter/brand/activity/add_activity_user_info.hh?appVer=3.2.0&appKey=6581235709&taobaoId="+taobaoId+"&activityName=sooryehan&score="+score+"&openid="+openid,
			dataType:'json',
			success:function(data){
				showMsg(data.msg)
				setTimeout(function(){
					window.location.href='turnplate.html?openid='+openid;
				},2000)
			},
			errror:function(error){
				console.log(error);
			}
		});
	},320))
}
start();
$('#share').unbind('click');
