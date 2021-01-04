import { V2 } from "./vector2.js";
export let H = {}

H.clamp = function (value, min, max) {
    return Math.max(Math.min(value, max), min);
}

H.isBetween = function (value, min, max) {
    if (min > max) {
        return value == H.clamp(value, max, min);
    }
    return value == H.clamp(value, min, max);
}

H.betweenExclusive = function (value, min, max) {
    return (value > min) && (value < max);
}

H.getBestMatchIndex = function (arr, criteria) {
    let bestMatchIndex = undefined;
    let bestMatchValue = -Infinity;
    arr.forEach((e, i) => {
        let value = criteria(e, i);
        if (value > bestMatchValue) {
            bestMatchIndex = i;
            bestMatchValue = value;
        }
    });
    return bestMatchIndex;
}

H.undefinedToZero = function (value) {
    return (value === undefined) ? 0 : value;
}

H.jsonToHTML = function (json) {
    if (json.elem) {
        return json.elem;
    } else {
        let elem = document.createElement(json.tagName);
        if (json.attributes) {
            Object.keys(json.attributes).forEach(attribute => {
                elem[attribute] = json.attributes[attribute];
            });
        }
        if (json.dataset) {
            Object.keys(json.dataset).forEach(datumName => {
                elem.dataset[datumName] = json.dataset[datumName];
            });
        }
        if (json.children) {
            json.children.forEach(child => {
                elem.appendChild(H.jsonToHTML(child));
            });
        }
        return elem;
    }
}

let uniqueTempId = 0;
H.id = function () {
    return uniqueTempId++;
}

H.toNDecimalPlaces = function (num, n) {
    let factor = Math.pow(10, n);
    return Math.floor(num * factor) / factor;
}

//https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
//https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
H.mulberry32 = function (a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

H.lerp = function (a, b, factor) {
    return a + (b - a) * factor;
}

H.Stopwatch = class Stopwatch {
    constructor () {
        this.time = new Date().getTime();
    }

    elapsed () {
        return new Date().getTime() - this.time;
    }

    logInterval () {
        let elapsed = this.elapsed();
        this.time += elapsed;
        console.log(elapsed + "ms");
    }

    getInterval () {
        let elapsed = this.elapsed();
        this.time += elapsed;
        return elapsed;
    }
}

H.recursiveArraySplit = function (arr, lengthMin, storeArr) {
    if (arr.length > lengthMin) {
        let halfLength = Math.floor(arr.length / 2);
        H.recursiveArraySplit(arr.slice(0, halfLength), lengthMin, storeArr);
        H.recursiveArraySplit(arr.slice(halfLength + 1, arr.length), lengthMin, storeArr);
    } else {
        storeArr.push(arr);
    }
}

H.shuffle = function (arr) {
    for (let i = 0; arr.length > i; i++) {
        let remaining = arr.length - 1 - i;

        let randIndex = Math.floor(Math.random() * remaining);

        let temp = arr[i];
        arr[i] = arr[randIndex];
        arr[randIndex] = temp;
    }
}

H.Tree = class Tree {
    constructor (children, data) {
        this.children = children || [];
        this.data = data || [];
    }

    traverseDepthFirst(callback) {
        callback(this);
        this.children.forEach(child => {
            child.traverseDepthFirst(callback);
        });
    }
}

H.Triangle = class Triangle {
    constructor (point1, point2, point3) {
        if (((point2.x - point1.x) * (point3.y - point1.y) - (point3.x - point1.x) * (point2.y - point1.y)) > 0) {
            this.point1 = point1;
            this.point2 = point2;
            this.point3 = point3;
        } else {
            this.point1 = point1;
            this.point2 = point3;
            this.point3 = point2;
        }
    }

    area () {
        //let side1 = this.point1.getDistanceTo(this.point2);
        //let side2 = this.point2.getDistanceTo(this.point3);
        //let side3 = this.point3.getDistanceTo(this.point1);
        //let semiperimeter = (side1 + side2 + side3) / 2;
        //return Math.sqrt(semiperimeter * (semiperimeter - side1) * (semiperimeter - side2) * (semiperimeter - side3));

        return Math.abs((this.point1.x * (this.point2.y - this.point3.y) + this.point2.x * (this.point3.y - this.point1.y) + this.point3.x * (this.point1.y - this.point2.y)) / 2);
    }

    isInside (point) {
        // let tri1 = new H.Triangle(this.point1, this.point2, point);
        // let tri2 = new H.Triangle(this.point2, this.point3, point);
        // let tri3 = new H.Triangle(this.point3, this.point1, point);

        // return (tri1.area() + tri2.area() + tri3.area()) - this.area() < 0.00001;

        let v2 = new V2(this.point2).sub(this.point1);
        let v3 = new V2(this.point3).sub(this.point1);

        let a = (V2.cross2d(point, v3) - V2.cross2d(this.point1, v3)) / V2.cross2d(v2, v3);
        let b = -(V2.cross2d(point, v2) - V2.cross2d(this.point1, v2)) / V2.cross2d(v2, v3);

        //  console.log(a, b);

        return (a > 0) && (b > 0) && ((a + b) < 1);
    }

    withinCircumcircle (point) {
        let a = this.point1.x - point.x;
        let b = this.point2.x - point.x;
        let c = this.point3.x - point.x;
        let d = this.point1.y - point.y;
        let e = this.point2.y - point.y;
        let f = this.point3.y - point.y;
        let g = a * a + d * d;
        let h = b * b + e * e;
        let i = c * c + f * f;

        return (a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g)) > 0;
    }

    centroid () {
        return new V2((this.point1.x + this.point2.x + this.point3.x) / 3, (this.point1.y + this.point2.y + this.point3.y) / 3);
    }

    static getFaceTriangle (dcel, faceId) {
        let side1 = dcel.faceEdge(faceId);
        let side2 = dcel.next(side1);
        let side3 = dcel.next(side2);

        return new H.Triangle(dcel.points[dcel.point(side1)].pos, dcel.points[dcel.point(side2)].pos, dcel.points[dcel.point(side3)].pos);
    }
}

H.DCEL = class DCEL {
    constructor (points, edges, faces) {
        this.points = points || [];
        this.edges = edges || [];
        this.faces = faces || [];
    }

    point (id) {
        return this.edges[id].pointId;
    }

    next (id) {
        return this.edges[id].nextId;
    }

    prev (id) {
        return this.edges[id].prevId;
    }

    twin (id) {
        return this.edges[id].twinId;
    }
    
    face (id) {
        return this.edges[id].faceId;
    }
    
    faceEdge (id) {
        return this.faces[id].edgeId;
    }

    pointEdge (id) {
        return this.points[id].edgeId;
    }

    drawAllEdges (ctx) {
        this.edges.forEach((edge, edgeIndex) => {
            ctx.beginPath();
            ctx.moveTo(this.points[edge.pointId].pos.x, this.points[edge.pointId].pos.y);
            ctx.lineTo(this.points[this.edges[this.next(edgeIndex)].pointId].pos.x, this.points[this.edges[this.next(edgeIndex)].pointId].pos.y);
            ctx.stroke();
        });

        this.faces.forEach((face, faceIndex) => {
            let centroid = H.Triangle.getFaceTriangle(this, faceIndex).centroid();
            //ctx.fillText(faceIndex, centroid.x, centroid.y);
        })
    }

    getAllConnectingEdges(pointId) {
        let connectingEdge = this.pointEdge(pointId);
        let firstConnectingEdge = connectingEdge;
        let connectingEdgeNext = this.next(this.twin(connectingEdge));
        let allConnectingEdges = [];
        while (this.twin(connectingEdgeNext) !== undefined && connectingEdgeNext != firstConnectingEdge) {
            allConnectingEdges.push(connectingEdge);
            connectingEdge = connectingEdgeNext;
            connectingEdgeNext = this.next(this.twin(connectingEdge));
        }
        allConnectingEdges.push(connectingEdge);
        if (this.twin(connectingEdgeNext) === undefined) {
            console.log("wtf happened here", this.edges[connectingEdgeNext], connectingEdgeNext, pointId, allConnectingEdges);
        }
        return allConnectingEdges;
    }

    getAllInPolygon(edgeId) {
        let firstEdge = edgeId;
        let edge = edgeId;
        let nextEdge = this.next(edgeId);
        let edges = [];
        edges.push(firstEdge);
        while (nextEdge != firstEdge) {
            edges.push(nextEdge);
            edge = nextEdge;
            nextEdge = this.next(edge);
        }
        return edges;
    }

    getOthersInPolygon(edgeId) {
        let firstEdge = edgeId;
        let edge = edgeId;
        let nextEdge = this.next(edgeId);
        let edges = [];
        while (nextEdge != firstEdge) {
            edges.push(nextEdge);
            edge = nextEdge;
            nextEdge = this.next(edge);
        }
        return edges;
    }

    flipEdge(edgeId) {
        let edgeToBeFlipped = edgeId;
        let edgeToBeFlippedTwin = this.twin(edgeId);

        let edge1 = this.next(edgeToBeFlipped);
        let edge2 = this.prev(edgeToBeFlipped);
        let edge3 = this.next(edgeToBeFlippedTwin);
        let edge4 = this.prev(edgeToBeFlippedTwin);

        let face1 = this.face(edgeToBeFlipped);
        let face2 = this.face(edgeToBeFlippedTwin);

        let point1 = this.point(edge1);
        let point2 = this.point(edge2);
        let point3 = this.point(edge3);
        let point4 = this.point(edge4);

        this.edges[edgeToBeFlipped].pointId = point2;
        this.edges[edgeToBeFlipped].prevId = edge1;
        this.edges[edgeToBeFlipped].nextId = edge4;

        this.edges[edgeToBeFlippedTwin].pointId = point4;
        this.edges[edgeToBeFlippedTwin].prevId = edge3;
        this.edges[edgeToBeFlippedTwin].nextId = edge2;

        this.faces[face1].edgeId = edgeToBeFlipped;
        this.faces[face2].edgeId = edgeToBeFlippedTwin;

        this.edges[edge1].prevId = edge4;
        this.edges[edge1].nextId = edgeToBeFlipped;

        this.edges[edge2].prevId = edgeToBeFlippedTwin;
        this.edges[edge2].nextId = edge3;
        this.edges[edge2].faceId = face2;

        this.edges[edge3].prevId = edge2;
        this.edges[edge3].nextId = edgeToBeFlippedTwin;

        this.edges[edge4].prevId = edgeToBeFlipped;
        this.edges[edge4].nextId = edge1;
        this.edges[edge4].faceId = face1;

        this.points[point1].edgeId = edge1;
        this.points[point3].edgeId = edge3;
        
    }
}

H.Graph = class Graph {
    constructor (nodes) {
        this.nodes = nodes || [];
    }

    static fromDCEL(dcel) {
        let nodes = [];
        dcel.points.forEach((point, pointId) => {
            nodes.push({ connections: [], data: { pos: point.pos }  });
        });
        dcel.edges.forEach((edge, edgeId) => {
            nodes[dcel.point(edgeId)].connections.push(dcel.point(dcel.next(edgeId)));
            //nodes[dcel.point(dcel.prev(edgeId))].connections.push(dcel.point(edgeId));
        });
        return new H.Graph(nodes);
    }

    getAllConnections (nodeId) {
        return this.nodes[nodeId].connections;
    }

    getNode (nodeId) {
        return this.nodes[nodeId];    
    }

    draw (ctx) {
        this.nodes.forEach(node => {
            if (node.data.pos) {
                node.connections.forEach(connection => {
                    let node2 = this.getNode(connection);
                    if (node2.data.pos) {
                        ctx.beginPath();
                        ctx.moveTo(node.data.pos.x, node.data.pos.y);
                        ctx.lineTo(node2.data.pos.x, node2.data.pos.y);
                        ctx.stroke();
                    }
                });
            }
        });
    }

    getCopy () {
        let nodes = [];
        this.nodes.forEach(node => {
            nodes.push({
                connections: node.connections.concat(),
                data: node.data
            });
        });

        let graphCopy = new Graph(nodes);
        return graphCopy
    }
}

H.aStar = function (graph, startNode, endNode, maxLength) {
    maxLength = maxLength || 99999;

    let nodeCosts = [];
    nodeCosts.length = graph.nodes.length;
    nodeCosts.fill({});
    nodeCosts = nodeCosts.map(nodeCost => { return {
        distFromStart: Infinity,
        heuristicDistance: Infinity,
        sum: Infinity
    } });

    let open = [startNode];
    let closed = [];

    nodeCosts[startNode] = {
        distFromStart: 0,
        heuristicDistance: graph.getNode(endNode).data.pos.getDistanceTo(graph.getNode(startNode).data.pos),
        sum: graph.getNode(endNode).data.pos.getDistanceTo(graph.getNode(startNode).data.pos),
        prev: undefined
    }

    nodeCosts[startNode].sum = nodeCosts[startNode].distFromStart + nodeCosts[startNode].heuristicDistance;

    let foundPath = false;
    let currentNode = startNode;

    let i = 0;

    while (!foundPath && maxLength > i && currentNode) {
        let connections = graph.getAllConnections(currentNode);

        open = open.concat(connections.concat().filter(connection => closed.indexOf(connection) == -1 && open.indexOf(connection) == -1));

        connections.forEach(connection => {
            let myPosition = graph.getNode(connection).data.pos;
            let nodeInfo = nodeCosts[connection];
            nodeInfo.distFromStart = Math.min(nodeInfo.distFromStart, nodeCosts[currentNode].distFromStart + graph.getNode(currentNode).data.pos.getDistanceTo(myPosition));
            nodeInfo.heuristicDistance = graph.getNode(endNode).data.pos.getDistanceTo(myPosition);
            let newSum = nodeInfo.distFromStart + nodeInfo.heuristicDistance;
            if (nodeInfo.sum > newSum) {
                nodeInfo.prev = currentNode;
                nodeInfo.sum = newSum;
            }
        });

        open.splice(open.indexOf(currentNode), 1);

        closed.push(currentNode);

        let lowestSumNode = H.getBestMatchIndex(open, nodeId => {
            let costs = nodeCosts[nodeId];

            return -costs.sum;
        });

        currentNode = open[lowestSumNode];

        i++;
        if (currentNode == endNode) {
            foundPath = true;
        }
    }

    let pathToDestination = [];

    i = 0;
    if (foundPath) {
        currentNode = endNode;
        while (currentNode != startNode && maxLength > i) {
            pathToDestination.push(currentNode);
            currentNode = nodeCosts[currentNode].prev;
            i++;
        }
        pathToDestination.push(startNode);

    }
    return pathToDestination.map(nodeId => graph.getNode(nodeId) ).reverse();
}

H.isColinear = function (p1, p2, p3) {
    return ((p1.y - p1.y) / (p1.x - p1.x)) == ((p2.y - p2.y) / (p2.x - p2.x)) && ((p2.y - p2.y) / (p2.x - p2.x)) == ((p3.y - p3.y) / (p3.x - p3.x));
}

H.xor = function (a, b) {
    return (a || b) && !(a && b);
}

H.isCircleIntersectingLine = function (lineStart, lineEnd, circlePosition, circleRadius) {
    let lineStartTransformed = new V2(lineStart).sub(circlePosition);
    let lineEndTransformed = new V2(lineEnd).sub(circlePosition);
    let lineOffset = new V2(lineEnd).sub(lineStart);

    let d = V2.cross2d(lineStartTransformed, lineEndTransformed);
    let dr2 = Math.pow(lineOffset.x, 2) + Math.pow(lineOffset.y, 2);

    let discriminant2 = Math.pow(circleRadius, 2) * (dr2) - Math.pow(d, 2);
    //let xAvg = d * lineOffset.x / dr2;
    let yAvg = -d * lineOffset.x / dr2;
    let yOffset = Math.sqrt(discriminant2) * Math.abs(lineOffset.y) / dr2; 

    let smallestY = Math.min(lineStartTransformed.y, lineEndTransformed.y);
    let greatestY = Math.max(lineStartTransformed.y, lineEndTransformed.y);

    let xAvg = d * lineOffset.y / dr2;
    let xOffset = Math.sign(lineOffset.y) * lineOffset.x * Math.sqrt(discriminant2) / dr2; 

    let smallestX = Math.min(lineStartTransformed.x, lineEndTransformed.x);
    let greatestX = Math.max(lineStartTransformed.x, lineEndTransformed.x);

    return discriminant2 >= 0 && H.isBetween(yAvg, smallestY - yOffset, greatestY + yOffset) && H.isBetween(xAvg, smallestX - xOffset, greatestX + xOffset);
}

H.getDelaunayEdges = function (points, ctx) { //TODO: Fix big imaginary triangle bug.
    let timer = new H.Stopwatch();

    points.forEach((point, i) => {
        point.delaunayEdgeIndex = i;
    });

    //create big imaginary triangle
    let highestPointIndex = 0;
    let highestPointX = Infinity;
    let highestPointY = Infinity;

    points.forEach((point, i) => {
        if (point.y < highestPointY) {
            highestPointX = point.x;
            highestPointY = point.y;
            highestPointIndex = i;
        } else if (point.y == highestPointY) {
            if (point.x < highestPointX) {
                highestPointX = point.x;
                highestPointY = point.y;
                highestPointIndex = i;
            }
        }
    });

    let highestPoint = points[highestPointIndex];

    let highestAngleIndex = H.getBestMatchIndex(points, point => {
        let angle = -Infinity;
        if (point !== highestPoint) {
            angle = highestPoint.getDirectionTo(point);
        }
        return angle;
    });
    let lowestAngleIndex = H.getBestMatchIndex(points, point => { 
        let angle = Infinity;       
        if (point !== highestPoint) {
            angle = highestPoint.getDirectionTo(point);
        }
        return -angle;
    });

    let highestAnglePoint = points[highestAngleIndex];
    let lowestAnglePoint = points[lowestAngleIndex];

    let highestDirection = Math.PI - (Math.PI - highestPoint.getDirectionTo(highestAnglePoint)) / 2;
    let lowestDirection = highestPoint.getDirectionTo(lowestAnglePoint) / 2;

    //console.log(highestDirection, lowestDirection)

    let avgAngle = (highestDirection + lowestDirection) / 2;

    let farthestPointIndex = H.getBestMatchIndex(points, point => {
        let rotatedPoint = new V2(point).rotate(-avgAngle);
        return rotatedPoint.x;
    });

    let farthestPointPerpendicularDistance = new V2(points[farthestPointIndex]).rotate(-avgAngle).x * 1.1;

    let requiredPointDistance = farthestPointPerpendicularDistance / Math.cos(avgAngle - lowestDirection);

    let imagPointH = V2.fromPolar(highestDirection, requiredPointDistance);
    let imagPointL = V2.fromPolar(lowestDirection, requiredPointDistance);

    let triangleTree = new H.Tree();

    let dcel = new H.DCEL();

    dcel.points.push({
        pos: new V2(highestPoint).sub(new V2(0, 10000)),
        edgeId: 0
    },
    {
        pos: imagPointH,
        edgeId: 1
    },
    {
        pos: imagPointL,
        edgeId: 2
    });

    dcel.edges.push({
        pointId: 0,
        twinId: undefined,
        prevId: 2,
        nextId: 1,
        faceId: 0
    },{
        pointId: 1,
        twinId: undefined,
        prevId: 1,
        nextId: 2,
        faceId: 0
    },{
        pointId: 2,
        twinId: undefined,
        prevId: 1,
        nextId: 0,
        faceId: 0
    });

    dcel.faces.push({
        edgeId: 0
    });
    //dcel.drawAllEdges(ctx);


    triangleTree.data = { faceId: 0, triangle: H.Triangle.getFaceTriangle(dcel, 0) };
    H.shuffle(points);
    
    //timer.logInterval();

    //find enclosing triangle of points
    let findEnclosingTriangle = function (tree, point, ignoreSecond) {
        if (tree.children.length > 0) {
            let insideTriangles = [];
            tree.children.forEach(child => {
                if (child.data.triangle.isInside(point)) {
                    insideTriangles.push(child);
                }
            });
            if (insideTriangles.length > 1) console.log("two enclosing triangles");
            if (insideTriangles.length == 1 || (ignoreSecond && insideTriangles.length != 0)) {
                return findEnclosingTriangle(insideTriangles[0], point, ignoreSecond);
            } else if (insideTriangles.length == 2) {
                console.log("stupid edge case");
                return insideTriangles;
            } else if (insideTriangles.length == 0) {
                //console.log(tree);
                //console.log(point);
                console.log("No enclosing triangles found: ", tree, point);
            }
        } else {
            return [tree];
        }
    }

    points.splice(points.indexOf(highestPoint), 1);

    points.forEach(point => {
        
    //dcel.drawAllEdges(ctx);


        // ctx.clearRect(-1000, -1000, 9999, 9999);
        // dcel.drawAllEdges(ctx);
        // points.forEach(point2 => {
        //     if (point2 === point) {
        //         ctx.fillStyle = "red";
        //         console.log(highestPoint.getDirectionTo(point2));
        //     } else {
        //         ctx.fillStyle = "black"
        //     }
        //     ctx.fillRect(point2.x, point2.y, 3, 3);
        // });

        let enclosingTriangles = findEnclosingTriangle(triangleTree, point);

        //add point to DCEL and tree
        if (enclosingTriangles.length == 1) {

            let enclosingTriangle = H.Triangle.getFaceTriangle(dcel, enclosingTriangles[0].data.faceId);

            //enclosingTriangles[0].data.triangle = enclosingTriangle;

            let existingEdge1 = dcel.faceEdge(enclosingTriangles[0].data.faceId);

            let existingPoint1 = dcel.point(existingEdge1);
            
            let existingEdge2 = dcel.next(existingEdge1);

            let existingPoint2 = dcel.point(existingEdge2);
            
            let existingEdge3 = dcel.next(existingEdge2);

            let existingPoint3 = dcel.point(existingEdge3);
            

            dcel.points.push({
                edgeId: dcel.edges.length + 1,
                pos: point
            });

            let prevEdgeLength = dcel.edges.length;

            dcel.edges[existingEdge1].faceId = enclosingTriangles[0].data.faceId;
            dcel.edges[existingEdge1].prevId = dcel.edges.length + 5;
            dcel.edges[existingEdge1].nextId = dcel.edges.length + 4;

            dcel.edges[existingEdge2].faceId = dcel.faces.length;
            dcel.edges[existingEdge2].prevId = dcel.edges.length + 3;
            dcel.edges[existingEdge2].nextId = dcel.edges.length + 2;

            dcel.edges[existingEdge3].faceId = dcel.faces.length + 1;
            dcel.edges[existingEdge3].prevId = dcel.edges.length + 1;
            dcel.edges[existingEdge3].nextId = dcel.edges.length + 0;

            dcel.edges.push(
                {//new triangle 1
                    pointId: existingPoint1,
                    twinId: prevEdgeLength + 5,
                    prevId: existingEdge3,
                    nextId: prevEdgeLength + 1,
                    faceId: dcel.faces.length + 1
                },
                {
                    pointId: dcel.points.length - 1,
                    twinId: prevEdgeLength + 2,
                    prevId: prevEdgeLength + 0,
                    nextId: existingEdge3,
                    faceId: dcel.faces.length + 1
                },
                {//new triangle 2
                    pointId: existingPoint3,
                    twinId: prevEdgeLength + 1,
                    prevId: existingEdge2,
                    nextId: prevEdgeLength + 3,
                    faceId: dcel.faces.length + 0
                },
                {
                    pointId: dcel.points.length - 1,
                    twinId: prevEdgeLength + 4,
                    prevId: prevEdgeLength + 2,
                    nextId: existingEdge2,
                    faceId: dcel.faces.length + 0
                },
                {//new triangle 3
                    pointId: existingPoint2,
                    twinId: prevEdgeLength + 3,
                    prevId: existingEdge1,
                    nextId: prevEdgeLength + 5,
                    faceId: enclosingTriangles[0].data.faceId
                },
                {
                    pointId: dcel.points.length - 1,
                    twinId: prevEdgeLength + 0,
                    prevId: prevEdgeLength + 4,
                    nextId: existingEdge1,
                    faceId: enclosingTriangles[0].data.faceId
                },
            );

            dcel.faces[enclosingTriangles[0].data.faceId].edgeId = prevEdgeLength + 5;
            dcel.faces.push({
                edgeId: prevEdgeLength + 3
            },{
                edgeId: prevEdgeLength + 1
            });

            enclosingTriangles[0].children.push(
                new H.Tree([], { faceId: enclosingTriangles[0].data.faceId, triangle: H.Triangle.getFaceTriangle(dcel, enclosingTriangles[0].data.faceId) }),
                new H.Tree([], { faceId: dcel.faces.length - 2, triangle: H.Triangle.getFaceTriangle(dcel, dcel.faces.length - 2) }),
                new H.Tree([], { faceId: dcel.faces.length - 1, triangle: H.Triangle.getFaceTriangle(dcel, dcel.faces.length - 1) })
            );

            // for (let i = 0; 3 > i; i++) {
            //     let edge = [existingEdge1, existingEdge2, existingEdge3][i];

            //     if (dcel.edges[edge].twin && (dcel.point(dcel.twin(edge)) != dcel.point(dcel.next(edge)) || dcel.point(edge) != dcel.point(dcel.next(dcel.twin(edge))))) {
            //         let edgeTwin = dcel.twin(edge);
            //         console.log("====jsdfkjsdkfjldf====")
            //         console.log(dcel.point(edgeTwin), dcel.point(dcel.prev(edgeTwin)), dcel.point(dcel.prev(dcel.prev(edgeTwin))));
            //         console.log(dcel.point(edge), dcel.point(dcel.prev(edge)), dcel.point(dcel.prev(dcel.prev(edge))));
            //     }
            // }

        } else if (enclosingTriangles.length == 2) {

            console.log("this is a very rare edge case")

            //enclosingTriangles[0].data.triangle = H.Triangle.getFaceTriangle(dcel, enclosingTriangles[0].data.faceId);
            
            //enclosingTriangles[1].data.triangle = H.Triangle.getFaceTriangle(dcel, enclosingTriangles[1].data.faceId);

            let enclosingFaceId1 = enclosingTriangles[0].data.faceId;
            
            let sharedEdge = undefined;
            let i = 0;
            let edge = dcel.faceEdge(enclosingFaceId1);
            let nextEdge = dcel.next(edge);
            while (sharedEdge === undefined && i < 4) {
                i++;
                if (H.isColinear(dcel.points[dcel.point(edge)].pos, dcel.points[dcel.point(nextEdge)].pos, point)) {
                    sharedEdge = edge;
                    console.log("COLINEAR FOUND")
                } else {
                    edge = nextEdge;
                    nextEdge = dcel.next(edge);
                }
            }
            
            //points colinear to added point
            let existingPoint1 = dcel.point(sharedEdge);
            let existingPoint2 = dcel.point(dcel.next(sharedEdge));
            //points not colinear to added point
            let existingPoint3 = dcel.point(dcel.prev(sharedEdge));
            let existingPoint4 = dcel.point(dcel.prev(dcel.twin(sharedEdge)));

            let sharedEdgeTwin = dcel.twin(sharedEdge);

            //Existing edges (not colinear) for both sides, one after another
            let edge8 = dcel.next(sharedEdge);
            let edge9 = dcel.next(edge8);

            let edge10 = dcel.next(sharedEdgeTwin);
            let edge11 = dcel.next(edge10);

            edge8.prevId = dcel.edges.length + 0;
            edge8.nextId = dcel.edges.length + 5;
            edge8.faceId = dcel.face(edge8);
            
            edge9.prevId = dcel.edges.length + 4;
            edge9.nextId = sharedEdge;
            edge9.faceId = dcel.face(edge11);

            edge10.prevId = dcel.edges.length + 3;
            edge10.nextId = dcel.edges.length + 2;
            edge10.faceId = dcel.faces.length + 0;
            
            edge11.prevId = dcel.edges.length + 1;
            edge11.nextId = sharedEdgeTwin;
            edge11.faceId = dcel.faces.length + 1;

            sharedEdge.nextId = dcel.edges.length + 4;
            sharedEdge.twinId = dcel.edges.length + 3;
            sharedEdge.faceId = dcel.face(edge9);

            sharedEdgeTwin.nextId = dcel.edges.length + 1;
            sharedEdge.twinId = dcel.edges.length + 0;
            sharedEdge.faceId = dcel.faces.length + 1;

            dcel.points.push({
                edgeId: dcel.edges.length,
                pos: point
            });

            dcel.edges.push(
                {
                    pointId: dcel.points.length - 1,
                    twinId: sharedEdgeTwin,
                    prevId: dcel.edges.length + 5,
                    nextId: edge8,
                    faceId: dcel.face(edge8)
                },
                {
                    pointId: dcel.points.length - 1,
                    twinId: dcel.edges.length + 2,
                    prevId: sharedEdgeTwin,
                    nextId: edge11,
                    faceId: dcel.faces.length + 1
                },
                {
                    pointId: existingPoint4,
                    twinId: dcel.edges.length + 1,
                    prevId: edge10,
                    nextId: dcel.edges.length + 3,
                    faceId: dcel.faces.length + 0
                },
                {
                    pointId: dcel.points.length - 1,
                    twinId: sharedEdge,
                    prevId: dcel.edges.length + 2,
                    nextId: edge10,
                    faceId: dcel.faces.length + 0
                },
                {
                    pointId: dcel.points.length - 1,
                    twinId: dcel.edges.length + 5,
                    prevId: sharedEdge,
                    nextId: edge9,
                    faceId: dcel.face(edge9)
                },
                {
                    pointId: existingPoint3,
                    twinId: dcel.edges.length + 4,
                    prevId: edge8,
                    nextId: dcel.edges.length + 0,
                    faceId: dcel.face(edge8)
                },
            );

            
            enclosingTriangles[0].children.push(
                new H.Tree([], { faceId: enclosingTriangles[0].data.faceId }),
                new H.Tree([], { faceId: enclosingTriangles[1].data.faceId })
            )
            
            enclosingTriangles[1].children.push(
                new H.Tree([], { faceId: dcel.faces.length + 0 }),
                new H.Tree([], { faceId: dcel.faces.length + 1 })
            )

            dcel.faces.push({
                edgeId: edge10
            },{
                edgeId: edge11
            });

        }

        //fix non-delaunay edges

        //console.log(dcel);

        let makeDelaunay = function (edge) {

            if (dcel.twin(edge) !== undefined) {

                let triangle = H.Triangle.getFaceTriangle(dcel, dcel.face(edge));
                
                let farPoint = dcel.point(dcel.prev(dcel.twin(edge)));

                if (triangle.withinCircumcircle(dcel.points[farPoint].pos)) {
                    //console.log("got here")

                    let triangleTwin = H.Triangle.getFaceTriangle(dcel, dcel.face(dcel.twin(edge)));

                    let triangleInTree = findEnclosingTriangle(triangleTree, triangle.centroid(), true);
                    let twinTriangleInTree = findEnclosingTriangle(triangleTree, triangleTwin.centroid(), true);

                    //console.log(JSON.parse(JSON.stringify(triangleInTree)), JSON.parse(JSON.stringify(twinTriangleInTree)));

                    //triangleInTree[0].data.triangle = triangle;
                    //twinTriangleInTree[0].data.triangle = triangleTwin;
                    // console.log("====jsdfkjsdkfjldf====")
                    // let edgeTwin = dcel.twin(edge);
                    //     console.log(dcel.point(edgeTwin), dcel.point(dcel.prev(edgeTwin)), dcel.point(dcel.prev(dcel.prev(edgeTwin))));
                    //     console.log(dcel.point(edge), dcel.point(dcel.prev(edge)), dcel.point(dcel.prev(dcel.prev(edge))));

                    // if (dcel.point(dcel.twin(edge)) != dcel.point(dcel.next(edge)) || dcel.point(edge) != dcel.point(dcel.next(dcel.twin(edge)))) {
                    //     let edgeTwin = dcel.twin(edge);
                    //     console.log("====jsdfkjsdkfjldf====")
                    //     console.log(dcel.point(edgeTwin), dcel.point(dcel.prev(edgeTwin)), dcel.point(dcel.prev(dcel.prev(edgeTwin))));
                    //     console.log(dcel.point(edge), dcel.point(dcel.prev(edge)), dcel.point(dcel.prev(dcel.prev(edge))));
                    //     console.log(dcel.point(edge), dcel.point(edgeTwin));
                    // }

                    dcel.flipEdge(edge);
                    
                    let flippedTriangle = new H.Tree([], { faceId: dcel.face(edge), triangle: H.Triangle.getFaceTriangle(dcel, dcel.face(edge)) } );
                    let flippedTriangleTwin = new H.Tree([], { faceId: dcel.face(dcel.twin(edge)), triangle: H.Triangle.getFaceTriangle(dcel, dcel.face(dcel.twin(edge))) } );

                    // if (triangleInTree[0].data.triangle.area() + twinTriangleInTree[0].data.triangle.area() - flippedTriangle.data.triangle.area() - flippedTriangleTwin.data.triangle.area() > 0.001) {
                    //     let edgeTwin = dcel.twin(edge);
                    //     console.log("THIS SHOULDNT HAPPEn")
                    //     console.log(dcel.point(edgeTwin), dcel.point(dcel.prev(edgeTwin)), dcel.point(dcel.prev(dcel.prev(edgeTwin))));
                    //     console.log(dcel.point(edge), dcel.point(dcel.prev(edge)), dcel.point(dcel.prev(dcel.prev(edge))));
                    // }

                    triangleInTree[0].children.push(flippedTriangle, flippedTriangleTwin);
                    twinTriangleInTree[0].children.push(flippedTriangle, flippedTriangleTwin);

                    let edgePrev = dcel.prev(edge);
                    let edgeNext = dcel.next(edge);
                    let twinEdgePrev = dcel.prev(dcel.twin(edge));
                    let twinEdgeNext = dcel.next(dcel.twin(edge));

                    makeDelaunay(edgePrev);
                    makeDelaunay(edgeNext);
                    makeDelaunay(twinEdgePrev);
                    makeDelaunay(twinEdgeNext);
                    //console.log(triangleInTree[0].children.length, twinTriangleInTree[0].children.length);
                    //console.log(dcel.face(edge), dcel.face(dcel.twin(edge)));
                }

                //if not delaunay, flip these two triangles
            }
        }

        let potentialEdgesToFlip = dcel.getAllConnectingEdges(dcel.points.length - 1).map(edge => dcel.next(edge));

        potentialEdgesToFlip.forEach(edge => {
            makeDelaunay(edge);
        });

        // dcel.edges.forEach((x, edge) => {
        //     if (dcel.twin(edge) !== undefined && (dcel.point(dcel.twin(edge)) != dcel.point(dcel.next(edge)) || dcel.point(edge) != dcel.point(dcel.next(dcel.twin(edge))))) {
        //         let edgeTwin = dcel.twin(edge);
        //         console.log("====jsdfkjsdkfjldf====")
        //         console.log(dcel.point(edgeTwin), dcel.point(dcel.prev(edgeTwin)), dcel.point(dcel.prev(dcel.prev(edgeTwin))));
        //         console.log(dcel.point(edge), dcel.point(dcel.prev(edge)), dcel.point(dcel.prev(dcel.prev(edge))));
        //         console.log(dcel.point(edge), dcel.point(edgeTwin));
        //     }
        // })

    });

    //timer.logInterval();

    //console.log(timer.elapsed() + "ms");

    // ctx.clearRect(-1000, -1000, 9999, 9999);
    // dcel.drawAllEdges(ctx);
    // points.forEach(point2 => {
    //     ctx.fillRect(point2.x, point2.y, 3, 3);
    // });

    //console.log(triangleTree);
    // let positionalSortXAscending = (a, b) => { 
    //     let xDiff = a.x - b.x;
    //     return xDiff || (a.y - b.y);
    // }
    // let positionalSortYDescending = (a, b) => { 
    //     let yDiff = b.y - a.y;
    //     return yDiff || (a.x - b.x);
    // }

    // let sortedPoints = points.concat().sort(positionalSortXAscending);
    // let dividedPoints = [];
    // H.recursiveArraySplit(sortedPoints, 3, dividedPoints);

    // let edges = [];

    // dividedPoints.forEach(pointList => {
    //     edges.push([]);
    // })

    // dividedPoints.forEach((pointList, pointListIndex) => {
    //     pointList.forEach((point1, i) => {
    //         pointList.forEach((point2, j) => {
    //             if (i != j && j >= i) edges[pointListIndex].push({ start: point1, end: point2 });
    //         });
    //     });
    // });

    // let mergedDividedPoints = [];

    // for (let i = 0; dividedPoints.length > i; i += 2) {
    //     if (i != dividedPoints.length - 1) {
    //         let left = dividedPoints[i];
    //         let right = dividedPoints[i + 1];

    //         left.sort(positionalSortYDescending);
    //         right.sort(positionalSortYDescending);

    //         left.forEach(leftPoint, function () {     
    //             right.forEach(leftPoint, function () {

    //             });
    //         });
            
    //     } else {
    //         mergedDividedPoints.push(dividedPoints[i]);
    //     }
    // }

    return dcel;
}

H.getSuitableGraphPaths = function (dcel) {
    let nodes = [];
    dcel.edges.forEach(edge => {
        nodes.push({
            connections: [],
            data: {}
        })
    });

    dcel.edges.forEach((edgeObj, edge) => {
        if (dcel.twin(edge) !== undefined && !nodes[dcel.twin(edge)].data.pos) {
            let entity1 = dcel.points[dcel.point(edge)].pos.metadata;
            let entity2 = dcel.points[dcel.point(dcel.next(edge))].pos.metadata;

            if (entity1 && entity2) {
                let dist = entity1.position.getDistanceTo(entity2.position);

                let collisionRadiusSum = entity1.collisionRadius + entity2.collisionRadius;

                let x = (dist - collisionRadiusSum) / (2 * dist);

                let nodePos = new V2(entity1.position).add(new V2(entity2.position).sub(entity1.position).mult(x));
                
                let isColliding = false;

                dcel.points.forEach((pointObj, point) => {
                    let entity3 = pointObj.pos.metadata;
                    if (entity3 && entity3.checkCollisionWithPoint(nodePos)) {
                        isColliding = true;
                    }
                });

                if (!isColliding) {

                    nodes[edge].data.pos = nodePos;
                }
            }
        }
    });

    dcel.edges.forEach((edgeObj, edge) => {
        if (dcel.twin(edge) !== undefined && !nodes[dcel.twin(edge)].data.pos) {
            let connections = dcel.getOthersInPolygon(edge);
            if (dcel.twin(edge) !== undefined) {
                connections = connections.concat(dcel.getOthersInPolygon(dcel.twin(edge)));
            }

            let connectionTwins = [];
            connections.forEach(connection => {
                if (dcel.twin(connection) !== undefined) {
                    connectionTwins.push(dcel.twin(connection));
                }
            });
            connections = connections.concat(connectionTwins);
            //console.log(connections);

            connections.forEach(connection => {
                if (nodes[connection].data.pos) {
                    nodes[edge].connections.push(connection);
                }
            });

        }
    });

    return new H.Graph(nodes);
}

H.hasLineOfSight = function (point1, point2, obstacles) {
    
    let hasLineOfSight = true;
        
    let obstacleIndex = 0;
    while (obstacles.length > obstacleIndex && hasLineOfSight) {
        if (H.isCircleIntersectingLine(point1, point2, obstacles[obstacleIndex].position, obstacles[obstacleIndex].collisionRadius)) {
            hasLineOfSight = false;
        }
        obstacleIndex++;
    }

    return hasLineOfSight
}

H.connectAllLineOfSightNodes = function (entity, game, graph) {
    let lineOfSightConnections = [];
    
    let obstacles = game.entities.entities.filter(entity => entity.isPathfindingObstacle)

    graph.nodes.forEach((node, nodeIndex) => {
               
        // let hasLineOfSight = true;
        
        // let obstacleIndex = 0;
        // while (obstacles.length > obstacleIndex && hasLineOfSight) {
        //     if (H.isCircleIntersectingLine(entity.position, node.data.pos, obstacles[obstacleIndex].position, obstacles[obstacleIndex].collisionRadius)) {
        //         hasLineOfSight = false;
        //     }
        //     obstacleIndex++;
        // }

        if (node.data.pos) {
            let hasLineOfSight = H.hasLineOfSight(entity.position, node.data.pos, obstacles);

            if (hasLineOfSight) {
                lineOfSightConnections.push(nodeIndex);
                node.connections.push(graph.nodes.length);
            }
        }
    });
    
    graph.nodes.push({
        data: {
            pos: new V2(entity.position)
        },
        connections: lineOfSightConnections
    });
}

H.variation = function (value, amount) {
    return value * (1 + (Math.random() - 0.5) * amount);
}

H.isPointWithinRectangle = function (rectCorner, rectSize, point) {
    return (H.isBetween(point.x, rectCorner.x, rectCorner.x + rectSize.x) && 
    H.isBetween(point.y, rectCorner.y, rectCorner.y + rectSize.y));
}

H.areRectanglesIntersecting = function (rectCorner1, rectSize1, rectCorner2, rectSize2) {
    return H.isPointWithinRectangle(new V2(rectCorner2).sub(rectSize1), new V2(rectSize2).add(rectSize1), rectCorner1);
}

H.Quadtree = class Quadtree extends H.Tree {
    constructor (children, position, size, maxChildren, remainingDepth) {
        super (children, {
            position: position,
            size: size,
            maxChildren: maxChildren,
            remainingDepth: remainingDepth,
            data: []
        });
    }

    insertAtPosition (data, position) {
        if (this.children.length != 0) {
            this.children.forEach(child => {
                let isAlreadyInserted = false;
                if (H.isPointWithinRectangle(child.data.position, child.data.size, position)) {
                    if (!isAlreadyInserted) {
                        child.insertAtPosition(data, position);
                        isAlreadyInserted = true;
                    }
                }
            });
        } else {
            this.data.data.push({
                position: position,
                data: data
            });
            this.subdivide();
        }
    }

    subdivide () {
        //console.log(this.data.data.length);
        if (this.data.data.length > this.data.maxChildren && this.data.remainingDepth > 0) {
            let halfSize = new V2(this.data.size).mult(0.5);
            this.children.push(new H.Quadtree([], new V2(this.data.position), new V2(halfSize), this.data.maxChildren, this.data.remainingDepth - 1));
            this.children.push(new H.Quadtree([], new V2(this.data.position).add(new V2(halfSize.x, 0)), new V2(halfSize), this.data.maxChildren, this.data.remainingDepth - 1));
            this.children.push(new H.Quadtree([], new V2(this.data.position).add(new V2(0, halfSize.y)), new V2(halfSize), this.data.maxChildren, this.data.remainingDepth - 1));
            this.children.push(new H.Quadtree([], new V2(this.data.position).add(halfSize), new V2(halfSize), this.data.maxChildren, this.data.remainingDepth - 1));
            this.data.data.forEach(datum => {
                this.insertAtPosition(datum.data, datum.position);
            });
            this.data.data = [];
        }
    }

    getAllWithinRect (rectCorner, rectSize, returnArr) {
        if (this.children.length != 0) {
            this.children.forEach(child => {
                if (H.areRectanglesIntersecting(rectCorner, rectSize, child.data.position, child.data.size)) {
                    child.getAllWithinRect(rectCorner, rectSize, returnArr);
                }
            });
        } else {
            this.data.data.forEach(datum => {
                if (H.isPointWithinRectangle(rectCorner, rectSize, datum.position)) {
                    returnArr.push(datum);
                }
            });
        }
    }

    getAllWithinCircle (circleCenter, circleRadius, returnArr) {
        if (this.children.length != 0) {
            this.children.forEach(child => {
                if (H.isRectangleIntersectingCircle(child.data.position, child.data.size, circleCenter, circleRadius)) {
                    child.getAllWithinCircle(circleCenter, circleRadius, returnArr);
                }
            });
        } else {
            this.data.data.forEach(datum => {
                if (datum.position.getDistanceTo(circleCenter) <= circleRadius) {
                    returnArr.push(datum);
                }
            });
        }
    }

    removeAllWithinRect (rectCorner, rectSize, returnArr) {
        //console.log(rectCorner, rectSize)
        if (this.children.length != 0) {
            this.children.forEach(child => {
                if (H.areRectanglesIntersecting(rectCorner, rectSize, child.data.position, child.data.size)) {
                    child.removeAllWithinRect(rectCorner, rectSize, returnArr);
                }
            });
        } else {
            for (let i = 0; this.data.data.length > i; i++) {
                let datum = this.data.data[i];
                if (H.isPointWithinRectangle(this.data.position, this.data.size, datum.position)) {
                    returnArr.push(datum);
                    this.data.data.splice(i, 1);
                    i--;
                }
            }
        }
        this.unsubdivide();
    }

    unsubdivide () {
        let noGrandchildren = true;
        let childCount = 0;
        this.children.forEach(child => {
            childCount += child.data.data.length;
            noGrandchildren = noGrandchildren && (child.children.length == 0);
        });
        if (noGrandchildren && childCount <= this.maxChildren) {
            this.children.forEach(child => {
                this.data.data = this.data.data.concat(child.data.data);
            });
            this.children = [];
        }
    }
}

H.isRectangleIntersectingCircle = function (rectangleCorner, rectangleSize, circleCenter, circleRadius) {
    let point1 = rectangleCorner;
    let point2 = new V2(rectangleCorner).add(new V2(rectangleSize.x, 0));
    let point3 = new V2(rectangleCorner).add(new V2(0, rectangleSize.y));
    let point4 = new V2(rectangleCorner).add(rectangleSize);
    // return point1.getDistanceTo(circleCenter) < circleRadius ||
    // point2.getDistanceTo(circleCenter) < circleRadius ||
    // point3.getDistanceTo(circleCenter) < circleRadius ||
    // point4.getDistanceTo(circleCenter) < circleRadius ||
    //console.log(H.isCircleIntersectingLine(point1, point2, circleCenter, circleRadius) );
    return H.isPointWithinRectangle(rectangleCorner, rectangleSize, circleCenter) ||
    H.isCircleIntersectingLine(point1, point2, circleCenter, circleRadius) ||
    H.isCircleIntersectingLine(point2, point4, circleCenter, circleRadius) ||
    H.isCircleIntersectingLine(point4, point3, circleCenter, circleRadius) ||
    H.isCircleIntersectingLine(point3, point1, circleCenter, circleRadius);
}

H.sleep = function (ms, callback) {
    let time = new Date().getTime();
    let x = 0;
    while (new Date().getTime() - time < ms) {
        x += 1
    }
    setTimeout(callback, 0);
}

H.smoothstep = function (x) {
    x = H.clamp(x, 0, 1);
    return 3 * Math.pow(x, 2) - 2 * Math.pow(x, 3);
}

H.smoothstepInterpolate = function (x, a0, a1) {
    return a0 + H.smoothstep(x) * (a1 - a0);
}

H.mulberry32Hash = function (a) {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

H.noise = function (seed, scale) {
    return function (position) {

        position = new V2(position).div(scale);

        let rand = H.mulberry32Hash;

        let positionInt = new V2(Math.floor(position.x), Math.floor(position.y));
        let v1 = V2.fromPolar(rand(seed + positionInt.x + 65536 * positionInt.y) * Math.PI * 2, 1);
        let v2 = V2.fromPolar(rand(seed + positionInt.x + 65536 * positionInt.y + 1) * Math.PI * 2, 1);
        let v3 = V2.fromPolar(rand(seed + positionInt.x + 65536 * positionInt.y + 65536) * Math.PI * 2, 1);
        let v4 = V2.fromPolar(rand(seed + positionInt.x + 65536 * positionInt.y + 65537) * Math.PI * 2, 1);

        let o1 = new V2(position).sub(positionInt);
        let o2 = new V2(o1).sub(new V2(1, 0));
        let o3 = new V2(o1).sub(new V2(0, 1));
        let o4 = new V2(o1).sub(new V2(1, 1));


        let dot1 = V2.dot(v1, o1);
        let dot2 = V2.dot(v2, o2);
        let dot3 = V2.dot(v3, o3);
        let dot4 = V2.dot(v4, o4);

        //console.log(o1, dot1);

        return H.smoothstepInterpolate(o1.y, H.smoothstepInterpolate(o1.x, dot1, dot2), H.smoothstepInterpolate(o1.x, dot3, dot4));
    }
}

H.fractalNoise = function (seed, scale, octaveCount, octaveFactor) {
    let noises = [];
    for (let i = 0; octaveCount > i; i++) {
        noises.push(H.noise(seed + i, scale * Math.pow(octaveFactor, i)));
    }
    return function (position) {
        return noises.map(noiseFunction => noiseFunction(position)).reduce((prev, cur) => prev + cur, 0);
    }
}