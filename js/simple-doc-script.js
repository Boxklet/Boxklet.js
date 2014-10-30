var docIndex = "index.json";	//指定数据地址

jQuery(document).ready(function() {
	var loadBar = $("#load-bar");
	var loading = $("#loading");
	var popupBox = $("#popup-box");
	var popupText = $("#popup-text");
	var mainDOM = $("#main");
	var mainMessagesBox = $("#main-messages>ul");

    //页面载入时候把 index.json 写到浏览器数据库
    dateCache(1);

    //test
    $("#test").click(function () {
    	loadHomePage();
    });
    $("#test2").click(function () {
    	popupWarning();
    });
    $("#test7").click(function () {
    	popupWarning("黄色警告","warning");
    });
    $("#test8").click(function () {
    	popupWarning("严重警告","error");
    });
    $("#test9").click(function () {
    	popupWarning("成功弹出提示","success");
    });
    $("#test3").click(function () {
    	mainMessages("Warning","warning");
    });
    $("#test4").click(function () {
    	mainMessages("Errot","error");
    });
    $("#test5").click(function () {
    	mainMessages("Success","success");
    });
    $("#test6").click(function () {
    	mainMessages();
    });

	// 显示或隐藏左边目录
    $('#list-button').click(function() {
        $('#index').toggleClass('list-show');
    });

    //关闭弹出窗口
    popupBox.click(function () {
    	$(this).fadeOut(100,function () {
    		popupBox.removeClass('show');
    	});
    })

	//弹出窗口
	function popupWarning (popupWarnText,popupStyle) {
		loadBar.hide()	//隐藏加载提示

		//如果有提示信息则更改为对应信息
		if (popupWarnText) {
			popupText.html(popupWarnText);
		} else {
			popupText.html("这是弹出层提示窗口");
		};

		//判断提示样式，默认是 info（蓝色），另分别是 warning（黄色）、error（红色）、success（绿色）
		if (popupStyle===1||popupStyle==="warning") {
			popupBox.attr("class","warning");
		} else if (popupStyle===2||popupStyle==="error"){
			popupBox.attr("class","error");
		} else if(popupStyle===3||popupStyle==="success") {
			popupBox.attr("class","success");
		} else {
			popupBox.attr("class","");
		};

		popupBox.fadeIn(100,function (argument) {
			$(this).addClass('show');
		});
	}


    // main 顶部提示信息删除按钮
    $("#main-messages").on("click","li>span",function () {
    	$(this).parent().animate({top: '-40px',opacity: 'hide'},300,function () {
    		$(this).detach();
    	})
    })

	//main 提示信息
	function mainMessages (message,messageStyle) {
		if (!message) {
			message = "这里是提示信息！";
		};

		// messageStyle 有四种样式，分别是warning（黄色）、error（红色）、success（绿色）和 info（蓝色）
		// style.css 中对应选择器为 #main-messages>ul>li
		// 默认样式是 info，当值为空时候则使用默认样式。
		if (messageStyle===1||messageStyle==="warning") {
			messageStyle = "warning";
		} else if (messageStyle===2||messageStyle==="error"){
			messageStyle = "error";
		} else if(messageStyle===3||messageStyle==="success") {
			messageStyle = "success";
		} else {
			messageStyle = "";
		};
		mainMessagesBox.append('<li class="'+messageStyle+'"><div>'+message+'</div><span></span></li>');
		var theMessage = $("#main-messages>ul>li:last-child");
		theMessage.fadeIn(100,function () {
			$("#main-messages-box").animate({scrollTop: theMessage.offset().top}, 100);
		}).delay(3000).animate({top: '-40px',opacity: 'hide'},300,function () {
    		$(this).detach();	//信息内容显示3秒后自动消失
    	});

	}

	//把 index.json 内容写到浏览器数据库中，之后不用每次都重新访问 index.json
	function dateCache (ishome,ifcachedocs) {
		$.ajax({
			url: docIndex,
			cache: false,
			dataType: "json",
			beforeSend: function(){
	            //发送 Ajax 之前显示加载提示
	            loadBar.show();
	        },
	        // 载入成功
			success: function (index_date) {
				//把数据写入本地数据库
				localStorage['simple_doc_doc_folder'] = index_date['doc_folder'];	//字符串不需要转换 json
				localStorage['simple_doc_home_page'] = index_date['home_page'];
				localStorage['simple_doc_items'] = JSON.stringify(index_date['items']);	//数组转换成 json
				if (ishome) {
					// 当页面第一次载入时候加载首页内容
					loadHomePage();
				};
			},

			//载入失败时候
			error: function () {
				popupWarning("读取 "+docIndex+" 失败");
			}
		})
	}

	// 列出目录
	function postIndex (argument) {
		// body...
	}

	//处理并载入对应页面内容 
	function loadHomePage () {
		//读取本地数据库中内容

		if (localStorage.simple_doc_home_page) {
			//如果数据库中有指定首页页面则载入
			loadDoc(localStorage.simple_doc_home_page);

		} else if(localStorage.simple_doc_items){
			var items_home_doc = JSON.parse(localStorage.simple_doc_items)[0]["doc"];
			if (items_home_doc) {
				//如果数据库中没有指定首页则载入 items 中第一个项目的内容
				loadDoc(items_home_doc);
			} else{
				// 如果没有指定主页内容并且 items 第一个项目也没指定 doc 弹出错误
				popupWarning("数据库中没有指定主页内容！")
			};

		};


	}

	//修改 Main
	function loadDoc (docLink,docTitle) {

		var loadDocCache = localStorage[docLink];

		if (loadDocCache) {
			// 如果本地数据库对应内容则直接加载本地数据库中对应内容
			editMain(loadDocCache,true);

		} else {

			//如果数据库中有指定文档存放文件夹则声明 docFolder
			if (localStorage.simple_doc_doc_folder) {
				var docFolder = localStorage.simple_doc_doc_folder+"/";
			} else{
				var docFolder = "";
			};

			$.ajax({
				url: docFolder+docLink,	//文件夹加上文件名组成完整文档路径
				cache: false, 
				dataType: "html",

				beforeSend: function(){
		            //发送 Ajax 之前显示加载提示
		            loadBar.show();
		        },

				success: function (postDate) {
					editMain(postDate,true);
				},
				error: function () {
					popupWarning(docLink+"<br>加载失败");	//提示错误
				}
			})
		};
	}

	//修改 #main
	function editMain (postDate,markdown) {
		loadBar.fadeOut();	//隐藏加载提示
		mainDOM.addClass("op0");	//先隐藏 main
		setTimeout(function () {
			// 隐藏后修改 main 内容，然后显示 main
			if (markdown) {
				mainDOM.html(marked(postDate)).removeClass("op0");
			} else {
				mainDOM.html(postDate).removeClass("op0");
			};
		},100);
	}

	//搜索 items 中的 keyword 
	function searchItems (keyword) {
		// body...
	}

});
