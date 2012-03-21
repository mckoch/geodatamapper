<script type="text/javascript">
            
            $(document).ready(function(){
                var paginate_default = 20;
                var markierteStandorte = [];
                var this_lat = <?php print $lat_default; ?>;
                var this_lng = <?php print $lng_default; ?>;
                var umkreis_default = <?php print $umkreis_default; ?>;
                var umkreis_meter = <?php print $umkreis_default; ?>;
                var reverse_geocoded;
                $.loading.classname = 'loading';
                $.loading({onAjax:true, text: 'Lade...', pulse: 'working fade', mask:true});

                var circle = new google.maps.Circle({
                    fillOpacity : .1,
                    fillColor:'#ffccaa',
                    strokeColor:'#00ff00',
                    strokeOpacity: .77,
                    zIndex:1});
                var markerimage = new google.maps.MarkerImage('css/ui-icon/ico/arrow_refresh.png');
                var marker = new google.maps.Marker({
                    draggable: true,
                    title: 'Umkreis!',
                    icon: markerimage
                });
                circle.bindTo('center', marker, 'position');

                google.maps.event.addListener(marker, 'dragend', function() {
                    myPos = marker.getPosition();
                    $("#lastlatitude").val(myPos.lat());
                    $("#lastlongitude").val(myPos.lng());
                    updateSelectionCenter();
                });

                var trafficLayer = new google.maps.TrafficLayer();
                var bikeLayer = new google.maps.BicyclingLayer();

                $('.ui-icon').contextMenu('mainmap_context_menu',
                {   bindings: {

                        'item_1': function(t) {

                            alert('Trigger was '+t.id+'\nAction was Open');

                        },

                        'item_2': function(t) {

                            alert('Trigger was '+t.id+'\nAction was Email');

                        },

                        'item_3': function(t) {

                            alert('Trigger was '+t.id+'\nAction was Save');

                        }

                    }

                });

                function updateSelectionCenter(){
                    this_lat = $('#lastlatitude').val();
                    this_lng = $('#lastlongitude').val();
                    var latlng = new google.maps.LatLng(this_lat, this_lng);
                    geocoder.geocode( {'latLng': latlng},
                    function(results, status) {
                        $('#aktuellerstandort').html(results[0].formatted_address);

                    });
                };

                var directionsService = new google.maps.DirectionsService();
                var map;

                function initialize() {
                    directionsDisplay = new google.maps.DirectionsRenderer();
                    var standort = new google.maps.LatLng(this_lat,this_lng);
                    var myOptions = {
                        zoom: 6,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        center: standort,
                        disableDefaultUI: true
                    }
                    mainmap =$('#map').data('jMapping');
                    directionsDisplay.setMap(mainmap.map);
                }

                function calcRoute() {
                    var start = $('#startlatitude').val() +','+ $('#startlongitude').val();
                    var end = $('#ziellatitude').val() +','+ $('#ziellongitude').val();
                    var waypts = [];
                    
                    var request = {
                        origin: start,
                        destination: end,
                        waypoints: waypts,
                        avoidHighways: true,
                        optimizeWaypoints: true,
                        travelMode: google.maps.DirectionsTravelMode.WALKING

                    };
                    directionsService.route(request, function(response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                            var coords = response.routes[0].overview_path;
                            var route = response.routes[0];
                            var summaryPanel = document.getElementById("directions_panel");
                            var text ='';
                            summaryPanel.innerHTML = "";
                            for (var i = 0; i < route.legs.length; i++) {
                                var routeSegment = i + 1;
                                text += '<input id="streckenkoordinaten" type="hidden" value="'+coords+'"/>';
                                text += '<a href="api.php?command=4&'+$('#geocoder').serialize()+'">';
                                
                                text += '<div class="ui-icon fff-icon-zoom" style="float:left"></div>';
                                text += 'Segment '  + routeSegment + ": ";
                                text += $("#startadresse").val() + " -> ";
                                text += $("#zieladresse").val() + " | ";
                                text += route.legs[i].distance.text + '</a>';

                                summaryPanel.innerHTML = text;
                            }
                            $('#zwischenstop').val('');
                            $('#directions_panel a').button();
                        }
                    });
                }

                



                var geocoder;
                geocoder = new google.maps.Geocoder();
        
                $("#address").autocomplete({
                    source: function(request, response) {
                        geocoder.geocode( {'address': request.term , 'region':'DE', 'language':'de'}, function(results, status) {
                            response($.map(results, function(item) {
                                return {
                                    label:  item.formatted_address,
                                    value: item.formatted_address,
                                    latitude: item.geometry.location.lat(),
                                    longitude: item.geometry.location.lng()
                                }
                            }));
                        })
                    },
                    select: function(event, ui) {
                        //alert(ui.item.latitude);
                        $('#tabs').tabs( "select" , 0 );
                        $("#lastlatitude").val(ui.item.latitude);
                        $("#lastlongitude").val(ui.item.longitude);
                        //alert($("#lastlongitude").val());
                        $('#history a').button();
                        var api='api.php?command=3&'+ $('#geocoder').serialize() + '&' + $.param(ui.item);
                        $('#history') .prepend('<span><a href="'+ api + '" title="'+ ui.item.value + '" latitude="'
                            + ui.item.latitude + '" longitude="'+ ui.item.longitude +'"><div class="ui-icon fff-icon-zoom" style="float:left"></div>'
                            + ui.item.value + '</a> <div class="ui-icon fff-icon-cross" style="float:right"></div></span>');
                        $('#map-side-bar').load(api,
                        function(){
                            $('#pagination').html('');
                            $('#address').val('');
                            $('#map-side-bar .map-location').quickpaginate({
                                perpage: paginate_default, showcounter: true,
                                pager: $("#pagination")
                            });

                            
                            $('#map').jMapping('update');
                            $('#geo_icon').pulse({opacity: [0,1]}, {times: 3,duration: 800});
                            $('#pagination a, .qp_counter, #history a').button();
                            updateSelectionCenter();

                        });

                    }
                });

                $("#startadresse").autocomplete({
                    source: function(request, response) {
                        geocoder.geocode( {'address': request.term , 'region':'de', 'language':'de'}, function(results, status) {
                            response($.map(results, function(item) {
                                return {
                                    label:  item.formatted_address,
                                    value: item.formatted_address,
                                    latitude: item.geometry.location.lat(),
                                    longitude: item.geometry.location.lng()
                                }
                            }));
                        })
                    },
                    select: function(event,ui) {
                        directionsDisplay = new google.maps.DirectionsRenderer();
                        var standort = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
                        var myOptions = {
                            zoom: 15,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            center: standort
                        }
                        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                        directionsDisplay.setMap(map);
                        var marker = new google.maps.Marker({
                            position: standort,
                            map: map,
                            title: ui.item.value
                        });
                        $("#startlatitude").val(ui.item.latitude);
                        $("#startlongitude").val(ui.item.longitude);
                    }
                });

                $("#zieladresse").autocomplete({
                    source: function(request, response) {
                        geocoder.geocode( {'address': request.term , 'region':'de', 'language':'de'}, function(results, status) {
                            response($.map(results, function(item) {
                                return {
                                    label:  item.formatted_address,
                                    value: item.formatted_address,
                                    latitude: item.geometry.location.lat(),
                                    longitude: item.geometry.location.lng()
                                }
                            }));
                        })
                    },
                    select: function(event, ui) {
                        directionsDisplay = new google.maps.DirectionsRenderer();
                        var standort = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
                        var myOptions = {
                            zoom: 15,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            center: standort
                        }
                        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                        directionsDisplay.setMap(map);
                        var marker = new google.maps.Marker({
                            position: standort,
                            map: map,
                            title: ui.item.value
                        });
                        $("#ziellatitude").val(ui.item.latitude);
                        $("#ziellongitude").val(ui.item.longitude);

                    }
                });

                $("#zwischenstop").autocomplete({
                    source: function(request, response) {
                        geocoder.geocode( {'address': request.term , 'region':'de', 'language':'de'}, function(results, status) {
                            response($.map(results, function(item) {
                                return {
                                    label:  item.formatted_address,
                                    value: item.formatted_address,
                                    latitude: item.geometry.location.lat(),
                                    longitude: item.geometry.location.lng()
                                }
                            }));
                        })
                    },
                    //This bit is executed upon selection of an address
                    select: function(event, ui) {
                        directionsDisplay = new google.maps.DirectionsRenderer();
                        var standort = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
                        var myOptions = {
                            zoom: 15,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            center: standort
                        }
                        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                        directionsDisplay.setMap(map);
                        var marker = new google.maps.Marker({
                            position: standort,
                            map: map,
                            title: ui.item.value
                        });
                        
                        $('#zwischenstopliste').append('<span class="zwischenstop styledbutton" style="width:180px; float: right">via '+ui.item.label+"</span>");
                        $('#zwischenstopliste .zwischenstop').button();
                        $('#zwischenstop').val('');

                    }
                });

                $(document).bind('init_finished.quickpaginate', function(e){
                    $('#map').jMapping({
                        map_config: {
                            navigationControlOptions: {
                                style: google.maps.NavigationControlStyle.DEFAULT
                            },
                            mapTypeId: google.maps.MapTypeId.HYBRID,
                            zoom: 10
                        },
                        location_selector: '.map-location:visible',
                        category_icon_options: {
                            'U': {color: '#F3F8F4'},
                            'B': {color: '#FFF7B7'},
                            'default': {color: '#EEEEEE'}
                        }});

                    mainmap =$('#map').data('jMapping');
                    
                    var position = new google.maps.LatLng($('#lastlatitude').val(), $('#lastlongitude').val());
                    marker.setPosition(position);
                    marker.setMap(mainmap.map);
                    circle.setRadius(umkreis_meter);
                    circle.setCenter(position);

                    circle.setMap(mainmap.map);
                    trafficLayer.setMap(mainmap.map);
                    
                    $('.map-link').heatcolor(function() {return $(this).attr("plz"); },{lightness: 0.93,colorStyle: 'roygbiv'});
                    $('.fff-icon-bullet-yellow').heatcolor(function() {return $(this).attr("rel"); },{lightness: 0.73,colorStyle: 'roygbiv'});
                    $('.fff-icon-tag-green').heatcolor(function() {return $(this).attr("rel"); },{lightness: 0.73,colorStyle: 'roygbiv'});
                    $('#map-side-bar-scrolller').jScrollPane({showArrows: true});
                    $('#counter').html($('#map-side-bar .map-link:visible').length + '/' +  $('#map-side-bar .map-link').length);
                    updateSelectionCenter();
                });
                $(document).bind('paginate.quickpaginate', function(e, direction, page){
                    $('#map').jMapping('update');
                    $('#geo_icon').pulse({opacity: [0,1]}, {times: 3,duration: 800});
                    $('#map-side-bar-scrolller').jScrollPane({showArrows: true});
                    updateSelectionCenter();
                });
                
                $('#map-side-bar .map-location').quickpaginate({
                    perpage: paginate_default, showcounter: true,
                    pager: $("#pagination")
                });
                
                $( "#umkreis" ).slider({
                    orientation: "vertical",
                    range: "min",
                    value: umkreis_default ,
                    min: 5,
                    max: 3000,
                    step: 5,
                    animate: true,
                    slide: function( event, ui ) {
                        var position = new  google.maps.LatLng($('#lastlatitude').val(), $('#lastlongitude').val());
                        circle.setCenter(position);
                        $( "#zoom" ).html( "" + ui.value +'m' );
                        $( "#umkreis_store" ).val(ui.value);
                        umkreis_meter = ui.value;
                        circle.setRadius(ui.value);
                        
                    }
                });
                $( "#zoom" ).html( $( "#umkreis" ).slider( "value" ) + 'm' );
                $('#umkreis, #zoom').live('mouseup',
                function(){
                    updateSelectionCenter();
                    var api='api.php?command=3&' + $('#geocoder').serialize() + '&latitude='+$('#lastlatitude').val()
                        +'&longitude='+$('#lastlongitude').val();
                    $('#tabs').tabs( "select" , 0 );
                    $('#map-side-bar').load( api,
                    function(){
                        $('#pagination').html('');
                        $('#zoom').pulse({opacity: [0,1]}, {times: 2,duration: 500});
                        $('#map-side-bar .map-location').quickpaginate({
                            perpage: paginate_default, showcounter: true,
                            pager: $("#pagination")
                        });
                        $('#map').jMapping('update');
                        $('#geo_icon').pulse({opacity: [0,1]}, {times: 3,duration: 800});
                        $('#map-side-bar-scrolller').jScrollPane({showArrows: true});

                        //$( "#freiesuche,#address" ).val('');
                        $('#pagination a, .qp_counter').button();
                    });
                });
                
                $( "#paginierung_hauptauswahl" ).slider({
                    orientation: "vertical",
                    range: "min",
                    value: paginate_default,
                    min: 1,
                    max: 200,
                    step: 1,
                    animate: true,
                    slide: function( event, ui ) {
                        paginate_default = ui.value;
                        $('#counter').html(paginate_default);

                        
                    }
                });

                $('#paginierung_hauptauswahl').live('mouseup', function(){
                    
                    updateSelectionCenter();
                    $('#tabs').tabs( "select" , 0 );
                    $('#pagination').html('');
                    $('#map-side-bar .map-location').quickpaginate({
                        perpage: paginate_default, showcounter: true,
                        pager: $("#pagination")
                    });

                    $('#map').jMapping('update');
                    $('#geo_icon').pulse({opacity: [0,1]}, {times: 3,duration: 800});
                    $('#map-side-bar-scrolller').jScrollPane({showArrows: true});
                    $('#pagination a, .qp_counter').button();

                });

                $('.styledbutton, #pagination a, .qp_counter, #zoom,#startadresse, #zieladresse, #counter').button();
                $( " #suche_route,#reset_route,#zwischenstop, #resetmap, #lademerkzettel, #auswahlinfo" ).button();
                $( "#fortbewegungsart" ).buttonset();
                $( ".datum" ).datepicker();
                $('.clearField').clearField();


                $("select").multiselect({
                    minWidth: 'auto',
                    height: 'auto',
                    selectedText: '# Merkmale',
                    noneSelectedText: 'keine Merkmale',
                    multiple: true,
                    checkAllText:'Alle',
                    uncheckAllText:'Keine'
                });

                $('#history a').live('click', function(){
                    /**
                     * working on....
                     */
                    $('#tabs').tabs( "select" , 0 );

                    $("#lastlatitude").val($(this).attr('latitude')); 
                    $("#lastlongitude").val($(this).attr('longitude'));
                    $('#map-side-bar').html('') .load( $(this).attr('href') + '&umkreis=' + $('#umkreis_store').val() ,
                    function(){
                        $('#pagination').html('');
                        $('#zoom').pulse({opacity: [0,1]}, {times: 2,duration: 500});
                        $('#map-side-bar .map-location').quickpaginate({
                            perpage: paginate_default, showcounter: true,
                            pager: $("#pagination")
                        });
                        
                        $('#map').jMapping('update');
                        $('#geo_icon').pulse({opacity: [0,1]}, {times: 3,duration: 800});
                        $('#map-side-bar-scrolller').jScrollPane({showArrows: true});

                        $('#pagination a, .qp_counter').button();
                    });
                    return false;
                });

                $('#resetmap').live('click',function(){$('#map-side-bar').load('api.php',
                    function(){
                        $('#tabs').tabs( "select" , 0 );
                        $('#pagination, #history').html('');

                        $('#lastlatitude').val('<?php print $lat_default; ?>');
                        $('#lastlongitude').val('<?php print $lng_default; ?>');
                        updateSelectionCenter();
                        $('#zoom').slider( 'option','value' ,<?php print $umkreis_default; ?>);
                        $('#map-side-bar .map-location').quickpaginate({
                            perpage: paginate_default, showcounter: true,
                            pager: $("#pagination")
                        });
                        $('#map').jMapping('update');
                        $('#geo_icon').pulse({opacity: [0,1]}, {times: 3,duration: 800});
                        $('#map-side-bar-scrolller').jScrollPane({showArrows: true});
                        $('#pagination a, .qp_counter').button();
                    }
                )});

                $( "#freiesuche" ).autocomplete({
                    source: "api.php",
                    minLength: 3,
                    delay: 600,
                    select: function( event, ui ) {
                        var api='api.php?command=2&' + $('#geocoder').serialize() + '&' +$.param(ui.item);
                        $('#history') .prepend('<span><a href="'+ api + '" title="'+ ui.item.value + '" latitude="'
                            + ui.item.latitude + '" longitude="'+ ui.item.longitude +'"><div class="ui-icon fff-icon-zoom" style="float:left"></div>'
                            + ui.item.value + '</a><div class="ui-icon fff-icon-cross" style="float:right"></div> </span>');
                        $('#tabs').tabs( "select" , 0 );
                        $("#lastlatitude").val(ui.item.latitude);
                        $("#lastlongitude").val(ui.item.longitude);
                        

                        $('#map-side-bar').load(api,
                        function(){
                            updateSelectionCenter();
                            $('#pagination').html('');
                            $('#zoom').pulse({opacity: [0,1]}, {times: 1,duration: 500});
                            $('#map-side-bar .map-location').quickpaginate({
                                perpage: paginate_default, showcounter: true,
                                pager: $("#pagination")
                            });

                            $('.styledbutton, #pagination a, .qp_counter, #history a').button();
                            $('#map').jMapping('update');
                            $('#geo_icon').pulse({opacity: [0,1]}, {times: 3,duration: 800});
                            $('#map-side-bar-scrolller').jScrollPane({showArrows: true});

                            $('#freiesuche').val('');
                        });
                    }
                });
                $( '#tabs' ).tabs();
                $('#suche_route').live('click',function(){initialize();calcRoute()});
                $('#reset_route').live('click',function(){
                    $('#directions_panel, #zwischenstopliste').html('');
                    $('#startadresse,#zieladresse, #zwischenstop').val('');
                });

                
                $('.map-location .fff-icon-folder-add').live('click', function(){
                    $(this).toggleClass('fff-icon-folder-add') .toggleClass('fff-icon-accept');
                    var mapdata = '<div class="map-location ' +$(this).parent().attr('s-class') + '" data-jmapping="'
                        + $(this).parent().attr('data-jmapping') +'" s-class="' +$(this).parent().attr('s-class') + '">'
                        + $(this).parent().html() + '</div>';
                   
                    $('#merkzettelstandorte, #merkliste').prepend(mapdata);
                    $('#merkliste .info-box:hidden') .toggle('visibility');
                    //$('#merkzettelstandorte .map-link, #merkliste .map-link').heatcolor(function() {return $(this).attr("plz"); },{lightness: 0.93,colorStyle: 'roygbiv'});
                    $(this).pulse({opacity: [0,1]}, {times: 3,duration: 400,
                        complete: function() {
                            $('#merkzettelouter_icon').pulse({opacity: [0,1]}, {times: 2,duration: 500});
                        }
                    });
                });

                $('.map-location .fff-icon-accept').live('click', function(){
                    $(this).toggleClass('fff-icon-folder-add') .toggleClass('fff-icon-accept');
                    $(this).parents($('.'+$(this) .parent() .attr('s-class') + ' .map-location .fff-icon-accept'))
                    .toggleClass('fff-icon-folder-add') .toggleClass('fff-icon-accept');
                    sel = '#merkliste .' + $(this) .parent() .attr('s-class');
                    $( sel ).remove();
                    sel = '#merkzettelstandorte .' + $(this) .parent() .attr('s-class');
                    $( sel ).remove();
                });

                
                $('.map-location .fff-icon-arrow-refresh-small').live('click',
                function(){
                    $("#lastlatitude").val($(this).attr('latitude'));
                    $("#lastlongitude").val($(this).attr('longitude'));
                    updateSelectionCenter();


                    var api='api.php?command=3&' + $('#geocoder').serialize() + '&latitude='+$('#lastlatitude').val()
                        +'&longitude='+$('#lastlongitude').val();
                    $('#tabs').tabs( "select" , 0 );
                    $('#zwischenspeicher').prepend($('#map-side-bar .map-location'));
                    $('#map-side-bar').load( api,
                    function(){
                        $('#pagination').html('');
                        $('#zoom').pulse({opacity: [0,1]}, {times: 2,duration: 500});
                        zwischenspeicher = $('#zwischenspeicher .map-location').get();
                        $('#zwischenspeicher').html('');
                        $('#zwischenspeicher').html($.unique(zwischenspeicher));
                        $('#map-side-bar').append($('#zwischenspeicher').html());
                        $('#map-side-bar .map-location').quickpaginate({
                            perpage: paginate_default, showcounter: true,
                            pager: $("#pagination")
                        });

                        $('#map').jMapping('update');
                        $('#geo_icon').pulse({opacity: [0,1]}, {times: 3,duration: 800});
                        $('#map-side-bar-scrolller').jScrollPane({showArrows: true});

                        //$( "#freiesuche,#address" ).val('');
                        $('#pagination a, .qp_counter').button();
                    });
                });


                $('#lademerkzettel').live('click', function(){
                    var merkzettel = $('#merkzettelstandorte').html();
                    $('#tabs').tabs( "select" , 0 );
                    $('#pagination').html('');
                    $('#map-side-bar').html(merkzettel);
                    $('#map').jMapping('update');
                    $('#geo_icon').pulse({opacity: [0,1]}, {times: 3,duration: 800});
                    $('#map-side-bar-scrolller').jScrollPane({showArrows: true});
                });

                $('.map-link').live('click', function(){
                    $("#lastlatitude").val($(this).attr('latitude'));
                    $("#lastlongitude").val($(this).attr('longitude'));
                    updateSelectionCenter();
                    $('#stellenkurzinfo').html($(this).parent().clone());
                    $('#stellenkurzinfo .info-box:hidden').toggle();
                    $('.map-link').parent().removeClass('ui-state-highlight');
                    $(this).parent().addClass('ui-state-highlight');
                    return false;
                });

                $('.map-location img').live('click', function(){
                    $.colorbox({href:'img/1048x1048/'+$(this).attr('rel')+'.jpg',
                        maxWidth: '90%', maxHeight: '90%', opacity: 0.5, close: 'Schließen',
                        previous:'Zurück', next:'Weiter'
                    });
                });


                $('#modus_maxmap').button();
                $('.ui-slider-handle').addClass('ui-icon fff-icon-bullet-blue');
                $('.map-location img').css({'float':'none'});

                $('#modus_maxmap').live('click', function(){
                    $(this).remove();
                    $('#tabs').tabs( "select" , 0 );
                    $('#helpbutton, #merkliste_outer').addClass('ui-helper-hidden-accessible');
                    $('#page').css({'width': '100%', 'height': '100%','margin':'0','padding':'0'});
                    $('#tabs').css({'top':'50px','opacity':'.87'});
                    $('#zoom').css({'float':'none'});
                    $('#geocoder').css({'position':'absolute','right':'8px', 'top':'30px','margin':'0','padding':'0'});
                    $('#tabs,#helpbutton, #geocoder,#zoom').draggable({opacity:0.37}) .css({'z-index':'1111'});
                    $('#umkreis').css({'position':'absolute','left':'8px', 'top':'100px'});
                    $('#zoom').position({my:'left bottom',at:'right bottom',of:$('#umkreis'), offset: '12'});
                    
                    $('#map').css({'height':'100%','width': '100%','position': 'absolute','top':'0','left':'0','right':'0'});
                });
            });
        </script>