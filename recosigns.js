//1.0.1 not premium

function Recognize(signs, dom, action) {
  this.listenDOM = null;
  this.signs = [];
  this.input = {
    start: null,
    end: null,
    dots: []
  }
  if (signs) { this.setSingns(signs); }
  if (dom) { this.listen(dom); }
  if (action) { this.setAction(action); }
}
Recognize.prototype.setAction = function(action) {
  this.action = action;
}
Recognize.prototype.clearSingns = function() {
  this.signs = [];
}
Recognize.prototype.setSingns = function(urls, success, i) {
  if (typeof urls == "string") { urls = [urls]; }
  if (!i) { i = 0; }
  if (i >= urls.length) {
    if (success) { success(); }
    return true;
  }

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  var tmp = this;
  img.onload = function(image) {
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    canvas.setAttribute("width", w+"px");
    canvas.setAttribute("height", h+"px");
    ctx.drawImage(img, 0, 0, w, h);

    var dots = [];
    var edges = [null, null, null, null];
    var edgesStart = [null, null, null, null];
    var edgesEnd = [null, null, null, null];
    var freq = 200;
    for (var j = 0; j < freq-1; j++) {
      for (var k = 0; k < freq-1; k++) {
        var x = k*(w/freq)+(w/freq)/2;
        var y = j*(h/freq)+(h/freq)/2;
        var clr = ctx.getImageData(x, y, 1, 1).data;
        if ((clr[0] <= 20 && clr[1] <= 20 && clr[2] <= 20) || (clr[0] >= 230 && clr[1] <= 20 && clr[2] <= 20) || (clr[0] <= 20 && clr[1] <= 20 && clr[2] >= 230)) {
          if (edges[0] == null || x < edges[0]) { edges[0] = x; }
          if (edges[1] == null || y < edges[1]) { edges[1] = y; }
          if (edges[2] == null || x > edges[2]) { edges[2] = x; }
          if (edges[3] == null || y > edges[3]) { edges[3] = y; }
        }
        if (clr[0] >= 230 && clr[1] <= 20 && clr[2] <= 20) {
          if (edgesStart[0] == null || x < edgesStart[0]) { edgesStart[0] = x; }
          if (edgesStart[1] == null || y < edgesStart[1]) { edgesStart[1] = y; }
          if (edgesStart[2] == null || x > edgesStart[2]) { edgesStart[2] = x; }
          if (edgesStart[3] == null || y > edgesStart[3]) { edgesStart[3] = y; }
        }
        if (clr[0] <= 20 && clr[1] <= 20 && clr[2] >= 230) {
          if (edgesEnd[0] == null || x < edgesEnd[0]) { edgesEnd[0] = x; }
          if (edgesEnd[1] == null || y < edgesEnd[1]) { edgesEnd[1] = y; }
          if (edgesEnd[2] == null || x > edgesEnd[2]) { edgesEnd[2] = x; }
          if (edgesEnd[3] == null || y > edgesEnd[3]) { edgesEnd[3] = y; }
        }
        if (clr[0] <= 20 && clr[1] <= 20 && clr[2] <= 20) { dots.push([x, y]); }
      }
    }
    for (var j = 0; j < dots.length; j++) {
      dots[j] = [(dots[j][0]-edges[0])/(edges[2]-edges[0]), (dots[j][1]-edges[1])/(edges[3]-edges[1])];
    }
    tmp.signs.push({
      start: {
        x: ((edgesStart[0]+edgesStart[2])/2-edges[0])/(edges[2]-edges[0]),
        y: ((edgesStart[1]+edgesStart[3])/2-edges[1])/(edges[3]-edges[1]),
        width: (edgesStart[2]-edgesStart[0])/(edges[2]-edges[0]),
        height: (edgesStart[3]-edgesStart[1])/(edges[3]-edges[1])
      },
      end: {
        x: ((edgesEnd[0]+edgesEnd[2])/2-edges[0])/(edges[2]-edges[0]),
        y: ((edgesEnd[1]+edgesEnd[3])/2-edges[1])/(edges[3]-edges[1]),
        width: (edgesEnd[2]-edgesEnd[0])/(edges[2]-edges[0]),
        height: (edgesEnd[3]-edgesEnd[1])/(edges[3]-edges[1])
      },
      dots: dots
    });

    // drawtest(tmp.signs[i], "#888");

    tmp.setSingns(urls, success, ++i);
  };
  img.src = urls[i];
}
function tchstart(e) {
  var rcnz = this.listenRecognize;
  rcnz.input.dots = [];
  rcnz.input.start = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  rcnz.input.dots.push([e.changedTouches[0].clientX, e.changedTouches[0].clientY]);
}
function tchend(e) {
  var rcnz = this.listenRecognize;

  rcnz.input.dots.push([e.changedTouches[0].clientX, e.changedTouches[0].clientY]);

  var edges = [null, null, null, null];
  for (var i = 0; i < rcnz.input.dots.length; i++) {
    if (edges[0] == null || rcnz.input.dots[i][0] < edges[0]) { edges[0] = rcnz.input.dots[i][0]; }
    if (edges[1] == null || rcnz.input.dots[i][1] < edges[1]) { edges[1] = rcnz.input.dots[i][1]; }
    if (edges[2] == null || rcnz.input.dots[i][0] > edges[2]) { edges[2] = rcnz.input.dots[i][0]; }
    if (edges[3] == null || rcnz.input.dots[i][1] > edges[3]) { edges[3] = rcnz.input.dots[i][1]; }
  }

  rcnz.input.start.x = (rcnz.input.start.x-edges[0])/(edges[2]-edges[0]);
  rcnz.input.start.y = (rcnz.input.start.y-edges[1])/(edges[3]-edges[1]);

  rcnz.input.end = { x: 0, y: 0 };
  rcnz.input.end.x = (e.changedTouches[0].clientX-edges[0])/(edges[2]-edges[0]);
  rcnz.input.end.y = (e.changedTouches[0].clientY-edges[1])/(edges[3]-edges[1]);

  for (var i = 0; i < rcnz.input.dots.length; i++) {
    rcnz.input.dots[i][0] = (rcnz.input.dots[i][0]-edges[0])/(edges[2]-edges[0]);
    rcnz.input.dots[i][1] = (rcnz.input.dots[i][1]-edges[1])/(edges[3]-edges[1]);
  }

  // drawtest(rcnz.input, "#000");

  // var cnvs = document.getElementById("testcanvas");
  // var ctx = testcanvas.getContext("2d");
  var answer = [];
  var accuracityStartEnd = 0.4;
  for (var i = 0; i < rcnz.signs.length; i++) {
    // var colorstart = "#ff0000";
    if (rcnz.input.start.x >= rcnz.signs[i].start.x-accuracityStartEnd && rcnz.input.start.x <= rcnz.signs[i].start.x+accuracityStartEnd && rcnz.input.start.y >= rcnz.signs[i].start.y-accuracityStartEnd && rcnz.input.start.y <= rcnz.signs[i].start.y+accuracityStartEnd) {
      if (rcnz.input.end.x >= rcnz.signs[i].end.x-accuracityStartEnd && rcnz.input.end.x <= rcnz.signs[i].end.x+accuracityStartEnd && rcnz.input.end.y >= rcnz.signs[i].end.y-accuracityStartEnd && rcnz.input.end.y <= rcnz.signs[i].end.y+accuracityStartEnd) {
        var percentage = 0;
        var accuracity = 0.01;

        for (var j = 0; j < rcnz.input.dots.length; j++) {
          var color = "#ff0000";
          for (var k = 0; k < rcnz.signs[i].dots.length; k++) {
            if (rcnz.input.dots[j][0] >= rcnz.signs[i].dots[k][0]-accuracity && rcnz.input.dots[j][0] <= rcnz.signs[i].dots[k][0]+accuracity && rcnz.input.dots[j][1] >= rcnz.signs[i].dots[k][1]-accuracity && rcnz.input.dots[j][1] <= rcnz.signs[i].dots[k][1]+accuracity) {
              color = "#059900";
              percentage++;
              break;
            }
          }
          // ctx.beginPath();
          // ctx.strokeStyle = color;
          // ctx.rect(rcnz.input.dots[j][0]*cnvs.clientWidth-3, rcnz.input.dots[j][1]*cnvs.clientHeight-3, 6, 6);
          // ctx.stroke();
        }
        percentage = percentage/rcnz.input.dots.length;

        answer.push([i, percentage]);
        break;
      }
      // colorstart = "#059900";
    }
    // ctx.beginPath();
    // ctx.strokeStyle = colorstart;
    // ctx.rect(rcnz.input.start.x*cnvs.clientWidth-8, rcnz.input.start.y*cnvs.clientHeight-8, 16, 16);
    // ctx.stroke();
    // console.log(percentage);
  }

  if (answer[0]) {
    var max = null;
    var ind = null;
    for (var i = 0; i < answer.length; i++) {
      if (max == null || answer[i][1] > max) {
        max = answer[i][1];
        ind = answer[i][0];
      }
    }
    if (rcnz.action) {
      rcnz.action(ind);
    }
  }
}
function tchmove(e) {
  var rcnz = this.listenRecognize;
  rcnz.input.dots.push([e.changedTouches[0].clientX, e.changedTouches[0].clientY]);
}
Recognize.prototype.stopListen = function() {
  var dom = this.listenDOM;
  dom.listenRecognize = null;
  dom.removeEventListener("touchstart", tchstart);
  dom.removeEventListener("touchend", tchend);
  dom.removeEventListener("touchmove", tchmove);
  this.listenDOM = null;
}
Recognize.prototype.listen = function(dom) {
  dom.listenRecognize = this;
  this.listenDOM = dom;
  dom.addEventListener("touchstart", tchstart);
  dom.addEventListener("touchend", tchend);
  dom.addEventListener("touchmove", tchmove);
}

function drawtest(obj, color) {
  var cnvs = document.getElementById("testcanvas");
  var ctx = cnvs.getContext("2d");

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.rect((obj.start.x-obj.start.width/2)*cnvs.clientWidth, (obj.start.y-obj.start.height/2)*cnvs.clientHeight, obj.start.width*cnvs.clientWidth, obj.start.height*cnvs.clientHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.rect((obj.end.x-obj.end.width/2)*cnvs.clientWidth, (obj.end.y-obj.end.height/2)*cnvs.clientHeight, obj.end.width*cnvs.clientWidth, obj.end.height*cnvs.clientHeight);
  ctx.stroke();

  for (var i = 0; i < obj.dots.length; i++) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.rect(obj.dots[i][0]*cnvs.clientWidth-1, obj.dots[i][1]*cnvs.clientHeight-1, 2, 2);
    ctx.stroke();
  }

}
