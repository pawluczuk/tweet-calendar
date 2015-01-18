/**
 * Created by Muzyk on 2015-01-09.
 */

function createNotiify(response) {
    var alert = '<div class="alert alert-info fade in" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">×</span></button>' +
        '<h4>' + response + '</h4>';

    $("#create-notify").append(alert);
}