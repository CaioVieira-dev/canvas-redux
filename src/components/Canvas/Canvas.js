import React,{useRef,useEffect,useState} from 'react';
import {useDispatch,useSelector} from 'react-redux'

import store from '../../store'

const Canvas = props=>{
    const canvasRef = useRef(null)

    const drawingCanvasRef = useRef(null)
    const drawingSnapshotCoords = useRef({minX: 0, minY: 0,maxX: 0, maxY: 0})


    const isDrawing = useRef(false)

    const state = useSelector(state=>state.draw)
    const [mode, setMode] = useState('draw')
    const dispatch = useDispatch()
  

    useEffect(()=>{
        const WIDTH = window.innerWidth
        const HEIGHT = window.innerHeight

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        const DCanvas = drawingCanvasRef.current
        const DContext = DCanvas.getContext('2d')

        context.canvas.width = WIDTH
        context.canvas.height = HEIGHT
        DContext.canvas.width = WIDTH
        DContext.canvas.height = HEIGHT


        const drawRect = (item)=>{
                context.fillStyle = item.color
                context.fillRect(item.x,item.y,item.width, item.height)
        }
        const drawLine = (item)=>{
            context.lineWidth=item.lineWidth
            context.lineColor=item.lineColor
            context.lineJoin=item.lineJoin

            context.moveTo(item.coordinates[0].x, item.coordinates[0].y)
            context.beginPath()
            if(item.coordinates.length>1){ 
                for(let i=0; i<item.coordinates.length;i++){
                    context.lineTo(item.coordinates[i].x, item.coordinates[i].y)
                    context.moveTo(item.coordinates[i].x, item.coordinates[i].y)
                    
                }
                context.closePath()
                context.stroke()
            }


        }

        const draw = ()=>{
            context.setTransform(1,0,0,1,0,0)
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.setTransform(1,0,0,1,state.canvas.x, state.canvas.y)

            state.items.forEach(function(item) {
            switch(item.type) {
                case 'rectangle':
                    drawRect(item);
                break;
                case 'path':
                    drawLine(item);
                break;
                default:return;
            }    
            })

        }
        store.subscribe(draw)
        function startEvent(event){
            if(mode==="draw"){
                // dispatch({
                //     type: "draw/line-start",
                //     payload:{
                //         type:"path",
                //         lineWidth:5,
                //         lineColor:"#000000",
                //         lineJoin:"round",
                //         x:event.clientX,
                //         y:event.clientY,
                //     }
                // })
                isDrawing.current = true;
                context.moveTo(event.clientX, event.clientY)
            context.beginPath()
            }else{
                for(let i=state.items.length-1; i>=0; i--){
                    const item = state.items[i];
                    
                    context.beginPath();
                    context.rect(item.x, item.y, item.width, item.height)
                    if(context.isPointInPath(event.offsetX,event.offsetY)){
                        dispatch({
                            type:"draw/translate-item-start",
                            payload:{
                                id:item.id,
                                xDragging:event.offsetX,
                                yDragging:event.offsetY,
                            }
                        })
                        return
                    }
                }
                dispatch({
                    type:"draw/translate-canvas-start",
                    payload:{
                        xDragging:event.offsetX,
                        yDragging:event.offsetY
                    }
                })

            }

        }
        function dragEvent(event) {
            if(mode==="draw"){
                // if(state.selectedItemId!==null){

                //     dispatch({
                //         type: "draw/line-path",
                //         payload:{
                //             x:event.clientX,
                //             y:event.clientY,
                //         }
                //     })
                // }
                if(isDrawing.current){
                    context.lineTo(event.clientX, event.clientY);
                    context.closePath();
                    context.stroke();
                    context.moveTo(event.clientX, event.clientY);
                }

            }else{

                if(state.selectedItemId!==null){
                    store.dispatch({
                        type:"draw/translate-item",
                        payload:{
                            xDragging:event.offsetX,
                            yDragging:event.offsetY
                        } 
                    })
                }else if(state.xDragging!==null&&state.yDragging!==null){
                    dispatch({
                        type:"draw/translate-canvas",
                        payload:{
                            xDragging:event.offsetX,
                            yDragging:event.offsetY
                        }
                    })
                }
            }
        }
        function endEvent(event) {
            if(mode==="draw"){
                // dispatch({
                //     type: "draw/line-end",
                //     payload:{}
                // })
            isDrawing.current=false;
            const dataURL = canvas.toDataURL();
            console.log('dataUrl without treatment',dataURL);

        }else{

                if(state.selectedItemId!==null){
                    dispatch({type:"draw/translate-item-end",payload:{}})
                }else{
                    dispatch({type:"draw/translate-canvas-end",payload:{}})
                }
            }
        }
        function updateSnapshotCoords(x,y){
            let copy = drawingSnapshotCoords.current
            if(x<copy.minX){
                copy.minX = x
            }else if(x>copy.maxX){
                copy.maxX = x
            }
            if(y<copy.minY){
                copy.minY = y
            }else if(y>copy.maxY){
                copy.maxY = y
            }

            drawingSnapshotCoords.current = copy
        }

        function lineStart(event){
            isDrawing.current = true;
            drawingSnapshotCoords.current ={minX: event.clientX, minY: event.clientY,maxX: event.clientX, maxY: event.clientY}
            DContext.moveTo(event.clientX, event.clientY)
            DContext.beginPath()
        }
        function lineDraw(event){
            if(isDrawing.current){
                DContext.lineTo(event.clientX, event.clientY);
                DContext.closePath();
                DContext.stroke();
                DContext.moveTo(event.clientX, event.clientY);
            updateSnapshotCoords(event.clientX,event.clientY)

            }
        }
        function lineEnd(event) {
            isDrawing.current=false;
            const minX= drawingSnapshotCoords.current.minX
            const minY= drawingSnapshotCoords.current.minY
            const maxX= drawingSnapshotCoords.current.maxX
            const maxY= drawingSnapshotCoords.current.maxY
            console.log('minX: ',minX,'maxX: ',maxX,'minY: ',minY,'maxY: ',maxY)
            const image = DContext.getImageData(minX, minY, maxX, maxY)
            console.log(image)
            DContext.clearRect(0,0,DCanvas.width,DCanvas.height)
            DContext.canvas.width = maxX - minX
            DContext.canvas.height = maxY - minY

            DContext.putImageData(image,0,0)


           // context.putImageData(image,300,100) //image A
           // context.putImageData(image,400,200) //image B

            const aSpec = {width:image.width, 
                height:image.height,data:image.data,
                x:300, y:100}

            const bSpec = {width:image.width, 
                height:image.height,data:image.data,
                x:400, y:200}
            
            const xWidth = image.width+ (Math.max(aSpec.x,bSpec.x)-Math.min(aSpec.x,bSpec.x))
            const xHeight = image.height+ (Math.max(aSpec.y,bSpec.y)-Math.min(aSpec.y,bSpec.y))
            const xSpec = {
                width:xWidth,
                height:xHeight,
                x:Math.min(aSpec.x,bSpec.x),
                y:Math.min(aSpec.y,bSpec.y)}
            
            console.log(xSpec)

            

                const xImage = context.createImageData(xSpec.width,xSpec.height)
            //assuming aSpec is at point zero
            for(let xx=3; xx<aSpec.width+1;xx+=4){
                for(let yy=0; yy<aSpec.height+1;yy++){
                    if(aSpec.data[xx+(yy*aSpec.width)]!==0){
                        xImage.data[xx+(yy*aSpec.width)] = aSpec.data[xx+(yy*aSpec.width)];
                        xImage.data[(xx+(yy*aSpec.width))-1] = aSpec.data[(xx+(yy*aSpec.width))-1];
                        xImage.data[(xx+(yy*aSpec.width))-2] = aSpec.data[(xx+(yy*aSpec.width))-2];
                        xImage.data[(xx+(yy*aSpec.width))-3] = aSpec.data[(xx+(yy*aSpec.width))-3];
                    }
                }
            }
            //assuming bSpec is at point 100 100
            for(let xx=3; xx<bSpec.width+1; xx+=4) {
                for(let yy=0; yy<bSpec.height+1;yy++){
                    if(bSpec.data[xx+(yy*bSpec.width)]!==0){
                        xImage.data[(xx+100)+((yy+100)*bSpec.width)] = bSpec.data[xx+(yy*bSpec.width)];
                        xImage.data[((xx+100)+((yy+100)*bSpec.width))-1] = bSpec.data[(xx+(yy*bSpec.width))-1];
                        xImage.data[((xx+100)+((yy+100)*bSpec.width))-2] = bSpec.data[(xx+(yy*bSpec.width))-2];
                        xImage.data[((xx+100)+((yy+100)*bSpec.width))-3] = bSpec.data[(xx+(yy*bSpec.width))-3];
                    }
                }
            }
           
            context.clearRect(0,0,WIDTH,HEIGHT);
            context.putImageData(xImage,xSpec.x,xSpec.y)
            
            const dataURL=DCanvas.toDataURL()
            console.log(dataURL)
            DContext.canvas.width = WIDTH
            DContext.canvas.height = HEIGHT
            
            //DContext.putImageData(image,200,100)
            
            console.log(canvas.toDataURL())

        }
        
        canvas.addEventListener('mousedown',startEvent,false)
        canvas.addEventListener('mousemove',dragEvent,false)
        canvas.addEventListener('mouseup',endEvent,false)
        DCanvas.addEventListener('mousedown',lineStart,false)
        DCanvas.addEventListener('mousemove',lineDraw,false)
        DCanvas.addEventListener('mouseup',lineEnd,false)
        draw()
        return ()=>{
            canvas.removeEventListener('mousedown',startEvent)
            canvas.removeEventListener('mousemove',dragEvent)
            canvas.removeEventListener('mouseup',endEvent)
            DCanvas.removeEventListener('mousedown',lineStart)
            DCanvas.removeEventListener('mousemove',lineDraw)
            DCanvas.removeEventListener('mouseup',lineEnd)
        }

    },[dispatch,
        state.canvas.x,
        state.canvas.y,
        state.items,
        state.xDragging,
        state.yDragging,
        state.selectedItemId,
    mode,
isDrawing])


    return (<>
        <canvas ref={canvasRef} {...props} className={mode!=="draw" ?"active mainCanvas":""}/>
        <canvas ref={drawingCanvasRef} className="drawingCanvas" />
        </>)
}

export default Canvas