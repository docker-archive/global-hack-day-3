var nomnoml = nomnoml || {}

$(function (){

	var jqCanvas = $('#canvas')
	var viewport = $('#uml_container')

	var canvasElement = document.getElementById('canvas')
	var graphics = skanaar.Canvas(canvasElement, {})
	
	//window.addEventListener('resize', _.throttle(parseAndRender, 750, {leading: true}))

	//parseAndRender("[a]->[b]\n[b]->[c]")

	function getConfig(d){
		return {
			arrowSize: +d.arrowSize || 1,
			bendSize: +d.bendSize || 0.3,
			direction: {down: 'TB', right: 'LR'}[d.direction] || 'TB',
			gutter: +d.gutter || 5,
			edgeMargin: (+d.edgeMargin) || 0,
			edges: {hard: 'hard', rounded: 'rounded'}[d.edges] || 'rounded',
			fill: (d.fill || '#eee8d5;#fdf6e3;#eee8d5;#fdf6e3').split(';'),
			fillArrows: d.fillArrows === 'true',
			font: d.font || 'Calibri',
			fontSize: (+d.fontSize) || 12,
			leading: (+d.leading) || 1.25,
			lineWidth: (+d.lineWidth) || 3,
			padding: (+d.padding) || 8,
			spacing: (+d.spacing) || 40,
			stroke: d.stroke || '#33322E',
			zoom: +d.zoom || 1
		}
	}

	function fitCanvasSize(rect, scale, superSampling){
		var w = rect.width * scale
		var h = rect.height * scale
		jqCanvas.attr({width: superSampling*w, height: superSampling*h})
		jqCanvas.css({
			top: (viewport.height() - h)/4,
			left: (viewport.width() - w)/2,
			width: w,
			height: h
		})
	}

	function setFont(config, isBold, isItalic){
		var style = (isBold === 'bold' ? 'bold ' : '')
		if (isItalic) style = 'italic ' + style
		graphics.ctx.font = style+config.fontSize+'pt '+config.font+', Helvetica, sans-serif'
	}

	function parseAndRender(data){
		var superSampling = window.devicePixelRatio || 1;
		var ast = nomnoml.parse(data)
		var config = getConfig(ast.directives)
	    var measurer = {
	    	setFont: setFont,
	        textWidth: function (s){ return graphics.ctx.measureText(s).width },
	        textHeight: function (s){ return config.leading * config.fontSize }
	    }
		var layout = nomnoml.layout(measurer, config, ast)
		fitCanvasSize(layout, config.zoom, superSampling)
		config.zoom *= superSampling
		nomnoml.render(graphics, config, layout, setFont)
	}

	nomnoml.parseAndRender = parseAndRender;
})