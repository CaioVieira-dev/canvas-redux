import React,{useRef,useEffect} from 'react';
import {useDispatch,useSelector} from 'react-redux'

import store from '../../store'

const Canvas = props=>{
    const canvasRef = useRef(null)
    const state = useSelector(state=>state.draw)
    const dispatch = useDispatch()
  

    useEffect(()=>{
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        context.canvas.width = window.innerWidth
        context.canvas.height = window.innerHeight

        const draw = ()=>{
            context.setTransform(1,0,0,1,0,0)
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.setTransform(1,0,0,1,state.canvas.x, state.canvas.y)
            state.items.forEach(item=>{
                context.fillStyle = item.color
                context.fillRect(item.x,item.y,item.width, item.height)
            })
        }
        store.subscribe(draw)
        function startEvent(event){
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
        function dragEvent(event) {
            if(state.draggingItemId!==null){
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
        function endEvent(event) {
            if(state.draggingItemId!==null){
                dispatch({type:"draw/translate-item-end",payload:{}})
            }else{
                dispatch({type:"draw/translate-canvas-end",payload:{}})
            }
        }
        
        canvas.addEventListener('mousedown',startEvent,false)
        canvas.addEventListener('mousemove',dragEvent,false)
        canvas.addEventListener('mouseup',endEvent,false)
        draw()
        return ()=>{
            canvas.removeEventListener('mousedown',startEvent)
            canvas.removeEventListener('mousemove',dragEvent)
            canvas.removeEventListener('mouseup',endEvent)
        }

    },[dispatch,
        state.canvas.x,
        state.canvas.y,
        state.items,
        state.xDragging,
        state.yDragging,
        state.draggingItemId])


    return <canvas ref={canvasRef} {...props}/>
}

export default Canvas