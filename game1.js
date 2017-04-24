var clientHeight=document.documentElement.clientHeight;
document.getElementById('gamebox').style.height=clientHeight+'px';
if(clientHeight<document.getElementById('game').offsetHeight){
	document.getElementById('game').style.height=clientHeight+'px';
}
//url字符串
function getQueryString(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)","i");var r=window.location.search.substr(1).match(reg);if(r!=null){return unescape(r[2])}return""};
//获得cookie
function getCookie(c){var d=document.cookie.split("; ");for(var b=0;b<d.length;b++){var a=d[b].split("=");if(a[0]==c){return unescape(a[1])}}}function clearCookie(a){addCookie(a,"",-1)};
function debounce(a,c){var b=0;return function(){var d=+new Date();if(d-b>c){a.apply(this,arguments);b=d}}};
/*
* 自定义tip提示 2秒自动关闭
* @param str {str}   传入的提示信息
*/	
function showMsg(str,delay){var alert_msg=document.getElementById("alert_msg");var delay=delay?delay:2000;if(!alert_msg){return}alert_msg.addEventListener("click",function(e){alert_msg.className="";alert_msg.innerHTML="";alert_msg.setAttribute("data-state","false");e.stopPropagation()});if(alert_msg.getAttribute("data-state")=="false"){alert_msg.setAttribute("data-state","true");alert_msg.innerHTML=str;alert_msg.className="alert_msg_show";setTimeout(function(){alert_msg.className="";alert_msg.innerHTML="";alert_msg.setAttribute("data-state","false")},delay)}}
var openid=getQueryString('openid')||getCookie('openid');
var user_uuid=getQueryString('user_uuid')||getQueryString('m_uuid')||getQueryString('ux').substr(3,10)||getCookie('user_uuid');

if(!openid||openid=='undefined'){
	window.location.href='http://m.lrlz.com/h5/activity/arsoa/';
}
var clientWidth=document.documentElement.clientWidth
//获得化肥皂盒
var soapBox=document.getElementById('soapBox');
//获得开始页
var start=document.getElementById('start');
//获得主页面
var main=document.getElementById('main');
//获取结束页
var result=document.getElementById('result');
//获取失败页
var lose=document.getElementById('lose');
//获取分数和时间
var timer=document.getElementById('timer'),
	score=document.getElementById('score')

//设置初始分数和时间
var scoreNum=0,mytime=30;
//类名处理
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}
//掉落部件
function Wpdl(num){
	this.odiv=document.createElement("div");
	this.left=Math.random()*(clientWidth-50);
	this.top=0;
	this.num=num;
	this.v=Math.random()*2+3;
	this.death=false;
	this.init();
}
Wpdl.prototype.init=function(){
	var arr=['soap','bomb','carbon']
	this.odiv.className=arr[this.num];
	this.odiv.style.left=this.left+'px';
	this.odiv.style.top=this.top;
	if(this.num==1){
		if(Math.random()>0.5)this.odiv.style.transform='rotateY(180deg)';
	}else{
		this.odiv.style.transform='rotate('+Math.random()*360+'deg)';
	}	
	main.appendChild(this.odiv);
}
Wpdl.prototype.move=function(){
	this.top=this.top+this.v;
	this.odiv.style.top=this.top+'px';
}
Wpdl.prototype.judge=function(){
	if(this.death==false&&this.top>soapBox.offsetTop-60&&this.top<soapBox.offsetTop){
		if((soapBox.offsetLeft-this.left>0&&soapBox.offsetLeft-this.left<50)||(soapBox.offsetLeft-this.left<0&&this.left-soapBox.offsetLeft<100)){
			if(this.num==0){
				scoreNum=scoreNum+10;
			}else if(this.num==1){
				scoreNum=scoreNum-10;
			}else{
				scoreNum=scoreNum-5;
			}
			score.innerHTML=scoreNum;
			this.death=true
			this.odiv.remove();
		}
	}
}
//	刮开爱的抱抱
function getlose(isFirst){
	setTimeout(function(){
		result.style.display='none';
		lose.style.display='block';
		var i=0;
		console.log(isFirst)
		if(isFirst>1)$('.sharechat').show();
		var losetimer=setInterval(function(){
			var losechild=lose.children;
			if(i<losechild.length){
				losechild[i].className=losechild[i].className+' fadeInAnimated';
				i++
			}else{
				clearInterval(losetimer);
			}
		},900);
	},200)
}

//获取结果
function getResult(scoreNum,status,isFirst){
	var price='',picurl='',btnstr='',share='';
	var haveprize='<p>(至安露莎天猫旗舰店使用)</p>';
	if(scoreNum<80){
		picurl='againchat';
		price='<span class="price" style="width:1.36rem;margin-left: -0.4rem;" onclick="getlose('+isFirst+')" id="tolose"><img src="images/game/mark.png"></span>';
		btnstr='<div class="result_btn"><span style="width:2.54rem;margin-top:1.1rem;" onclick="getlose('+isFirst+')"><img src="images/game/open.png"><span></div>'
		haveprize='';
	}else{
		var mylink='form.html';
		var resultType=0
		if(scoreNum<120){
			picurl='80chat';
			price='<span class="price">80元优惠券</span>'
			resultType=80;
			mylink='result.html';
			haveprize='';
		}else if(scoreNum<150){
			picurl='100chat';
			price='<span class="price">100元优惠券</span>'
			resultType=100;
		}else{
			picurl='150chat';
			price='<span class="price">150元优惠券</span>'
			resultType=150;
		}
		if(isFirst>1)share='<div class="share"><img src="images/game/share.png"/></div>';
		btnstr='<p>游戏奖励仅限领取1次，熟能生巧挑战更高分吧！</p><div class="result_btn"><span class="toShare" id="toShare" again="'+status+'"><img src="images/game/again.png"/></span><span><a href="'+mylink+'?resultType='+resultType+'&openid='+openid+'&user_uuid='+user_uuid+'"><img src="images/game/price.png"/></a></span></div>'
	}
	document.getElementById('result').innerHTML='<div id="myscore"><img src="images/game/'+picurl+'.png" class="chat"/><span class="myscore">'+scoreNum+'</span>'+price+haveprize+'</div>'+btnstr+share
	var tolose=document.getElementById('tolose');
	var mylose=false;
	if(tolose)tolose.addEventListener('touchmove',function(){if(!mylose){getlose(isFirst);mylose=true;}},false);
	if(isFirst==1){
		$('.toShare').click(debounce(function(){
			startgame();
		},320))
	}else{
		toshare();
	}
	
}
//上传分数
function postScore(scoreNum){
	$.ajax({
		type:"post",
//		url:"http://192.168.0.124:8080/app/inter/arsoa/add_arsoa.hh?appVer=3.2.0&appKey=6581235709&openid="+openid+"&score="+scoreNum,
		url:"http://lrlzapp.wx.jaeapp.com/app/inter/arsoa/add_arsoa.hh?appVer=3.2.0&appKey=6581235709&openid="+openid+"&score="+scoreNum,
		dataType:"json",
		success:function(data){
			if(data.code==0||data.code==102||data.code==103){
				var status=0;
				if(data.isAgain!=true){
					status=1
				}
				var isFirst=data.gameCount;
				if(data.score){
					showMsg(data.msg+'当前显示为上一轮有效分数！',4000);
					scoreNum=data.score;
				}
				getResult(scoreNum,status,isFirst);
			}else{
				showMsg(data.msg);
			}
		},
		error:function(error){
			console.log(error);
		}
	});
}
//	创建掉落对象
var dlwp=[];
var mark=0;
//开始游戏
function begin(){
	mark++
	if(mark==30){
		var num=0
		var arr=[1,2]
		var rand=Math.random()*4;
		if(scoreNum>80){rand=Math.random()*6;arr=[1,3];}
		if(rand>arr[0])num=1;
		if(rand>arr[1])num=2;
		dlwp.push(new Wpdl(num));
		mark=0;
	}
	for(var i=0;i<dlwp.length;i++){
		dlwp[i].move();
		dlwp[i].judge();
		if(dlwp[i].top>600){
			dlwp[i].odiv.remove();
			dlwp.splice(i,1);
		}
	}
}
function startgame(){
	start.style.display='none';
	lose.style.display='none';
	result.style.display='none';
	main.style.display='block';
	scoreNum=0,mytime=30
	score.innerHTML=scoreNum;
	//为肥皂盒添加移动
	main.addEventListener("touchmove",function(event){
		var oevent=event.touches[0];
	    var selfplanX=oevent.clientX;
	    var selfplanY=oevent.clientY;
	    if(oevent.clientX<soapBox.offsetWidth/2){
	    	selfplanX=soapBox.offsetWidth/2
	    }else if(oevent.clientX>clientWidth-soapBox.offsetWidth/2){
	    	selfplanX=clientWidth-soapBox.offsetWidth/2
	    }
	    if(oevent.clientY<soapBox.offsetHeight/2){
	    	selfplanY=soapBox.offsetHeight/2
	    }else if(oevent.clientY>clientHeight-soapBox.offsetHeight/2){
	    	selfplanY=clientHeight-soapBox.offsetHeight/2
	    }
	    soapBox.style.left=selfplanX-soapBox.offsetWidth/2+"px";
	    soapBox.style.top=selfplanY-soapBox.offsetHeight/2+"px";
	    event.stopPropagation(); 
	    event.preventDefault();
	},true);
	var djsTimer=setInterval(function(){
		if(mytime<=0){
			clearInterval(djsTimer);
			clearInterval(setTimer);
			postScore(scoreNum);
			setTimeout(function(){
				main.style.display='none';
				result.style.display='block';
			},300)
			for(var i=0;i<dlwp.length;i++){
				dlwp[i].odiv.remove();
			}
			dlwp=[];
			return
		}
		mytime--
		timer.innerHTML=mytime
	},1000)
	var setTimer=setInterval(begin,10)
}
function toshare(){
	$('.toShare').unbind('click')
	$('.toShare').click(debounce(function(){
		$('#share').show();
		$('#share').click(function(){
			$('#share').hide();
		})
	},320))
}
window.onload=function(){
	$('#start').click(startgame)
}
var userAgent=window.navigator.userAgent.toLowerCase(),isWeixin = userAgent.indexOf('micromessenger') !== -1,isIos = userAgent.indexOf('iphone') !== -1;
//微信分享
if(isWeixin){
	   var myurl=(window.location.href || document.URL) + "#";
		var url = "https://lrlz.sinaapp.com/lrlz?uri="+ encodeURIComponent(myurl.substring(0,myurl.indexOf('#'))) +"&callback=";  
		//begin 微信统计活动数据
		var jsoninfo=getQueryString('jsoninfo');
		if (jsoninfo){
			var userinfo = eval("([" + jsoninfo + "])"); 
		}else{
			var userinfo = []; 
		}
				
		tar.init({
					tar_debug:false,
					tar_token:"94dced41e93ac5c4e815d9a727b8cf8b",
					tar_tid: "107827",
					tar_userinfo:userinfo
		},userinfo)
		//end 微信统计活动数据
		$.ajax({
					type: "get",
					url:url,
					async:true,
					dataType:"jsonp",
					success: function(data) {
					var app_id=data.appid,timestamp=data.timestamp,nonceStr=data.nonceStr, signature=data.signature,appid=data.appid;	
					  //console.log(data);
					 wx.config({
						  debug: false,
						  appId: app_id,
						  timestamp: timestamp,
						  nonceStr: nonceStr,
						  signature: signature,
						  jsApiList: [
							'checkJsApi',
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareQQ',
							'onMenuShareWeibo',
							'onMenuShareQZone',
							'getNetworkType',
							'hideOptionMenu',
							'showOptionMenu',
							'chooseWXPay'
						  ]		  
					 }); //config end
				 }
		})		 

        wx.ready(function(){
			var shareData = {
				title: '捡肥皂是一门赚钱的手艺！谁捡谁知道！',
				desc: '肥皂捡得多,红包大大滴！ 单就捡肥皂,我只服我自己！',
				link: 'http://m.lrlz.com/h5/activity/arsoa/',
				imgUrl: 'http://m.lrlz.com/h5/activity/arsoa/images/300-300.jpg',
				trigger:function(){
					showMsg('点击分享给好友！')
				},
				success:function(res){
					$.ajax({
						type:"post",
						url:"http://lrlzapp.wx.jaeapp.com/app/inter/arsoa/add_share.hh?appVer=3.2.0&appKey=6581235709&openid="+openid,
						dataType:"json",
						success:function(data){
							$('.toShare').unbind('click');
							$('.toShare').click(debounce(function(){
								startgame();
							},320))
							$('#share').hide();
						},
						error:function(error){
							console.log(error)
						}
					});	
				},
				cancel:function(res){
					showMsg('分享已取消！')
				},
				fail:function(res){
					showMsg('分享失败！')
				}
			};
			wx.onMenuShareAppMessage(tar.shapeShareAppMessage(shareData));  	//分享给好友
	        wx.onMenuShareTimeline(tar.shapeShareAppMessage(shareData)); 
			wx.onMenuShareQQ(tar.shapeShareAppMessage(shareData)); 	  			//分享到qq
		    wx.onMenuShareQZone(tar.shapeShareAppMessage(shareData)); 	 	//分享到空间
		    
		    //背景音乐
			function  musicPlay(source){
			 var audio = new Audio();
		        audio.src = source;
				audio.load();
		        audio.loop = true;
		        audio.id = 'indexmusic';
		        audio.autoplay = true;
		        audio.play();
				audio.addEventListener('canplay', function(){    audio.play();  }, false);
				}
			var source='music/gameon.mp3?v=3';
				musicPlay(source)
		});// wxready 
}