﻿/// <reference path="jquery/1.9.1-vsdoc.js" />

$.extend({ mvc: {
    _ajax: $.ajax,
    /// <summary>
    ///     封装jquery的ajax，适合于MVC
    /// </summary>
    ///	<param name="setting" type="Object">
    ///		1: action - 同MVC中的action.
    ///		2: controller - 同MVC中的controller.
    ///     3: area - 同MVC中的area.
    ///		4: callback - 当成功获取时调用.
    ///     5：type - 默认为post，同jquery的type.
    ///		6: params - 发送到服务器的数据，同jquery的data.
    ///     7: beforeSend - 同Jquery，发送前调用
    ///     8: complete - 同Jquery，完成时调用
    ///     9: error - 同Jquery，出错时调用
    ///     10: sucess -同Jquery，成功时调用
    ///	</param>
    ajax: function (settings) {
        settings = settings || {};
        var action = settings.action || '_404';
        var controller = settings.controller || 'Error';
        var area = settings.area || '';
        if (area != '') {
            area = '/' + area;
        }
        var type = settings.type || "post";
        var params = settings.params || '';
        var url = area + '/' + controller + '/' + action;
        $.mvc._ajax(url, {
            type: type,
            data: params,
            beforeSend: settings.beforeSend || function (XMLHttpRequest) {
                console.log("beforeSend");
            },
            complete: settings.complete || function (XMLHttpRequest, textStatus) {
                console.log("complete");
            },
            error: settings.error || function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error");
            },
            success: settings.success || function (data, textStatus) {
                console.log("success");
            }
        });
    }
}
});
//sysxcode

$.extend($.mvc, { sysxcode: {
    /// 第二个参数 object 
    /// subnav是数据返回显示的元素id
    /// process 是对每个a元素进行处理，加样式等
    LoadPrimaryNav: function (id) {
        id = "#" + id;
        var settings = {};
        if (arguments.length == 2) {
            settings = arguments[1] || settings;
        }
        $.mvc.ajax({
            type: "post",
            action: "AdminNav",
            controller: "SysXCode",
            beforeSend: settings.beforeSend || function (XMLHttpRequest) {
                $(id).html("<img src='/images/loading2.jpg' title='载入中'/>");
            },
            success: settings.success || function (data, textStatus) {
                var ul = $("<ul></ul>");
                for (var nav in data) {
                    var item = data[nav];
                    var li = $("<li></li>");
                    var a = $("<a></a>");
                    a.on("click", { id: settings.subnav, xid: item.XID }, $.mvc.sysxcode.LoadSecondNav);
                    if (nav == data.length - 1) {
                        a.attr("class", "defaultLoad");
                    }
                    if (settings.process && typeof (settings.process) == "function") {
                        settings.process(a);
                    }
                    li.append(a.append(item.XName));
                    li.appendTo(ul);
                }
                $(id).empty().append(ul);
            },
            error: settings.error || function (XMLHttpRequest, textStatus, errorThrown) {
                $(id).html("请求失败，<a href='' onclick='LoadPrimaryNav()'> 点击重试 </a> ");
            },
            complete: settings.complete || function (XMLHttpRequest, textStatus) {
                $("a.defaultLoad").trigger("click");
            }
        });
    },
    LoadSecondNav: function (params) {
        var id = "#" + params.data.id;
        var settings = $.mvc.sysxcode.LoadSecondNav.settings || {};
        if (arguments.length == 2) {
            settings = arguments[1] || {};
        }
        $.mvc.ajax({
            type: "post",
            action: "SubNavOf",
            controller: "SysXCode",
            params: { ID: params.data.xid },
            beforeSend: settings.beforeSend || function (XMLHttpRequest) {
                $(id).html("<img src='/images/loading2.jpg' title='载入中'/>");
            },
            success: settings.success || function (data, textStatus) {
                if (!data && !data.length) {
                    $(id).html("服务器返回数据错误，<a href='' onclick='LoadSecondNav(" + params.data.XID + ")'> 点击重试 </a> ");
                }

                $(id).empty();
                try {
                    $(id).accordion("destroy");
                } catch (e) {
                }
                if (data.length == 0) {
                    data[0] = { empty: true };
                }
                $(id).html($("#SubNavTemplate").render(data));
                $(id).accordion();
            },
            error: settings.error || function (XMLHttpRequest, textStatus, errorThrown) {
                $(id).html("请求失败，<a href='' onclick='LoadSecondNav(" + params.data.xid + ")'> 点击重试 </a> ");
            },
            complete: settings.complete || function (XMLHttpRequest, textStatus) {
            }
        });
    }
}
});
$.mvc.sysxcode.LoadSecondNav.settings = { };
