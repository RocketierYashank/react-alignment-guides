import React, { Component } from 'react';
import Draggable from 'react-draggable'; // The default
import cornerNotch from './assets/cornerNotch.svg';
import middleNotch from './assets/middleNotch.svg';
import styles from './styles.scss';
import { Rnd } from "react-rnd";


export default class Cropper extends Component {
    constructor(props) {
        super(props);
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
        this.calculateNewScale = this.calculateNewScale.bind(this);
        this.state = {
            translateX : 0,
            translateY : 0,
            scale: null,
            centerSet: false
        }
        this.escFunction = this.escFunction.bind(this);
        this.calculateNewObjectPosition = this.calculateNewObjectPosition.bind(this);
        this.myRef = React.createRef();
        this.calculateNewObjectPositionCenter = this.calculateNewObjectPositionCenter.bind(this);
    }
    escFunction(event) {
        if (event.keyCode === 27) {
            // this.calculateNewObjectPosition();
            const scale = this.state.scale || this.props.zoomScale;
            // const widthDiff = (this.state.width - this.state.initWidth) / 2;
            // const heightDiff = (this.state.height - this.state.initHeight) / 2;

            // if (widthDiff !== 0) {
            //     const clientXPercentage = (this.props?.objectPosition?.horizontal || 0) + (((widthDiff /  this.props.renderedResolution.width) * 100));
            //     console.log('new x%: ', clientXPercentage, 'old x% ', this.state.clientXPercentage);
            // }
    
            // if (heightDiff !== 0) {
            //     const clientYPercentage = (this.props?.objectPosition?.vertical || 0) + (((heightDiff / this.props.renderedResolution.height ) * 100));   
            //     console.log('new y%: ', clientYPercentage, 'old y% ', this.state.clientYPercentage);
            // }

            this.calculateNewObjectPositionCenter();

            this.props.endCropMode({
                scale,
                clientXPercentage: this.state.clientXPercentage ? this.state.clientXPercentage : this.props.objectPosition.horizontal,
                clientYPercentage: this.state.clientYPercentage ? this.state.clientYPercentage : this.props.objectPosition.vertical
            });
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    componentDidUpdate(previousProps, previousState) {
        if (!previousState.centerSet) {
            if (this.myRef && this.myRef.current) {
                console.log('init Center Rect:', this.myRef.current.getBoundingClientRect())
                this.setState({
                    initCenterRect : this.myRef.current.getBoundingClientRect(),
                    centerSet: true
                })
            }
        }
    }

    calculateNewObjectPositionCenter() {
        const currentCenter = this.myRef.current.getBoundingClientRect();
        const {initCenterRect} = this.state;

        console.log('center moved by: (', initCenterRect.x - currentCenter.x, ",", initCenterRect.y - currentCenter.y, ")");

        const differenceInX =  currentCenter.x - initCenterRect.x;
        const differenceInY =  currentCenter.y - initCenterRect.y;
        const newScale = this.state.scale || this.props.zoomScale || 1;

        let clientXPercentage = 0;

        if (differenceInX !== 0) {
            clientXPercentage = (this.props?.objectPosition?.horizontal || 0) + (((differenceInX /  this.props.renderedResolution.width) * 100) / newScale);
            this.setState({
                clientXPercentage
            })
        }

        let clientYPercentage = 0;

        if (differenceInY !== 0) {
            clientYPercentage = (this.props?.objectPosition?.vertical || 0) + (((differenceInY / this.props.renderedResolution.height ) * 100) / newScale);   
            this.setState({
                clientYPercentage
            })
        }

        console.log('center calculated new pos: ', clientXPercentage, clientYPercentage);
    }

    calculateNewObjectPosition() {

        const {initialTranslateX, translateX, initialTranslateY, translateY} = this.state;
        const differenceInX =  translateX - initialTranslateX;
        const differenceInY =  translateY - initialTranslateY;
        const newScale = this.state.scale || this.props.zoomScale || 1;


        let clientXPercentage = (this.props?.objectPosition?.horizontal || 0);
        let clientYPercentage = (this.props?.objectPosition?.vertical || 0);

        // if (differenceInX !== 0) {
        //     clientXPercentage = (this.props?.objectPosition?.horizontal || 0) + (((differenceInX /  this.props.renderedResolution.width) * 100) / newScale);
        //     this.setState({
        //         clientXPercentage
        //     })
        // }

        // if (differenceInY !== 0) {
        //     clientYPercentage = (this.props?.objectPosition?.vertical || 0) + (((differenceInY / this.props.renderedResolution.height ) * 100) / newScale);   
        //     this.setState({
        //         clientYPercentage
        //     })
        // }

        console.log('translate calculated new pos: ', clientXPercentage , clientYPercentage);

    }

    calculateNewScale(e, direction, ref, delta, position) {
        const originalWidth = this.state.onLoadBoundingRect.width / this.props.zoomScale ;
        const newScale =  Math.abs(ref.offsetWidth / originalWidth);

        this.setState({
            scale: newScale,
            width: ref.offsetWidth,
            height: ref.offsetHeight, 
            translateX: position.x, 
            translateY: position.y,
        }, () => {
            this.calculateNewObjectPosition();
        });
    }

    handleImageLoaded(e) {
        const boundingRect = e?.target?.getBoundingClientRect();

        const newScale = this.state.scale || this.props.zoomScale || 1;

        let initX = this.props.position.width/2 - boundingRect.width/2;
        let initY = this.props.position.height/2 - boundingRect.height/2;

        if (this.props.objectPosition) {
            initX = initX + Math.round(((this.props.objectPosition?.horizontal || 0) * newScale * this.props.renderedResolution.width) / 100);
            initY = initY + Math.round(((this.props.objectPosition?.vertical || 0) * newScale * this.props.renderedResolution.height) / 100);
        }
        
        this.setState({
            onLoadBoundingRect: boundingRect,
            width: boundingRect.width,
            height: boundingRect.height, 
            initWidth: boundingRect.width,
            initHeight:  boundingRect.height, 
            translateX: initX, 
            translateY: initY,
            initialTranslateX: initX,
            initialTranslateY: initY,
        })
    }


    render() {
        const draggableStyle = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "solid 1px #f00",
            background: "transparent"
        };

        const innerDraggableStyle = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "solid 1px #0f0",
            background: "transparent"
        }

        const newScale = this.state.scale || this.props.zoomScale || 1;

        const outerImageWidth = this.state.width || this?.rnd?.props?.default?.width;
        const outerImageHeight = this.state.height || this?.rnd?.props?.default?.height;


        const outerImageStyles = this.state.onLoadBoundingRect ? {position: 'absolute', filter: 'brightness(0.6)', opacity: '0.75', 'max-width': 'none', width: outerImageWidth, height: outerImageHeight, transform: `translate(${this.state.translateX}px, ${this.state.translateY}px)`} : 
            {"max-height": "100%", position: 'absolute', filter: 'brightness(0.6)', opacity: '0', transform: `scale(${newScale}) translate(${this.state.translateX}px, ${this.state.translateY}px)`};
        const innerImageStyles = this.state.onLoadBoundingRect ? {'max-width': 'none', width: outerImageWidth, height: outerImageHeight, transform: `translate(${this.state.translateX}px, ${this.state.translateY}px)`} : {transform: `scale(${newScale}) translate(${this.state.translateX}px, ${this.state.translateY}px)`, opacity: '0'};

        return (
            <>
                <img onLoad={this.handleImageLoaded} draggable="false" style={outerImageStyles} src={this.props.url} />

                <div style={{ width: '100%', height: '100%', 'pointer-events': 'none', overflow: 'hidden'}}>
                    <img onLoad={this.handleImageLoaded} draggable="false" style={innerImageStyles} src={this.props.url} />
                </div>
                <div className={styles.cropper_border} />

                {this.state.onLoadBoundingRect && <Rnd
                    ref={c => { this.rnd = c; }}
                    lockAspectRatio={true}
                    onDragStop={(e, d) => {
                        this.setState({
                            translateX: d.x, 
                            translateY: d.y, 
                        }, () => {
                            this.calculateNewObjectPosition();
                        })
                        
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => this.calculateNewScale(e, direction, ref, delta, position)}
                    style={draggableStyle}
                    default={{
                        x: this.state.translateX,
                        y: this.state.translateY,
                        width: this.state.onLoadBoundingRect.width,
                        height: this.state.onLoadBoundingRect.height
                    }}
                ><div ref={this.myRef} style={{color: 'red', width: "1px", height: "1px"}}/> </Rnd>}

                {(this.state.onLoadBoundingRect && false) && <Rnd
                    lockAspectRatio={false}
                    style={innerDraggableStyle}
                    onDragStop={(e, d) => {
                    }}
                    default={{
                        x: 0,
                        y: 0,
                        width: '100%',
                        height: '100%'
                    }}
                />}

                <img src={cornerNotch} className={styles.cropper_notch_lt} />
                <img src={cornerNotch} className={styles.cropper_notch_rt} />
                <img src={cornerNotch} className={styles.cropper_notch_rb} />
                <img src={cornerNotch} className={styles.cropper_notch_lb} />
                <img src={middleNotch} className={styles.cropper_notch_tc} />
                <img src={middleNotch} className={styles.cropper_notch_rc} />
                <img src={middleNotch} className={styles.cropper_notch_bc} />
                <img src={middleNotch} className={styles.cropper_notch_lc} />
            </>
        )
    }
}