var _fields;
function init_fields(data){
    _fields = data;
    for (var i = 0; i < data.length; ++i) {
        var item = data[i];
        var name = item['name'], type = item['type'];
        if (type == 'category') {
            var unique = item['unique'];
        }
        $('#idle-fields').append('<li class="' + type + '" id="' + name + '><a href="#">' + name + '</a></li>\n');
        
    }
}

function get_fields(selector){
    var data = '';
    var lis = $(selector + ' li');
    lis.each(function(i){
        data += '|' + lis.eq(i).text();
    });
    return data
}

function refresh_table(){
    var columns = get_fields('#columns'),
        values  = get_fields('#values'),
        index   = get_fields('#index');
    var method = $("#aggfunc>option:selected").val();
    Backend.refresh_table(columns, index, values, method);
}
$(function(){
    $("#index, #columns, #idle-fields, #values").sortable({
        'connectWith': '.fields',
        'update': function(event, ui){
            refresh_table();
        }
    }).disableSelection();
    $("#index, #columns").on("sortreceive", function(event, ui){
        console.log("event triggered");
        if ($(ui.item[0]).hasClass("numeric")){
            console.log("item identified");
            $(".fields").sortable("cancel");
        }
    });
    $("#aggfunc").change(refresh_table);
});
$(function(){
    Backend.get_fields();
    refresh_table();
});