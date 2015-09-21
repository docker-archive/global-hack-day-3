function toggleTab(e, id1, id2, node) {
	e = e || window.event;
	var n = node || e.currentTarget;
	id1 = document.getElementById(id1);
	id2 = document.getElementById(id2);
	id1.classList.remove('hidden');
	id2.classList.add('hidden');
	n.parentNode.querySelector('.selected').classList.remove('selected');
	n.classList.add('selected');
}


function showTemplateBuild(node) {
	var data = node.querySelector('.data.hidden').textContent;
	data = JSON.parse(data);
	document.querySelector('#template_build button').data = data;
	displayTemplateBuild(true);
}

function displayTemplateBuild(show) {
	document.querySelector('.shim').classList[show ? 'remove' : 'add']('hidden');
	document.querySelector('#template_build').classList[show ? 'remove' : 'add']('hidden');
}

function buildTemplate(node) {
	var name = document.querySelector('#template_build #name');
	if(!validate(name)) return;
	var data = {
			name : name.value,
			app : node.data.app,
			description : document.querySelector('#template_build #desc').value,
			compose_status : 'processing',
			ttl : document.querySelector('#template_build #ttl').value
	};
	document.querySelector('#processing').classList.remove('hidden');
	$.post('', data, function(res){
		if(res.redirect) {
			window.location = res.redirect;
		} else alert(JSON.stringify(res));
	});
}