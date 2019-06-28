var w = 1400
var h = 900
var sens = 0.1

var land = "forestgreen"

var proj = d3.geoOrthographic()
  .rotate([80, -40])
  .scale(400)
  .translate([w/2, h/2])
  .precision(.1);

var path = d3.geoPath()
  .projection(proj);

var graticule = d3.geoGraticule();

let v0, r0, q0;

var svg = d3.select("body")
  .append("svg")
  .attr("id", "svg")
  .attr("width", "100%")
  .attr("height", "100%")

svg.call(d3.drag()
  .on("start", dragstarted)
  .on("drag", dragged)
)

svg.append("circle")
  .attr("cx", w / 2)
  .attr("cy", h / 2)
  .attr("r", proj.scale())
  .attr("fill", "lightblue")

Promise.all([d3.json("./data/original/geojson/110m.json")]).then(function(topo) {
  var countries = topojson.feature(topo[0], topo[0].objects.countries).features;
  console.log(countries);

  svg.selectAll("path")
  .data(countries)
  .enter().append("path")
  .attr("d", path)
  .attr("class", "land")

  svg.append("path")
  .datum(graticule)
  .attr("class", "graticule")
  .attr("d", path)

});

function refresh() {
  svg.selectAll(".graticule").attr("d", path);
  svg.selectAll(".land").attr("d", path);
}

function dragstarted() {
  v0 = versor.cartesian(proj.invert(d3.mouse(this)));
  r0 = proj.rotate();
  q0 = versor(r0);
}

function dragged() {
  var v1 = versor.cartesian(proj.rotate(r0).invert(d3.mouse(this))),
      q1 = versor.multiply(q0, versor.delta(v0, v1)),
      r1 = versor.rotation(q1);
  proj.rotate(r1);
  refresh();
}