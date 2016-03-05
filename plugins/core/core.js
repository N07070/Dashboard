function core() {
    $('#core').click(function() {
        var r = confirm("Are you sure you want to hide this card ?");
        if (r) {
            $('#core').addClass('hidden');
        }
    });
}
