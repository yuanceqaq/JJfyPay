
/**
 * 封装的工具类
 */
var U = {
	/**
	 * 封装的AJAX请求方式
	 * @param args 请求配置参数，详解如下
	 * @param url:请求地址，必选
	 * @param data:请求参数，默认使用JSON.stringify()转为json对象，必选
	 * @param type:请求方式，默认POST，可选
	 * @param dataType:响应数据类型，默认json，可选
	 * @param contentType:请求参数数据类型，默认json， 可以是form，可选
	 * @param loading:是否需要loading加载框，默认不显示，配置loading:true则显示，可选
	 * @param success:请求成功回调，必选
	 * @param error:请求失败回调，可选
	 */
	ajax:function(args){
        var layerIndex;
		if(args.loading){
			 layerIndex = U.loading();
		}
		var params = args.data;
		var contentType = "application/x-www-form-urlencoded; charset=UTF-8";

        if (args.contentType == "json") {
            contentType = "application/json; charset=UTF-8";
            params = JSON.stringify(args.data);
        } else if (args.contentType) {
            contentType = args.contentType;
        }

		$.ajax({
			async : args.async || true,
	        url: args.url,
			type:args.type || "POST",
			//timeout: 30000, //超时时间：30秒
			dataType:args.dataType || "json",
	        contentType: contentType,//必须有application/x-www-form-urlencoded; charset=UTF-8
	        data: params, //JSON.stringify({ 'foo': 'foovalue', 'bar': 'barvalue' }),  //相当于 //data: "{'str1':'foovalue', 'str2':'barvalue'}",
	        success: function(data,status){
				if(data==null){
                    U.showError("服务器异常：响应结果为空");
				}else {
                    args.success(data,status);
                }
	        	if(args.loading){
	    			U.closeLoading(layerIndex);
	    		}
	        },
	        error: function (xhr, statusText, err) {	        	
	        	if(args.loading){
	        		U.closeLoading(layerIndex);
	        	}
	        	if(args.error){
	        		args.error(xhr, statusText, err);
	        	}else{
	        		U.showError("服务器异常");
	        	}
	        },
	        complete:function(xhr,status){
	        	if(status!='success'){
	        		U.showError("服务器异常");//泛指服务器连接不上,网络卡顿,超时...
	        	}	        	
	        },
	        /*请求头设置*/
	        headers: {
	            "X-Api-Version":"1",//接口API版本
	            "X-User-Agent":"WEB",//WEB=key
	            "X-User-OrgID":1,//所属机构ID，写死湖大=1
	            "X-Client-Language":"zh"//语言
	        }
	    });
	},
    get: function (args) {
        args.type = 'GET';
		U.ajax(args);
    },
    post: function (args) {
        args.type = 'POST';
        U.ajax(args);
    },
    put: function (args) {
        args.type = 'PUT';
        U.ajax(args);
    },
    delete: function (args) {
        args.type = 'DELETE';
        U.ajax(args);
    },

	/**
	 * 将ajax请求结果用指定模板类容解析到指定的容器内
	 * @param  async 是否异步，默认为true
	 * @param  url 请求URL
	 * @param  type 请求类型，默认为POST
	 * @param  data 请求参数
	 * @param  success 解析成功后的回调函数
	 * @param  replace 是否替换，默认为true（true or fasle），true=全部替换，fasle = 在内容后面追加
	 * @return {[type]}      [description]
	 */
	tmpl:function(args){
        var layerIndex;
        if(args.loading){
            layerIndex = U.loading();
        }

		var isReplace = args.replace == undefined ? true : args.replace;//是否替换（replace or append）
		var async = args.async == undefined ? true : args.async;

        var params = args.data;
        var contentType = "application/x-www-form-urlencoded; charset=UTF-8";

        if (args.contentType == "json") {
            contentType = "application/json; charset=UTF-8";
            params = JSON.stringify(args.data);
        } else if (args.contentType) {
            contentType = args.contentType;
        }


		$.ajax({
			async:true,
	        url: args.url,
			type:args.type || "POST",
			dataType:args.dataType || "json",
	        contentType: contentType,//必须有
	        data: params, //JSON.stringify({ 'foo': 'foovalue', 'bar': 'barvalue' }),  //相当于 //data: "{'str1':'foovalue', 'str2':'barvalue'}",
	        success: function(data,status){
	        	//解析模板前的回调函数
				if(args.before){
					args.before(data,status);
				}

	        	var html = template(args.tmplId, data);
	        	//替换 or 追加
				if(isReplace){
					// document.getElementById('group_container').innerHTML = html;
					$('#'+args.containerId).html(html);
				}else{
					$('#'+args.containerId).append(html);
				}

				//解析执行成功后的回调函数
				if(args.after){
					args.after(data,status);
				}

                if(args.loading){
                    U.closeLoading(layerIndex);
                }
	        },
	        error: args.error || function (xhr, statusText, err) {
                if(args.loading){
                    U.closeLoading(layerIndex);
                }
                U.showError("服务器异常");//请求失败
	        }
	    });
	},
	getUrlParam:function(paramName) {//获取url参数
		var url = window.location.href;
		var oRegex = new RegExp('[\?&]' + paramName + '=([^&]+)', 'i');
		var oMatch = oRegex.exec(url);
		if (oMatch && oMatch.length > 1) {
			return decodeURI(oMatch[1]);
		} else {
			return "";
		}
	},
	isEmpty:function(obj) {//判断是否空值
		if (obj == null) {
			return true;
		} else if ( typeof (obj) == "undefined") {
			return true;
		}else if(obj == "undefined"){
			return true;
		} else if (obj == "") {
			return true;
		} else if ($.trim(obj) == "") {
			return true;
		} else if (obj.length == 0) {
			return true;
		} else {
			return false;
		}
	},
	trim:function(obj) {//去空格
		if (obj == null) {
			return "";
		} else if ( typeof (obj) == "undefined") {
			return "";
		} else if (obj == "") {
			return "";
		} else if ($.trim(obj) == "") {
			return "";
		} else {
			return obj;
		}
	},
	formatIdNullOrEmpty:function(obj) {//处理ID是空的情况
		if (obj == null) {
			return "";
		} else if ( typeof (obj) == "undefined") {
			return "";
		} else if (obj == "") {
			return "";
		} else if ($.trim(obj) == "") {
			return "";
		}else if ( obj == "null") {
			return "";
		} else {
			return obj;
		}
	},
    loading:function(){
        //加载层-风格3
        var index = layer.load(2);
        return index;
    },
    closeLoading:function(index){
        layer.close(index); //此时你只需要把获得的index，轻轻地赋予layer.close即可
    },   
    //======================================各类提示=====================================
    //===================================================================================
    msg:function(msg){
    	//提示层
    	layer.msg(msg, {
    		/*	    icon: 6,*/
    		time: 3000 //2秒关闭（如果不配置，默认是3秒）
    	});
    },   
    tips:function(msg, element){
        //小tips
        layer.tips(msg, element, {
            tips: [2, '#FF9900'],
            time: 1500,
            tipsMore: true
        });
    },
    //可配置提示
    show:function(options){
    	$.message({
        	message:options.msg || '操作成功',    
    		duration:options.seconds || '3000',          
    		type:options.type || 'info',                
    		showClose:options.isClose || false,        
    		center:options.isCenter || true,              
    		onClose:options.fn,             
        });
    },
    //信息提示
    showInfo:function(msg){
    	$.message({
    		message: msg || '提示',          
    		type:'info'          
    	});
    },
    //成功提示
    showSuccess:function(msg){
    	$.message({
    		message: msg || '成功',          
    		type:'success'          
    	});
    },
    //错误提示
    showError:function(msg){
    	$.message({
    		message: msg || '错误',          
    		type:'error'          
    	});
    },
    //警告提示
    showWarning:function(msg){
    	$.message({
    		message: msg || '警告',          
    		type:'warning'          
    	});
    },
    //======================================数值处理=====================================
    //===================================================================================
    //货币转数字，将1,234,567.00转换为1234567
    formatToNubmer:function(money) {
        var num = val.trim();
        var ss = num.toString();
        if (ss.length == 0) {
            return "0";
        }
        return ss.replace(/,/g, "");
    },     
    //数字转货币，fmoney("12345.675910", 3)，返回12,345.67
    //保留两位小数并且整数部分三位一个逗号分隔符的数字金钱标准表示法：
    //这里假设我们即不知道输入数字的整数位数，也不知道小数位数
    formatToMoney:function(number) {
    	if(number && number!=null){  
    		number = String(number);
            var left=number.split('.')[0],right=number.split('.')[1];
                right = right ? (right.length>=2 ? '.'+right.substr(0,2) : '.'+right+'0') : '.00';
            var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
            return (Number(number)<0?"-":"") + temp.join(',').split('').reverse().join('')+right;
        }else if(number===0){   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
            return '0.00';
        }else{
            return "";
        }
    },
    
    // --身份证号码验证-支持新的带x身份证
    isIdCardNo:function(num){
	     var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
	     var error;
	     var varArray = new Array();
	     var intValue;
	     var lngProduct = 0;
	     var intCheckDigit;
	     var intStrLen = num.length;
	     var idNumber = num;
	   
	     if ((intStrLen != 15) && (intStrLen != 18)) {	       
	    	 return false; // error = "输入身份证号码长度不对！";	
	     }

	     // check and set value
	     for (i = 0; i < intStrLen; i++) {
		      varArray[i] = idNumber.charAt(i);
		      if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {	
		    	  return false;// error = "错误的身份证号码！.";
		      } else if (i < 17) {
		    	  varArray[i] = varArray[i] * factorArr[i];
		      }	
	     }

	     if (intStrLen == 18) {
		      // 验证出生日期
		      var date8 = idNumber.substring(6, 14);
		      if (isDate8(date8) == false) {      
		    	  return false; // error = "身份证中日期信息不正确！.";
		      }
		     
		      for (i = 0; i < 17; i++) {
		    	  lngProduct = lngProduct + varArray[i];
		      }
		    
		      intCheckDigit = 12 - lngProduct % 11;
			      switch (intCheckDigit) {
			      case 10:
			       intCheckDigit = 'X';
			       break;
			      case 11:
			       intCheckDigit = 0;
			       break;
			      case 12:
			       intCheckDigit = 1;
			       break;
		      }
	
		      // check last digit
		      if (varArray[17].toUpperCase() != intCheckDigit) {      
		    	  return false; // error = "身份证效验位错误!...正确为： " + intCheckDigit + ".";
		      }
	     }else { 		     
		      var date6 = idNumber.substring(6, 12);
		      if (isDate6(date6) == false) {     
		    	  return false;  // alert("身份证日期信息有误！.");
		      }
         }   
     return true;
    },
    isValidIP:function(ip){   
	    var reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/   
	    return reg.test(ip);   
	}

};

