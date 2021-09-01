import React,{useRef,useEffect} from 'react';

const Canvas = props=>{
    const {draw, ...rest} = props;

    const canvasRef = useRef(null)

  

    useEffect(()=>{
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        function render(ctx, draw){
            ctx.clearRect(0,0,canvas.width,canvas.height)

            draw.forEach(function(rect){
                ctx.fillStyle = rect.color
                ctx.fillRect(rect.x,rect.y,rect.width,rect.height)
            })
        }
        render(context,draw)

    },[draw])


    return <canvas ref={canvasRef} {...rest}/>
}

export default Canvas