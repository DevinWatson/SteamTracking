
CACHE_LIFETIME_SECS = 30;

var g_bLoadingGroupPage = false;
var g_rgPendingRequestedURL = null;
var g_strActiveTab;
var g_strActiveURL;
var g_strGroupURL;
var g_rgPageContentCache = {};
var g_oRecommendedApps = null;
function InitGroupPage( strGroupBaseURL, strActiveTab )
{
	g_strGroupURL = strGroupBaseURL;
	g_strActiveTab = strActiveTab;
	g_strActiveURL = '';
	BindOnHashChange( OnGroupHashChange );
	OnGroupHashChange( window.location.hash, true );
}

function OnGroupHashChange( hash, bInitialLoad )
{
	var strTab = 'overview';
	var url = '';
	if ( hash.length > 1 )
	{
		hash = hash.substr(1);	// skip the #
		var rgMatches = hash.match( /^[^\^]*/ );

		if ( rgMatches && rgMatches[0] )
		{
			url = rgMatches[0];
			url = url.replace( /\.+[\/\\]/g, '' );	//clean out any ./ or ../ in the URL
			strTab = url.match( /^[a-zA-Z]*/ )[0];
		}
	}

	if ( url != g_strActiveURL )
	{
		if ( bInitialLoad )
		{
			// we just loaded the page and we're immediately navigating to a sub page,
			//	flip over to the dynamic div now so there's no flash of the overview tab/page while
			//	we wait for the AJAX
			$('group_tab_content_overview').hide();
			$('group_page_dynamic_content').show();
			FlipToTab( strTab );
		}
		LoadURL( strTab, url );
	}
	else if ( bInitialLoad )
	{
		// not flipping to another tab, so load trending topics on the group overview page
		LoadTrendingTopics();
	}
}

function LoadURL( strTab, url )
{
	if ( g_bLoadingGroupPage )
	{
		g_rgPendingRequestedURL = {strTab: strTab, url: url };
		return;
	}

	if ( url == '' || url == '/' || url == 'overview' )
	{
		$('group_tab_content_overview').show();
		$('group_page_dynamic_content').hide();
		g_strActiveURL = url;
		FlipToTab( 'overview' );
		return;
	}

	var tsNow = new Date().getTime();
	var rgCacheData = g_rgPageContentCache[ url ];
	if ( !rgCacheData  || ( tsNow - rgCacheData.timestamp > CACHE_LIFETIME_SECS * 1000 ) )
	{
		g_bLoadingGroupPage = true;
		new Ajax.Request( g_strGroupURL + '/' + url, {
			method: 'get',
			parameters: { content_only: true },
			onComplete: OnGroupContentLoadComplete.bind( null, strTab, url )
		} );
	}
	else
	{

		FlipToTab( strTab );
		$('group_page_dynamic_content').childElements().invoke( 'remove' );
		ScrollToIfNotInView( 'group_tab_overview', 20, 150 );

		$('group_page_dynamic_content').appendChild( rgCacheData.html );
		g_strActiveURL = url;
	}
}

function OnGroupContentLoadComplete( strTab, url, transport )
{
	g_bLoadingGroupPage = false;

	FlipToTab( strTab );
	$('group_page_dynamic_content').childElements().invoke( 'remove' );
	ScrollToIfNotInView( 'group_tab_overview', 20, 150 );


		if ( transport.responseJSON == null )
	{
		var elContent = new Element( 'div' );
		$('group_page_dynamic_content').appendChild( elContent );
		elContent.update( transport.responseText );

		g_rgPageContentCache[ url ] = {
			timestamp: new Date().getTime(),
			html: elContent
		};
	}

	g_strActiveURL = url;

	if ( g_rgPendingRequestedURL )
	{
		LoadURL( g_rgPendingRequestedURL.strTab, g_rgPendingRequestedURL.url );
		g_rgPendingRequestedURL = null;
	}
}

function FlipToTab( strTab )
{
	$('group_tab_' + g_strActiveTab).removeClassName( 'active' );
	$('group_tab_' + strTab).addClassName( 'active' );

	if ( strTab != 'overview' )
	{
		$('group_tab_content_overview').hide();
		$('group_page_dynamic_content').show();
	}
	else
	{
		LoadTrendingTopics();
	}

	g_strActiveTab = strTab;
}

g_bTrendingTopicsLoading = false;
function LoadTrendingTopics()
{
	var elTrendingTopics = $('group_trending_topics');
	if ( elTrendingTopics.children.length == 0 )
	{
		elTrendingTopics.update('<div id="group_trending_topics_pending"><img src="https://steamcommunity.com/public/images/login/throbber.gif"></div>')
		g_bTrendingTopicsLoading = true;
		new Ajax.Updater( elTrendingTopics, g_strGroupURL + '/trendingtopics', {method: 'get', onSuccess: function() { Forum_InitTooltips.defer(); } } );
	}
}

Event.observe( window, 'load', function() {
	if ( Prototype.Browser.IE )
	{
		var rv = -1;
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );

		if ( rv < 8 )
		{
			$(document.body).addClassName('nodatauri');
		}
	}
} );



/* Event page cruft */


function deleteEvent( deleteURL )
{
	if ( confirm( 'You are about to delete this event. Are you sure?' ) )
	{
		var $Form = $J('<form/>', {action: deleteURL, method: 'POST'});
		$Form.append( $J('<input/>', {type: 'hidden', name: 'sessionid', value: g_sessionID } ) );
		$J('body').append( $Form );
		$Form.submit();
	}
}

function getMonthEvents( newMonth, newYear )
{
	var postData = {
		"xml": 1,
		"action": "eventFeed",
		"month": newMonth,
		"year": newYear
	};
	createQuery2( getEventURL, monthEventsReceive, postData );
}

function getDayEvents( mdy, eventID )
{
	var postData = {
		"xml": 1,
		"action": "eventDayFeed",
		"mdy": mdy
	};
	if ( eventID != undefined )
	{
		postData['selectedEvent'] = eventID;
	}
	createQuery2( getEventURL, dayEventsReceive, postData );
}

var calCurrentClass;
function dayEventsReceive()
{
	if ( req.readyState == 4 )
	{
		if ( req.status == 200 )
		{
			response = req.responseXML.documentElement;
			updateInProgress = false;
			results = response.getElementsByTagName('results')[0].firstChild.nodeValue;
			if ( results != 'OK' )
			{
				alert( results );
				return false;
			}
			// clear existing list
			expandedEvents = document.getElementById( 'eventsExpanded' );
			while( expandedEvents.childNodes.length > 0 )
			{
				expandedEvents.removeChild( expandedEvents.childNodes[0] );
			}
			eventCount = response.getElementsByTagName( 'eventCount' )[0].firstChild.nodeValue;
			expiredEventCount = response.getElementsByTagName( 'expiredEventCount' )[0].firstChild.nodeValue;
			if ( eventCount > 0 || expiredEventCount > 0 )
			{
				mdy = response.getElementsByTagName( 'mdy' )[0].firstChild.nodeValue;
				if ( calCurrentFocus != undefined )
				{
					if ( document.getElementById( 'cal1_' + calCurrentFocus ) )
					{
						document.getElementById( 'cal1_' + calCurrentFocus ).className = calCurrentClass;
						document.getElementById( 'cal1_' + calCurrentFocus ).className = document.getElementById( 'cal1_' + calCurrentFocus ).className.replace( /rollOver/, '' );
						if ( document.getElementById( 'cal1_' + calCurrentFocus ).className == ' ' )
						{
							document.getElementById( 'cal1_' + calCurrentFocus ).classname = '';
						}
					}
				}
				calCurrentClass = document.getElementById( 'cal1_' + mdy ) .className;
				document.getElementById( 'cal1_' + mdy ) .className = 'isFocus';
				calCurrentFocus = mdy;
				selectedEvent = response.getElementsByTagName( 'selectedEvent' )[0].firstChild.nodeValue;
				expandedEvents.innerHTML += '<p class="sectionText" id="fullEventTitle">Showing events for ' + mdy + '</p>';
				if ( eventCount > 0 )
				{
					events = response.getElementsByTagName( 'event' );
					for( x = 0; x < events.length; x++ )
					{
						expandedEvents.innerHTML += events[x].firstChild.nodeValue;
					}
				}
				if ( expiredEventCount > 0 )
				{
					events = response.getElementsByTagName( 'expiredEvent' );
					for( x = 0; x < events.length; x++ )
					{
						expandedEvents.innerHTML += events[x].firstChild.nodeValue;
					}
				}
			}
		}
	}
}



function monthEventsReceive()
{
	if ( req.readyState == 4 )
	{
		if ( req.status == 200 )
		{
			response = req.responseXML.documentElement;
			updateInProgress = false;
			results = response.getElementsByTagName('results')[0].firstChild.nodeValue;
			if ( results != 'OK' )
			{
				alert( results );
				return false;
			}
			// clear existing lists
			eventList = document.getElementById( 'eventListing' );
			while( eventList.childNodes.length > 0 )
			{
				eventList.removeChild( eventList.childNodes[0] );
			}
			expiredEventList = document.getElementById( 'expiredEventListing' );
			while( expiredEventList.childNodes.length > 0 )
			{
				expiredEventList.removeChild( expiredEventList.childNodes[0] );
			}
			expandedEvents = document.getElementById( 'eventsExpanded' );
			while( expandedEvents.childNodes.length > 0 )
			{
				expandedEvents.removeChild( expandedEvents.childNodes[0] );
			}
			//get and populate new ones
			eventCount = response.getElementsByTagName( 'eventCount' )[0].firstChild.nodeValue;
			expiredEventCount = response.getElementsByTagName( 'expiredEventCount' )[0].firstChild.nodeValue;
			monthName = response.getElementsByTagName( 'monthName' )[0].firstChild.nodeValue;
			year = response.getElementsByTagName( 'year' )[0].firstChild.nodeValue;
			bPastMonth = response.getElementsByTagName( 'bPastMonth' )[0].firstChild.nodeValue;
			if ( bPastMonth == 1 )
			{
				document.getElementById( 'futureEventsHeader' ).innerHTML = '';
				document.getElementById( 'futureEventsHeaderBreak' ).style.display = 'none';
			}
			else
			{
				document.getElementById( 'futureEventsHeader' ).innerHTML = monthName + " " + year;
				document.getElementById( 'futureEventsHeaderBreak' ).style.display = 'block';
			}
			if ( expiredEventCount > 0 || bPastMonth == 1 )
			{
				document.getElementById( 'expiredEventsHeader' ).innerHTML = "Past events in " + monthName;
				document.getElementById( 'expiredEventsHeaderBreak' ).style.display = 'block';
			}
			else
			{
				document.getElementById( 'expiredEventsHeader' ).innerHTML = '';
				document.getElementById( 'expiredEventsHeaderBreak' ).style.display = 'none';
			}
			if ( bPastMonth || expiredEventCount > 0 )
			{
				document.getElementById( 'expiredEventsHeader' ).style.display = 'block';
			}
			if ( bPastMonth == 0 )
			{
				document.getElementById( 'futureEventsHeader' ).style.display = 'block';
			}
			if ( eventCount > 0 )
			{
				events = response.getElementsByTagName('event');
				for( x = 0; x < events.length; x++ )
				{
					eventList.innerHTML += events[x].firstChild.nodeValue;
				}
			}
			if ( expiredEventCount > 0 )
			{
				events = response.getElementsByTagName('expiredEvent');
				for( x = 0; x < events.length; x++ )
				{
					expiredEventList.innerHTML += events[x].firstChild.nodeValue;
				}
			}
		}
	}
}


function validateSearchSubmit()
{
	tbox = document.getElementById( 'searchKey' );
	if ( tbox.value == '' )
	{
		return false;
	}
	var elForm = $('searchEditForm');
	window.location = elForm.action + '?' + elForm.serialize();
}

function ConfirmLeaveGroup( groupName )
{
	if ( window.confirm( 'You are about to leave the group: \n' + groupName + '\nAre you sure?' ) )
	{
		$('leave_group_form').submit();
	}
}


function Curator_CreateOrEditRecommendation( groupid, create_only )
{
	// create the recommendation
	$J.ajax({
		url: 'https://steamcommunity.com/groups/' + groupid + '/createrecommendation/',
		type: 'POST',
		data: {
			sessionID: g_sessionID,
			appid: $J('#curationAppIDInput').val(),
			appname: $J('#curationAppInput').val(),
			blurb: $J('#curationBlurbInput').val(),
			link_url: $J('#curationURLInput').val(),
			create_only: create_only?1:0
		},
		success: function( data, textStatus, jqXHR ) {
			if ( data.success == 1 )
			{
				// great, go back to the front page
				window.location = 'https://steamcommunity.com/groups/' + groupid + '/curation';
			}
			else if ( data.error )
			{
				ShowAlertDialog( 'Could not create recommendation', data.error );
			}
			else
			{
				ShowAlertDialog( 'Could not create recommendation', 'The Steam Servers are currently too busy to create your recommendation. Please try again later.' );
			}
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			// uh oh
			ShowAlertDialog( 'Could not create recommendation', 'The Steam Servers are currently too busy to create your recommendation. Please try again later.' );
		}
	});
}

function Curator_UpdateCharacterCount( textareaid, counterid, maxchars )
{
	var len = $J(textareaid).val().length;
	var text = '%s characters remaining';
	$J( counterid ).html( text.replace( '%s', maxchars-len ) );
}

function Curator_Follow( groupid, bFollow )
{
	$J.ajax({
		url: 'https://steamcommunity.com/groups/' + groupid + '/followcurator/',
		type: 'POST',
		data: {
			sessionID: g_sessionID,
			follow: bFollow
		},
		success: function( data, textStatus, jqXHR ) {
			if ( data.success == 1 )
			{
				if ( data.following )
				{
					$J('#group_curation_follow_button').html( 'Stop following' );
				}
				else
				{
					$J('#group_curation_follow_button').html( 'Follow this curator' );
				}

				$J('#group_curation_follow_link').attr( 'onclick', "Curator_Follow('" + groupid + "', " + (data.following?'0':'1') + "); return false;" );

				if ( data.total_followers )
				{
					$J('#curator_follower_count').html( data.total_followers );
				}
			}
			else if ( data.error )
			{
				ShowAlertDialog( 'Could not change follow state', data.error );
			}
			else
			{
				ShowAlertDialog( 'Could not change follow state', 'Sorry! There was an error with the servers and you\'ll have to try to do this again later.' );
			}
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			// uh oh
			ShowAlertDialog( 'Could not change follow state', 'Sorry! There was an error with the servers and you\'ll have to try to do this again later.' );
		}
	});
}

function Curator_DeleteRecommendation( groupid, appid, appname )
{
	var prompt_text = 'Do you want to delete your recommendation of %s?';
	prompt_text = prompt_text.replace( '%s', appname );
	var dialog = ShowConfirmDialog( 'Delete recommendation', prompt_text, 'Delete recommendation' );
	dialog.done( function( reason ) {
		$J.ajax({
			url: 'https://steamcommunity.com/groups/' + groupid + '/deleterecommendation/',
			type: 'POST',
			data: {
				sessionID: g_sessionID,
				appid: appid
			},
			success: function( data, textStatus, jqXHR ) {
				dialog = null;
				if ( data.success == 1 )
					dialog = ShowAlertDialog( 'Recommendation deleted', data.message );
				else if ( data.error )
					dialog = ShowAlertDialog( 'Could not deleted recommendation', data.error );
				else
					dialog = ShowAlertDialog( 'Could not deleted recommendation', 'Sorry! There was an issue with the Steam servers and the recommendation could not be deleted. Please try again later.' );

				// reload
				dialog.done( function( reason ) {
					window.location = 'https://steamcommunity.com/groups/' + groupid + '/curation';
				});
			},
			error: function( jqXHR, textStatus, errorThrown ) {
				// uh oh
				ShowAlertDialog( 'Could not deleted recommendation', 'Sorry! There was an issue with the Steam servers and the recommendation could not be deleted. Please try again later.' );
			}
		});
	});
}


function Curator_SetTagline( groupid, tagline )
{
	$J.ajax({
		url: 'https://steamcommunity.com/groups/' + groupid + '/settagline/',
		type: 'POST',
		data: {
			sessionID: g_sessionID,
			tagline: tagline
		},
		success: function( data, textStatus, jqXHR ) {
			if ( data.success == 1 )
			{
				// just reload, this page shows the result
				window.location = 'https://steamcommunity.com/groups/' + groupid + '/curation';
			}
			else if ( data.error )
			{
				ShowAlertDialog( 'Could not set tagline', data.error );
			}
			else
			{
				ShowAlertDialog( 'Could not set tagline', 'Sorry! We failed to talked to the Steam Servers to set your tagline. Please try again later.' );
			}
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			// uh oh
			ShowAlertDialog( 'Could not set tagline', 'Sorry! We failed to talked to the Steam Servers to set your tagline. Please try again later.' );
		}
	});
}

function ConfirmDeleteAnnouncement( deleteURL )
{
	var dialog = ShowConfirmDialog( 'Delete Announcement?', 'Are you sure you want to delete this announcement?' );
	dialog.done( function() {
		top.location.href = deleteURL;
	});
}



