const PlayerTpl = function(){
    return `<a class="btn btn-default si_play" id="play" href="#" role="button">
                <i class="fa fa-play"></i>
            </a>
            <a class="btn btn-default si_stop hidden" id="stop" href="#" role="button">
                <i class="fa fa-stop"></i>
            </a>
            <span id="current-time">0:00</span>
            <span>/</span>
            <span id="duration">0:00</span>`;
};

export default PlayerTpl;