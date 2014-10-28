var docIndex = "index.json";	//指定数据地址

jQuery(document).ready(function() {
	var loadBar = $("#load-bar");
	var loading = $("#loading");
	var errorBox = $("#error-box");
	var errorText = $("#error-text");
	var mainDOM = $("#main");

	// List Button
    $('#list-button').click(function() {
        $('#index').toggleClass('list-show');
    });

    //Error clock
    errorBox.click(function (argument) {
    	$(this).fadeOut(100);
    	setTimeout(function () {
    		errorBox.removeClass('show');
    	},100);
    })

    // 当页面第一次载入时候加载首页内容
    loadMain(1);

    //test
    $("#test").click(function () {
    	loadMain(1);
    });
    $("#test2").click(function () {
    	errorWarning();
    });

	//错误提示
	function errorWarning (errorWarnText) {
		loadBar.hide()	//隐藏加载提示
		if (errorWarnText) {
			errorText.html(errorWarnText);
		} else {
			errorText.html("加载文档失败");
		};
		errorBox.fadeIn(100);
		setTimeout(function () {
			errorBox.addClass('show');
		},100);
	}

	//处理并载入对应页面内容 
	function loadMain (ishome) {
		$.ajax({
			url : docIndex, 
			cache: false, 
			dataType: "json",

	        beforeSend: function(){
	            //发送 Ajax 之前显示加载提示
	            loadBar.show();
	        },

	        // 载入成功
			success: function (index_date) {

				// 如果数据库中有指定文档存放文件夹则声明 docFolder
				if (index_date["doc_folder"]) {
					var docFolder = index_date["doc_folder"]+"/"
				} else {
					var docFolder = "";
				};

				//设置需要载入文档的路径
				if (ishome) {
					//使用 is home 判断是否载入首页内容
					if (index_date["home_page"]) {
						//如果数据库中有指定首页页面则载入
						var docFile = docFolder+index_date["home_page"];
						//载入并修改页面内容
						editMain(docFile);
					} else if (!index_date["home_page"]&&index_date["items"][0]["doc"]) {
						//如果数据库中没有指定首页则载入 itema 中第一个项目的内容
						var docFile = docFolder+index_date["items"][0]["doc"];
						editMain(docFile);
					} else if (!index_date["items"][0]["doc"]) {
						//如果第一个 itema 没有指定页面内容则提示错误
						errorWarning(docIndex+" 中没有指定主页内容！")
					};
				};

			},

			//载入失败时候
			error: function () {
				errorWarning("读取 "+docIndex+" 失败");
			}
		});
	}

	//修改 Main
	function editMain (docLink,docTitle) {
		$.ajax({
			url: docLink,
			cache: false, 
			dataType: "html",

			success: function (postDate) {
				loadBar.hide();	//隐藏加载提示
				mainDOM.addClass("op0");	//先隐藏 main
				setTimeout(function () {
					// 隐藏后修改 main 内容，然后显示 main
					mainDOM.html(marked(postDate)).removeClass("op0");
				},100);
			},
			error: function () {
				errorWarning(docLink+"<br>加载失败");	//提示错误
			}
		})
	}

});
