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


# Merge png
## Considerations
- ImageData has 3 properties:
    - width: The width in pixels of the image.
    - height: The height in pixels of the image.
    - data: The rgba data of the pixels in Uint8ClampedArray
- These fields are read-only, but this doesn't mean that it's not possible to change them, only that we can't replace the array

## Steps
1. First generate a new array of pixels, with the max size of width and height of your ImageData
2. Look in your images if the pixel has alpha greater than 0, if so write into the image the rgba values at new ImageData.data

### Catches
- Your new ImageData may be an array bigger than the original, if so there will be spots with no pixel data. In the blending loop try to iterate only the needed spots.
- The ImageData.data array one dimensional. it's size is width * height * 4 (specifically Red Green Blue Alpha). Vectors are faster to iterate than bi-dimensional arrays.
- One good strategy is to iterate separately where it should only copy the pixels

x+y*w

x=0 => y=0 => w=4 => 0a
x=0 => y=1 => w=4 => 1a
x=0 => y=2 => w=4 => 2a
x=1 => y=0 => w=4 => 0b
x=1 => y=1 => w=4 => 1b


[ 0a , 0b , 0c , 0d ]
[ 1a , 1b , 1c , 1d ]
[ 2a , 2b , 2c , 2d ]