var stb = gSTB,
v_idx = 0,
h_idx = 0,
cur_page = 0,
cur_volume = 0,
standby = false,
channel_set = false,
button_blocked = false,
debug = false,
update_enable = false,
update_url250 = 'http://mag.infomir.com.ua/250/imageupdate',
update_url200 = '';
var channelsObj = [
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"},
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"},
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"},
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"},
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"},
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"},
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"},
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"},
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"},
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"},
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"},
                   {"name":"MBI","solution":"","url":"auto udp://239.10.10.1:50000"},
                   {"name":"CSPAN","solution":"","url":"auto udp://239.10.10.2:50000"},
                   {"name":"ESPN","solution":"","url":"auto udp://239.10.10.3:50000"}
                   ];
function init(){
    stb.InitPlayer();
    stb.SetBufferSize(4000,2000000);
    var model = stb.RDir("Model ");
    if(update_enable && ((model == 'MAG250' && update_url250 != '')||(model == 'MAG200' && update_url200 != ''))){
        var locupdateurl = stb.RDir('getenv autoupdateURL');
        if(locupdateurl == ''){
            stb.RDir('setenv autoupdate_cond 2');
        }
        if(model == 'MAG200'){
            update_url = update_url200;
        }else{
            update_url = update_url250;
        }
        startUpdating();
    }
    try{cur_volume = parseInt(stb.RDir('getenv audio_initial_volume'));}catch(e){log(e);cur_volume = 100;stb.RDir('setenv audio_initial_volume 70');}
    if(isNaN(cur_volume)){cur_volume = 100;stb.RDir('setenv audio_initial_volume 70');}
    for(var i = 0;i<6;i++){
        for(var y = 0;y<6;y++){
            document.getElementById(i+''+y).style.WebkitTransform = 'scale(0.75)';
        }
    }
    menuItem_Select();
    stb.EnableServiceButton(true);
    stb.EnableVKButton(true);
    win = {
        "width":screen.width,
        "height":screen.height
    };
    stb.SetTopWin(0);
    resize(win.height);
}
var update_url = '';
function resize(res){
    var new_width = 0,
        new_height = 0;
    switch(res){
        case 480:
            new_width = '200';
            new_height = '200';
        break;
        case 576:
            new_width = '200';
            new_height = '200';
        break;
        case 720:
            new_width = '200';
            new_height = '200';
        break;
        case 1080:
            new_width = '200';
            new_height = '200';
        break;
    }
    for(var i = 0;i<6;i++){
        for(var y = 0;y<6;y++){
            document.getElementById(i+''+y).getElementsByTagName('a')[0].getElementsByTagName('img')[0].width = new_width;
            document.getElementById(i+''+y).getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = new_height;
        }
    }
	document.body.style.display = 'block';
}
footer_hide_tmo = 0;
function body_keyDown(e){
    var key = e.keyCode || e.which;
    log(key);
    if(button_blocked){e.preventDefault();return;}
    switch(key){
        case 13:
            e.preventDefault();
            log('TARGET: '+e.target);
            document.getElementById('mainpage').style.display = 'none';
            document.getElementById('player_layer').style.display = 'block';
            document.getElementById("volume_line").style.width = (cur_volume*2-5) + 'px';
            document.getElementById("volume_cnt").innerHTML = (cur_volume) + '%';
            stb.Play(channelsObj[v_idx*6+h_idx].url);
            document.body.onkeydown = player_keyDown;
            document.getElementById('info_footer_text').innerHTML = (v_idx*6+h_idx+1)+'. '+channelsObj[v_idx*6+h_idx].name;
            footer_hide_tmo = window.setTimeout(function(){document.getElementById('info_footer').style.display = 'none';}, 4000);
            volume_timer = window.setTimeout(function(){document.getElementById('volume_form').style.display = 'none';},1000)
        break;
        case 37:
            menuItem_unSelect()
            h_idx>0?h_idx--:h_idx;
            menuItem_Select()
            log('left');
        break;
        case 38:
            menuItem_unSelect()
            v_idx>0?v_idx--:v_idx;
            menuItem_Select()
            log('up');
        break;
        case 39:
            menuItem_unSelect()
            h_idx<5?h_idx++:h_idx;
            menuItem_Select()
            log('right');
        break;
        case 40:
            menuItem_unSelect()
            v_idx<5?v_idx++:v_idx;
            menuItem_Select()
            log('down');
        break;
        case 85:
            if(event.altKey){
                if(standby == false){
                    standby = true;
                    stb.StandBy(true);
                    stb.ExecAction('front_panel led-on');}
                else{
                    stb.StandBy(false);
                    standby = false;
                    stb.ExecAction('front_panel led-off');
                }
        
            }
        break;
        case 57:
            document.getElementById('00').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
            document.getElementById('01').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
            document.getElementById('02').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
            document.getElementById('03').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
            document.getElementById('04').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
            document.getElementById('05').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
        break;
    }
}
function menuItem_Select(){
  document.getElementById(v_idx+''+h_idx).style.WebkitTransform = 'scale(1.25)';
  
  //document.getElementById(v_idx+''+h_idx).style.visibility = "visible";

}

function menuItem_unSelect(){
  document.getElementById(v_idx+''+h_idx).style.WebkitTransform = 'scale(1)';
  
  //document.getElementById(v_idx+''+h_idx).style.visibility = "visible";

}
chan_tmo = 0;
volume_timer = 0;
function player_keyDown(e){
    var key = e.keyCode || e.which;
    log('player_key'+ key);
    switch(key){
        case 8:     //Back
        case 27:    //Exit
        case 83:    //Stop
            document.getElementById('player_layer').style.display = 'none';
            document.getElementById('mainpage').style.display = 'block';
            stb.Stop();
            document.body.onkeydown = body_keyDown;
        break;
        case 13:    //Ok
            e.preventDefault();
            if(channel_set){
                clearTimeout(chan_tmo);
                stb.Play(channelsObj[parseInt(document.getElementById('chan_num').innerHTML)-1].url);
                clearTimeout(footer_hide_tmo);
                document.getElementById('info_footer').style.display = 'block';
                document.getElementById('info_footer_text').innerHTML = (parseInt(document.getElementById('chan_num').innerHTML))+'. '+channelsObj[parseInt(document.getElementById('chan_num').innerHTML)-1].name;
                footer_hide_tmo = window.setTimeout(function(){document.getElementById('info_footer').style.display = 'none';}, 4000);
                menuItem_unSelect()
                v_idx = (parseInt(document.getElementById('chan_num').innerHTML)-1)/6 - ((parseInt(document.getElementById('chan_num').innerHTML,10)-1)/6)%1;
                h_idx = (parseInt(document.getElementById('chan_num').innerHTML)-1)%6 - ((parseInt(document.getElementById('chan_num').innerHTML,10)-1)%6)%1;
                menuItem_Select();
                log(v_idx+' '+h_idx);
                document.getElementById('chan_num').innerHTML = '';
                channel_set = false;
            }
        break;
        case 9:
            log(e.ctrlKey);
            if(e.shiftKey){
                log('down');
                menuItem_unSelect()
                if(h_idx>0){h_idx--}else{
                    if(v_idx>0){v_idx--;h_idx=5}
                }
                menuItem_Select();
                stb.Play(channelsObj[v_idx*6+h_idx].url);
                clearTimeout(footer_hide_tmo);
                document.getElementById('info_footer').style.display = 'block';
                document.getElementById('info_footer_text').innerHTML = (v_idx*6+h_idx+1)+'. '+channelsObj[v_idx*6+h_idx].name;
                footer_hide_tmo = window.setTimeout(function(){document.getElementById('info_footer').style.display = 'none';}, 4000);
            }else{
                log('up');
                menuItem_unSelect()
                if(h_idx<5){h_idx++}else{
                    if(v_idx<5){v_idx++;h_idx=0}
                }
                menuItem_Select();
                stb.Play(channelsObj[v_idx*6+h_idx].url);
                clearTimeout(footer_hide_tmo);
                document.getElementById('info_footer').style.display = 'block';
                document.getElementById('info_footer_text').innerHTML = (v_idx*6+h_idx+1)+'. '+channelsObj[v_idx*6+h_idx].name;
                footer_hide_tmo = window.setTimeout(function(){document.getElementById('info_footer').style.display = 'none';}, 4000);
            }
        break;
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
            channel_set = true;
            clearTimeout(chan_tmo);
            var digit = key - 48;
            document.getElementById('chan_num').innerHTML += digit;
            if(parseInt(document.getElementById('chan_num').innerHTML, 10)<channelsObj.length){
                
            }else{
                document.getElementById('chan_num').innerHTML = channelsObj.length;
            }
            chan_tmo = window.setTimeout(function(){
                log('\n\nMUST NOt SEE THIS\n');
                stb.Play(channelsObj[parseInt(document.getElementById('chan_num').innerHTML)-1].url);
                clearTimeout(footer_hide_tmo);
                document.getElementById('info_footer').style.display = 'block';
                document.getElementById('info_footer_text').innerHTML = (parseInt(document.getElementById('chan_num').innerHTML))+'. '+channelsObj[parseInt(document.getElementById('chan_num').innerHTML)-1].name;
                footer_hide_tmo = window.setTimeout(function(){document.getElementById('info_footer').style.display = 'none';}, 4000);
                menuItem_unSelect()
                v_idx = (parseInt(document.getElementById('chan_num').innerHTML)-1)/6 - ((parseInt(document.getElementById('chan_num').innerHTML,10)-1)/6)%1;
                h_idx = (parseInt(document.getElementById('chan_num').innerHTML)-1)%6 - ((parseInt(document.getElementById('chan_num').innerHTML,10)-1)%6)%1;
                menuItem_Select();
                log(v_idx+' '+h_idx);
                document.getElementById('chan_num').innerHTML = '';
                channel_set = false;
            }, 3000)
            
        break;
        case 40:
            menuItem_unSelect()
            if(h_idx>0){h_idx--}else{
                if(v_idx>0){v_idx--;h_idx=5}
            }
            menuItem_Select();
            stb.Stop();
            stb.Play(channelsObj[v_idx*6+h_idx].url);
            clearTimeout(footer_hide_tmo);
            document.getElementById('info_footer').style.display = 'block';
            document.getElementById('info_footer_text').innerHTML = (v_idx*6+h_idx+1)+'. '+channelsObj[v_idx*6+h_idx].name;
            footer_hide_tmo = window.setTimeout(function(){document.getElementById('info_footer').style.display = 'none';}, 4000);
            log('up');
        break;
        case 38:
            menuItem_unSelect()
            if(h_idx<5){h_idx++}else{
                if(v_idx<5){v_idx++;h_idx=0}
            }
            menuItem_Select();
            stb.Stop();
            stb.Play(channelsObj[v_idx*6+h_idx].url);
            clearTimeout(footer_hide_tmo);
            document.getElementById('info_footer').style.display = 'block';
            document.getElementById('info_footer_text').innerHTML = (v_idx*6+h_idx+1)+'. '+channelsObj[v_idx*6+h_idx].name;
            footer_hide_tmo = window.setTimeout(function(){document.getElementById('info_footer').style.display = 'none';}, 4000);
            log('down');
        break;
        case 109:
            clearTimeout(volume_timer);
            var mute = stb.GetMute();
            if(mute == 1){
                clearTimeout(volume_timer);
                document.getElementById('volume_form').style.display = 'block';
                document.getElementById('volume_cont').style.display = 'block';
                window.setTimeout(function(){document.getElementById('volume_form').style.display = 'none';
                    }, 2000);
                document.getElementById('mute').style.display = 'none';
            }
            if(cur_volume>4){cur_volume-=5}
            stb.SetVolume(cur_volume);
            document.getElementById('volume_form').style.display = 'block';
            document.getElementById("volume_line").style.width = (cur_volume*2-5) + 'px';
            document.getElementById("volume_cnt").innerHTML = (cur_volume) + '%';
            volume_timer = window.setTimeout(function(){document.getElementById('volume_form').style.display = 'none';
                }, 2000);
        break;
        case 107:
            clearTimeout(volume_timer);
            var mute = stb.GetMute();
            if(mute == 1){
                clearTimeout(volume_timer);
                document.getElementById('volume_form').style.display = 'block';
                document.getElementById('volume_cont').style.display = 'block';
                window.setTimeout(function(){document.getElementById('volume_form').style.display = 'none';
                    }, 2000);
                document.getElementById('mute').style.display = 'none';
            }
            if(cur_volume<96){cur_volume+=5}
            stb.SetVolume(cur_volume);
            document.getElementById('volume_form').style.display = 'block';
            document.getElementById("volume_line").style.width = (cur_volume*2-5) + 'px';
            document.getElementById("volume_cnt").innerHTML = (cur_volume) + '%';
            volume_timer = window.setTimeout(function(){document.getElementById('volume_form').style.display = 'none';
                }, 2000);
        break;
        case 85:
            if(event.altKey){
                if(standby == false){
                    standby = true;
                    stb.StandBy(true);
                    stb.ExecAction('front_panel led-on');
                    document.getElementById('mainpage').style.display = 'block';
                    stb.Stop();
                    document.body.onkeydown = body_keyDown;
                }
                else{
                    stb.StandBy(false);
                    standby = false;
                    stb.ExecAction('front_panel led-off');
                }
        
            }
        break;
        case 192:
            var mute = stb.GetMute();
            stb.SetMute(1 - mute);
            if(mute == 1){
                clearTimeout(volume_timer);
                document.getElementById('volume_form').style.display = 'block';
                document.getElementById('volume_cont').style.display = 'block';
                window.setTimeout(function(){document.getElementById('volume_form').style.display = 'none';
                    }, 2000);
                document.getElementById('mute').style.display = 'none';
            }else{
                clearTimeout(volume_timer);
                document.getElementById('volume_form').style.display = 'block';
                document.getElementById('volume_cont').style.display = 'none';
                document.getElementById('mute').style.display = 'block';
            }
        break;
    }
}

function startUpdating(){
    stbUpdate.startCheck(update_url);
    timerHandler();
}

function timerHandler(){
    if(stbUpdate.getStatus() == 21){
        autoupdate_init();
    }else{
        setTimeout(timerHandler, 1000);
    }
}

function autoupdate_init(){
    var cur_Imagedate = new Date();
    var date_str = stb.RDir("ImageDate").replace(/\n|\r/gm,'');
    cur_Imagedate.setTime(Date.parse(date_str.match(/\w{3}\s\w{3}\s\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/)+' '+date_str.match(/\d{4}/)));
    var last_Imagedate = new Date();
    last_Imagedate.setTime(Date.parse(stbUpdate.getImageDateStr().match(/\w{3}\s\w{3}\s\d{1,2}\s/)+''+stbUpdate.getImageDateStr().match(/\d{4}/)+' '+stbUpdate.getImageDateStr().match(/\d{1,2}:\d{1,2}:\d{1,2}/)));
    if(((last_Imagedate.getTime() > cur_Imagedate.getTime())||(isNaN(cur_Imagedate.getTime())))){
        var updateform_obj = {
            'tag':'div',
            'attrs':{
                'id':'update_form'
            },
            'child':[
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_label',
                        'html':'Autoupdate form'
                    }
                },
                {
                    'tag':'span',
                    'attrs':{
                        'html':'Current version',
                        'class':'update_text'
                    }
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_curver',
                        'html':isNaN(cur_Imagedate.getTime())?('Date : '):('Date : '+cur_Imagedate),
                        'class':'update_text',
                    }
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_curdescr',
                        'html':'Description : '+stb.RDir('ImageDescription'),
                        'class':'update_text',
                    }
                },
                {
                    'tag':'div',
                    'child':[
                        {
                            'tag':'span',
                            'attrs':{
                                'class':'update_text',
                                'html':'New version'
                            }
                        }
                    ]
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_newver',
                        'html':'Date : '+last_Imagedate,
                        'class':'update_text',
                    }
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_newdescr',
                        'html':'Description : '+stbUpdate.getImageDescStr(),
                        'class':'update_text',
                    }
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_prbar'
                    },
                    'child':[
                        {
                            'tag':'div',
                            'attrs':{
                                'id':'prbar_bg'
                            }
                        },
                        {
                            'tag':'div',
                            'attrs':{
                                'id':'prbar_line'
                            }
                        }
                    ]
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_msg',
                        'html':'Updating...',
                        'class':'update_text',
                    }
                },

            ]
        }
        document.body.appendChild(createHTMLTree(updateform_obj));
        button_blocked = true;
        //document.getElementById('update_newver').innerHTML = update_version_text+': '+update_list[(update_list.length-1)].name+'-'+update_list[(update_list.length-1)].type+' '+update_list[(update_list.length-1)].date.replace(/GMT\+\d\d\d\d/,'');
        //document.getElementById('update_newdescr').innerHTML = update_descr_text+': '+update_list[(update_list.length-1)].descr;
        e();
    }
}
function e(){
    if(stbUpdate.getStatus() == 21){
        window.setTimeout(function(){startUpdate()}, 1000);
    }else{
        var prlime_width = 560;
        document.getElementById('update_msg').innerHTML = stbUpdate.getStatusStr();
        document.getElementById('prbar_line').style.width = prlime_width*(stbUpdate.getPercents()/100)+'px';
        window.setTimeout(function(){e();}, 1000);            
    }
}



function log(text){
    if(debug){
        stb.Debug(text);
    }
}

function createHTMLTree(obj){
    var el = document.createElement(obj.tag);
    for(var key in obj.attrs) {
        if (obj.attrs.hasOwnProperty(key)){
            if(key!='html'){
                el.setAttribute(key, obj.attrs[key]);
            }else{
                el.innerHTML = obj.attrs[key];
            }
        }
    }
    if(typeof obj.child != 'undefined'){
        for(var i=0; i<obj.child.length; i++){
            el.appendChild(createHTMLTree(obj.child[i]));
        }
    }
    return el;
}

function startUpdate(){
    document.getElementById('update_msg').innerHTML = stbUpdate.getStatusStr();
    var prlime_width = 560;
    document.getElementById('prbar_line').style.width = prlime_width*(stbUpdate.getPercents()/100)+'px';
    var activeBank = stbUpdate.getActiveBank();
    var model = stb.RDir("Model ");
    if(model == 'MAG250'){
        if(activeBank == 1){
            stbUpdate.startUpdate(0, update_url250);
        }else{
            if(activeBank == 0){
                stbUpdate.startUpdate(1, update_url250);
            }else{
                stbUpdate.startUpdate(0, update_url250);
            }
        }
    }else{
        if(activeBank == -1){
            stbUpdate.startUpdate(0, update_url200);
        }else{
            if(stbUpdate.GetFlashBankCount() == 2){
                if(activeBank == 0){
                    stbUpdate.startUpdate(1, update_url200);
                }else{
                    stbUpdate.startUpdate(0, update_url200);
                }
            }else{
                document.body.removeChild(document.getElementById('update_form'));
                return;
            }

        }
    }
    e();
}
