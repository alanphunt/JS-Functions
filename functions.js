	const $ = (qry) => {
		return document.querySelector(qry);
	};

	const $$ = (qry) => {
		return document.querySelectorAll(qry);
	};

	const mapFormData = (form) =>{
		return Array.from(form.children).map(value => {
			return {[value.getAttribute("name")] : value.value};
		}).filter(el => el.null !== "");
	};

	const ajax = (o) => {
		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function(){
			if(this.readyState === XMLHttpRequest.DONE){
				let callback = (response) =>{
					console.log(response);
				};

				switch(Math.floor(xhr.status/100)){
					case 1:
					case 2:
					case 3:
						callback = o.success || callback;
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

		xhr.open(o.method || "GET", o.url || "/", o.async || true);

		if(o.async !== false)
			xhr.responseType = o.responseType || "text";

		if(o.mimeType)
			xhr.overrideMimeType(o.mimeType);

		if(o.headers)
			for(let i of o.headers){
				xhr.setRequestHeader(Object.keys(i)[0], Object.values(i)[0]);
			}

		if(o.data && o.method !== "GET") {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

			var params = typeof o.data == 'string' || o.useUriEncoding === false
				? o.data
				: Object.keys(o.data).map(function (k) {
					return (!o.data.length
							? encodeURIComponent(k) + '=' + encodeURIComponent(o.data[k])
							: encodeURIComponent(Object.keys(o.data[k])) + '=' + encodeURIComponent(Object.values(o.data[k]))
					);
				}).join('&');
		}

		xhr.send(params);
	};
