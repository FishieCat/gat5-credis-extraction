// inject jquery once first since the page already uses $ somehow but incompletely

javascript: (function(e, s) {
    e.src = s;
    e.onload = function() {
        jQuery.noConflict();
        console.log('jQuery injected');
    };
    document.head.appendChild(e);
})(document.createElement('script'), '//code.jquery.com/jquery-latest.min.js')

// original code start

var cred = {}; // object for storing each credit line
var group_order = [] // objects don't guarantee order, so we also use an array
var title_order = {} // object of arrays for title order
var count = 0; // counter for total credit lines
var moby = '' // credits text in moby format
// let's loop over each credit line:
jQuery('main#main > div:nth-child(1) > div:nth-child(2) > ul:nth-child(2) > li').each(function () {
	count += 1; // increase counter
    let name = jQuery(this).find('span:nth-child(1)').text(); // extract the name
    let subline = jQuery(this).find('span:nth-child(2)').text(); // extract bottom text
	
	var commas = subline.split(",").length - 1; // comma counter because we comma-split

	group = ''; title = '';
	if ( commas == 1 ) { // one comma, normal
		title = subline.split(',')[0]; // title left of comma
		group = subline.split(',')[1].trim(); // group right of comma
	} else if ( commas == 2 ) { // two commas
		// using ugly replacement to temporarily "protect" commas other than the last
		let sublinecomma = subline.replace(',','XYZCOMMA');
		title = sublinecomma.split(',')[0].replace('XYZCOMMA',',');
		group = sublinecomma.split(',')[1].trim();
	} else if ( commas == 3 ) { // three commas
		// using ugly replacement to temporarily "protect" commas other than the last
		let sublinecomma = subline.replace(',','XYZCOMMA').replace(',','XYZCOMMA');
		title = sublinecomma.split(',')[0].replace('XYZCOMMA',',').replace('XYZCOMMA',',');
		group = sublinecomma.split(',')[1].trim();
	} else if ( commas < 1 || commas > 2 ) { // other commas (not occurring while writing)
		console.log('WARNING: ' + commas + ' ',' in ' + name); // warning about exceptions
	}
	if (group == '' || title == '') { // catch if groups/titles still empty
		console.log('WARNING: Empty group (' + group + ') or title (' + title + ')');
	}
	
	if ( cred[group] === undefined ) { // if group not stored yet
		cred[group] = {}; //add group object
	}
	if ( cred[group][title] === undefined ) { // if title not stored yet
		cred[group][title] = []; //add title array
		
		if ( !group_order.includes(group) ) { group_order.push(group); } // group order
		if (title_order[group] === undefined) { title_order[group] = []; } // create missing titles array
		title_order[group].push(title); // tracking title order in group
	}
	if (cred[group][title].includes(name) ) { // if name already there
		console.log('WARNING: ' + name + ' in ' + title + ' in ' + group + ' already!');
	} else {
		cred[group][title].push(name);
	}

    //console.log(n)
});

var group_prev = '';
var title_prev = '';
group_order.forEach((group => {
	title_order[group].forEach((title => {
		if (group_prev != group) { // if group new (title can be same in two diff groups)
			moby += '\n' + group + '\n\n' + title + '\n';
		}
		else if (title_prev != title) { // if title new
			moby += '\n' + title + '\n';
		}
		cred[group][title].forEach((name => {
			moby += name + '\n';
		}));
		group_prev = group;
		title_prev = title;
	}));
}));

console.log('entries: ' + count);
console.log(moby.trim());
