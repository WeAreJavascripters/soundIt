const RecorderTpl = function(){
    
    return `<div class="form-group">
                <label for="title">Title</label>
                <input type="text" class="form-control" id="title" placeholder="Enter title">
            </div>
            <div class="form-group">
                <a class="btn btn-danger si_Record" id="record" href="#" role="button">
                    <i class="fa fa-microphone"></i>
                    <span>Record</span>
                </a>
                <a class="btn btn-danger si_RecordStop hidden" id="stop-recording" href="#" role="button">
                    <i class="fa fa-microphone"></i>
                    <span>Stop</span>
                    <span class="countdown"></span> s.
                </a>
                <a class="btn btn-default si_deleteRecord hidden" id="delete" href="#" role="button">
                    <i class="fa fa-trash"></i>
                </a>
                <span class="hidden" id="loading">
                    Loading....
                </span>
                <span id="audio-container" class="hidden"></span>
                <button type="submit" class="pull-right btn btn-primary">Submit</button>
            </div>`;
};

export default RecorderTpl;
