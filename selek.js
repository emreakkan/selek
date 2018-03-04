/*
* @author Emre AKKAN
* @version V1.0
* @description
* Select tag replacement
*/

$.fn.selek = function(params){
	return $(this).each(function(){
		var elem = $(this);
		var elementOpt = $(this).children();

		var option = $.extend({
			class       : '',
			isSearch    : false,
			searchPlace : 'Ara...',
			addNewItem  : false
		}, params);

		var classList = {
			mainClass     : 'selek-wrapper' + ((option.class !== '') ? ' ' + option.class : ''),
			titleClass    : 'selek-title',
			listClass     : 'selek-list',
			selectedClass : 'selected',
			openClass     : 'opened',
			searchClass   : 'selek-search'
		};

		/*Create select container*/
		var selekWrapper = document.createElement('div');
		selekWrapper.className = classList.mainClass;

		/*Create select title element and add event on click*/
		var selekName = document.createElement('span');
		selekName.className = classList.titleClass;
		selekName.addEventListener('click', toggle);

		/*Create select options list container*/
		var selekList = document.createElement('div');
		selekList.className = classList.listClass;
		selekList.addEventListener('click', change);

		/*Create options list*/
		var selekUL = document.createElement('ul');
		for(var i = 0; i < elementOpt.length; i++){
			var li = document.createElement('li');
			li.innerText = $(elementOpt[i]).text();
			li.setAttribute('data-value', $(elementOpt[i]).val());
			li.setAttribute('data-index', i);

			if($(elementOpt[i]).is(':selected') !== false){
				li.classList.add('selected');
				selekName.innerText = $(elementOpt[i]).text();
			}

			selekUL.appendChild(li);
		};

		/*Search Enable*/
		if(option.isSearch === true){
			var searchInput = document.createElement('input');
			searchInput.setAttribute('type', 'search');
			searchInput.setAttribute('placeholder', option.searchPlace);
			searchInput.addEventListener('keyup', function(e){
				searchOpt(e);
			});

			var searchWrapper = document.createElement('div');
			searchWrapper.className = classList.searchClass;
			searchWrapper.appendChild(searchInput);

			function searchOpt(e){
				var searchString = $(searchInput).val(),
					count = 0;

				for (var i = 0; i < elementOpt.length; i++) {
					if(selekUL.querySelectorAll('li')[i].innerText.search(new RegExp(searchString, "i")) < 0){
						$(selekUL.querySelectorAll('li')[i]).hide();
					} else {
						count++;
						$(selekUL.querySelectorAll('li')[i]).show();
					}
				}

				if(count == 0 && searchString != '' && e.keyCode === 13){
					elem.append('<option value="' + searchString + '">' + searchString + '</option>');
					elementOpt = elem.children();

					var newLi = document.createElement('li');
					newLi.innerText = searchString;
					newLi.setAttribute('data-value', searchString);
					newLi.setAttribute('data-index', elementOpt.length);
					selekUL.appendChild(newLi);
				}
			}
		}

		selekWrapper.appendChild(selekName);
		selekWrapper.appendChild(selekList);
		if(option.isSearch === true) selekList.appendChild(searchWrapper);
		selekList.appendChild(selekUL);

		elem.before(selekWrapper, elem);
		elem.hide();

		function change(e){
			var _this = e.target;

			if(_this.className === selekName){
				toggle();
			}

			if(_this.tagName == 'LI'){
				selekWrapper.querySelector('.' + classList.titleClass).innerText = $(_this).text();
				$(elem).selectedIndex = _this.getAttribute('data-index');
				elem.val($(_this).data('value')).change();

				for (var i = 0; i < elementOpt.length; i++) {
					selekUL.querySelectorAll('li')[i].classList.remove(classList.selectedClass);
				}

				_this.classList.add(classList.selectedClass);
				toggle();
			}
		}

		function toggle(){
			$('.selek-wrapper').not($(selekWrapper)).removeClass(classList.openClass);
			selekWrapper.classList.toggle(classList.openClass);
		}
	});
}

$(document).click(function(e){
	if(e.type == 'click' && $(e.target).parents('.selek-wrapper').length < 1){
		$('.selek-wrapper').removeClass('opened');
	}
});