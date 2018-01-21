$.fn.selek = function(params){
	var selek = this;
	var selekOpt = selek.children();
	var option = $.extend({
		class: '',
		searchEnable: false,
		addSearched: false
	}, params);

	var selekContainer = document.createElement('div');
	selekContainer.className = 'selek-wrapper';

	if(option.class != ''){
		selekContainer.classList.add(option.class);
	}

	var selekName = document.createElement('span');
	selekName.className = 'selek-title';
	selekName.innerText = selek.find('option:first-child').text();
	selekName.addEventListener('click', open);
	selekName.addEventListener('click', open);

	var selekList = document.createElement('div');
	selekList.className = 'selek-list';
	selekList.addEventListener('click', onChange);

	var ul = document.createElement('ul');

	for(var i = 0; i < selekOpt.length; i++){
		var li = document.createElement('li');
		li.innerText = $(selekOpt[i]).text();
		li.setAttribute('data-value', $(selekOpt[i]).val());
		li.setAttribute('data-index', i);

		if(selekOpt[i].getAttribute('selected') !== null){
			li.classList.add('selected');
			selekName.innerText = $(selekOpt[i]).text();
		}

		ul.appendChild(li);
	}

	if(option.searchEnable === true){
		var searchInput = document.createElement('input');
		searchInput.setAttribute('type', 'search');
		searchInput.addEventListener('keyup', function(e){
			searchOpt(e);
		});

		var searchContainer = document.createElement('div');
		searchContainer.className = 'selek-search-wrapper';
		searchContainer.appendChild(searchInput);

		function searchOpt(e){
			var searchString = $(searchInput).val(),
				count = 0;

			for (var i = 0; i < selekOpt.length; i++) {
				if(ul.querySelectorAll('li')[i].innerText.search(new RegExp(searchString, "i")) < 0){
					$(ul.querySelectorAll('li')[i]).hide();
				} else {
					count++;
					$(ul.querySelectorAll('li')[i]).show();
				}
			}

			if(count == 0 && searchString != '' && e.keyCode === 13){
				selek.append('<option value="' + searchString + '">' + searchString + '</option>');
				selekOpt = selek.children();

				var newLi = document.createElement('li');
				newLi.innerText = searchString;
				newLi.setAttribute('data-value', searchString);
				newLi.setAttribute('data-index', selekOpt.length);
				ul.appendChild(newLi);
			}
		}
	}

	selekContainer.appendChild(selekName);
	selekContainer.appendChild(selekList);
	if(option.searchEnable === true) selekList.appendChild(searchContainer);
	selekList.appendChild(ul);

	selek.before(selekContainer, selek);
	selek.hide();

	document.addEventListener('click', function(e) {
		if(!selekContainer.contains(e.target)) close();
	});

	function onChange(e){
		e.preventDefault();
		var elem = e.target;

		if(elem.className === selekName){
			toggle();
		}

		if(elem.tagName == 'LI'){
			selekContainer.querySelector('.selek-title').innerText = elem.innerText;
			$(selek).selectedIndex = elem.getAttribute('data-index');
			selek.val($(elem).data('value')).change();

			for (var i = 0; i < selekOpt.length; i++) {
				ul.querySelectorAll('li')[i].classList.remove('is-selected');
			}

			elem.classList.add('is-selected');
			close();
		}
	}


	function toggle(){
		selekContainer.classList.toggle('is-opened');
	}

	function open(){
		selekContainer.classList.add('is-opened');
	}

	function close(){
		selekContainer.classList.remove('is-opened');
	}

	return{
		toggle: toggle,
		close: close,
		open: open
	};
};

$(function(){
	$('.selek').selek({
		searchEnable: true,
		addSearched: true
	});
});