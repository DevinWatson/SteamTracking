
function OnHomepageException(e)
{
	}


GHomepage = {
	oSettings: {},
	oApplicableSettings: {"main_cluster":{"top_sellers":true,"early_access":true,"games_already_in_library":true,"recommended_for_you":true,"prepurchase":true,"games":"always","software":true,"dlc_for_you":true,"dlc":null,"recently_viewed":null,"new_on_steam":null,"popular_new_releases":"always","games_not_in_library":null,"only_current_platform":true,"hidden":null},"new_on_steam":{"top_sellers":null,"early_access":true,"games_already_in_library":true,"recommended_for_you":null,"prepurchase":null,"games":"always","software":true,"dlc_for_you":null,"dlc":null,"recently_viewed":null,"new_on_steam":null,"popular_new_releases":null,"games_not_in_library":null,"only_current_platform":true,"hidden":null},"recently_updated":{"top_sellers":null,"early_access":true,"games_already_in_library":null,"recommended_for_you":null,"prepurchase":null,"games":"always","software":true,"dlc_for_you":null,"dlc":null,"recently_viewed":null,"new_on_steam":null,"popular_new_releases":null,"games_not_in_library":true,"only_current_platform":true,"hidden":null},"tabs":null,"specials":null,"more_recommendations":null,"friend_recommendations":null,"curators":{"top_sellers":null,"early_access":true,"games_already_in_library":true,"recommended_for_you":null,"prepurchase":null,"games":"always","software":true,"dlc_for_you":null,"dlc":null,"recently_viewed":null,"new_on_steam":null,"popular_new_releases":null,"games_not_in_library":null,"only_current_platform":true,"hidden":null}},

	oDisplayListsRaw: {},
	oDisplayLists: {},

	oFeaturedMainCapItems: {},

	rgRecommendedGames: [],
	rgFriendRecommendations: [],	// { appid, accountid_friends, time_most_recent_recommendation }

	rgAppsRecommendedByCurators: [],
	rgTopSteamCurators: [],

	bUserDataReady: false,
	bStaticDataReady: false,

	MainCapCluster: null,

	InitUserData: function( rgParams )
	{
		try {
			GHomepage.oSettings = rgParams.oSettings;
			GHomepage.CheckLocalStorageSettings();

			if ( rgParams.rgRecommendedGames && rgParams.rgRecommendedGames.length )
			{
				var rgRecommendedAppIDs = v_shuffle( rgParams.rgRecommendedGames );
				for( var i = 0; i < rgRecommendedAppIDs.length; i++ )
				{
					GHomepage.rgRecommendedGames.push( { appid: rgRecommendedAppIDs[i], recommended: true } );
				}
			}

			if ( g_AccountID == 0 )
			{
				$J('#home_recommended_spotlight_notloggedin').show();
			}
			else
			{
				$J('#home_recommended_more').show();
			}

			GHomepage.rgAppsRecommendedByCurators = rgParams.rgAppsRecommendedByCurators || [];
			GHomepage.rgTopSteamCurators = rgParams.rgTopSteamCurators || [];
			GHomepage.rgFriendRecommendations = v_shuffle( rgParams.rgFriendRecommendations ) || [];
		} catch( e ) { OnHomepageException(e); }

		GHomepage.bUserDataReady = true;
		if ( GHomepage.bStaticDataReady )
			GHomepage.OnHomeDataReady();
	},

	InitStaticData: function( rgParams )
	{
		try {
			GHomepage.oDisplayListsRaw = rgParams.rgDisplayLists;
		} catch( e ) { OnHomepageException(e); }

		GHomepage.bStaticDataReady = true;
		if ( GHomepage.bUserDataReady )
			GHomepage.OnHomeDataReady();
	},

	OnHomeDataReady: function()
	{
		try {
			if ( g_AccountID != 0 )
			{
				$J('#discovery_queue').append( $J('#static_discovery_queue_elements').children() );
				$J('#static_discovery_queeue_elements').remove();
				$J('.discovery_queue_ctn').show();
			}
			else
			{
				$J('.discovery_queue_ctn').show();
				$J( "#discovery_queue_not_logged_in").show();
				$J( "#discovery_queue").hide();
				$J('.upcoming_queue_ctn').show();
			}
		} catch(e) { OnHomepageException(e); }

		GDynamicStore.OnReady( GHomepage.OnDynamicStoreReady );
	},

	OnDynamicStoreReady: function()
	{
		var HomeSettings;
		var bHaveUser = ( g_AccountID != 0 );

		// RECOMMENDED SPOTLIGHTS
		try {
			// we render this first, it may "steal" some recommendations from the main cap to show here instead.
			if ( bHaveUser )
				GHomepage.RenderRecommendedForYouSpotlight();
		} catch( e ) { OnHomepageException(e); }


		GHomepage.oDisplayLists.main_cluster_legacy = GHomepage.oDisplayListsRaw.main_cluster_legacy || [];
		GHomepage.oDisplayLists.main_cluster = GHomepage.oDisplayListsRaw.main_cluster || [];
		GHomepage.oDisplayLists.top_sellers = GHomepage.oDisplayListsRaw.top_sellers || [];
		GHomepage.oDisplayLists.popular_new = GHomepage.oDisplayListsRaw.popular_new_releases || [];
		GHomepage.oDisplayLists.new_on_steam = GHomepage.MergeLists(
			GHomepage.oDisplayListsRaw.featured_items, true,
			GHomepage.oDisplayLists.popular_new, false
		);

		// MAIN CLUSTER
		try {
			if ( bHaveUser )
			{
				HomeSettings = new CHomeSettings( 'main_cluster', GHomepage.RenderMainCluster );
				$J('.main_cluster_content').append( HomeSettings.RenderCustomizeButton() );
			}
			GHomepage.RenderMainCluster();
		} catch( e ) { OnHomepageException(e); }

		// NEW ON STEAM
		try {
			if ( bHaveUser )
			{
				HomeSettings = new CHomeSettings( 'new_on_steam', GHomepage.RenderNewOnSteam );
				$J('.home_smallcap_area.new_on_steam .home_actions_ctn').append( HomeSettings.RenderCustomizeButton() );
			}
			GHomepage.RenderNewOnSteam();
		} catch( e ) { OnHomepageException(e); }


		// RECENTLY UPDATED
		try {
			if ( bHaveUser )
			{
				HomeSettings = new CHomeSettings( 'recently_updated', GHomepage.RenderRecentlyUpdated );
				$J('.home_smallcap_area.recently_updated .home_actions_ctn').append( HomeSettings.RenderCustomizeButton() );
			}
			GHomepage.oDisplayLists.recently_updated = GHomepage.MergeLists(
				GHomepage.oDisplayListsRaw.featured_update_round, true,
				GHomepage.oDisplayListsRaw.other_update_round, false
			);
			GHomepage.RenderRecentlyUpdated();
		} catch( e ) { OnHomepageException(e); }

		// CURATORS
		try {
			if ( bHaveUser )
			{
				HomeSettings = new CHomeSettings( 'curators', GSteamCurators.Render );
				$J('.apps_recommended_by_curators_ctn .home_page_content .home_actions_ctn').append( HomeSettings.RenderCustomizeButton() );
			}
			GSteamCurators.Init( GHomepage.rgTopSteamCurators, GHomepage.rgAppsRecommendedByCurators );
		} catch( e ) { OnHomepageException(e); }

		// RECOMMENDED TAGS
		try {
			if ( bHaveUser && GDynamicStore.s_rgRecommendedTags.length )
			{
				GHomepage.RenderRecommendedTags();
			}
		} catch( e ) { OnHomepageException(e); }

		GHomepage.oDisplayListsRaw = null;

		// More Content
		if( bHaveUser )
		{
			$J('#content_more').autoloader({template_url: 'http://store.steampowered.com/explore/render/', recommendations_url: 'http://store.steampowered.com/explore/recommended/', additional_url: 'http://store.steampowered.com/explore/more'});
		}
		else
		{
			$J('#content_more').hide();
			$J('#content_loading').hide();
			$J('#content_callout').hide();
			$J('#content_login').show();
		}
	},

	ItemKey: function( rgItem )
	{
		return rgItem.appid ? 'a' + rgItem.appid : 'p' + rgItem.packageid;
	},

	RenderMainCluster: function()
	{
		for ( var i = 0; i < GHomepage.oDisplayLists.popular_new.length; i++ )
		{
			GHomepage.oDisplayLists.popular_new[i].new_on_steam = true;
		}
		for ( var i = 0; i < GHomepage.oDisplayLists.top_sellers.length; i++ )
		{
			GHomepage.oDisplayLists.top_sellers[i].top_seller = true;
		}

		var rgTopSellers = [];
		if ( oSettings && oSettings.top_sellers )
			rgTopSellers = GHomepage.oDisplayLists.top_sellers;

		var rgDisplayListCombined = GHomepage.MergeLists(
			GHomepage.oDisplayLists.main_cluster_legacy, false,
			GHomepage.oDisplayLists.main_cluster, true,
			rgTopSellers, false,
			GHomepage.oDisplayLists.popular_new.slice( 0, 20 ), true
		);
		var oSettings = GHomepage.oSettings.main_cluster;

		GHomepage.oFeaturedMainCapItems = {};

		if ( oSettings && oSettings.recommended_for_you )
		{
			rgDisplayListCombined = GHomepage.ZipLists(
				rgDisplayListCombined, false,
				GHomepage.rgRecommendedGames, true
			);
		}

		var rgMainCaps = GHomepage.FilterItemsForDisplay(
			rgDisplayListCombined, 'main_cluster', 0, 15
		);
		var cMainCaps = rgMainCaps.length;	// record the real number before we add a dupe to the end

		for ( var i = 0; i < rgMainCaps.length; i++ )
		{
			GHomepage.oFeaturedMainCapItems[ GHomepage.ItemKey( rgMainCaps[i] ) ] = true;
		}

		var $MainCluster = $J('#main_cluster_scroll').empty();

		var $FirstCap = null;
		for ( var i = 0; i < rgMainCaps.length; i++ )
		{
			var oItem = rgMainCaps[i];
			var rgData = GHomepage.GetStoreItemData( oItem );

			var strStatus = '';
			if ( oItem.recommended )
				strStatus = 'Recommended For You';
			else if ( oItem.status_string )
				strStatus = oItem.status_string;
			else if ( rgData && rgData.early_access )
				strStatus = 'Early Access Now Available'
			else if ( oItem.new_on_steam )
				strStatus = 'New On Steam';
			else if ( oItem.top_seller )
				strStatus = 'Top Seller';
			else if ( rgData && rgData.coming_soon )
				strStatus = 'Pre-Purchase Now'
			else
				strStatus = 'Now Available'

			var strFeature = 'main_cluster';
			if ( oItem.recommended )
				strFeature = 'main_cluster_recommended';
			else if ( oItem.top_seller )
				strFeature = 'main_cluster_topseller';
			else if ( oItem.new_on_steam )
				strFeature = 'main_cluster_newonsteam';

			var $CapCtn = GHomepage.BuildHomePageMainCap( oItem.appid, oItem.packageid, strStatus, strFeature, i );
			if ( $CapCtn )
			{
				$MainCluster.append( $CapCtn );
				if ( !$FirstCap )
					$FirstCap = $CapCtn;
			}
			else
				cMainCaps--;
		}

		if ( $FirstCap )
			$MainCluster.append( $FirstCap.clone( true ) );

		// global
		if ( GHomepage.MainCapCluster )
			GHomepage.MainCapCluster.setCaps( cMainCaps );
		else
			GHomepage.MainCapCluster = new Cluster( {
				cCapCount: cMainCaps,
				nCapWidth: 616 + 4,
				elClusterArea: $J('#home_main_cluster'),
				elSlider: $J('#main_cluster_control'),
				elScrollLeftBtn: $J('#main_cluster_control_previous'),
				elScrollRightBtn: $J('#main_cluster_control_next'),
				bUseActiveClass: true,
				rgImageURLs: {},
				onChangeCB: GDynamicStore.HandleClusterChange
			} );

		$MainCluster.InstrumentLinks();
		GDynamicStore.DecorateDynamicItems( $MainCluster );
	},

	RenderNewOnSteam: function()
	{
		var rgNewOnSteamNoMainCap = [];
		for( var i = 0; i < GHomepage.oDisplayLists.new_on_steam.length; i++ )
		{
			var rgItem = GHomepage.oDisplayLists.new_on_steam[i];
			if ( !GHomepage.oFeaturedMainCapItems[ GHomepage.ItemKey( rgItem ) ] )
				rgNewOnSteamNoMainCap.push( rgItem );
		}

		var rgFeaturedLaunchTitles = GHomepage.FilterItemsForDisplay(
			rgNewOnSteamNoMainCap, 'new_on_steam', 0, 3
		);

		var $NewOnSteam = $J('.home_smallcap_area.new_on_steam .home_smallcaps' ).empty();
		for( var i = 0; i < rgFeaturedLaunchTitles.length; i++ )
		{
			var oItem = rgFeaturedLaunchTitles[i];

			var $CapCtn = GHomepage.BuildHomePageSmallCap( 'new_on_steam', oItem.appid, oItem.packageid );
			$NewOnSteam.append( $CapCtn );
		}
		$NewOnSteam.append( $J('<div/>', {'style': 'clear: left;' } ) );

		if ( rgFeaturedLaunchTitles.length )
		{
			$J('.home_smallcap_area.new_on_steam').show();
			$NewOnSteam.InstrumentLinks();
			GDynamicStore.DecorateDynamicItems( $NewOnSteam );
		}
		else
		{
			$J('.home_smallcap_area.new_on_steam').hide();
		}
	},


	RenderRecentlyUpdated: function()
	{
		var rgFeaturedUpdateTitles = GHomepage.FilterItemsForDisplay(
			GHomepage.oDisplayLists.recently_updated, 'recently_updated', 0, 3
		);

		var $RecentlyUpdated =  $J('.home_smallcap_area.recently_updated .home_smallcaps' ).empty();
		for( var i = 0; i < rgFeaturedUpdateTitles.length; i++ )
		{
			var oItem = rgFeaturedUpdateTitles[i];

			var $CapCtn = GHomepage.BuildHomePageSmallCap( 'recently_updated', oItem.appid, 0 );
			$CapCtn.append( $J('<div/>', {'class': 'recently_updated_desc' }).text( oItem.description ) );
			if ( oItem.announcementid.length != 0 )
			{
				var strAnnouncementLink = 'http://steamcommunity.com/ogg/' + oItem.appid + '/announcements/detail/' + oItem.announcementid + '/';
				var $AnnouncementLink = $J('<div/>', {'class': 'recently_updated_announcement_link', 'text' : 'View Update Details', 'data-ds-link' : strAnnouncementLink } );
				$AnnouncementLink.click(function(e) {
					top.location.href = $J( this).attr( 'data-ds-link' );
					return false;
				} );
				$CapCtn.append( $AnnouncementLink );
			}
			$RecentlyUpdated.append( $CapCtn );
		}
		$RecentlyUpdated.append( $J('<div/>', {'style': 'clear: left;' } ) );

		if ( rgFeaturedUpdateTitles.length )
		{
			$J('.home_smallcap_area.recently_updated').show();
			$RecentlyUpdated.InstrumentLinks();
			GDynamicStore.DecorateDynamicItems( $RecentlyUpdated );
		}
		else
		{
			$J('.home_smallcap_area.recently_updated').hide();
		}

	},

	MergeLists: function( /* rgList1, bShuffle1, rgList2, bShuffleList2, rgList3, bShuffleList3, etc... */ )
	{
		return GHomepage.MergeListsInternal( arguments, false );
	},

	ZipLists: function( /* rgList1, bShuffle1, rgList2, bShuffleList2, rgList3, bShuffleList3, etc... */ )
	{
		return GHomepage.MergeListsInternal( arguments, true );
	},

	MergeListsInternal: function( args, bZip )
	{
		var rgLists = [];
		for ( var iArg = 0; iArg < args.length; iArg++ )
		{
			var rgList = args[iArg];
			if ( iArg + 1 < args.length && args[++iArg] )
				rgList = v_shuffle( rgList );
			rgLists.push( rgList );
		}

		var oIncludedItems = {};
		var rgOutput = [];

		var fnAddItem = function( rgItem ) {
			var key = GHomepage.ItemKey( rgItem );
			if ( !oIncludedItems[key] )
			{
				oIncludedItems[key] = true;
				rgOutput.push( rgItem );
				return true;
			}
			return false;
		};

		if ( bZip )
		{
			var rgIndicies = [];
			while( rgIndicies.length < rgLists.length )
				rgIndicies.push( 0 );

			var bRemaining = true;
			while ( bRemaining )
			{
				bRemaining = false;
				for( var iList = 0; iList < rgLists.length; iList++ )
				{
					var rgList = rgLists[iList];
					var i = rgIndicies[iList];
					if ( i >= rgList.length )
						continue;

					// keep trying to add until one sticks
					while( i < rgList.length && !fnAddItem( rgList[i++] ) )
						;
					rgIndicies[iList] = i;
					bRemaining = true;
				}
			}
		}
		else
		{
			for ( var iList = 0; iList < rgLists.length; iList++ )
			{
				var rgList = rgLists[iList];
				for ( var i = 0; i < rgList.length; i++ )
					fnAddItem( rgList[i] );
			}
		}

		return rgOutput;
	},

	GetStoreItemData: function( rgItem )
	{
		return rgItem.appid ? GStoreItemData.rgAppData[ rgItem.appid] : GStoreItemData.rgPackageData[ rgItem.packageid ];
	},

	GetCapParams: function( strFeatureContext, unAppID, unPackageID, params, nDepth )
	{
		var rgItemData = ( unAppID ? GStoreItemData.rgAppData[ unAppID] : GStoreItemData.rgPackageData[ unPackageID ] );

		if ( !rgItemData )
			return null;

		if ( unAppID )
		{
			params['data-ds-appid'] = unAppID;
			params['href'] = GStoreItemData.GetAppURL( unAppID, strFeatureContext, nDepth );
		}
		else
		{
			params['data-ds-packageid'] = unPackageID;
			params['href'] = GStoreItemData.GetPackageURL( unPackageID, strFeatureContext, nDepth );
			if ( rgItemData['appids'] )
				params['data-ds-appid'] = rgItemData['appids'];
		}

		return rgItemData;
	},

	BuildHomePageSmallCap: function( strFeatureContext, unAppID, unPackageID )
	{
		var params = { 'class': 'home_smallcap' };
		var rgItemData = GHomepage.GetCapParams( strFeatureContext, unAppID, unPackageID, params );
		if ( !rgItemData )
			return null;

		var $CapCtn = $J('<a/>', params );
		GStoreItemData.BindHoverEvents( $CapCtn, unAppID, unPackageID );

		$CapCtn.append( $J('<img/>', { src: rgItemData.small_capsule } ) );
		$CapCtn.append( $J('<div/>', {'class': 'home_smallcap_title ellipsis' } ).html( rgItemData.name ) );
		$CapCtn.append( $J('<div/>').html( rgItemData.discount_block ? $J(rgItemData.discount_block).addClass('discount_block_inline') : '&nbsp;' ) );

		return $CapCtn;
	},

	BuildHomePageMainCap: function( unAppID, unPackageID, strStatus, strFeature, nDepth )
	{
		var params = { 'class': 'cluster_capsule' };
		var rgItemData = GHomepage.GetCapParams( strFeature, unAppID, unPackageID, params, nDepth );
		if ( !rgItemData )
			return null;

		var $CapCtn = $J('<a/>', params );

		if ( rgItemData.main_capsule )
		{
			$CapCtn.append( $J('<img/>', {'class': 'cluster_capsule_image', src: 'https://steamstore-a.akamaihd.net/public/images/blank.gif', 'data-image-url': rgItemData.main_capsule } ) );
		}
		else
		{
			var strImageURL = rgItemData.header ? rgItemData.header : rgItemData.package_header;
			if ( strImageURL )
			{
				$CapCtn.append( $J('<div/>', {'class': 'cluster_maincap_fill ' + (rgItemData.package_header ? 'package' : '') } )
					.append(
						$J('<img/>', {'class': 'cluster_capsule_image cluster_maincap_fill_bg', src: 'https://steamstore-a.akamaihd.net/public/images/blank.gif', 'data-image-url': strImageURL } ),
						$J('<img/>', {'class': 'cluster_maincap_fill_header', src: 'https://steamstore-a.akamaihd.net/public/images/blank.gif', 'data-image-url': strImageURL } )
					)
				);
			}
			else
			{
				// no image to display!
				return null;
			}
		}

		if ( rgItemData.discount_block )
			$CapCtn.append( $J(rgItemData.discount_block).addClass( 'discount_block_large main_cap_discount' ) );
			$CapCtn.append( $J('<div/>', {'class': 'main_cap_desc'})
			.append( $J('<div/>', {'class': 'main_cap_content'})
				.append( $J('<div/>', {'class': 'main_cap_platform_area platform_area'}).html( GHomepage.BuildSupportedPlatformIcon( rgItemData ) ) )
				.append( $J('<div/>', {'class': 'main_cap_status'}).text( strStatus ) )
			)
		);

		return $CapCtn;
	},

	BuildSupportedPlatformIcon: function( rgItemData )
	{
		var strHTML = '';
		if ( rgItemData.os_macos )
			strHTML += '<span class="platform_img mac"></span>';
		if ( rgItemData.os_linux )
			strHTML += '<span class="platform_img linux"></span>';

		var bIsSteamplay = strHTML.length > 0;

		return '<span class="platform_img win"></span>' + strHTML + ( bIsSteamplay ? '<span class="platform_img steamplay"></span>' : '' );
	},

	FilterItemsForDisplay: function( rgItems, strSettingsName, cMinItemsToDisplay, cMaxItemsToDisplay )
	{

		var Settings = GHomepage.oSettings[strSettingsName] || {};
		var ApplicableSettings = GHomepage.oApplicableSettings[strSettingsName] || {};

		if ( !cMaxItemsToDisplay )
			cMaxItemsToDisplay = cMinItemsToDisplay;

		return GStoreItemData.FilterItemsForDisplay( rgItems, Settings, ApplicableSettings, cMaxItemsToDisplay, cMinItemsToDisplay )
	},

	PersistSettings: function()
	{
		WebStorage.SetLocal( 'home_viewsettings', GHomepage.oSettings, true );
	},

	CheckLocalStorageSettings: function()
	{
		// to defeat bfcache
		var oSettings = WebStorage.GetLocal( 'home_viewsettings', true );
		if ( oSettings )
			GHomepage.oSettings = oSettings;
	},

	RenderRecommendedTags: function()
	{
		var rgGenreTags = [19,21,597,492,128,699,122,599,9,701,113,493];
		// array( 'tagid' => $Tag->tagid, 'name' => $Tag->name, 'weight' => $Tag->weight )

		var $TagBlock = $J('#home_gutter_recommendedtags');
		var $TagList = $TagBlock.find('.gutter_items');
		var cTagsFound = 0;
		for ( var i = 0; i < GDynamicStore.s_rgRecommendedTags.length; i++ )
		{
			var rgTag = GDynamicStore.s_rgRecommendedTags[i];
			if ( rgGenreTags.indexOf( rgTag.tagid ) == -1 )
			{
				var url = GStoreItemData.AddNavEventParamsToURL( 'http://store.steampowered.com/tag/en/TAGNAME/'.replace( /TAGNAME/, encodeURIComponent( rgTag.name ) ), 'gutter' );
				$TagList.append( $J('<a/>', {'class': 'gutter_item', 'href' : url}).text( rgTag.name ) );

				if ( ++cTagsFound >= 5 )
					break;
			}
		}
		if ( cTagsFound > 1 )
		{
			$TagList.InstrumentLinks();
			$TagBlock.show();
		}
	},

	RenderRecommendedForYouSpotlight: function()
	{
		var $Element = $J('#home_recommended_spotlight');
		var rgGamesShown = [];

		var rgRecommendedSpotlightOptions = [];

		for ( var i = 0; i < GHomepage.rgRecommendedGames.length && rgRecommendedSpotlightOptions.length < 2; i++ )
		{
			var unAppID = GHomepage.rgRecommendedGames[i].appid;
			if ( GStoreItemData.BAppPassesFilters( unAppID, GHomepage.oSettings.main_cluster, GHomepage.oApplicableSettings.main_cluster ) )
				rgRecommendedSpotlightOptions.push( unAppID );
		}

		if ( rgRecommendedSpotlightOptions.length > 0 )
		{
			$Spotlight = GHomepage.RenderRecommendedSpotlight( rgRecommendedSpotlightOptions[0], 'Similar to games you play' );
			if ( $Spotlight )
			{
				$Element.append( $Spotlight );
				rgGamesShown.push( rgRecommendedSpotlightOptions[0] );
			}
		}

		if ( rgGamesShown.length < 2 && GHomepage.rgFriendRecommendations )
		{
			for ( var i = 0; i < GHomepage.rgFriendRecommendations.length; i++ )
			{
				var unAppID = GHomepage.rgFriendRecommendations[i].appid;
				if ( rgGamesShown.indexOf( unAppID ) == -1 )
				{
					$Spotlight = GHomepage.RenderRecommendedSpotlight( unAppID, 'Recommended by friends' );
					if ( $Spotlight )
					{
						$Element.append( $Spotlight );
						rgGamesShown.push( unAppID );
						GHomepage.rgFriendRecommendations.splice( i, 1 );
						break;
					}
				}
			}
		}

		if ( rgGamesShown.length < 2 )
		{
			// try and find something onsale from wishlist that we have data for
			var rgWishlistItemsOnSale = [];
			for ( var unAppID in GDynamicStore.s_rgWishlist )
			{
				if ( GStoreItemData.rgAppData[unAppID] && GStoreItemData.rgAppData[unAppID].discount &&
					rgGamesShown.indexOf( unAppID ) == -1 )
					rgWishlistItemsOnSale.push( unAppID );
			}

			v_shuffle( rgWishlistItemsOnSale );
			for ( var i = 0; i < rgWishlistItemsOnSale.length; i++ )
			{
				// game from wishlist on sale
				$Spotlight = GHomepage.RenderRecommendedSpotlight( rgWishlistItemsOnSale[i], 'From your wishlist' );
				if ( $Spotlight )
				{
					$Spotlight.children( 'a.recommended_spotlight' ).addClass( 'wishlist_recommendation' );
					$Element.append( $Spotlight );
					rgGamesShown.push( rgWishlistItemsOnSale[i] );
					break;
				}
			}
		}

		if ( rgGamesShown.length < 2 && rgRecommendedSpotlightOptions.length > 1 && rgGamesShown.indexOf( rgRecommendedSpotlightOptions[1] ) == -1 )
		{
			$Spotlight = GHomepage.RenderRecommendedSpotlight( rgRecommendedSpotlightOptions[1], 'Similar to games you play' );
			if ( $Spotlight )
			{
				$Element.append( $Spotlight );
				rgGamesShown.push( rgRecommendedSpotlightOptions[1] );
			}
		}

		// remove anything we showed here from the main cluster rotation
		for ( var i = GHomepage.rgRecommendedGames.length - 1; i >= 0; i-- )
		{
			if ( rgGamesShown.indexOf( GHomepage.rgRecommendedGames[i].appid ) != -1 )
			{
				GHomepage.rgRecommendedGames.splice( i, 1 );
			}
		}

		GDynamicStore.DecorateDynamicItems( $Element );
	},

	RenderRecommendedSpotlight: function( unAppID, strDescription, bNoDSFlag )
	{
		var $SpotlightCtn = $J('<div/>', {'class': 'recommended_spotlight_ctn' } );

		var params = { 'class': 'recommended_spotlight' };
		var rgItemData = GHomepage.GetCapParams( 'recommended_spotlight', unAppID, null, params );

		if ( !rgItemData )
			return null;

		var strHeaderURL = rgItemData.header;
		if ( !strHeaderURL )	// wishlist items may not have a header loaded
			strHeaderURL = 'https://steamcdn-a.akamaihd.net/steam/apps/' + unAppID + '/header.jpg';

		var $Spotlight = $J('<a/>', params );
		GStoreItemData.BindHoverEvents( $Spotlight, unAppID );
		$Spotlight.append( $J('<div/>', {'class': 'recommended_spotlight_cap'}).append( $J('<img/>', {src: strHeaderURL } ) ) );
		$Spotlight.append( $J('<div/>', {'class': 'recommended_spotlight_price' }).html( rgItemData.discount_block ? $J(rgItemData.discount_block).addClass('discount_block_inline') : '&nbsp;' ) );

		$SpotlightCtn.append(
			$J('<div/>', {'class': 'recommended_spotlight_desc'} ).text( strDescription ),
			$Spotlight
		);
		return $SpotlightCtn;
	}
};

function CHomeSettings( strSectionName, fnOnSettingsChange )
{
	this.m_strSectionName = strSectionName;
	this.m_ApplicableSettings = GHomepage.oApplicableSettings[strSectionName];
	this.m_Settings = GHomepage.oSettings[strSectionName];
	this.m_fnOnSettingsChange = fnOnSettingsChange;

	this.m_$ActiveBtn = null;
	this.m_$Popup = null;
}

CHomeSettings.prototype.RenderCustomizeButton = function()
{
	var $Btn = $J('<div/>', {'class': 'home_btn home_customize_btn' } ).text( 'Customize' );
	$Btn.click( $J.proxy( this.DisplayPopup, this, $Btn ) );
	return $Btn;
};

CHomeSettings.prototype.DisplayPopup = function( $Btn )
{
	if ( this.m_$Popup )
		return;

	this.m_$ActiveBtn = $Btn;

	this.m_$ActiveBtn.addClass( 'active' );

	this.m_$Popup = $J('<div/>', {'class': 'home_viewsettings_popup' } );
	this.m_$Popup.append( $J('<div/>', {'class': 'home_viewsettings_instructions' } ).text( 'Select the types of products that you wish to see in this section' ) );

	if ( this.m_ApplicableSettings.popular_new_releases )
		this.m_$Popup.append( this.RenderCheckbox( 'popular_new_releases', 'Popular New Releases' ) );
	if ( this.m_ApplicableSettings.top_sellers )
		this.m_$Popup.append( this.RenderCheckbox( 'top_sellers', 'Top Sellers' ) );
	if ( this.m_ApplicableSettings.early_access )
		this.m_$Popup.append( this.RenderCheckbox( 'early_access', 'Early Access Products' ) );
	if ( this.m_ApplicableSettings.games_already_in_library )
		this.m_$Popup.append( this.RenderCheckbox( 'games_already_in_library', 'Games already in your account' ) );
	if ( this.m_ApplicableSettings.games_not_in_library )
		this.m_$Popup.append( this.RenderCheckbox( 'games_not_in_library', 'Games not in your account' ) );
	if ( this.m_ApplicableSettings.recommended_for_you )
		this.m_$Popup.append( this.RenderCheckbox( 'recommended_for_you', 'Recommended For You' ) );
	if ( this.m_ApplicableSettings.prepurchase )
		this.m_$Popup.append( this.RenderCheckbox( 'prepurchase', 'Prepurchase' ) );
	if ( this.m_ApplicableSettings.games )
		this.m_$Popup.append( this.RenderCheckbox( 'games', 'Games' ) );
	if ( this.m_ApplicableSettings.software )
		this.m_$Popup.append( this.RenderCheckbox( 'software', 'Software' ) );
	if ( this.m_ApplicableSettings.dlc_for_you )
		this.m_$Popup.append( this.RenderCheckbox( 'dlc_for_you', 'DLC for your games & software' ) );
	if ( this.m_ApplicableSettings.recently_viewed )
		this.m_$Popup.append( this.RenderCheckbox( 'recently_viewed', 'Products you\'ve recently viewed' ) );
	if ( this.m_ApplicableSettings.new_on_steam )
		this.m_$Popup.append( this.RenderCheckbox( 'new_on_steam', 'New On Steam' ) );
	if ( this.m_ApplicableSettings.dlc )
		this.m_$Popup.append( this.RenderCheckbox( 'dlc', 'Downloadable Content' ) );

	if ( this.m_ApplicableSettings.only_current_platform )
	{
		// this one is a little magic
		if ( GDynamicStore.s_bUserOnLinux )
			this.m_$Popup.append( this.RenderCheckbox( 'only_current_platform', 'Available for Linux/SteamOS' ) );
		else if ( GDynamicStore.s_bUserOnMacOS )
			this.m_$Popup.append( this.RenderCheckbox( 'only_current_platform', 'Available for Mac' ) );
	}

	var nOffsetTop = $Btn.position().top + $Btn.outerHeight();
	var nOffsetRight = $Btn.position().left + $Btn.outerWidth( true );

	this.m_$Popup.css( 'top', nOffsetTop + 'px' );

	$Btn.parent().append( this.m_$Popup );

	this.m_$Popup.css( 'left', ( nOffsetRight - this.m_$Popup.outerWidth() ) + 'px' );

	var _this = this;
	window.setTimeout( function() {
		$J(document).on( 'click.CHomeSettings', function( event ) {
			if ( !_this.m_$Popup.has( event.target).length && !_this.m_$Popup.is( event.target ) )
				_this.DismissPopup();
		}).on( 'keyup.CHomeSettings', function( event ) {
			if ( event.which == 27 )
				_this.DismissPopup();
		});
	}, 1 );
};

CHomeSettings.prototype.RenderCheckbox = function( strSettingName, strDisplayLabel )
{
	var $Row = $J('<div/>', {'class': 'home_viewsettings_checkboxrow ellipsis' } );

	if ( this.m_ApplicableSettings[strSettingName] == 'always' )
		$Row.addClass( 'disabled' );

	var $Checkbox = $J('<div/>', {'class': 'home_viewsettings_checkbox' } );
	if ( this.m_Settings[strSettingName] || this.m_ApplicableSettings[strSettingName] == 'always' )
		$Checkbox.addClass('checked');

	var $Label = $J('<div/>', {'class': 'home_viewsettings_label'} ).text( strDisplayLabel );

	$Row.append( $Checkbox, $Label );

	if ( this.m_ApplicableSettings[strSettingName] != 'always' )
	{
		$Row.click( $J.proxy( this.OnCheckboxToggle, this, strSettingName, $Checkbox ) );
	}

	return $Row;
};

CHomeSettings.prototype.OnCheckboxToggle = function( strSettingName, $Checkbox )
{
	var bEnabled = $Checkbox.hasClass( 'checked' );

	if ( bEnabled )
		$Checkbox.removeClass( 'checked' );
	else
		$Checkbox.addClass( 'checked' );

	this.m_Settings[strSettingName] = !bEnabled;

	var _this = this;
	$J.post( 'https://store.steampowered.com/dynamicstore/updatehomeviewsettings', {
		sessionid: g_sessionID,
		section: this.m_strSectionName,
		settings: V_ToJSON( this.m_Settings )
	}).done( function () {
		_this.m_fnOnSettingsChange();
		GHomepage.PersistSettings();
	}).fail( function() {
		_this.DismissPopup();
		_this.m_Settings[strSettingName] = bEnabled;	// revert
		ShowAlertDialog( 'Customize', 'There was a problem saving your preferences.  Please try again later.' );
	} );
};

CHomeSettings.prototype.DismissPopup = function()
{
	this.m_$Popup.remove();
	this.m_$Popup = null;
	this.m_$ActiveBtn.removeClass( 'active' );
	$J(document).off( 'click.CHomeSettings' ).off( 'keyup.CHomeSettings' );
};


function GetAvatarURL( strAvatarHash, sizeStr )
{
	return 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/' + strAvatarHash.substr( 0 , 2 ) + '/' + strAvatarHash + sizeStr + '.jpg';
}

GSteamCurators = {
	rgAppsRecommendedByCurators: [],
	rgSteamCurators: [],

	Init: function( rgSteamCurators, rgApps )
	{
		GSteamCurators.rgSteamCurators = rgSteamCurators;
		GSteamCurators.rgAppsRecommendedByCurators = rgApps;

		GSteamCurators.Render();
	},

	BuildHomePageHeaderCap: function( strFeatureContext, oItem )
	{
		var unAppID = oItem.appid;
		var unPackageID = 0;
		var params = { 'class': 'curated_app_link' };
		var rgItemData = GHomepage.GetCapParams( strFeatureContext, unAppID, unPackageID, params );
		if ( !rgItemData )
			return null;

		var $Item = $J('<div/>', {'class': 'curated_app_item'} );
		GStoreItemData.BindHoverEvents( $Item, unAppID, unPackageID );

		// href
		var $CapCtn = $J('<a/>', params );
		$Item.append( $CapCtn );

		// app image
		$Image = $J('<img/>', { src: rgItemData.headerv5 } );
		$CapCtn.append( $Image );

		// show up to 3 curators per app
		var curatorsCache = GSteamCurators.rgAppsRecommendedByCurators.curators;
		var $Curators = $J('<div/>', {'class': 'curated_app_curators'} );
		var numCuratorsAdded = 0;
		for ( var j = 0; j < oItem.rgCurators.length && numCuratorsAdded < 3; ++j )
		{
			var clanID = oItem.rgCurators[j];
			if ( curatorsCache.hasOwnProperty( clanID ) )
			{
				var curator = curatorsCache[clanID];
				var $Curator =  $J('<div/>', {'class': 'steam_curator_for_app tooltip', 'onclick': "top.location.href='" + curator.link + "'", "data-tooltip-content": curator.name } );
				var $CuratorImg = $J('<img/>', {'class': 'steam_curator_for_app_img', 'src': GetAvatarURL( curator.strAvatarHash, '' ) });
				$Curator.append( $CuratorImg );
				$Curator.v_tooltip();

				$Curators.append( $Curator );
				++numCuratorsAdded;
			}
		}
		$Curators.append( $J('<div/>', {'style': 'clear: left'} ) );
		$Item.append( $Curators );

		// pricing info
		$CapCtn.append( $J('<div/>', {'class': 'home_headerv5_title ellipsis' } ).html( rgItemData.name ) );
		$CapCtn.append( $J('<div/>').html( rgItemData.discount_block ? $J(rgItemData.discount_block).addClass('discount_block_inline') : '&nbsp;' ) );

		return $Item;
	},

	BuildCuratorItem: function( curator )
	{
		var $Item = $J('<div/>', {'class': 'steam_curator', 'onclick': "top.location.href='" + curator.link + "'" } );
		var $Img = $J('<img/>', {'class': 'steam_curator_img', 'src': GetAvatarURL( curator.strAvatarHash, '_medium' ) });
		$Item.append( $Img );
		$Item.append( $J('<div/>', {'class': 'steam_curator_name' } ).text( curator.name ) );
		if ( curator.curator_description )
		{
			$Item.append( $J('<div/>', {'class': 'steam_curator_featuring_desc' } ).text( 'Featuring:' ) );
			$Item.append( $J('<div/>', {'class': 'steam_curator_desc' } ).text( curator.curator_description ) );
		}
		$Item.append( $J('<div/>', {'style': 'clear: left;' } ) );

		return $Item;
	},

	Render: function()
	{
		$J('.steam_curators_ctn').hide();
		$J('.apps_recommended_by_curators_ctn').hide();

		$J('#apps_recommended_by_curators').empty();
		$J('#steam_curators').remove( ".steam_curator" );

		// if there are apps, then show them
		var bShowApps = 1;
		if ( bShowApps && GSteamCurators.rgAppsRecommendedByCurators && GSteamCurators.rgAppsRecommendedByCurators.length != 0 &&
			 GSteamCurators.rgAppsRecommendedByCurators.apps.length != 0 )
		{
			var apps = GSteamCurators.rgAppsRecommendedByCurators.apps;

			var rgRecommendedApps = GHomepage.FilterItemsForDisplay(
				apps, 'curators', 4
			);

			if ( rgRecommendedApps.length >= 4 )
			{
				$J('.apps_recommended_by_curators_ctn').show();
				var $RecommendedApps = $J('#apps_recommended_by_curators');

				for ( var i = 0; i < rgRecommendedApps.length; i++ )
				{
					var oItem = rgRecommendedApps[i];
					var $Item = GSteamCurators.BuildHomePageHeaderCap( 'curated_app', oItem );
					if ( $Item )
					{
						$RecommendedApps.append( $Item );
					}
				}
				$RecommendedApps.InstrumentLinks();
				GDynamicStore.DecorateDynamicItems( $RecommendedApps );
				return;
			}
		}

		$J('.steam_curators_ctn').show();
		// if no apps, then curators
		if ( GSteamCurators.rgSteamCurators && GSteamCurators.rgSteamCurators.length != 0 )
		{
			$J('#steam_curators_not_empty').show();
			var $Curators = $J('#steam_curators');

			for ( var i = 0; i < GSteamCurators.rgSteamCurators.length; i++ )
			{
				var curator = GSteamCurators.rgSteamCurators[i];

				var $Item = GSteamCurators.BuildCuratorItem( curator );
				$Curators.append( $Item );
			}
		}
		else
		{
			$J('#steam_curators_not_empty').hide();
			$J('#steam_curators_empty').show();
		}
	}
};

function srand(nSeed)
{
	this.nModulus = 0x80000000;
	this.nMultiplier = 1103515245;
	this.nIncrement = 12345;

	this.nLast = nSeed ? nSeed : Math.floor(Math.random() * (this.nModulus-1));
};
srand.prototype.nextInt = function()
{
	this.nLast = (this.nMultiplier * this.nLast + this.nIncrement) % this.nModulus;
	return this.nLast;
};
srand.prototype.nextFloat = function()
{
	return this.nextInt() / (this.nModulus - 1);
};
srand.prototype.nextIntBetween = function(nStart, nEnd)
{
	var nRangeSize = nEnd - nStart;
	var fRand = this.nextInt() / this.nModulus;
	return nStart + Math.floor(fRand * nRangeSize);
};
srand.prototype.choice = function(rgOptions)
{
	return rgOptions[this.nextIntIn(0, rgOptions.length)];
};

var bAutoLoaderReady = false;
var g_bDisableAutoloader = false;

(function ( $ ) {

	$.fn.autoloader = function( options ) {
		var settings = $.extend({
			triggerStart: 0,
			template_url: false,
			recommendations_url: false,
			additional_url: false
		}, options );



		return this.each(function( i, ele ) {

			ele.indices = {chunks: 0};

			var offset = $(ele).offset();
			this.nNextTrigger = $(ele).height() + offset.top - 750;

			ele.bTriggerActive = false;
			ele.tagIndex = 0
			ele.nRecommendedDataIndex = 0;
			ele.rgSeenApps = [];


			var loadFunc = function() {
				ele = this;

				if( this.bTriggerActive || g_bDisableAutoloader )
				{
					return;
				}

				this.bTriggerActive = true;

				if( this.rgRecommendedData )
				{
					$(this).show();

					// Main cap

					var nItems = 0;
					while( nItems < 2 && this.rgRecommendedData.tags.length > 0 )
					{
						var rgMainCap = {
							tagid: this.rgRecommendedData.tags[this.nRecommendedDataIndex].tagid,
							tagname: this.rgRecommendedData.tags[this.nRecommendedDataIndex].tagname,
							items: []
						};

						nItems = 0

						while( nItems < 2 && this.rgRecommendedData.tags[this.nRecommendedDataIndex].items.length > 0)
						{
							var nAppId = this.rgRecommendedData.tags[this.nRecommendedDataIndex].items.shift();
							if( !GDynamicStore.BIsAppOwned( nAppId ) && !GDynamicStore.BIsAppIgnored( nAppId ) && this.rgSeenApps.indexOf( nAppId ) === -1 )
							{
								rgMainCap.items.push(nAppId);
								nItems++;
								this.rgSeenApps.push(nAppId);
							}
						}

						// If we can't fill the bucket, remove it.
						if( nItems < 2 )
						{
							this.rgRecommendedData.tags.splice(this.nRecommendedDataIndex,1);
							this.nRecommendedDataIndex = ( this.nRecommendedDataIndex + 1 ) % this.rgRecommendedData.tags.length;
						}
					}

					if( nItems < 2 )
					{
						$('#content_out').show();
						$('#LoadingContent').hide();
						return;
					}

					this.nRecommendedDataIndex = ( this.nRecommendedDataIndex + 1 ) % this.rgRecommendedData.tags.length;

					// Secondary cap

					nItems = 0;
					while( nItems < 4 && this.rgRecommendedData.tags.length > 0 )
					{
						var rgSubCap = {
							tagid: this.rgRecommendedData.tags[this.nRecommendedDataIndex].tagid,
							tagname: this.rgRecommendedData.tags[this.nRecommendedDataIndex].tagname,
							items: []
						};

						nItems = 0;
						while( nItems < 4 && this.rgRecommendedData.tags[this.nRecommendedDataIndex].items.length > 0)
						{
							var nAppId = this.rgRecommendedData.tags[this.nRecommendedDataIndex].items.shift();
							if( !GDynamicStore.BIsAppOwned( nAppId ) && !GDynamicStore.BIsAppIgnored( nAppId ) && this.rgSeenApps.indexOf( nAppId ) === -1 )
							{
								rgSubCap.items.push(nAppId);
								nItems++;
								this.rgSeenApps.push(nAppId);
							}
						}

						// If we can't fill the bucket, remove it.
						if( nItems < 4 )
						{
							this.rgRecommendedData.tags.splice(this.nRecommendedDataIndex,1);
							this.nRecommendedDataIndex = ( this.nRecommendedDataIndex + 1 ) % this.rgRecommendedData.tags.length;
						}
					}

					if( nItems < 4 )
					{
						$('#content_out').show();
						$('#LoadingContent').hide();
						return;
					}

					this.nRecommendedDataIndex = ( this.nRecommendedDataIndex + 1 ) % this.rgRecommendedData.tags.length;

					var nItems = 0;
					var rgSimilarItems = [];
					var rgBuckets = ['recent', 'played', 'friends', 'wishlist', 'curators'];
					while( rgSimilarItems.length < 3 && rgBuckets.length > 0 )
					{
						var nIndex = ele.srand.nextIntBetween(0,rgBuckets.length);
						WebStorage.SetLocal('home_seed',ele.srand.nLast, true );
						$('#content_seed').val(ele.srand.nLast);
						var strBucket = rgBuckets[nIndex];
						if( this.rgRecommendedData[strBucket].length == 0 )
						{
							rgBuckets.splice( nIndex, 1 );
							continue;
						}

						var rgItem = this.rgRecommendedData[strBucket].shift();

						// Don't show items similar to ones I'm ignoring
						if( ( strBucket == 'recent' || strBucket == 'curators' || strBucket == 'friends' ) && GDynamicStore.BIsAppIgnored( rgItem.appid ) )
							continue;

						// Don't recommend items I already own
						if( ( strBucket == 'curators' || strBucket == 'friends' ) && GDynamicStore.BIsAppOwned( rgItem.appid ) )
							continue;

						var rgItem = {
							type: strBucket,
							appid: rgItem.appid
						};
						rgSimilarItems.push(rgItem);

					}

					this.bTriggerActive = true;

					$('#content_loading').show();

					var jqxhr = $.ajax( {
						url: settings.template_url,
						data: {
							main: rgMainCap,
							sub: rgSubCap,
							similar: rgSimilarItems
						},
						//dataType: 'json',
						type: 'GET'
					}).done(function( data ) {
						ele.index++;
						var newElement = $(data);

						GDynamicStore.DecorateDynamicItems(newElement);

						$('.gamelink.ds_owned', newElement).parent().parent().hide();

						$('*[data-ds-appid]', newElement).each(function(index, e){
							var nAppId = $(e).data('ds-appid');
							if( ele.rgSeenApps.indexOf( nAppId ) === -1 )
							{
								ele.rgSeenApps.push( nAppId );
							} else {
								if( $(e).hasClass('gamelink') )
									$(e).parent().parent().hide();
							}
							// If we're going to recommend this game later, skip it for now.
							for( var i=0; i < ele.rgRecommendedData['friends'].length - 1; i++ )
							{
								if( nAppId == ele.rgRecommendedData['friends'][i].appid )
								{
									if( $(e).hasClass('gamelink') )
									{
										$(e).parent().parent().hide();
										ele.rgSeenApps.splice( ele.rgSeenApps.indexOf( nAppId ), 1 );
									}
								}
							}
							if( GDynamicStore.BIsAppIgnored( nAppId ) )
							{
								if( $(e).hasClass('gamelink') )
									$(e).parent().parent().hide();
							}
						});
						$(ele).append(newElement);
						ele.bTriggerActive = false;

						var nCurrentScroll = $(window).scrollTop() + $(window).height();
						ele.nNextTrigger = $(ele).height() + offset.top - 750;
						if(nCurrentScroll > ele.nNextTrigger)
						{
							loadFunc.apply(ele);
						}

					}).always(function() {
						$('#content_loading').hide();
						WebStorage.SetLocal('home_content',$(ele).html(), true);
						//WebStorage.SetLocal('home_seed',ele.nSeed, true );
						WebStorage.SetLocal('home_data',ele.rgRecommendedData, true );
						WebStorage.SetLocal('home_seen',ele.rgSeenApps, true );
						WebStorage.SetLocal('home_index',ele.nRecommendedDataIndex, true );
					});
				} else {
					this.bTriggerActive = true;
					$('#content_loading').show();

					if( $('#content_seed').val() == WebStorage.GetLocal('home_seed', true ) )
					{
						// Clean out any pesky script tags that might have found their way into LS
						var wrapped = $J("<div>" + WebStorage.GetLocal('home_content', true ) + "</div>");
						wrapped.find('script').remove();

						$(this).html( wrapped.html() );
						ele.rgRecommendedData = WebStorage.GetLocal('home_data', true );
						ele.nRecommendedDataIndex = WebStorage.GetLocal('home_index', true );
						ele.nSeed = WebStorage.GetLocal('home_seed', true );
						ele.rgSeenApps = WebStorage.GetLocal('home_seen', true );
						ele.srand = new srand(ele.nSeed);
						$('#content_loading').hide();
						this.bTriggerActive = false;
						setTimeout(function(){ $J('html, body').scrollTop( WebStorage.GetLocal('home_scroll', true ) ) }, 250 );
						return;
					}

					var jqxhr = $.ajax( {
						url: settings.recommendations_url,
						dataType: 'json',
						type: 'GET'
					}).done(function( data ) {

						if( !data || data['tags'].length == 0 )
						{
							$J('#content_more').hide();
							$J('#content_loading').hide();
							$J('#content_callout').hide();
							$J('#content_none').show();
							return;
						}

						data['wishlist'] = [];
						for ( var unAppID in GDynamicStore.s_rgWishlist )
						{
							data['wishlist'].push({appid: unAppID});
						}

						ele.rgRecommendedData = data;
						ele.nSeed = data.seed;
						$('#content_seed').val(ele.nSeed);

						ele.srand = new srand(ele.nSeed);
						ele.bTriggerActive = false;

						loadFunc.apply(ele);

					}).fail( function(){
						$J('#content_more').hide();
						$J('#content_loading').hide();
						$J('#content_callout').hide();
						$J('#content_none').show();
						return;
					} );
				}

				bAutoLoaderReady = true;
			}

			var scrollFunc = function( event ){
				if ( g_bDisableAutoloader )
					return;

				if( bAutoLoaderReady )
					WebStorage.SetLocal('home_scroll',$(window).scrollTop(), true);

				var nCurrentScroll = $(window).scrollTop() + $(window).height();
				if(nCurrentScroll > this.nNextTrigger)
				{
					loadFunc.apply(this);
				}
			};

			$(document).scroll( function() { return scrollFunc.apply(ele) } );
		});

	};

}( jQuery ));

function ScrollToDynamicContent()
{
	$J('html, body').animate({ scrollTop: $J("#homecontent_anchor").offset().top }, 200);
}

function TabSelectLast()
{
	var strLastValue = $J('#last_tab').val();
	if( strLastValue )
	{
		TabSelect( $J('#'+strLastValue+'_trigger')[0], strLastValue );
		LoadDelayedImages('home_tabs');
	}
}

jQuery( document ).ready(function( $ ) {
	TabSelectLast();
});

