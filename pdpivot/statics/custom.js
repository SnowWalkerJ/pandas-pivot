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
function refresh_table(){
    var columns = '', values = '', index = '';
    var lis = $('#columns li');
    lis.each(function(i){
        columns += '|' + lis.eq(i).text();
    });
    var lis = $('#index li');
    lis.each(function(i){
        index += '|' + lis.eq(i).text();
    });
    var lis = $('#values li');
    lis.each(function(i){
        values += '|' + lis.eq(i).text();
    });
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