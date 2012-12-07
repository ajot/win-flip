(function () {
    "use strict";

    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    // Create a group container for the list control
    var sampleGroups = [

    ];

    // Call USA Today API -> callback is seachCallbackUSAToday
   // $.ajax({ url: 'http://api.usatoday.com/open/articles/topnews/home?count=10&days=0&page=0&encoding=json&api_key=8sz6z4u38yssmr8j3pcfyfs9', dataType: "json", success: searchCallbackUSAToday });

    // Call USA Today's Full Text API -> callback is seachCallbackUSATodayFull
    $.ajax({ url: 'http://api.usatoday.com/articles/nitfx/topnews?api_key=modev2013&encoding=json', dataType: "json", success: searchCallbackUSATodayFull });

    //call Rotten Tomatoes API
    $.ajax({url: 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?apikey=bhtrz42e3ndmmnu4q62ppm2s',dataType: "json",success: searchCallbackRotten});

    //call Pearson's images API
    //$.ajax({ url: 'https://api.pearson.com/dk/v1/images?apikey=f9f161f4027c45ee0b9dc3b92c6bbe0f', dataType: "json", success: searchCallbackPearson });

    function searchCallbackUSATodayFull(data) {
        // Pulls out stories object from data
        var stories = data.stories[0].xml[0].nitf;

        // Sets up a new "group" for win8 list control
        sampleGroups[0] = { key: "group1", title: "USA Today", subtitle: "Group Subtitle: 1", backgroundImage: "", description: "summy data goes here" };

        var total = stories.length;
        var story;

        // Loop throuh all stories and push them into the list component
        for (var i = 0; i < total; i++) {
            story = stories[i];
            list.push({ group: sampleGroups[0], title: story.body[0].bodycontent[0].media[0].mediacaption, subtitle: story.body[0].bodyhead[0].abstract[0].p, description: story.body[0].bodycontent[0].p, content: story.body[0].bodycontent[0].p, backgroundImage: story.body[0].bodycontent[0].media[1].mediareference[0].source });
        }

    }

    function searchCallbackRotten(data) {
        // Pulls out stories object from data
        var movies = data.movies;

        // Sets up a new "group" for win8 list control
        sampleGroups[1] = { key: "group2", title: "Rotten Tomatoes", subtitle: "Group Subtitle: 1", backgroundImage: "", description: "summy data goes here" };

        var total = movies.length;
        var movie;

        // Loop throuh all stories and push them into the list component
        for (var i = 0; i < total; i++) {
            movie = movies[i];
            list.push({ group: sampleGroups[1], title: movie.title, subtitle: "No Story Subtitle", description: movie.synopsis, content: movie.synopsis, backgroundImage: movie.posters.profile });
        }
    }
    // Gets called when data is loaded from ajax call
    //function searchCallbackUSAToday(data) {
    //    // Pulls out stories object from data
    //    var stories = data.stories;

    //    // Sets up a new "group" for win8 list control
    //    sampleGroups[1] = { key: "group2", title: "USA Today", subtitle: "Group Subtitle: 1", backgroundImage: "", description: "summy data goes here" };

    //    var total = stories.length;
    //    var story;

    //    // Loop throuh all stories and push them into the list component
    //    for (var i = 0; i < total; i++) {
    //        story = stories[i];
    //        list.push({ group: sampleGroups[1], title: story.title, subtitle: "No Story Subtitle", description: story.description, content: "No Item Content", backgroundImage: "http://4.bp.blogspot.com/-pHw45wS8Sqk/UFMfIZzSUxI/AAAAAAAANyc/rJZjlab_4bE/s1600/20120913175135ENPRNPRN-USA-TODAY-LOGO-1y-1-1347558695MR.jpg" });
    //    }

    //}



    //// Gets called when data is loaded from ajax call
    //function searchCallbackPearson(data) {
    //    // Pulls out stories object from data
    //    var images = data.images;

    //    // Sets up a new "group" for win8 list control
    //    sampleGroups[2] = { key: "group3", title: "Pearson Images", subtitle: "Group Subtitle: 1", backgroundImage: "", description: "summy data goes here" };

    //    var total = images.length;
    //    var image;

    //    // Loop throuh all stories and push them into the list component
    //    for (var i = 0; i < total; i++) {
    //        image = images[i];
    //        list.push({ group: sampleGroups[2], title: image.caption, subtitle: "No Story Subtitle", description: image.keywords, content: "No Item Content", backgroundImage: image.url });
    //    }

    //}


    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

})();