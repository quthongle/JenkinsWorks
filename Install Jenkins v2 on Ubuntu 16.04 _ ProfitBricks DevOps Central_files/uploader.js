'use strict';

$(document).ready(function() {

    if(!$('[data-uploader="true"]').length) {
        return;
    }   

    var token       = $('[name="csrfmiddlewaretoken"]').get(0).value,
        textarea    = $('[data-uploader="true"]'),
        attachments = $('input#id_attachments');    

    var dropzone = new Dropzone('[data-uploader="true"]', {
        url: '/uploads/upload/',
        clickable: false,
        maxFilesize: 1, //in mb
        maxFiles: 8,
        parallelUploads: 4,
        uploadMultiple: true,
        autoProcessQueue: true,
        paramName: function() {
            return 'files[]'
        },
        acceptedFiles: 'image/jpeg, image/png, image/gif',
        init: function() {
            /**
             *  Prime the events in here
             */
            this.on('addedfiles', dzAddedFiles);
            this.on('sendingmultiple', dzSendingMultiple);
            this.on('maxfilesexceeded', this.removeFile);
            this.on('totaluploadprogress', dzTotalUploadProgress);
            this.on('error', dzError);
            this.on('successmultiple', dzSuccessMultiple);
        },
        dictInvalidFileType: 'Invalid file type. Please upload png, gif, jpg.',
        dictMaxFilesExceeded: 'Too many files. Please limit uploads to 4 files at a time.',
        dictFileTooBig: 'File size is too big. Please limit to 1mb.'
    });

    function dzAddedFiles() {
        $('#upload_alert').alert('close');
    };

    function dzSendingMultiple(files, xhr, formData) {
        formData.append('csrfmiddlewaretoken', token);
        textarea.prop('disabled', true);
        
        $('#markdown_editor').prepend(
            '<div id="progress" class="progress">'
            +   '<div class="progress-bar progress-bar-striped progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">'
            +       '0%'
            +   '</div>' +
            '</div>'
        );
    };

    function dzTotalUploadProgress(e) {
        var progress = Math.ceil(e);
        $('.progress-bar', '#progress').css({
            width: progress + '%'
        }).prop({
            'aria-valuenow': progress
        }).text(progress + '%');
    };

    function dzError(err, msg, xhr_problem) {
        $('#instructions').addClass('has-error');
        $('#markdown_editor').prepend(
            '<div id="upload_alert" class="alert alert-dismissable alert-danger fade in" role="alert">'
            +   '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
            +       '<span aria-hidden="true">&times;</span>'
            +   '</button>'
            +   '<strong id="upload_error">'
            +      msg
            +   '</strong>' +
            '</div>'
        );

        $('#upload_alert').on('closed.bs.alert', function() {
            $('#instructions').removeClass('has-error');
        });
    };

    function dzSuccessMultiple(files, serverResponse) {
        var destination = textarea.get(0),
            attached    = attachments.val().length === 0 ? [] : attachments.val().split(','), 
            uploads,
            markdownTag;

        textarea.prop('disabled', false);
        files.forEach(function(file) {
            dropzone.removeFile(file);
        });

        if(typeof (uploads = serverResponse.uploads) !== 'undefined') {
            uploads.forEach(function(upload) {
                markdownTag = '\n![INCLUDE_ALT_TEXT_HERE](' + upload.url + ' "INCLUDE_TITLE_HERE")\n';
                attached.push(upload.url);
                insertTextAtCursor(destination, markdownTag);
            });
            attachments.val(attached.join(','));
            setTimeout(function() {
                $('#progress').fadeOut(200).remove();
            }, 400);
            editors.id_body.refreshPreview();
        }
    };
});
