import React, {Component} from 'react'
import {Animated, Dimensions, Easing, PanResponder, StyleSheet, TouchableOpacity,Text, View} from 'react-native'
 

const PropTypes = require('prop-types')
const {width,height} = Dimensions.get('window')

const sortRefs = new Map();
const animMaps = new Map();
const measureDelay = 100
const defaultZIndex = 8
const touchZIndex = 99
const maxScale = 1.1
const minOpacity = 0.8
const scaleDuration = 100

const deviceWidth = Dimensions.get('window').width
const childrenWidth = width/3.2;
const childrenHeight = height/7.2;
const itemWidth = 72
const itemHeight = 36
const sortWidth = deviceWidth

 
const slideDuration = 300

let isEditStateSX = false

export default class DragSortableView extends Component{

 
    constructor(props) {
        super(props);

        this.itemWidth = props.childrenWidth+props.marginChildrenLeft+props.marginChildrenRight
        this.itemHeight = props.childrenHeight+props.marginChildrenTop+props.marginChildrenBottom
        this.state = {
            Button1:'',
            BannerDB:'',  
            newsAnnouncements:'',
            NowType:1,
            enabled:true,
            scrollEnabled: true,
            isEditStateS: false, 
            dataSource:'',
            height:0,
            childrenWidthSS:100,
            childrenHeightSS:100,
          }
        this.reComplexDataSource(true,props)
    }
    
    componentWillMount(props) {
        
         console.log(this.props) 
         console.log('------------------')
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => {
                this.isMovePanResponder = false
                return false
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => this.isMovePanResponder,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.isMovePanResponder,

            onPanResponderGrant: (evt, gestureState) => {},
            onPanResponderMove: (evt, gestureState) => this.moveTouch(evt,gestureState),
            onPanResponderRelease: (evt, gestureState) => this.endTouch(evt),

            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onShouldBlockNativeResponder: (evt, gestureState) => false,
        })
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.dataSource != nextProps.dataSource) {
            this.reComplexDataSource(false,nextProps)
        }
    }

    startTouch(touchIndex) {

        this.isHasMove = false
        console.log(touchIndex)
        console.log(sortRefs.has(touchIndex))
        if (!this.props.sortable) return
  
        if (sortRefs.has(touchIndex)) {
            
            if (this.props.onDragStart) { 
                isEditStateSX = true;
                this.props.onDragStart(touchIndex)
            }
            if(this.state.dataSource.length != 0){
                Animated.timing(
                    this.state.dataSource[touchIndex].scaleValue,
                    {
                        toValue: maxScale,
                        duration: scaleDuration,
                    }
                ).start(()=>{
                    this.touchCurItem = {
                        ref: sortRefs.get(touchIndex),
                        index: touchIndex,
                        originLeft: this.state.dataSource[touchIndex].originLeft,
                        originTop: this.state.dataSource[touchIndex].originTop,
                        moveToIndex: touchIndex,
                    }
                    this.isMovePanResponder = true
                })
            }
           
        }
    }



    moveTouch (nativeEvent,gestureState) {
       console.log('aaa1')
        this.isHasMove = true

        //if (this.isScaleRecovery) clearTimeout(this.isScaleRecovery)

        if (this.touchCurItem) {

            let dx = gestureState.dx
            let dy = gestureState.dy

            const rowNum = parseInt(this.props.parentWidth/this.itemWidth);
            const maxWidth = this.props.parentWidth-this.itemWidth
            const maxHeight = this.itemHeight*Math.ceil(this.state.dataSource.length/rowNum) - this.itemHeight

            //出界后取最大或最小值
            if (this.touchCurItem.originLeft + dx < 0) {
                dx = -this.touchCurItem.originLeft
            } else if (this.touchCurItem.originLeft + dx > maxWidth) {
                dx = maxWidth - this.touchCurItem.originLeft
            }
            if (this.touchCurItem.originTop + dy < 0) {
                dy = -this.touchCurItem.originTop
            } else if (this.touchCurItem.originTop + dy > maxHeight) {
                dy = maxHeight - this.touchCurItem.originTop
            }
 
            let left = this.touchCurItem.originLeft + dx
            let top = this.touchCurItem.originTop + dy

            this.touchCurItem.ref.setNativeProps({
                style: {
                    zIndex: touchZIndex,
                }
            })
            
            console.log(left)
            this.state.dataSource[this.touchCurItem.index].position.setValue({
                x: left,
                y: top,
            })


            let moveToIndex = 0
            let moveXNum = dx/this.itemWidth
            let moveYNum = dy/this.itemHeight
            if (moveXNum > 0) {
                moveXNum = parseInt(moveXNum+0.5)
            } else if (moveXNum < 0) {
                moveXNum = parseInt(moveXNum-0.5)
            }
            if (moveYNum > 0) {
                moveYNum = parseInt(moveYNum+0.5)
            } else if (moveYNum < 0) {
                moveYNum = parseInt(moveYNum-0.5)
            }

            moveToIndex = this.touchCurItem.index+moveXNum+moveYNum*rowNum

            if (moveToIndex > this.state.dataSource.length-1) moveToIndex = this.state.dataSource.length-1

            if (this.touchCurItem.moveToIndex != moveToIndex ) {
                this.touchCurItem.moveToIndex = moveToIndex

                this.state.dataSource.forEach((item,index)=>{

                    let nextItem = null
                    if (index > this.touchCurItem.index && index <= moveToIndex) {
                        nextItem = this.state.dataSource[index-1]

                    } else if (index >= moveToIndex && index < this.touchCurItem.index) {
                        nextItem = this.state.dataSource[index+1]

                    } else if (index != this.touchCurItem.index &&
                        (item.position.x._value != item.originLeft ||
                            item.position.y._value != item.originTop)) {
                        nextItem = this.state.dataSource[index]

                    } else if ((this.touchCurItem.index-moveToIndex > 0 && moveToIndex == index+1) ||
                        (this.touchCurItem.index-moveToIndex < 0 && moveToIndex == index-1)) {
                        nextItem = this.state.dataSource[index]
                    }

                    if (nextItem != null) {
                        Animated.timing(
                            item.position,
                            {
                                toValue: {x: parseInt(nextItem.originLeft+0.5),y: parseInt(nextItem.originTop+0.5)},
                                duration: slideDuration,
                                easing: Easing.out(Easing.quad),
                            }
                        ).start()
                    }

                })
            }

        }
    }

    endTouch (nativeEvent) {
        console.log('aaa22')
        //clear

        if (this.touchCurItem) {
            if (this.props.onDragEnd) {
                this.props.onDragEnd(this.touchCurItem.index,this.touchCurItem.moveToIndex)
            }
            //this.state.dataSource[this.touchCurItem.index].scaleValue.setValue(1)
            Animated.timing(
                this.state.dataSource[this.touchCurItem.index].scaleValue,
                {
                    toValue: 1,
                    duration: scaleDuration,
                }
            ).start()
            this.touchCurItem.ref.setNativeProps({
                style: {
                    zIndex: defaultZIndex,
                }
            })
            this.changePosition(this.touchCurItem.index,this.touchCurItem.moveToIndex)
            this.touchCurItem = null
        }
    }

    onPressOut () {
        this.isScaleRecovery = setTimeout(()=> {
            if (this.isMovePanResponder && !this.isHasMove) {
                isEditStateSX =false
                this.endTouch()
            }
        },220)
    }

    changePosition(startIndex,endIndex) {
        console.log('aaa33')
        if (startIndex == endIndex) {
            const curItem = this.state.dataSource[startIndex]
            this.state.dataSource[startIndex].position.setValue({
                x: parseInt(curItem.originLeft+0.5),
                y: parseInt(curItem.originTop+0.5),
            })
            return;
        }

        let isCommon = true
        if (startIndex > endIndex) {
            isCommon = false
            let tempIndex = startIndex
            startIndex = endIndex
            endIndex = tempIndex
        }

        const newDataSource = [...this.state.dataSource].map((item,index)=>{
            let newIndex = null
            if (isCommon) {
                if (endIndex > index && index >= startIndex) {
                    newIndex = index+1
                } else if (endIndex == index) {
                    newIndex = startIndex
                }
            } else {
                if (endIndex >= index && index > startIndex) {
                    newIndex = index-1
                } else if (startIndex == index) {
                    newIndex = endIndex
                }
            }

            if (newIndex != null) {
                const newItem = {...this.state.dataSource[newIndex]}
                newItem.originLeft = item.originLeft
                newItem.originTop = item.originTop
                newItem.position = new Animated.ValueXY({
                    x: parseInt(item.originLeft+0.5),
                    y: parseInt(item.originTop+0.5),
                })
                item = newItem
            }

            return item
        })

        this.setState({
            dataSource: newDataSource
        },()=>{
            if (this.props.onDataChange) {
                this.props.onDataChange(this.getOriginalData())
            }
            //防止RN不绘制开头和结尾
            const startItem = this.state.dataSource[startIndex]
            this.state.dataSource[startIndex].position.setValue({
                x: parseInt(startItem.originLeft+0.5),
                y: parseInt(startItem.originTop+0.5),
            })
            const endItem = this.state.dataSource[endIndex]
            this.state.dataSource[endIndex].position.setValue({
                x: parseInt(endItem.originLeft+0.5),
                y: parseInt(endItem.originTop+0.5),
            })
        }) 
    }

    reComplexDataSource(isInit,props) { 
            const rowNum = parseInt(props.parentWidth/this.itemWidth);
            const dataSource = props.dataSource.map((item,index)=>{
            const newData = {}
            const left = (index%rowNum)*this.itemWidth
            const top = parseInt((index/rowNum))*this.itemHeight

            newData.data = item
            newData.originIndex = index
            newData.originLeft = left
            newData.originTop = top
            newData.position = new Animated.ValueXY({
                x: parseInt(left+0.5),
                y: parseInt(top+0.5),
            })
            newData.scaleValue = new Animated.Value(1)
            return newData
        })

        if (isInit) {
            
             this.state.dataSource = dataSource
             this.state.height = Math.ceil(dataSource.length/rowNum)*this.itemHeight


        } else {
            this.setState({
                dataSource: dataSource,
                height: Math.ceil(dataSource.length/rowNum)*this.itemHeight
            })
        } 
    }

    getOriginalData () {
        console.log('xxx1')
        return this.state.dataSource.map((item,index)=> item.data)
    }


    closeButton(){ 
        
        isEditStateSX =false
        this.isScaleRecovery = setTimeout(()=> {
            
                this.endTouch()
           
        },220)
       
        
    } 

    render() {

        const {isEditStateS} = this.state;

        window.CloseHomeButton = () =>{   //關閉 
            this.closeButton();
        }

        window.OpenHomeButton = () =>{   //關閉 
            this.startTouch(0)
        }

        console.log(this.props.marginChildrenLeft)
 
       
        return (
            this.props.Type == false ? 
           
            <View
                //ref={(ref)=>this.sortParentRef=ref}
                style={[styles.container,{
                    width: this.props.parentWidth,
                    height: this.state.height,
                }]}
                //onLayout={()=> {}}
                >
                {
                    this.state.dataSource.map((item,index)=>{
                            
                        return (
                            <Animated.View
                                key={item.originIndex}
                                ref={(ref) => sortRefs.set(index,ref)}
                                {...this._panResponder.panHandlers}
                                style={[styles.item,{
                                    height:this.props.childrenHeight,
                            width:this.props.childrenWidth,
                                    marginTop: this.props.marginChildrenTop,
                                    marginBottom: this.props.marginChildrenBottom,
                                    marginLeft: this.props.marginChildrenLeft,
                                    marginRight: this.props.marginChildrenRight,
                                    left: item.position.x,
                                    top: item.position.y,
                                    opacity: item.scaleValue.interpolate({
                                        inputRange:[1,maxScale],
                                        outputRange:[1,minOpacity]
                                    }),
                                    transform: [
                                        {scale: item.scaleValue}
                                    ]
                                }]}>
                                <TouchableOpacity
                                    activeOpacity = {1}
                                    hitSlop={{top:3,bottom:3,left:3,right:3 }}
                                    //onPressOut={()=> this.onPressOut()}
                                    onLongPress={()=>this.startTouch(index)}
                                    onPress={()=>{
                                        if (isEditStateSX == false ) {
                                             if(item.data.gameT !="JBP" && item.data.gameT !="JBR"){
                                                this.props.onOpenGame(item.data.key,item.data.gameT)
                                             }else{
                                                this.props.onOpenGameSS(item.data.key,item.data.gameT)
                                             } 
                                        }
                                    }}>
                                    {this.props.renderItem(item.data,index)}
  
                                </TouchableOpacity>

                                {isEditStateSX == true  && 
                                    <TouchableOpacity 
                                    onPressIn={()=>{
                                        this.props.onClickItem(this.getOriginalData(),item.data,index)
                                    }}
                                    > 
                                <View style={styles.selected_item_icon}>  
                                    <Text style={styles.closeButton}>Ｘ</Text> 
                                </View>   
                                </TouchableOpacity>
                                } 
                            </Animated.View>
                        )
                    })
                }
            </View>
 
        :this.props.Type == true &&
 
        <View
        //ref={(ref)=>this.sortParentRef=ref}
        style={[styles.container,{
            width: this.props.parentWidth,
            height:height+300,
        }]}
        //onLayout={()=> {}}
        >
        {
            this.state.dataSource.map((item,index)=>{ 
                return (
                    <Animated.View
                        key={item.originIndex}
                        ref={(ref) => sortRefs.set(index,ref)}
                        {...this._panResponder.panHandlers}
                        style={[styles.item,{
                            height:this.props.childrenHeight,
                            width:this.props.childrenWidth,
                            marginTop: this.props.marginChildrenTop,
                            marginBottom: this.props.marginChildrenBottom,
                            marginLeft: this.props.marginChildrenLeft,
                            marginRight: this.props.marginChildrenRight,
                            left: item.position.x,
                            top: item.position.y,
                            opacity: item.scaleValue.interpolate({
                                inputRange:[1,maxScale],
                                outputRange:[1,minOpacity]
                            }),
                            transform: [
                                {scale: item.scaleValue}
                            ]
                        }]}>
 

                        <TouchableOpacity
                            activeOpacity = {1}
                            hitSlop={{top:3,bottom:3,left:3,right:3 }}
                            //onPressOut={()=> this.onPressOut()}
                            onLongPress={()=>this.startTouch(index)}
                            onPress={()=>{
                                if (isEditStateSX == false ) {
                                    this.props.onOpenGame(item.data.key,item.data.gameT)
                                }
                            }}>
                            {this.props.renderItem(item.data,index)}  
                        </TouchableOpacity>

                        {isEditStateSX == true  && 
                            <TouchableOpacity 
                            onPressIn={()=>{
                                this.props.onClickItem(this.getOriginalData(),item.data,index)
                            }}
                            > 
                        <View style={styles.selected_item_icon}>  
                            <Text style={styles.closeButton}>＋</Text> 
                        </View>   
                        </TouchableOpacity>
                        } 
                    </Animated.View>
                )
            })
        } 

        {isEditStateSX == true  &&
            <TouchableOpacity onPressIn={()=>{this.closeButton(),CloseButton() }} > 
            <View style={{width:width+250,height:height+300}}></View>
            </TouchableOpacity>
       
            }
            </View>

        )
    }

    componentWillUnmount() {
        if (this.isScaleRecovery) clearTimeout(this.isScaleRecovery)
    }

}

DragSortableView.propsTypes = {
    dataSource: PropTypes.array.isRequired,
    parentWidth: PropTypes.number,
    childrenHeight: PropTypes.number.isRequired,
    childrenWidth: PropTypes.number.isRequired,

    marginChildrenTop: PropTypes.number,
    marginChildrenBottom: PropTypes.number,
    marginChildrenLeft: PropTypes.number,
    marginChildrenRight: PropTypes.number,

    sortable: PropTypes.bool,

    onClickItem: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDataChange: PropTypes.func,
    renderItem: PropTypes.func.isRequired,
}

DragSortableView.defaultProps = {
    marginChildrenTop: 0,
    marginChildrenBottom: 0,
    marginChildrenLeft: 0,
    marginChildrenRight: 0,
    parentWidth: width,
    sortable: true,
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    item: {
        position: 'absolute',
        zIndex: defaultZIndex, 
    },
    selected_item_icon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        position: 'absolute',
        top: (childrenHeight - itemHeight - 90) / 2 + 16*0.25, //下移点
        left: (childrenWidth + itemWidth -10) / 2 - 16*0.25 //右移点，也可以换个布局
    },
    unselected_item: {
        width: 72,
        height: 36,
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    unselected_item_icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
        marginLeft: 6
    },
    closeButton:{
	    paddingTop:2,
		left:20,
		fontSize:18,fontWeight:'900',color:'#fff',
		width:25,
		height:25,
		borderWidth: 1,
        borderRadius:13, 
        backgroundColor:'#939393',
		borderColor: '#fff',
		textAlign:'center'
	 },
})
