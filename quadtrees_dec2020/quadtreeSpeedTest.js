import { H } from "../helper.js";
import { V2 } from "../vector2.js";

let ctx = document.getElementById("canvas").getContext("2d");

let vectors = [];

let rand = H.mulberry32(1);

for (let i = 0; 10 > i; i++) {
    let pt = new V2(rand() * 1024, rand() * 1024);
    vectors.push(pt);
}

let quadtree = new H.Quadtree([], new V2(0, 0), new V2(1024, 1024), 1, 30);

let index = 0;

let circleCenter = new V2(333, 222);
let circleRadius = 100;

function quadtreeFillLoop() {
    ctx.fillStyle = "black"

    ctx.fillRect(0, 0, 3333, 3333);

    ctx.fillStyle = "#88FF88";
    ctx.strokeStyle = "#444444";

    quadtree.insertAtPosition(vectors[index], vectors[index]);
    
    quadtree.traverseDepthFirst((square) => {
        ctx.lineWidth = 2;
        ctx.strokeRect(square.data.position.x, square.data.position.y, square.data.size.x, square.data.size.y);
    });

    for (let i = 0; index > i; i++) {
        let point = vectors[i];
        ctx.fillRect(Math.floor(point.x) - 1.5, Math.floor(point.y) - 1.5, 4, 4)
    }

    ctx.fillRect(Math.floor(vectors[index].x) - 5.5, Math.floor(vectors[index].y) - 5.5, 12, 12);

    if (index < vectors.length - 1) {
        index++
        if (index < 10) {
            setTimeout(quadtreeFillLoop, 500);
        } else {
            setTimeout(quadtreeFillLoop, 20);
        }
    }
}

function pointsOnGridLoop() {
    if (index == 0) {
            
        ctx.fillStyle = "black"

        ctx.fillRect(0, 0, 3333, 3333);
    }
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(Math.floor(vectors[index].x) - 1.5, Math.floor(vectors[index].y) - 1.5, 4, 4);
    if (index < vectors.length - 1) {
        setTimeout(pointsOnGridLoop, 1);
        index++;
    } else {
        setTimeout(() => {
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#88FF88";
            ctx.beginPath();
            ctx.arc(circleCenter.x, circleCenter.y, circleRadius, 0, Math.PI * 2);
            ctx.stroke();
        }, 400);
    }
}

function pointsWithLinesLoop() {
    if (index == 0) {
            
        ctx.fillStyle = "black"

        ctx.fillRect(0, 0, 3333, 3333);
        
        ctx.fillStyle = "#FFFFFF";
        for (let i = 0; vectors.length > i; i++) {
            let point = vectors[i];
            ctx.fillRect(Math.floor(point.x) - 1.5, Math.floor(point.y) - 1.5, 4, 4);
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#88FF88";
        ctx.beginPath();
        ctx.arc(circleCenter.x, circleCenter.y, circleRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#FF000088";
    ctx.beginPath();
    ctx.moveTo(Math.floor(vectors[index].x), Math.floor(vectors[index].y));
    ctx.lineTo(circleCenter.x, circleCenter.y);
    ctx.stroke();
    if (index < vectors.length - 1) {
        setTimeout(pointsWithLinesLoop, 1);
        index++;
    }
}

function quadtreeCircleCandidatePoints() {

    for (let i = 0; vectors.length > i; i++) {
        let point = vectors[i];
        quadtree.insertAtPosition(point, point);
    }
    let arr = [];       
    
    console.log(H.Quadtree.prototype);

    ctx.fillStyle = "black"

    ctx.fillRect(0, 0, 3333, 3333);

    ctx.fillStyle = "#88FF88";
    ctx.strokeStyle = "#444444";

    for (let i = 0; vectors.length > i; i++) {
        let point = vectors[i];
        ctx.fillRect(Math.floor(point.x) - 1.5, Math.floor(point.y) - 1.5, 4, 4)
    }
    
    quadtree.traverseDepthFirst((square) => {
        ctx.lineWidth = 2;
        ctx.strokeRect(square.data.position.x, square.data.position.y, square.data.size.x, square.data.size.y);
    });


    ctx.lineWidth = 3;
    ctx.strokeStyle = "#88FF88";
    ctx.beginPath();
    ctx.arc(circleCenter.x, circleCenter.y, circleRadius, 0, Math.PI * 2);
    ctx.stroke();

    let checkedSquares = [];


    H.Quadtree.prototype.getAllWithinCircle = function (circleCenter, circleRadius, returnArr) {
 


        if (this.children.length != 0) {
            this.children.forEach(child => {
                checkedSquares.push(child);
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

    quadtree.getAllWithinCircle(circleCenter, circleRadius, arr);

    let squareIndex = 0;
    function checkedSquaresLoop() {

        let square = checkedSquares[squareIndex]

        if (square.children.length == 0 && H.isRectangleIntersectingCircle(square.data.position, square.data.size, circleCenter, circleRadius)) {
            ctx.strokeStyle = "red";
        } else {
            ctx.strokeStyle = "yellow";
        }
        ctx.lineWidth = 2;
        ctx.strokeRect(square.data.position.x + 1, square.data.position.y + 1, square.data.size.x - 2, square.data.size.y - 2);

        if (H.isRectangleIntersectingCircle(square.data.position, square.data.size, circleCenter, circleRadius)) {
            square.data.data.forEach(datum => {
                ctx.fillStyle = "White";
                ctx.fillRect(Math.floor(datum.position.x) - 3.5, Math.floor(datum.position.y) - 3.5, 8, 8);
            })
        }

        if (squareIndex < checkedSquares.length - 1) {
            squareIndex++;
            setTimeout(checkedSquaresLoop, 50);
        }
    }

    checkedSquaresLoop();

}

function naiveSpeedTest() {
    // ctx.fillStyle = "black"

    // ctx.fillRect(0, 0, 3333, 3333);
    

    // ctx.lineWidth = 3;
    // ctx.strokeStyle = "#88FF88";
    // ctx.beginPath();
    // ctx.arc(circleCenter.x, circleCenter.y, circleRadius, 0, Math.PI * 2);
    // ctx.stroke();

    // ctx.fillStyle = "white";
    // vectors.forEach(point => {
    //     ctx.fillRect(Math.floor(point.x) - 0.5, Math.floor(point.y) - 0.5, 2, 2);
    // });

    let pointsWithinCircle = [];

    let timer = new H.Stopwatch();

    vectors.forEach(point => {
        if (point.getDistanceTo(circleCenter) <= circleRadius) {
            pointsWithinCircle.push(point);
        }
    });


    //console.log(pointsWithinCircle);

    return {
        pointCount: vectors.length,
        timeToFindPointsWithinCircle: timer.getInterval()
    }
}

function quadtreeSpeedTest(maxPoints) {
    // ctx.fillStyle = "black"

    // ctx.fillRect(0, 0, 3333, 3333);
    

    // ctx.lineWidth = 3;
    // ctx.strokeStyle = "#88FF88";
    // ctx.beginPath();
    // ctx.arc(circleCenter.x, circleCenter.y, circleRadius, 0, Math.PI * 2);
    // ctx.stroke();

    // ctx.fillStyle = "white";
    // vectors.forEach(point => {
    //     ctx.fillRect(Math.floor(point.x) - 0.5, Math.floor(point.y) - 0.5, 2, 2);
    // });


    let timer = new H.Stopwatch();

    let quad = new H.Quadtree([], new V2(0, 0), new V2(1024, 1024), maxPoints, 20);
    vectors.forEach(point => {
        quad.insertAtPosition(point, point);
    });


    let quadtreeCreationTime = timer.getInterval();


    let pointsWithinCircle = [];
    
    quad.getAllWithinRect(new V2(circleCenter).sub(new V2(circleRadius, circleRadius)), new V2(circleRadius, circleRadius).mult(2), pointsWithinCircle);

    pointsWithinCircle = pointsWithinCircle.filter(point => point.data.getDistanceTo(circleCenter) <= circleRadius);

    //console.log(pointsWithinCircle);
    return {
        pointCount: vectors.length,
        timeToCreateQuadtree: quadtreeCreationTime,
        timeToFindPointsWithinCircle: timer.getInterval()
    }
}

//setTimeout(pointsOnGridLoop(), 200);

//setTimeout(pointsWithLinesLoop(), 200);

//setTimeout(quadtreeFillLoop, 200);

//setTimeout(quadtreeCircleCandidatePoints, 200);

console.log("got here")

function bothSpeedTests() {

    let naiveTable = [];
    let qtTable1MaxPoint = [];
    let qtTable8MaxPoints = [];

    for (let pow = 1; 7 > pow; pow++) {

        let pts = Math.pow(10, pow);

        //console.log("\n Point Count:", pts)

        vectors = [];

        let rand = H.mulberry32(1);

        for (let i = 0; pts > i; i++) {
            let pt = new V2(rand() * 1024, rand() * 1024);
            vectors.push(pt);
        }

        naiveTable.push(naiveSpeedTest());
        qtTable1MaxPoint.push(quadtreeSpeedTest(1));
        qtTable8MaxPoints.push(quadtreeSpeedTest(8));
    }
    
    console.log("\n====== Naive Method ======");
    console.table(naiveTable);
    console.log("\n====== Quadtree (1 point/square) ======");
    console.table(qtTable1MaxPoint);
    console.log("\n====== Quadtree (8 points/square) ======");
    console.table(qtTable8MaxPoints);
}

window.alert("Check the developer console for results. The page will announce 'Done!' once everything has been calculated (may take a while).");
bothSpeedTests();
window.alert("Done!");