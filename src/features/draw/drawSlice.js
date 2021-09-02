const initialState = {
    canvas: {x:0,y:0},
    items:[
        {id:1,x:10,y:10,width:50,height:50,color: 'red'},
        {id:2,x:30,y:30,width:50,height:50,color: 'blue'},
    ],
    xDragging:null,
    yDragging:null,
    draggingItemId:null
}

export default function drawReducer(state= initialState,action){
    switch(action.type) {
        case 'draw/translate-canvas-start':return{
           canvas:state.canvas,
           items:state.items,
           xDragging:action.payload.xDragging,
           yDragging:action.payload.yDragging,
           draggingItemId:state.draggingItemId
        };
        case 'draw/translate-canvas':return{
            canvas:{
                x:state.canvas.x+action.payload.xDragging - state.xDragging,
                y:state.canvas.y+action.payload.yDragging - state.yDragging,
            },
            items:state.items,
            xDragging:action.payload.xDragging,
            yDragging:action.payload.yDragging,
            draggingItemId:state.draggingItemId
        };
        case 'draw/translate-canvas-end':return{
            canvas:state.canvas,
            items:state.items,
            xDragging:null,
            yDragging:null,
            draggingItemId:state.draggingItemId
        };
        case 'draw/translate-item-start':return {
            canvas:state.canvas,
            items:state.items,
            xDragging:action.payload.xDragging,
            yDragging:action.payload.yDragging,
            draggingItemId:action.payload.id
        };
        case 'draw/translate-item':
            const newItems = state.items.map(item=>{
                if(item.id===state.draggingItemId){
                   return{
                    id: item.id,
                    x:item.x+action.payload.xDragging- state.xDragging,
                    y:item.y+action.payload.yDragging - state.yDragging,
                    width:item.width,
                    height:item.height,
                    color:item.color,
                   }
                }else{
                    return item
                }
                })
            return {
                canvas:state.canvas,
                items:newItems,
                xDragging:action.payload.xDragging,
                yDragging:action.payload.yDragging,
                draggingItemId:state.draggingItemId,
            };
        case "draw/translate-item-end":return{
            canvas:state.canvas,
            items:state.items,
            xDragging:null,
            yDragging:null,
            draggingItemId:null,
        }
        default:
            return state
    }
}
export const selectDraw = state => state.draw