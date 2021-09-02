const initialState = {
    canvas: {x:0,y:0}, //canvas coordinates for panning
    items:[
        {id:1,type:'rectangle',x:10,y:10,width:50,height:50,color: 'red'},
        {id:2,type:'rectangle',x:30,y:30,width:50,height:50,color: 'blue'},
        {id:3,
            type:'path',
            lineWidth: 5,
            lineColor: "#000000",
            lineJoin:"round",
            coordinates:[
                {x:0,y:0},//mouse event start position
                {x:50,y:50},
                {x:100,y:200}
              ] 
        }
    ], //items array
    xDragging:null, // the current x position of the mouse for panning
    yDragging:null, // the current y position of mouse for panning
    selectedItemId:null,    // the id of the draggable item
}

export default function drawReducer(state= initialState,action){
    switch(action.type) {
        case 'draw/translate-canvas-start':return{
            ...state,
           xDragging:action.payload.xDragging,
           yDragging:action.payload.yDragging,
        };
        case 'draw/translate-canvas':return{
            ...state,
            canvas:{
                x:state.canvas.x+action.payload.xDragging - state.xDragging,
                y:state.canvas.y+action.payload.yDragging - state.yDragging,
            },
            xDragging:action.payload.xDragging,
            yDragging:action.payload.yDragging,
        };
        case 'draw/translate-canvas-end':return{
            ...state,
            xDragging:null,
            yDragging:null,
        };
        case 'draw/translate-item-start':return {
            ...state,
            xDragging:action.payload.xDragging,
            yDragging:action.payload.yDragging,
            selectedItemId:action.payload.id
        };
        case 'draw/translate-item':
            const newItems = state.items.map(item=>{
                if(item.id===state.selectedItemId){
                   return{
                    ...item,
                    x:item.x+action.payload.xDragging- state.xDragging,
                    y:item.y+action.payload.yDragging - state.yDragging,
                   }
                }else{
                    return item
                }
                })
            return {
                ...state,
                items:newItems,
                xDragging:action.payload.xDragging,
                yDragging:action.payload.yDragging,
            };
        case "draw/translate-item-end":return{
            ...state,
            xDragging:null,
            yDragging:null,
            selectedItemId:null,
        }
        case 'draw/line-start':return{
            ...state,
            items:[
                ...state.items,
                {
                    id:state.items.length,
                    type:action.payload.type,
                    lineWidth: action.payload.lineWidth,
                    lineColor: action.payload.lineColor,
                    lineJoin:action.payload.lineJoin,
                    coordinates:[
                        {x:action.payload.x,y:action.payload.y},//mouse event start position
                    ] 
                }
            ],
            selectedItemId:state.items.length
        }
        case "draw/line-path":
            const updatedItems = state.items.map((item) => {
                if(item.id===state.selectedItemId){
                    return{
                        ...item,
                        coordinates:[...item.coordinates,{x:action.payload.x,y:action.payload.y}],
                    }
                }else{return item}
            })

            return{
            ...state,
            items:updatedItems,
        }
        case 'draw/line-end':return{
            ...state,
            selectedItemId:null
        }
        default:
            return state
    }
}
export const selectDraw = state => state.draw