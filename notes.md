# Draw setup
1. get context
    - width and height
    - lineWidth
    - lineColor
    - lineJoin
    
# Draw line flow
1. Set canvas context
2. Move context to mouse current position
3. Begin path
4. Line to mouse current position
5. Close path
6. Stroke
7. Move to mouse current position
8. end

# Draw line path object
`   
    {
        id:3,
        type:path,
        lineWidth: 5,
        lineColor: "#000000",
        lineJoin:"round",
        coordinates:[{
            initialPosition:{x:0,y:0},
            finalPosition:{x:5,y:5}
        }  ]  
    }
`
# redux path saving
start->{
    id:3, //state.items.lenght
        type:path,
        lineWidth: 5,
        lineColor: "#000000",
        lineJoin:"round",
        coordinates:[
            {x:0,y:0},//mouse event start position
          ] 
}

drag->{ 
    x:1,
    y:0
}
end->{ 

}



        context.lineWidth=5
        context.lineColor="#000000"
        context.lineJoin="round"

        const draw = ()=>{

        }
        store.subscribe(draw)
        function startEvent(event){
            drawing.current = true
            context.moveTo(event.clientX, event.clientY)
            context.beginPath()
        }
        function dragEvent(event) {
            if(drawing.current) {
                context.lineTo(event.clientX, event.clientY);
                context.closePath();
                context.stroke();
                context.moveTo(event.clientX, event.clientY);
            }else{
                context.moveTo(event.clientX, event.clientY);
            }
        }
        function endEvent(event) {
            drawing.current=false;
        }