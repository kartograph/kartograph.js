$.extend({
	loadAssets: function(opt) {
		var data = {};
		for (var id in opt.urls) {
			var context = { id: id };
			$.ajax({
				url: opt.urls[id],
				success: function(content) {
					data[this.id] = content;
					for (var id2 in opt.urls) {
						if (!data.hasOwnProperty(id2)) return;
					}
					opt.success(data);
				},
				context: context
			});
		}
	}
});