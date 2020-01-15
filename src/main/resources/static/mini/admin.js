// 获取本月第一天
function getCurrentMonthFirst(){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay;
}
// 获取本月最后一天
function getCurrentMonthLast(){
    var date = new Date();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay;
}

// 昨天
function getZt() {
    var day1 = new Date();
    day1.setTime(day1.getTime()-24*60*60*1000);
    return  day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
}

// 今天
function getJt() {
    var day2 = new Date();
    day2.setTime(day2.getTime());
    return day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();
}

// 上周
function getSz() {
    var day1 = new Date();
    day1.setTime(day1.getTime()-24*60*60*1000*6);
    return  day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
}

// 本周
function getBz() {
    var day1 = new Date();
    day1.setTime(day1.getTime()+24*60*60*1000*6);
    return  day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
}

/**
 * 这是时分秒的 dateTime
 */
function  loadDateTime(number) {
    var now = new Date();                    // 当前日期
    var nowDayOfWeek = now.getDay();         // 今天本周的第几天
    var nowDay = now.getDate();              // 当前日
    var nowMonth = now.getMonth();           // 当前月
    var nowYear = now.getYear();             // 当前年
    nowYear += (nowYear < 2000) ? 1900:0;
    var startDate = mini.get("startDate");
    var endDate = mini.get("endDate");
    if(number == 1){ // 今天
        now.setTime(now.getTime());
        var today = now.getFullYear()+"-" + (now.getMonth()+1) + "-" + now.getDate();
        startDate.setValue(today+" 00:00:00");
        endDate.setValue(today+" 23:59:59");
    }else if(number == 2){  // 昨天
        now.setTime(now.getTime()-24*60*60*1000);
        var yesterday = now.getFullYear()+"-" + (now.getMonth()+1) + "-" + now.getDate();
        startDate.setValue(yesterday+" 00:00:00");
        endDate.setValue(yesterday+" 23:59:59");
    }else if(number == 3){ // 本周
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1);
        startDate.setValue(weekStartDate+" 00:00:00");
        endDate.setValue(now.getFullYear()+"-" + (now.getMonth()+1) + "-" + now.getDate()+" 23:59:59");
    }else if(number == 4){ // 上周
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 6);
        var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek );
        startDate.setValue(weekStartDate+" 00:00:00");
        endDate.setValue(weekEndDate+" 23:59:59");
    }
}
//计算天数差的函数，通用  
function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是xxxx-xx-xx格式  
    var  aDate,  oDate1,  oDate2,  iDays
    aDate  =  sDate1.split("-")
    oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为xx-xx-xxxx格式  
    aDate  =  sDate2.split("-")
    oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数  
    return  iDays
}

// 隐藏 mini.open
function CloseWindow(action) {
    if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
    else window.close();
}

function onCancel(e) {
    CloseWindow("cancel");
}


function rowDelete(opt) {
    var grid = opt.grid,url=opt.url;
    var rows = grid.getSelecteds();
    if (rows.length > 0) {
        var msgInfo = "您确定要删除选中的记录么？删除后将不可恢复，请慎重操作！";
        if (opt.msg){
            msgInfo = opt.msg;
        }
        layer.confirm(msgInfo,{icon:0,title:'是否确定要删除？'},function () {
            var id = "id";
            if (opt.id){
                id = opt.id;
            }
            var ids = $.toIdArray(rows,id);
            $.ajax({
                type:'post',
                url: url,
                data:{ids:ids},
                dataType:"json",
                success:function(res) {
                    if(res.code == 0){
                        layer.msg("删除成功",{icon:1});
                        if (opt.callBack){
                            if(typeof(eval(opt.callBack)) == "function"){
                                opt.callBack.apply();
                            }
                        } else{
                            grid.reload();
                        }
                    }else{
                        layer.alert(res.msg);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    layer.alert(jqXHR.responseText);
                }
            });
        });
    } else {
        lay.warn("请最少选中一条记录进行删除");
    }
}

var lay ={
    error:function (msg) {
        layer.msg(msg,{icon:2});
    },
    warn:function(msg){
        layer.msg(msg,{icon:0});
    },
    saveSuccess:function (msg) {
        var msgInfo = msg || '数据保存成功';
        layer.msg(msgInfo,{icon:1});
    }
};

(function ($) {
    $.extend({
        toIdArray:function(array,idName,objName){
            var ids = [];
            $.each(array,function (i,v) {
                if (idName && objName){
                    ids.push(v[objName][idName]);
                }else{
                    if (!idName){
                        idName = "id";
                    }

                    ids.push(v[idName]);
                }

            });
            return ids;
        },
        fullscreen: function (e) {
            var a = "fa-arrows-alt", i = "fa-compress", t = e.children("i");
            if (t.hasClass(a)) {
                var n = document.body;
                n.webkitRequestFullScreen ? n.webkitRequestFullScreen() : n.mozRequestFullScreen ? n.mozRequestFullScreen() : n.requestFullScreen && n.requestFullscreen(), t.addClass(i).removeClass(a)
            } else {
                var n = document;
                n.webkitCancelFullScreen ? n.webkitCancelFullScreen() : n.mozCancelFullScreen ? n.mozCancelFullScreen() : n.cancelFullScreen ? n.cancelFullScreen() : n.exitFullscreen && n.exitFullscreen(), t.addClass(a).removeClass(i)
            }
        },
        //设备信息
        device: function(key){
            var agent = navigator.userAgent.toLowerCase()
                //获取版本号
                ,getVersion = function(label){
                    var exp = new RegExp(label + '/([^\\s\\_\\-]+)');
                    label = (agent.match(exp)||[])[1];
                    return label || false;
                }
                //返回结果集
                ,result = {
                    os: function(){ //底层操作系统
                        if(/windows/.test(agent)){
                            return 'windows';
                        } else if(/linux/.test(agent)){
                            return 'linux';
                        } else if(/iphone|ipod|ipad|ios/.test(agent)){
                            return 'ios';
                        } else if(/mac/.test(agent)){
                            return 'mac';
                        }
                    }()
                    ,ie: function(){ //ie版本
                        return (!!window.ActiveXObject || "ActiveXObject" in window) ? (
                            (agent.match(/msie\s(\d+)/) || [])[1] || '11' //由于ie11并没有msie的标识
                        ) : false;
                    }()
                    ,weixin: getVersion('micromessenger')  //是否微信
                };

            //任意的key
            if(key && !result[key]){
                result[key] = getVersion(key);
            }

            //移动设备
            result.android = /android/.test(agent);
            result.ios = result.os === 'ios';

            return result;
        },
        getNumber:function(str){
            return str.replace(/[^0-9]/g,'');
        },
        //arrayToTree: function (j, n, d, m) {
        arrayToTree: function (data, id, pid) {
            var children  = "children";
            id = id || "id";
            pid = pid || "pid";
            var treeList = [];
            var itemData = {};
            for (var i = 0; i<data.length; i++) {
                var item = data[i];
                if (!item) {
                    continue
                }
                var itemId = item[id];
                if (itemId !== null && itemId !== undefined) {
                    itemData[itemId] = item
                }
                delete item[children];
            }
            for (var i = 0; i<data.length; i++) {
                var item = data[i];
                var parentItem = itemData[item[pid]];
                //如果不存在上级，则说明是一级
                if (!parentItem) {
                    treeList.push(item);
                    continue
                }
                //如果有上级，将当前的数据添加为下级数据
                if (!parentItem[children]) {
                    parentItem[children] = []
                }
                parentItem[children].push(item);
            }
            return treeList;
        }
    })
})(jQuery);

// 取消
function cancelRow(type) {
    mini.get(type).hide();
}

// 提示语句mask
function mask(msg) {
    mini.mask({
        el: document.body,
        cls: 'mini-mask-loading',
        html: msg
    });
}

// 关闭mask
function unmask() {
    mini.unmask();
}