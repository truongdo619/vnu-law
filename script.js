var edgeColor = {
    1 : "#37A84D",
    2 : "#8ECD31",  
    3 : "#f9bf3b",
    4 : "#f15a22",
    5 : "#cf000f",
}
//right popup menu
function right(code, document_type, scope, publish_date, aprove_date, status)
{
    return "<table class='table-bordered table-sm'>"
    +"<thead class='thead-dark'>"
    +"<tr>"
      +"<th scope='col'>Thuộc tính</th>"
      +"<th scope='col'>Nội dung</th>"
    +"</tr>"
  +"</thead>"
  +"<tbody>"
    +"<tr>"
      +"<th scope='row'>Số ký hiệu</th>"
      +"<td>" + code +"</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Loại văn bản</th>"
        +"<td>" + document_type+"</td>"
     +"</tr>"
    +"<tr>"
        +"<th scope='row'>Nguồn thu thập</th>"
        +"<td></td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Cơ quan ban hành/ Chức danh / Người ký</th>"
        +"<td></td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Phạm vi</th>"
        +"<td>" + scope +"</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Ngày ban hành</th>"
        +"<td>" + publish_date +"</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Ngày có hiệu lực</th>"
        +"<td>"+ aprove_date +"</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Ngày đăng công báo</th>"
        +"<td>	...</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Phó Chủ tịch</th>"
        +"<td></td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row' colspan='2'>Tình trạng hiệu lực: <b>" + status + "</b></th>"
    +"</tr>"
  +"</tbody>"
  +"</table>";
}

//left popup menu
function left(type, source_name, target_name)
{
    return "<table class='table-bordered table-sm'>"
    +"<thead class='thead-dark'>"
    +"<tr>"
      +"<th scope='col'>Thuộc tính</th>"
      +"<th scope='col'>Nội dung</th>"
    +"</tr>"
  +"</thead>"
  +"<tbody>"
    +"<tr>"
      +"<th scope='row'>Quan hệ</th>"
      +"<td>"+ type +"</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Nguồn</th>"
        +"<td>"+ source_name +"</td>"
     +"</tr>"
    +"<tr>"
        +"<th scope='row'>Văn bản tham chiếu</th>"
        +"<td>"+ target_name+"</td>"
    +"</tr>"
  +"</tbody>"
  +"</table>"
}
var width = 1920,
    height = 900;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);
d3.json('data.json', function(err, json){
	root=json;
	var root;
	var force;
	var link;
	var node
	var nodeEnter;
	

    //set up force layout
    force = d3.layout.force()
        .size([width, height])
        .charge(-2000)
        .distance(200)
        .on("tick", tick);

    var dict = {};

    for (var i=0;i<root.nodes.length;i++){
        dict[root.nodes[i].id] = i;
    };

    root.links.forEach(function(link) {
        link.source = dict[link.target_id];
        link.target = dict[link.source_id];
        });

    // tooltip div:
    const tooltip = d3.select('body').append("div")
        .attr("class" , "tooltip")
        .style("opacity", 0);

    const rightPopup = d3.select('body').append("div")
        .classed("right", true)
        .classed("table", true)
        .classed("table-responsive", true)

    const leftPopup = d3.select('body').append("div")
        .classed("table", true)
        .classed("left", true)
        .classed("table-responsive", true)
        .html(left());

    link = svg.selectAll(".link");
    node = svg.selectAll('.node');


    svg.append("svg:defs").selectAll("marker")
        .data(["end"])     
        .enter().append("svg:marker")    
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 50)
        .attr("refY", 0)    
        .attr("markerWidth", 3)
        .attr("markerHeight", 3)
        .attr("orient", "auto")
    .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")
        .style("fill", "gray")
        .style("stroke", "#fff")
        .style("stroke-width", 0.5); 

    for(var i=0; i<root.nodes.length; i++) {
        var n = root.nodes[i];
        n.r = 30;
        n.collapsing = 0;
        n.collapsed = true;
    }
    //Give links ids and initialize variables
    for(var i=0; i<root.links.length; i++) {
        var l = root.links[i];
        l.source = root.nodes[l.source];
        l.target = root.nodes[l.target];
        l.source.collapsing++;
    };
    for(var i=0; i<root.nodes.length; i++) {
        var n = root.nodes[i];
        if (n.collapsing == 0)
            n.collapsing = 1000;
    }

    root.nodes.sort(function(a,b)
    {
        return b.collapsing - a.collapsing;
    });


    nodeEnter;
    update();


    function update()
    {
        var nodes = root.nodes.filter(function(d){  return d.collapsing > 0});

        var links = root.links.filter(function(d){
                return d.source.collapsing > 0 && d.target.collapsing > 0 && d.target.collapsed == true;
            });

        force
        .nodes(nodes)
        .links(links)
        .start();
        
        
        link = link.data(links);

        link.exit().remove();
    
        link.enter().insert('path', ":first-child")
            .attr('class', 'link')
            .attr('marker-end',"url(#end)")
            .style("cursor", "pointer")
            .style("stroke", function(d){ 
                //return "hsl(" + Math.random() * 360 + ",100%,50%)"
                return edgeColor[d.weight];
                })
            .style("stroke-width", function(d){ return d.weight * 2})
            .on("mouseover", function(d){
                tooltip.transition()
                .duration(300)
                .style("opacity", 1) 
                tooltip.html("Quan hệ: " + d.type)
                .style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth - 5) + "px")
                .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px")
                leftPopup.transition()
                .duration(200)
                .style("opacity", 1);
                leftPopup.html(
                    left(d.type, d.target.name, d.source.name)
                );
            })
            .on("mouseout", function(d){
                tooltip.transition()
                .duration(200)
                .style("opacity", 0);
                leftPopup.transition()
                .duration(200)
                .style("opacity", 0);
            });
        node = node.data(nodes);

        node.exit().remove();
        
        nodeEnter = node.enter().append("g")
                        .attr('class', 'node')
                        .on("contextmenu", rightclick)
                        .on("dblclick", dbclick)
                        .style("cursor", "pointer")
                        .call(force.drag)
                        .on("mouseover", function(d){
                            d3.select(this).select("circle").transition()
                            .duration(750)
                            .attr("r", function(d){ return d.size * 11});
                            tooltip.transition()
                            .duration(300)
                            .style("opacity", 1);
                            tooltip.html(d.name)
                            .style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth - 5) + "px")
                            .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px");
                            rightPopup.transition()
                            .duration(300)
                            .style("opacity", 1);
                            rightPopup.html(
                                right(d.code, d.document_type, d.scope, d.publish_date, d. aprove_date,d .status));
                                d3.select(this).select("text").transition()
                                    .duration(750)
                                    .style("font-size", function(d){return d.size * 2.8}).style("font-weight","bold");
                        })
                        .on("mouseout", function(d){
                            d3.select(this).select("circle").transition()
                            .duration(750)
                            .attr("r", function(d){ return d.size * 8.5});
                            tooltip.transition()
                            .duration(200)
                            .style("opacity", 0);
                            rightPopup.transition()
                            .duration(200)
                            .style("opacity", 0);
                            d3.select(this).select("text").transition()
                                .duration(750)
                                .style("font-size", function(d){return d.size *2.2}).style("font-weight","");
                        });
            nodeEnter.append('circle')
            .attr("r", function(d){ return d.size * 8.5})
            .style("fill", function(d){ 
                //return "hsl(" + Math.random() * 360 + ",100%,50%)"
                return d.color})
            .style("stroke-width", 1.5)
            .style("stroke", "#fff");
    
            nodeEnter.append("text")
            .attr("text-anchor", "middle")
            .style("font-size", function(d){return d.size *2.2})
            .attr("dy", ".2em")
            .text(function(d){
                return d.code;
            });
    }
    function tick(e) {
        link.attr( "d", function(d){ return "M" + d.source.x + "," + d.source.y + ", " + d.target.x + "," + d.target.y});
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    };

    function dbclick(d){
        function recurse(node)
        {
            if (node.collapsed == false){
                node.collapsed = true;
                root.links.forEach(e => {
                    if (e.target.id == node.id){
                        e.source.collapsing++;
                        recurse(e.source);
                    }
                });
            }
        }
        if (!d3.event.defaultPrevented) {
            tooltip.transition()
            .duration(200)
            .style("opacity", 0);
        recurse(d);
        }
        update();
    }

    function rightclick(d){
        d3.event.preventDefault();
        function recurse(node)
        {
            if (node.collapsed == true){
                node.collapsed = false;
                root.links.forEach(e => {
                    if (e.target.id == node.id){
                        e.source.collapsing--;
                        recurse(e.source);
                    }
                });
            }
        }
        tooltip.transition()
        .duration(200)
        .style("opacity", 0);
        recurse(d);
        update();
    }
})