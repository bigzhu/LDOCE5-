// !!!!!!!!!!!!!!!!!!!!!!!!!!!!! script embedded in HTML !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// add platfrom infos to <span collinsbody>

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    embedd jQuery 3.2.1 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
/* beautify ignore:start */

/* beautify ignore:end */
// -------------------------------- END END END jQuery 3.2.1 -------------------------------

/* 中文Topic开启/隐藏 */
/* 开启:把下一句前面两条斜杠去掉; 隐藏：下一句前面加两条斜杠 */
// var lm5pp_topicChineseActive = true;

/* ================================================ */

jQuery.noConflict()(function ($) {
    const TAGSWITCHCN = '.LDOCE_switch_lang';
    const TAGSWITCHCNALL = '.LDOCE_switch_lang.switch_all';
    const TAGSWITCHCNCHILDREN = '.LDOCE_switch_lang.switch_children';
    const TAGSWITCHCNSIBLINGS = '.LDOCE_switch_lang.switch_siblings';
    const TAGSWITCHCNTAG = '.LDOCE_switch_lang.switch_children, .LDOCE_switch_lang.switch_siblings'

    const TAGSENSEFOLD = '.LDOCE5pp_sensefold';
    const TAGSENSEFOLDOTHER = '.LDOCE5pp_sensefold_other';
    const TAGCROSSSENSE = '.cross_sense';
    const TAGWORDFAMILY = '.LDOCE_word_family';

    const TAGCHINESSTEXT = '.cn_txt';

    var lm5pp_pagetype = 0;
    var lm5pp_clickDealy = 200;

    (function () {
        // log5p($('.entry_content').parent().html());
        if (typeof window.lm5pp_pageCount == 'undefined') {
            window.lm5pp_pageCount = 0
        }
        window.lm5pp_pageCount += 1;
        if (window.lm5pp_pageCount > 1) return;

        lm5pp_checkPlatform();
        // $('.lm5ppbody').addClass('android');
        lm5pp_extendJQuery();

        lm5pp_removePictureAndSound();

        // ********************************************
        lm5pp_topicSetup();

        lm5pp_multiwordsSetup();

        lm5pp_imageSetup();

        // ********************************************
        $('h1.pagetitle').each(function () {
            lm5pp_pagetype =
                Math.min(lm5pp_pagetype, $(this).attr('pagetype') === undefined ? 0 : parseInt($(this).attr('pagetype')));
        });

        // pagetype=3: online page
        if (lm5pp_pagetype != 3)
            lm5pp_switchChineseSetup();

        // hook tags for show/hide cross senses(phrase verbs)
        lm5pp_senseSetup();

        $('.wordfams > ' + TAGSENSEFOLD)
            .off().on("click", function () {
            $(this).toggleClass('foldsign_fold');
            $(this).nextAll('.LDOCE_word_family').first().lm5pp_toggle();
        })

        // double click setup
        lm5pp_dblSetup();

        // ...box show/hide,
        lm5pp_boxSetup();

        // version
        lm5pp_versionSetup();

        // ***************** menu ********************
        //lm5pp_menuSetup();
        //lm5pp_floatmenuSetup();

        // ***************** proncodes ***************
        lm5pp_HWDSetup();

        // ***************** proncodes ***************
        lm5pp_pronCodeSetup();

        // ***************** Tips window ***************
        // lm5pp_tipsSetup();

        // ***************** East Egg ***************
        lm5pp_easteggSetup();

        // ********************************************
        lm5pp_onlinePronSetup();

        // *****************
        $('.ldoceEntry img[base64],.ldoceEntry .crossRef.ldoce-show-image[base64]').each(function () {
            _base64 = $(this).attr('base64');
            if (_base64.substr(0, 6) == 'ldoce4')
                _base64 = $('#' + _base64).attr('base64');

            $(this).attr('src', _base64).removeAttr('base64');
        });

        lm5pp_anchorSetup();
        // 删除所有的 a
        //alert($("a[href*='illness']").prop("outerHTML"))
        // dic://
        //$("a[href^='dic://']").each(function(){
        //  alert($(this).prop("outerHTML"))
        //});
        // 真正删除无意义的写死的单词跳转, 避免单击显示中文时候误触
        $("a[class='defRef']").each(function(){
          $(this).replaceWith($(this).text());
        });
        //class="defRef"

        //$("a").removeAttr("href");

        $(window).scroll(); // trigger float logo

    })()

    function lm5pp_checkPlatform() {
        _class = '';
        _userAgent = navigator.userAgent.toLowerCase();
        if (_userAgent.indexOf('windows nt') >= 0) {
            _class += ' windowsnt';
        }
        if (_userAgent.indexOf('chrome') >= 0) {
            _class += ' chrome';
        }
        if (_userAgent.indexOf('goldendict') >= 0) {
            _class += ' goldendict';
        }
        if (_userAgent.indexOf('iphone') >= 0) {
            _class += ' iphone';
        }
        if (_userAgent.indexOf('ipad') >= 0) {
            _class += ' iphone';
        }
        if (_userAgent.indexOf('android') >= 0) {
            _class += ' android';
        }
        if (_class.indexOf('iphone') >= 0 || _class.indexOf('android') >= 0 || _class.indexOf('ipad') >= 0) {
            _class += ' mobile';
        }
        _ss = document.styleSheets;
        for (var i = 0, max = _ss.length; i < max; i++) {
            if (_ss[i].href && (_ss[i].href.toLowerCase().indexOf('main.css') >= 0)) {
                _class += ' eudic';
                break;
            }
        }
        ;
        // delete _ss;
        // _cc = '<' + 's' + 'p' + 'a' + 'n class="lm5ppbody' + _class + '"\\x3e'
        // document.write(_cc);
        $('.lm5ppbody').addClass(_class);
        // delete _class;
        // delete _userAgent;
    }

    function lm5pp_multiwordsSetup() {
        if (!lm5pp_isMultiwords()) {
            return;
        }

        // remove duplicate images
        var _images = new Array();
        $('.ldoce-show-image[src]').each(function () {
            var _src = $(this).attr('src');
            _src = _src.substring(_src.search('media'));
            if (_images.indexOf(_src) >= 0) {
                $(this).hide();
            } else {
                _images.push(_src);
            }
        });

        // merge menu items
        $('.lm5ppbody:last .lm5pp_popup')
            .prepend('<span></span>')
            .children('span:first')
            .append(
                $('.lm5pp_popupitem:has(.Head)'))
            .append($('.lm5pp_popupitem:has(#switch_online):first'))
            .append($('.lm5pp_popupitem:has(#switch_cn):first'))
            .append($('.lm5pp_popupitem:has(#switch_syllable):first'))
            .append($('.lm5pp_popupitem:has(.lm5pp_icon):first'))
            .append($('.lm5ppMenu_floatlogo:first'));

        $('.lm5ppbody:last .lm5pp_popup > span:last').remove();
        // .find('#menu_quit:first').nextAll('.lm5pp_popupitem').remove();


        $('.lm5ppbody:lt(-1)').find('.lm5pp_popup').remove();
        $('.entry_content:not(.topic):gt(0)').find('.dictionary_intro').remove();

    }

    function lm5pp_isMultiwords() {
        return ($('.lm5ppbody > .entry_content:not(.topic)').length > 1);
    }

    function lm5pp_menuSetup() {
        // initialize checked boxes
        $('#switch_syllable').prop("checked", $('.HWD .HYP').is(":visible"));

        if (!lm5pp_isChineseSwitch()) {
            $('#switch_cn').closest('.lm5pp_popupitem').hide();
        } else {
            $('#switch_cn').prop("checked", $('.ldoceEntry .Sense .cn_txt').is(":visible"));
        }

        if ($('.ldoceEntry .LDOCEVERSION_new').length == 0) {
            $('#switch_online').closest('.item').remove();
        } else {
            $('#switch_online').prop("checked", $('.ldoceEntry .LDOCEVERSION_new').is(":visible"));

            $('#lm5ppMenu_logo')
                .addClass("switch_version")
                .on('click.lm5ppMenu', lm5pp_toggleVersion);
        }

        // prevent default event handlers
        $('#switch_syllable, #switch_online, #switch_cn')
            .off('.itemClick').on('click.itemClick', false);

        $('.lm5pp_popupitem a[href]').off('.itemClick').on('click.itemClick', function (event) {
            event.preventDefault();
            scrollPosition($($(event.currentTarget).attr('href')));
        })

        $('#menu_quit').off('.itemClick').on('click.itemClick', function (event) {
            var _x = event.pageX - $('#icon_senseFold').offset().left
            if ((_x > 0)
                && (_x < $('#icon_senseFold').outerWidth() + 10)) {
                // console.log('in icon_senseFold');
                lm5pp_toggleAllCrossense();
                return;
            }
            _x = event.pageX - $('#icon_boxFold').offset().left
            if ((_x > 0)
                && (_x < $('#icon_boxFold').outerWidth() + 10)) {
                // console.log('in icon_boxFold');
                lm5pp_toggleAllBoxes();
                return;
            }
        })

        $('.lm5ppbody:last .lm5pp_popup').off('.itemClick')
            .on('click.itemClick', '.lm5pp_popupitem', function (event) {
                $(this)
                    .has('#switch_syllable').each(lm5pp_switchSyllable).end()
                    .has('#switch_cn').each(lm5pp_toggleChineseAll).end()
                    .has('#switch_online').each(lm5pp_toggleVersion);
                lm5pp_menuHide();
                // lm5pp_menuHide();
            });

    }

    function lm5pp_menuHide() {
        if (!lm5pp_isMenuShow())
            return;

        $('.lm5ppbody:last .active.lm5pp_popup').fadeTo(250, 0.1, function () {
            $(this).removeClass('active').css({'opacity': '', 'visibility': ''});
            // .removeAttr('style');
            $(window).off('.monitorFloatMenu');
            // $('#lm5ppMenu_logo').append($('#lm5ppMenu_items'));
            // $('.lm5ppbody:last').find('#logo_float').removeClass('menu_active');
            $(window).scroll();
        });
    }

    function lm5pp_menuShow() {
        if (!lm5pp_isMenuShow())
            return;

        $('.lm5ppbody:last .lm5pp_popup:not(.active)')
            .css({'opacity': 0, 'visibility': 'visible'})
            .fadeTo(250, 1, function () {
                $(this).addClass('active').css({'opacity': '', 'visibility': ''});
                // $(this).addClass('active').removeAttr('style');

                $(window).off('.monitorFloatMenu').on("click.monitorFloatMenu", function (event) {
                    if ($(event.target).closest('.lm5pp_popup').length == 0) {
                        // console.log('window.onclick');
                        lm5pp_menuHide();
                    }
                });
            });
    }

    var lm5pp_scrollTimer;
    const lm5pp_MENUSHOWHIDE = 1000;

    function lm5pp_floatmenuSetup() {
        // log5p('floatmenu');
        $('.lm5ppbody').first().append('<span id="location_zero" style="position: fixed; top:0; left:0"></span>')
            .append('<span id="location_zero_bottom" style="position: fixed; bottom:0; right:0"></span>');
        // $('.entry_content:last').append('<span id="lm5pp_location_relative" ' +
        //     'style="position:absolute; bottom:20px; right:10px;"></span>');
        if (!lm5pp_isMenuShow()) {
            // $('#logo_float').hide();
        }
        $('.entry_content:last').css('position', 'relative');
        var _originalBottom = parseInt($('.entry_content:last .lm5pp_popup').css('bottom'));
        var _originalRight = parseInt($('.entry_content:last .lm5pp_popup').css('right'));

        $(window).scroll(function () {
            clearTimeout(lm5pp_scrollTimer);
            lm5pp_scrollTimer = setTimeout(function () {
                lm5pp_menuHide();

                if (!lm5pp_isMenuShow()) {
                    // console.log('!lm5pp_isMenuShow -> fadeOut');
                    $('#logo_float.show').removeClass('show');

                    // $('#logo_float').lm5pp_fadeOut(lm5pp_MENUSHOWHIDE).off();
                    return;
                }

                // console.log('scroll');
                var _entryHeight = 0;
                $('.entry_content').each(function () {
                    _entryHeight += $(this).outerHeight();
                })

                var _top = $('.entry_content').first().offset().top;
                var _bottomOffset = 40;
                _bottomOffset = 0;
                var _bottom = _top + _entryHeight + _bottomOffset;
                var _zero_top = $('#location_zero').offset().top;

                // var _locate = $('#logo_float').offset().top;
                var _menu = $('.entry_content:last .lm5pp_popup'),
                    _menu_height = _menu.height();
                var _locate = _menu.offset().top + _menu_height;
                var _zero_bottom = _locate + parseInt(_menu.css('bottom'));
                _zero_bottom = $('#location_zero_bottom').offset().top;
                console.log("top:%d bottom:%d ztop:%d zbottom:%d loc:%d h:%d",
                    _top, _bottom, _zero_top, _zero_bottom, _locate, _menu.height);

                var _flag_show = ((_bottom - _zero_top) >= (_menu_height + 60));
                // console.log("%d %d %s",_bottom - _zero_top, _menu.height + 60, (_bottom - _zero_top) >= (_menu.height + 60));
                console.log("show:%s", _flag_show);
                if (_flag_show) {
                    // _flag_show = ((_top < _zero_top) && (_locate <= _bottom))
                    //     || (_top >= _zero_top && (_top - _zero_top) < (_zero_bottom - _zero_top) / 4)
                    _flag_show = ((_top < _zero_top)
                        || (_top >= _zero_top && (_zero_bottom - _top) >= (_menu_height + 60)))
                    console.log("show 2:%s", _flag_show);

                }
                if (_flag_show) {
                    // $('#logo_float').css('visibility', 'visible');
                    // log5p('float show');
                    // if ($('#logo_float').css('visibility') == 'visible')
                    //     $('#logo_float').css('visibility', 'hidden').css('visibility', 'visible')
                    // Goldendict workaround
                    var _offset = _zero_bottom - _bottom + 20
                    if (_offset < _originalBottom) {
                        _offset = _originalBottom;
                        if (_menu.css('position') != 'fixed')
                            _menu.css({"right": '', "position": "", "bottom": ""});
                    } else {
                        if (_menu.css('position') == 'fixed') {
                            var _right = $('#location_zero_bottom').offset().left
                                - ($('.entry_content:last').offset().left + $('.entry_content:last').outerWidth());
                            _menu.css({"right": _originalRight - _right, "bottom": '10px', "position": "absolute"})
                        }

                    }
                    // else {
                    //     _offset = _zero_bottom - _bottom - 10;
                    // }
                    $('#logo_float').not('.show').addClass('show');
                    // if (_offset != parseInt(_menu.css('bottom'))) {
                    //     _menu.animate({bottom: _offset}, 100);
                    // }
                    // $('#logo_float').show();
                    // if (lm5pp_isGoldendict()) {
                    //     $('#logo_float').css('visibility', 'hidden');
                    //     setTimeout(function () {
                    //         $('#logo_float').css('visibility', 'visible');
                    //         // $('#logo_float:hidden')
                    //         //     .lm5pp_fadeIn(lm5pp_MENUSHOWHIDE);
                    //     }, 100);
                    // } else {
                    //
                    //     $('#logo_float:hidden')
                    //         .lm5pp_fadeIn(lm5pp_MENUSHOWHIDE);
                    // }
                } else {
                    // log5p('float hide');
                    $('#logo_float.show').removeClass('show');
                    // $('#logo_float:visible')
                    //     .lm5pp_fadeOut(lm5pp_MENUSHOWHIDE);
                }
                // console.log('locate:' + _locate + ' top:' + _top + ' bottom:' + _bottom);
                // console.log('show_logo:' + _show_logo);

                $('#logo_float').off('.logo_float').on('click.logo_float', function () {
                    // console.log('logo_float click');
                    // if ($('.ldoce5pp-image-show:visible'.length)) return;
                    ($(this).closest('.active.lm5pp_popup').length) ? lm5pp_menuHide() : lm5pp_menuShow();

                    return false;
                });
            }, 300);
        });
    }

    function lm5pp_pronCodeSetup() {
        // click proncodes to pronounce
        if (!lm5pp_isMDDExist() && !lm5pp_isMobile()) {
            $('.ldoceEntry > .Head > a.PronCodes')
                .css('cursor', 'default').attr('href', '#')
                .on('click', function () {
                    return false;
                });
            return;
        }

        $('.ldoceEntry > .Head > a.PronCodes')
            .each(function () {
                var _selector = 'a.speaker[href!="{}"]'.replace('{}', $(this).attr('href'));
                if ($(this).siblings(_selector).length > 0) {
                    $(this).attr('hrefalt', $(this).siblings(_selector).attr('href'))
                }
            })
            .on('click.pronCode', function () {
                var _href = $(this).attr('href');
                if ($(this).is('[hrefalt]')) {
                    // var _selector = 'a.speaker[href!="{}"]'.replace('{}', $(this).attr('href'));
                    // console.log('href:' + $(this).siblings(_selector).attr('href'));
                    setTimeout(function (element, href) {
                        $(element).attr('href', href);
                    }, 200, this, $(this).attr('hrefalt'));

                    $(this).attr('hrefalt', _href);

                }
                if (lm5pp_isOnlinePron()) {
                    var _selector = 'a.speaker[href="{}"]'.replace('{}', _href);
                    $(this).siblings(_selector).trigger('click');
                    return false;
                }
            });
    }

    function lm5pp_versionSetup() {
        $('.ldoceEntry').find('.LDOCEVERSION_new, .LDOCEVERSIONLOGO_5, .LDOCEVERSIONLOGO_new').hide();
    }

    function lm5pp_HWDSetup() {
        if (lm5pp_isMenuShow() && $('.ldoceEntry > .Head > .HWD').length > 1) {
            $('.ldoceEntry > .Head > .HWD').css('cursor', 'pointer')
                .on('click.HWD', function () {
                    var _$HWDs = $('.ldoceEntry > .Head > .HWD:visible');
                    if (_$HWDs.length > 1) {
                        var _index = _$HWDs.index(this);
                        if (_index >= 0) {
                            _index += 1;
                            if (_index >= _$HWDs.length)
                                _index = 0;

                            // if (lm5pp_isBluedict()) {
                            //     var _id = _$HWDs.eq(_index).closest('.ldoceEntry').attr('id');
                            //     window.location.href = "entry://" + $(obj).attr('href');
                            //     return;
                            // }

                            // $(document).scrollTop(_$HWDs.eq(_index).offset().top);
                            scrollPosition(_$HWDs.eq(_index));
                        }
                    }
                })
        } else {
            $('.ldoceEntry > .Head > .HWD:has(.HYP)').css('cursor', 'pointer')
                .on('click.HWD', function () {
                    lm5pp_switchSyllable();
                })
        }
    }

    function lm5pp_switchChineseSetup() {
        if (!lm5pp_isChineseSwitch())
            return;

        // console.log('lm5pp_isChineseSwitch');

        $('.cn_txt').hide();
        $('.lm5ppMenu_title').addClass('en_show');

        if ($('.ldoceEntry .cn_txt').length != 0) {
            $('.lm5ppMenu_title').addClass('intro_active')
                .add(TAGSWITCHCNALL)
                .off('.lm5pp_lang')
                .on('click.lm5pp_lang', lm5pp_showChineseAll);

            lm5pp_tipsSetup($(TAGSWITCHCNALL).add('.lm5ppMenu_title'), function (element) {
                $('#lm5pp_tips').text('→ Show Chinese');
            });

            $(TAGSWITCHCNTAG)
                .off('.lm5pp_lang')
                .on('click.lm5pp_lang entry.lm5pp_lang', lm5pp_switchChinese)
                .css('cursor', 'pointer');
        }

        if ($('.topicCloud .cn_txt').length != 0) {
            $('.lm5ppTopic_title').addClass('intro_active')
                .off('.lm5pp_lang')
                .on('click.lm5pp_lang', function () {
                    $('.entry_content.topic .cn_txt').lm5pp_toggle();
                });
        }
    }

    function lm5pp_onlinePronSetup() {
        // log5p('OnlinePron:' + lm5pp_isOnlinePron() + " MDDExist:" + lm5pp_isMDDExist() + " mobile:" + lm5pp_isMobile());
        if (!lm5pp_isOnlinePron()) return;

        $('a.speaker[href$=".spx"]')
            .closest('.EXAMPLE.speaker').removeClass('speaker').end()
            .remove();

        $('.ldoceEntry').on('click.onlinePron', 'a.speaker[href$="mp3"][href*="media"]:not(.loading)', function () {
            // log5p('onclick onlinepron');
            /*  by author of Bluedict */
            // log5p('pron p');
            if (lm5pp_isBluedict() && false) {
                var _src = $(this).attr('href');
                _src = 'http://www.ldoceonline.com/' + _src.substring(_src.search('media'));
                var _audio = new Audio();
                _audio.src = _src;
                _audio.play();
                return;
            }
            /* END END END END */

            var _src = $(this).addClass('loading').attr('href');

            _src = 'http://www.ldoceonline.com/' + _src.substring(_src.search('media'));

            var _audio = new Audio();

            var _timeout = setTimeout(function (audioObj, loadingTag) {
                // log5p('timeout:' + audioObj);
                $(audioObj).trigger('abort', {timeout: null, loadingTag: loadingTag});
            }, 5000, _audio, this);

            /* networkState
            0 = NETWORK_EMPTY - audio/video has not yet been initialized
            1 = NETWORK_IDLE - audio/video is active and has selected a resource, but is not using the network
            2 = NETWORK_LOADING - browser is downloading data
            3 = NETWORK_NO_SOURCE - no audio/video source found

            readyState
            0 = HAVE_NOTHING - no information whether or not the audio/video is ready
            1 = HAVE_METADATA - metadata for the audio/video is ready
            2 = HAVE_CURRENT_DATA - data for the current playback position is available, but not enough data to play next frame/millisecond
            3 = HAVE_FUTURE_DATA - data for the current and at least the next frame is available
            4 = HAVE_ENOUGH_DATA - enough data available to start playing
            */
            var _event = 'play.play ended.play abort.play error.play';
            $(_audio)
                .on(_event, {timeout: _timeout, loadingTag: this}, function (event) {
                    // log5p(event.type + " net:"
                    //     + this.networkState + " ready:" + this.readyState);

                    clearTimeout(event.data.timeout);

                    if (event.type == 'play') return;

                    $(event.data.loadingTag).removeClass('loading');
                    $(this).off('.play').prop('autoplay', false);
                })
                // .prop('autoplay', true)
                .prop('src', _src);
            _audio.play();
            // log5p('ding dong');
            return false;
        });
    }

    function lm5pp_isChineseSwitch() {
        // console.log('background-repeat:' + $('.pagetitle').css('background-repeat') + ' length:' + $('.ldoceEntry .cn_txt').length);
        return ($('.pagetitle').css('background-repeat') == 'repeat-y'
            && $('.ldoceEntry .cn_txt, .cloud .cn_txt').length > 0);
    }

    var lm5pp_lastdblSetupClick = null;

    function lm5pp_dblSetup() {
        // return;

        $('.lm5ppbody').off('.lm5ppbody').on('click.lm5ppbody', function (event) {
            // console.log('target:' + $(event.target).attr('class'));
            if (lm5pp_lastdblSetupClick === event.target) return;
            lm5pp_lastdblSetupClick = event.target;
            setTimeout(function () {
                lm5pp_lastdblSetupClick = null;
            }, 500)

            if ($(event.target).closest('.ldoce-show-image').length) return false;

            $('.lm5ppBox, .Sense, .Subsense')
                .each(function () {
                    // console.log('classname:' + this.className + " " + $(this).offset().top + ' ' + ($(this).offset().top + $(this).height()));
                    if (($(this).offset().top < event.pageY)
                        && (($(this).offset().top + $(this).outerHeight()) > event.pageY)) {
                        // console.log('target:' + $(event.target).attr('class'));
                        var _element = $(this);
                        if (_element.is('.lm5ppBox')) {
                            if ($(event.target).filter('.EXAMPLE, .Exponent, .Collocate')
                                    .first()
                                    .children(TAGSWITCHCNTAG)
                                    .first().trigger('entry').length > 0) return false;

                            _element.children('.LDOCE5pp_sensefold')
                                .each(function () {
                                    // console.log('_top:' + $(this).offset().top + ' pageY:' + event.pageY);
                                    // console.log('_top:' + $(this).offset().top + ' pageY:' + event.pageY);
                                    if ($(this).offset().top < event.pageY
                                        && $(this).offset().top + $(this).outerHeight() >= event.pageY) {
                                        $(this).trigger('entry');
                                        return false;
                                    }
                                });
                            // if ($(event.target).is('.EXAMPLE')) {
                            //     $(event.target).children(TAGSWITCHCNCHILDREN).first().trigger('entry');
                            // }
                            // else if ($(event.target).is('.Exponent, .Collocate')) {
                            //     $(event.target).children(TAGSWITCHCNSIBLINGS).first().trigger('entry');
                            // }
                        } else if (_element.is('.Sense, .Subsense')) {
                            if ($(event.target)
                                    .filter('.EXAMPLE, .ErrorBox, .ColloExa, .GramExa, .Sense, .Subsense')
                                    .first()
                                    .children(TAGSWITCHCNTAG)
                                    .first()
                                    .trigger('entry').length > 0
                            ) return false;

                            if ($(event.target)
                                    .filter('.Sense, .Subsense')
                                    .first()
                                    .children(TAGSENSEFOLD)
                                    .first()
                                    .trigger('entry').length > 0
                            ) return false;


                            // if ($(event.target).is('.EXAMPLE, .ErrorBox')) {
                            //     $(event.target).children(TAGSWITCHCNCHILDREN).trigger('entry');
                            //     console.log($(event.target).find(TAGSWITCHCNCHILDREN).attr('class') + ':trigger dblclick');
                            // } else if ($(event.target).is('.ColloExa, .GramExa')) {
                            //     $(event.target).children(TAGSWITCHCNSIBLINGS).first().trigger('entry');
                            // } else if ($(event.target).is('.Sense, .Subsense')) {
                            //     if ($(event.target).children(TAGSWITCHCNSIBLINGS).first().trigger('entry').length == 0)
                            //         $(event.target).children(TAGSENSEFOLD).first().trigger('entry');
                            // } else
                            _element.children(TAGSENSEFOLD).each(function () {
                                // console.log('trigger fold');

                                if ($(this).offset().left > event.pageX
                                    && $(this).offset().top < event.pageY
                                    && $(this).offset().top + $(this).outerHeight() >= event.pageY) {
                                    // console.log('trigger fold');
                                    $(this).trigger('entry');
                                    return false;
                                }

                            })
                            // lm5pp_toggleAllCrossense(_element);
                        }
                        return false;
                    }
                });
        });
    }

    function lm5pp_switchSyllable() {
        $('.HWD .HYP').lm5pp_toggle();
        $('#switch_syllable').prop('checked', function (index, val) {
            return !val;
        });
    }

    var lm5pp_lastClick;

    function lm5pp_imageSetup() {
        // $('.ldoce5pp-image-small').css('cursor', 'zoom-out');
        $('.ldoce-show-image').click(function () {
            // var _id = $(this).attr('showid');
            if (this === lm5pp_lastClick) return;
            lm5pp_lastClick = this;

            if ($('.ldoce5pp-image-show').length == 0) {
                $('.entry_content').append('<div class="ldoce5pp-image-show"> </div>');
            }

            var _src = $(this).attr('src');
            $('.ldoce5pp-image-show:hidden').each(function () {
                $(this).css('background-image', 'url("' + _src + '")')
                    .lm5pp_show(0.5);

                setTimeout(function () {
                    lm5pp_lastClick = null;
                    $('.ldoce5pp-image-show:visible').off().one('click', function (event) {
                        $(this).lm5pp_hide(0.5);
                    })
                }, 200);
                return false;
            })

        });

        // $('.ldoce5pp-image-caption').click(function () {
        //     $('.ldoce5pp-image-show').lm5pp_hide();
        // });
    }

    var lm5pp_clickTimer;

    function lm5pp_boxSetup() {
        $('.BoxHide .BoxPanel').hide();

        $('.ldoceEntry').off('.boxControl')
            .on("click.boxControl entry.boxControl", '.lm5ppBox.BoxHide,.lm5ppBox:not(.BoxHide) .lm5ppBoxHead', function () {
                // console.log('click box');
                lm5pp_toggleBox($(this));
                return;

            });
    }

    var lm5pp_switchBox;

    function lm5pp_toggleBox($obj, actionUnfold) {
        var $box = $obj.closest('.lm5ppBox');
        if ($box.length) {
            // console.log('box length:' + $box.length);

            if ($box.length == 1) {
                var _box = $box.get(0);
                if (lm5pp_switchBox === _box) {
                    return;
                } else {
                    lm5pp_switchBox = _box;
                }
            }

            if (actionUnfold === undefined)
                actionUnfold = $box.hasClass('BoxHide');

            // if ($box.length == 1 && actionUnfold != $box.hasClass('BoxHide'))
            //     return;

            $box
                .filter(function () {
                    return actionUnfold == $(this).hasClass('BoxHide')
                })
                .toggleClass('BoxHide', !actionUnfold).children('.BoxPanel')
                .each(function () {
                    $(this).animate({height: 'toggle', opacity: 'toggle'}, 300, function () {

                    });

                }).end()
                .find('.LDOCE5pp_sensefold').toggleClass('foldsign_fold');

            // $box.find('.LDOCE5pp_sensefold').toggleClass('foldsign_fold');

            setTimeout(function () {
                lm5pp_switchBox = null;
            }, 300);

            $(window).scroll();
        }
    }

    var lm5pp_boxes;

    function lm5pp_toggleAllBoxes($obj) {
        if (lm5pp_boxes === undefined)
            lm5pp_boxes = $('.ldoceEntry .lm5ppBox');

        var _$target = lm5pp_boxes;
        var _actionUnfold;

        if (lm5pp_boxes.length == 0)
            return;

        if ($obj === undefined || !($obj instanceof jQuery)) {
            _actionUnfold = lm5pp_boxes.filter('.BoxHide').length / lm5pp_boxes.length >= 0.5;
        } else {
            _actionUnfold = !$obj.hasClass('BoxHide');
            // console.log('$obj.get(0) === lm5pp_switchBox:' + ($obj.get(0) === lm5pp_switchBox));
            if ($obj.get(0) === lm5pp_switchBox) {
                _$target = _$target.not($obj);
                _actionUnfold = !_actionUnfold;
                // lm5pp_switchBox = null;
            }
        }
        // console.log('lm5pp_toggleAllBoxes _actionUnfold:' + _actionUnfold);
        lm5pp_toggleBox(_$target, _actionUnfold);
    }

    function lm5pp_toggleVersion() {
        // hook logo on logo bar
        $('#switch_online').prop('checked', function (index, val) {
            // console.log('switch_online');
            $('#lm5ppMenu_logo, #logo_float, .lm5ppMenu_title')
                .toggleClass('goldlogo', !val);

            $('.ldoceEntry.LDOCEVERSION_new, .ldoceEntry .LDOCEVERSION_new').filter(lm5pp_ControlFilter)
                .add('.ldoceEntry [class*=LDOCEVERSIONLOGO_]')
                .lm5pp_toggle(!val);

            $('.lm5pp_popup').toggleClass('switch_version');

            $(window).scroll();
            return !val;
        });
    }

    function lm5pp_topicSetup() {
        if ($('.entry_content.topic').length > 0) {
            $('.cloud.full').hide();
            $('a.topic_other').off('.topic').on('click.topic', function () {
                $('.cloud').slideToggle();
                if ($(this).text().indexOf('all')) {
                    $(this).text($(this).text().replace('all entries', 'common entries'));
                    scrollPosition($('.lm5ppbody .topicCloud'));
                } else {
                    $(this).text($(this).text().replace('common entries', 'all entries'))
                }
                // .not('.full').slideToggle().fadeToggle().end()
                // .filter('.full').slideToggle();
                return false;
            });

            if ('undefined' != typeof lm5pp_topicChineseActive) {
                $('.entry_content.topic .cn_topic').addClass('cn_txt');
                $('.topic_intro').addClass('lm5ppTopic_title');
            } else {
                $('.entry_content.topic .cn_topic').hide();
            }
        }
    }

    function lm5pp_senseFilter(index) {
        return !$(this).is('.merge_sense') && $(this).is('.EXAMPLE, .GramExa, .ColloExa, ' +
            '.Crossref, .F2NBox, .Thesref, .GramBox, .Subsense, .Hint, .UsageBox, .Sense, .ErrorBox');
    }


    var lm5pp_senseTimer;
    var lm5pp_senseTimerFlag = false;

    function lm5pp_senseSetup() {
        $('.ldoceEntry')
            .off('.senseFold')
            .on("click.senseFold entry.senseFold", TAGSENSEFOLD + ':not(.fixed), ' + TAGSENSEFOLDOTHER, function (event) {
                // console.log('click which:' + event.which);
                if ($(this).parent().hasClass('lm5ppBox'))
                    return;

                if ($(this).parent().hasClass('SpokenSect')) {
                    // lm5pp_toggleCrosssense(this);
                    $(this).toggleClass('foldsign_fold');
                    $(this).siblings('.Sense').lm5pp_toggle();
                    return false;
                }

                lm5pp_toggleCrosssense(this);
                return;
            })
    }

    var lm5pp_switchSense;

    function lm5pp_toggleCrosssense(obj) {
        if ($(obj).is(TAGSENSEFOLDOTHER)) {
            obj = $(obj).siblings(TAGSENSEFOLD)
        }

        var _sense = $(obj).closest('.Sense').get(0);

        if (lm5pp_switchSense === _sense) {
            return;
        } else {
            lm5pp_switchSense = _sense;
        }

        $(obj).siblings().filter(lm5pp_senseFilter).filter(lm5pp_VersionFilter).lm5pp_toggle();
        $(obj).filter(lm5pp_VersionFilter).toggleClass('foldsign_fold');

        setTimeout(function () {
            lm5pp_switchSense = null;
        }, 200);
    }

    var lm5pp_allSenses;

    function lm5pp_toggleAllCrossense(obj) {
        if (lm5pp_allSenses === undefined)
            lm5pp_allSenses = $('.ldoceEntry .Sense > ' + TAGSENSEFOLD);

        var _actionUnfold;
        var _sense;

        var _$target = lm5pp_allSenses;

        if (obj === undefined || !(obj instanceof jQuery)) {
            _actionUnfold = (_$target.filter('.foldsign_fold').length / _$target.length >= 0.5);
        } else {
            _actionUnfold = obj.is('.foldsign_fold');
            _sense = obj.closest('.Sense').get(0);
            if (_sense === lm5pp_switchSense) {
                _$target = _$target.not($(obj));
                lm5pp_switchSense = null;
                _actionUnfold = !_actionUnfold;
            }
        }

        if (_actionUnfold) {
            _$target = _$target.filter('.foldsign_fold');
        } else {
            _$target = _$target.not('.foldsign_fold');
        }

        _$target.siblings().filter(lm5pp_senseFilter)
            .filter(lm5pp_VersionFilter).lm5pp_toggle(_actionUnfold);

        _$target
            .filter(lm5pp_VersionFilter).toggleClass('foldsign_fold', !_actionUnfold);
    }

    function lm5pp_VersionFilter(index) {
        return !($(this).is('.LDOCEVERSION_new') && !$('#switch_online').is(':checked'));
    }

    function lm5pp_ControlFilter(index) {
        if ($(this).parent().is('.Sense, .Subsense')) {
            // console.log($(this).attr('class'));
            return $(this).siblings('.foldsign_fold').length == 0;
        }
        // if ($(this).('LDOCE5PPBOX_show')) {
        //     return $(this).hasClass('foldsign_fold');
        // } else if ($(this).has('.LDOCE5PPBOX_hide')) {
        //     return !$(this).prevAll('.LDOCE5PPBOX_show').first().hasClass('foldsign_fold');
        // }
        return true;
    }

    var lm5pp_lastSwitchElement;

    function lm5pp_switchChinese(event) {
        // console.log('switch cn');
        if (this === lm5pp_lastSwitchElement)
            return;

        if ($(this).is(TAGSWITCHCNSIBLINGS)) {
            $(this).siblings().children(TAGCHINESSTEXT).lm5pp_toggle();
            $(this).children(TAGCHINESSTEXT).lm5pp_toggle();
        } else {
            $(this).children(TAGCHINESSTEXT).lm5pp_toggle();
        }

        if ($('.ldoceEntry .cn_txt:hidden').length == 0)
            lm5pp_showChineseAll();

        $(window).scroll();

        setTimeout(function () {
            lm5pp_lastSwitchElement = null;
        }, 200);
    }

    function lm5pp_showChineseAll() {
        lm5pp_toggleChineseAll(true);
    }

    function lm5pp_toggleChineseAll(option) {
        // option: true/false - show/hide
        $('#switch_cn').prop('checked', function (index, val) {
            if (option !== undefined && typeof option == 'boolean')
                val = !option;

            // val=true: hide chiness, active controls
            // val=false: show chiness
            $(TAGCHINESSTEXT).lm5pp_toggle(!val);

            $('.lm5ppMenu_title').toggleClass('en_show', val)
                .add('.lm5ppTopic_title')
                .toggleClass('intro_active', val)
                .not('.intro_active')
                .off('.lm5pp_lang');

            if (val) {
                lm5pp_switchChineseSetup();
            } else {
                $(TAGSWITCHCNALL).add(TAGSWITCHCNTAG)
                    .off('.lm5pp_lang')
                    .css('cursor', 'auto');

                lm5pp_tipsSetup($(TAGSWITCHCNALL).add('.lm5ppMenu_title'));
            }

            $(window).scroll();
            return !val;
        });
    }

    function lm5pp_anchorSetup() {
        if (lm5pp_isGoldendict()) {
            _match = document.location.href.match(/gdanchor=.*?_.*?_(.*?)__a/)
            if (_match) {
                $('#' + _match[1]).each(function () {
                    if ($(this).closest('.lm5ppbody .SpokenSect').children('.foldsign_fold')
                            .toggleClass('foldsign_fold')
                            .siblings('.Sense').show().length) {
                        scrollPosition($(this));
                    }
                });
            }
        }
    }

    var lm5pp_tipsTimer;

    function lm5pp_tipsSetup($element, func) {
        return;

        if ($('#lm5pp_tips_box').length == 0)
            $('.lm5ppbody').append('<span id="lm5pp_tips_box"><span id="lm5pp_tips"> </span></span>');

        if (func === undefined) {
            $element.off('.tooltips');
            $('#lm5pp_tips_box').hide();
            return
        }

        $element
            .on('mouseenter.tooltips', function () {
                func(this);
                clearTimeout(lm5pp_tipsTimer);
                lm5pp_tipsTimer = setTimeout(function (element) {
                    var _left = $(element).offset().left;
                    var _top = $(element).offset().top - $('#location_zero').offset().top
                        + $(element).outerHeight() + 5;
                    $('#lm5pp_tips_box').css({'left': _left, 'top': _top}).lm5pp_fadeIn('slow');
                }, 0, this);
            })
            .on('mouseleave.tooltips', function () {
                clearTimeout(lm5pp_tipsTimer);
                $('#lm5pp_tips_box').lm5pp_fadeOut('slow');
            })
    }

    function lm5pp_easteggSetup() {
        $('.corpusegg').on('click', function () {
            $('.corpus').lm5pp_slideToggle();
            $(window).scroll();
        });

        $('.bussdictegg').on('click', function () {
            $('.bussdict').lm5pp_slideToggle();
            $(window).scroll();
        });
    }

    function lm5pp_isMenuShow() {
        var _height = 0;
        $('.entry_content').each(function () {
            _height += $(this).outerHeight();
        });
        // log5p('menushow height:' + _height);
        return ($('.lm5ppBox').length != 0)
            || _height > $('.lm5pp_popup').outerHeight() * 1.8;
    }

    function lm5pp_isMobile() {
        return $('.lm5ppbody').is('.iphone, .android, .ipad') || lm5pp_isBluedict();
    }

    function lm5pp_isMDDExist() {
        /* Bluedict */
        // if (lm5pp_isBluedict()) {
        //     return ($('.MddExist').length != 0);
        // }
        // log5p("agent:" + navigator.userAgent.toLowerCase());
        // log5p("lm5ppbody:" + $('.lm5ppbody').attr('class'));
        // log5p("isMobile:" + lm5pp_isMobile());
        // log5p("MDD-style:" + $('.pagetitle').css('border-top-style'));
        // log5p("MDD-len:" + $('.pagetitle').css('border-top-style').length);
        // log5p("MDD-boolean:" + ($('.pagetitle').css('border-top-style').toLowerCase() == 'double'));
        return ($('.pagetitle').css('border-top-style').toLowerCase() == 'double');
    }

    function lm5pp_isOnlinePron() {
        if (lm5pp_isBluedict()) return ($('.MddExist').length == 0);

        return (!lm5pp_isMDDExist() && lm5pp_isMobile());
        // return (!lm5pp_isMDDExist() && lm5pp_isMobile()) || $('.lm5ppbody').is('.chrome');
    }

    function lm5pp_isGoldendict() {
        return ($('.goldendict').length != 0);
    }

    function lm5pp_isBluedict() {
        return ($('.bd_body').length != 0);
    }

    function lm5pp_checkEudic() {
        // search for eudic(欧陆)
        var _ss = document.styleSheets;
        for (var i = 0, max = _ss.length; i < max; i++) {
            if (_ss[i].href && (_ss[i].href.toLowerCase().indexOf('main.css') >= 0)) {
                return true;
            }
        }

        return (document.getElementsByClassName('expBody').length != 0);
    }


    function lm5pp_toggleWordFamily() {
        $(TAGWORDFAMILY).lm5pp_toggle();
    }

    function lm5pp_removePictureAndSound() {
        if (!lm5pp_isMDDExist()) {
            if (!lm5pp_isMobile()) {
                $('a.speaker, .fa-volume-up').remove();
                // $('a.speaker, .fa-volume-up, img, .FrequenceBox, .Crossref.imagerelated').remove();
                $('.EXAMPLE.speaker').removeClass('speaker');
            }
            $('.Crossref.ldoce4img.mdd').remove();
        }
    }

    function scrollPosition(target) {
        $('html,body').animate({scrollTop: target.offset().top}, 1000);

    }

    function lm5pp_anchor(obj) {
        // log5p($(obj).attr('href'));
        if (lm5pp_isBluedict()) {
            window.location.href = "entry://" + $(obj).attr('href');
            return;
        }

        scrollPosition($($(obj).attr('href')));
        // $('html,body').animate({scrollTop: $($(obj).attr('href')).offset().top}, 1000);

        // $(document).scrollTop($($(obj).attr('href')).offset().top);
        // log5p('top:' + $($(obj).attr('href')).offset().top);
    }

    var lm5pp_slideDuration = 300;

    function lm5pp_extendJQuery() {
        $.fn.extend({
            lm5pp_show: function () {
                return this.each(function () {
                    if (typeof($.fn.fadeIn) == "undefined") {
                        $(this).show();
                    } else {
                        if ($(this).css('display') == 'block') {
                            $(this)
                                .fadeIn({duration: lm5pp_slideDuration, queue: false})
                                // .css('display', 'none')
                                .slideDown(lm5pp_slideDuration);
                        } else {
                            $(this)
                                .fadeIn({duration: lm5pp_slideDuration});
                        }
                    }
                });
            },
            lm5pp_hide: function () {
                return this.each(function () {
                    if (typeof($.fn.fadeOut) == "undefined") {
                        $(this).hide();
                    } else {
                        if ($(this).css('display') == 'block') {
                            $(this)
                                .fadeOut({duration: lm5pp_slideDuration, queue: false})
                                .slideUp(lm5pp_slideDuration);
                        } else {
                            $(this)
                                .fadeOut({duration: lm5pp_slideDuration, queue: false});
                        }
                    }
                });
            },
            lm5pp_toggle: function (option) {
                return this.each(function (index, element) {
                    if ((typeof(option) != 'undefined') ? option : !$(this).is(":visible")) {
                        $(this).lm5pp_show();
                    } else {
                        $(this).lm5pp_hide();
                    }
                });
            },
            lm5pp_slideToggle: function (option) {
                return this.each(function (index, element) {
                    if (typeof($.fn.slideToggle) == "undefined") {
                        $(this).toggle(option);
                    } else {
                        $(this).slideToggle(option);
                    }
                });
            },
            lm5pp_fadeIn: function (option) {
                return this.each(function (index, element) {
                    if (typeof($.fn.fadeIn) == "undefined") {
                        $(this).show(option);
                    } else {
                        $(this).fadeIn(option);
                    }
                });
            },
            lm5pp_fadeOut: function (option) {
                return this.each(function (index, element) {
                    if (typeof($.fn.fadeOut) == "undefined") {
                        $(this).hide(option);
                    } else {
                        $(this).fadeOut(option);
                    }
                });
            }
        });


    }

    function log5p(info) {
        if ($('#loginfo5p').length == 0) {
            $('.entry_content:last').after('<h1 class="pagetitle" id="loginfo5p" style="font-size: 0.8em;"></h1>');
            $('#loginfo5p').show();
        }
        var _old = $('#loginfo5p').text();
        $('#loginfo5p').text(_old + '\n' + info);
    }

})
