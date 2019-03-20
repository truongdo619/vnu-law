function right()
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
      +"<td>07/2019/QĐ-UBND</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Loại văn bản</th>"
        +"<td>	Quyết định</td>"
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
        +"<td>Tỉnh Quảng Bình</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Ngày ban hành</th>"
        +"<td>06/03/2019</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Ngày có hiệu lực</th>"
        +"<td>20/03/2019</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Ngày đăng công báo</th>"
        +"<td>	...</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Phó Chủ tịch</th>"
        +"<td>Lê Minh Ngân</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row' colspan='2'>Tình trạng hiệu lực: <b>Chưa có hiệu lực</b></th>"
    +"</tr>"
  +"</tbody>"
  +"</table>";
}

function left()
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
      +"<td>07/2019/QĐ-UBND</td>"
    +"</tr>"
    +"<tr>"
        +"<th scope='row'>Văn bản tham chiếu</th>"
        +"<td>	Quyết định</td>"
     +"</tr>"
    +"<tr>"
        +"<th scope='row'>Văn bản được tham chiếu</th>"
        +"<td></td>"
    +"</tr>"
  +"</tbody>"
  +"</table>"
}
var width = 1920,
    height = 900;

d3.json('data.json', function(err, json){
	root=json;
	console.log(json)
	var root;
	var force;
	var link;
	var node
	var nodeEnter;
	var svg;
	
svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

//set up force layout
force = d3.layout.force()
    .size([width, height])
    .charge(-1500)
    .distance(200)
    .on("tick", tick);

// tooltip div:
const tooltip = d3.select('body').append("div")
    .attr("class" , "tooltip")
    .style("opacity", 0);

const rightPopup = d3.select('body').append("div")
    .classed("right", true)
    .classed("table", true)
    .classed("table-responsive", true)
    .html(right());

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
    .attr("d", "M0,-5L10,0L0,5"); 

for(var i=0; i<root.nodes.length; i++) {
    var n = root.nodes[i];
    n.id = i;
    n.r = 30;
    n.collapsing = 0;
    n.collapsed = true;
  }
  //Give links ids and initialize variables
  for(var i=0; i<root.links.length; i++) {
    var l = root.links[i];
    l.source = root.nodes[l.source];
    l.target = root.nodes[l.target];
    l.target.collapsing++;
    l.id = i;
  };
  for(var i=0; i<root.nodes.length; i++) {
    var n = root.nodes[i];
    if (n.collapsing == 0)
        n.collapsing = 1;
  }

nodeEnter;
update();


function update()
{
    var nodes = root.nodes.filter(function(d){  return d.collapsing > 0});

    var links = root.links.filter(function(d){
            return d.source.collapsing > 0 && d.target.collapsing > 0 && d.source.collapsed == true;
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
          .style("stroke", function(){ 
              //return "hsl(" + Math.random() * 360 + ",100%,50%)"
              return "#666";
            })
          .style("stroke-width", 5)
          .on("mouseover", function(d){
              tooltip.transition()
              .duration(300)
              .style("opacity", 1) 
              tooltip.html(d.source.x + " to " + d.target.x)
              .style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth - 5) + "px")
              .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px")
              leftPopup.transition()
              .duration(200)
              .style("opacity", 1);
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
                          .attr("r", 55);
                          tooltip.transition()
                          .duration(300)
                          .style("opacity", 1);
                          tooltip.html(d.x)
                          .style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth - 5) + "px")
                          .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px");
                          rightPopup.transition()
                          .duration(300)
                          .style("opacity", 1);
                      })
                      .on("mouseout", function(d){
                        d3.select(this).select("circle").transition()
                        .duration(750)
                        .attr("r", 40);
                          tooltip.transition()
                          .duration(200)
                          .style("opacity", 0);
                          rightPopup.transition()
                          .duration(200)
                          .style("opacity", 0);
                      });
          nodeEnter.append('circle')
          .attr("r", function(d){ return 40})
          .style("fill", function(){ 
              //return "hsl(" + Math.random() * 360 + ",100%,50%)"
            return " #ccc"})
          .style("stroke-width", 1.5)
          .style("stroke", "#fff");
  
          nodeEnter.append("text")
          .attr("x", -14)
          .attr("y", 0)
          .attr("dy", ".2em")
          .text("data");
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
                if (e.source.id == node.id){
                    e.target.collapsing++;
                    recurse(e.target);
                }
            });
        }
    }
    if (!d3.event.defaultPrevented) {
       recurse(d);
    }
    update();
    console.log(root.nodes);
}

function rightclick(d){
    d3.event.preventDefault();
    function recurse(node)
    {
        if (node.collapsed == true){
            node.collapsed = false;
            root.links.forEach(e => {
                if (e.source.id == node.id){
                    e.target.collapsing--;
                    recurse(e.target);
                }
            });
        }
    }
       recurse(d);
    update();
}
	})