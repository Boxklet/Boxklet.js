var docIndex = "index.json";	//指定数据地址
var docPrefix = 'SimpleDoc';
// var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

jQuery(document).ready(function() {
	var loadBar = $("#load-bar");
	var loading = $("#loading");
	var indexList = $('#Index-list');
	var popupBox = $("#popup-box");
	var popupText = $("#popup-text");
	var mainDOM = $("#Main");
	var mainMessagesBox = $("#Main-Messages");

    //页面载入时候把 index.json 写到浏览器数据库
    dateCache(1);
    // 清除所有 localStorage
    $('#test1').click(function () {
    	mainMessages('',3);
    })

    // 目录载入文件
    $('#Index-list').on('click','li>span',function () {
    	var thisFile = $(this).data('doc');
    	if (thisFile) {
    		loadDoc(thisFile);
    	};
    	
    })

    // 正文内部链接
    $('#Main').on('click','span.doclink',function () {
    	// var docFile = $(this).data('doc');
    	loadDoc($(this).data('doc'));
    })

    // 清除所有 localStorage
    $('#Del-Cache').click(function () {
    	// body...
    })

	// 显示或隐藏左边目录
    $('#Index-Button').click(function() {
        $(this).toggleClass('show');
        $('#Index-Box').toggleClass('show');
    });

    //关闭弹出窗口
    popupBox.click(function () {
    	$(this).fadeOut(100,function () {
    		popupBox.removeClass('show');
    	});
    })

	//弹出窗口
	function popupMessages (popupWarnText,popupStyle) {

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
    mainMessagesBox.on("click","li>span",function () {
    	// 动画向上移动并同时透明度为0，然后折叠后删除
    	$(this).parent().addClass('delete').delay(200).slideUp(300,function () {
			$(this).detach();
		})
    })

	//main 提示信息
	function mainMessages (message,messageStyle) {
		if (!message) {
			var message = "这里是提示信息！";
		};

		// messageStyle 有四种样式，分别是warning（黄色）、error（红色）、success（绿色）和 info（蓝色）
		// style.css 中对应选择器为 #Main-Messages-Box>ul>li
		// 默认样式是 info，当值为空时候则使用默认样式。
		if (messageStyle===1||messageStyle==="warning") {
			var messageStyle = "warning";
		} else if (messageStyle===2||messageStyle==="error"){
			var messageStyle = "error";
		} else if(messageStyle===3||messageStyle==="success") {
			var messageStyle = "success";
		} else {
			var messageStyle = "";
		};

		mainMessagesBox.append('<li class="'+messageStyle+' hide"><div>'+message+'</div><span></span></li>');
		var theMessage = $("#Main-Messages-Box>ul>li:last-child");
		$("#Main-Messages-Box").animate({
			scrollTop: theMessage.offset().top
		}, 200,function () {
			theMessage.removeClass('hide');
		});

	}

	//把 index.json 内容写到浏览器数据库中，之后不用每次都重新访问 index.json
	function dateCache (ishome,ifcachedocs) {
		var locaDocVersion = localStorage.simple_doc_doc_version;
		$.ajax({
			url: docIndex,
			cache: false,
			dataType: "json",
	        // 载入成功
			success: function (index_date) {
				if (locaDocVersion===index_date['doc_version']) {
					postIndexList();
				} else{
					//把数据写入本地数据库
					localStorage[docPrefix+'_doc_version'] = index_date['doc_version'];
					localStorage[docPrefix+'_doc_folder'] = index_date['doc_folder'];	//字符串不需要转换 json
					localStorage[docPrefix+'_doc_home_page'] = index_date['doc_home_page'];
					localStorage[docPrefix+'_doc_items'] = JSON.stringify(index_date['doc_items']);	//数组转换成 json
					
					postIndexList(index_date['doc_items']);//列出左边目录
				};
				if (ishome) {
					// 当页面第一次载入时候加载首页内容
					loadHomePage();
				};
			},

			//载入失败时候
			error: function () {
				popupMessages("读取 "+docIndex+" 失败");
			}
		})
	}

	// 列出目录
	function postIndexList (items) {
		if (!items&&localStorage[docPrefix+'_doc_items']) {
			var items = JSON.parse(localStorage[docPrefix+'_doc_items']);
		};
		if (typeof items == 'object'&&items.constructor==Array) {
			//第一个循环是列出第一层目录 category 直为空的
			for (var i = items.length - 1; i >= 0; i--) {
				if (!items[i]['category']) {
					var thisLi = ''
					if (items[i]['doc']) {
						var thisLi = '<li><span data-doc="'+items[i]['doc']+'">'+items[i]['title']+'</span><ol></ol></li>';
					} else if (items[i]['link']) {
						var thisLi = '<li><a href="'+items[i]['link']+'">'+items[i]['title']+'</a><ol></ol></li>';
					} else {
						var thisLi = '<li>'+items[i]['title']+'<ol></ol></li>';
					};
					indexList.append(thisLi);
				};
			};

			// 第二次循环是列出 category 不为空的，并且添加在对应的分类下。
			for (var i = items.length - 1; i >= 0; i--) {
				if (items[i]['category']) {
					var categoryLi = $('#Index-list>li:nth-child('+i+')>ol');
					var thisLi = ''
					if (items[i]['doc']) {
						var thisLi = '<li><span data-doc="'+items[i]['doc']+'">'+items[i]['title']+'</span></li>';
					} else if (items[i]['link']) {
						var thisLi = '<li><a href="'+items[i]['link']+'">'+items[i]['title']+'</a></li>';
					} else {
						var thisLi = '<li>'+items[i]['title']+'</li>';
					};
					categoryLi.append(thisLi);
				};
			};
		} else {
			mainMessages('无法读取文档列表','warning');
		};
	}

	//处理并载入对应页面内容 
	function loadHomePage () {
		//读取本地数据库中内容

		if (localStorage[docPrefix+'_doc_home_page']) {
			//如果数据库中有指定首页页面则载入
			loadDoc(localStorage[docPrefix+'_doc_home_page']);

		} else if(localStorage[docPrefix+'_doc_items']){
			var itemsHomeDoc = JSON.parse(localStorage[docPrefix+'_doc_items'])[0]["doc"];
			if (itemsHomeDoc) {
				//如果数据库中没有指定首页则载入 items 中第一个项目的内容
				loadDoc(itemsHomeDoc);
			} else{
				// 如果没有指定主页内容并且 items 第一个项目也没指定 doc 弹出错误
				mainMessages("数据库中没有指定主页内容！",'warning')
			};

		} else {mainMessages("数据库中没有指定主页内容！",'warning')};


	}

	//修改 Main
	function loadDoc (docLink,docTitle) {

		var loadDocCache = localStorage[docPrefix+'_'+docLink];

		if (loadDocCache) {
			// 如果本地数据库对应内容则直接加载本地数据库中对应内容
			editMain(loadDocCache,true);

		} else {

			//如果数据库中有指定文档存放文件夹则声明 docFolder
			if (localStorage[docPrefix+'_doc_folder']) {
				var docFolder = localStorage[docPrefix+'_doc_folder']+"/";
			} else{
				var docFolder = "";
			};

			$.ajax({
				url: docFolder+docLink,	//文件夹加上文件名组成完整文档路径
				cache: false, 
				dataType: "html",

				success: function (postDate) {
					editMain(postDate,true);
				},
				error: function () {
					mainMessages(docLink+" 加载失败", 'warning');	//提示错误
				}
			})
		};
	}

	//修改 #main
	function editMain (postDate,markdown) {
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

	// ajax Loadingbar
	$(document).ajaxStart(function () {
		loadBar.show();
	})
	$(document).ajaxStop(function () {
		loadBar.fadeOut(100);
	})

});
