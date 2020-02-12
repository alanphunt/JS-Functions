const $ = (el) => {
	const ele = document.querySelectorAll(el);
	return (ele.length === 1 ? ele[0] : ele);
};

const mapFormData = (form) =>{
	return Array.from(form.children).map(value => {
		return {[value.getAttribute("name")] : value.value};
	}).filter(el => el.null !== "");
};

const ajax = (o) => {
	let xhr = new XMLHttpRequest();

	if(o.events){
		//loadstart, load, loadend, progress (upload/download only), error, abort
		for(let [key, value] of Object.entries(o.events)){
			xhr.addEventListener(key, value);
		}
	}

	xhr.onreadystatechange = function(){
		if(o.progress)
			o.progress((this.readyState*25));
		if(this.readyState === XMLHttpRequest.DONE){
			let callback = (response) =>{
				console.log(response);
			};

			switch(Math.floor(xhr.status/100)){
				case 1:
				case 2:
				case 3:
					callback = o.success || function(){};
					break;
				case 4:
				case 5:
					callback = o.error || callback;
					break;
				default:
					break;
			}
			let response = (xhr.responseType === "text" ? xhr.responseText : xhr.response);

			if(typeof response == 'string' && (response.charAt(0) === "[" || response.charAt(0) === "{"))
				response = JSON.parse(response);

			callback(response);

			if(o.complete)
				o.complete(response);
		}
	};

	if(o.data) {
		var params = typeof o.data == 'string' || o.noEncoding === true || o.isFile === true
			? o.data
			: Object.keys(o.data).map(function (k) {
				return (!o.data.length
						? encodeURIComponent(k) + '=' + encodeURIComponent(o.data[k])
						: encodeURIComponent(Object.keys(o.data[k])) + '=' + encodeURIComponent(Object.values(o.data[k]))
				);
			}).join('&');
	}

	o.method = (o.method ? o.method : "GET");
	xhr.open(o.method, (o.url === undefined ? "/" : o.method === "GET" && o.data !== undefined ? (o.url+"?"+params) : o.url), o.async || true);

	if(o.method !== "GET" && o.useContentType !== false && o.isFile !== true)
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	if(o.async !== false)
		xhr.responseType = o.responseType || "text";

	if(o.mimeType)
		xhr.overrideMimeType(o.mimeType);

	if(o.headers)
		for(let [key, value] of Object.entries(o.headers)){
			xhr.setRequestHeader(key, value);
		}

	xhr.send(params);
};