import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { RESIZE_HANDLES } from './utils/constants';
import styles from './styles.scss';

class Box extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: props.position ? props.position.width : props.defaultPosition.width,
			height: props.position ? props.position.height : props.defaultPosition.height,
			top: props.position ? props.position.top : props.defaultPosition.top,
			left: props.position ? props.position.left : props.defaultPosition.left
		};

		this.dragging = false;
		this.resizing = false;

		this.box = React.createRef();
		this.onDragStart = this.onDragStart.bind(this);
		this.shortcutHandler = this.shortcutHandler.bind(this);
		this.onResizeStart = this.onResizeStart.bind(this);
	}

	onDragStart(e) {
		const { target } = e;
		const startingPosition = target.getBoundingClientRect().toJSON();
		const data = { startX: startingPosition.x, startY: startingPosition.y, node: target };
		this.props.onDragStart && this.props.onDragStart(e, data);
		this.dragging = true;

		const deltaX = Math.abs(target.offsetLeft - e.clientX);
		const deltaY = Math.abs(target.offsetTop - e.clientY);

		const onDrag = (e) => {
			if (this.dragging) {
				const currentPosition = {
					left: e.clientX - deltaX,
					top: e.clientY - deltaY
				};
				const data = { startX: startingPosition.left, startY: startingPosition.top, currentX: currentPosition.left, currentY: currentPosition.top, node: target };
				this.props.onDrag && this.props.onDrag(e, data);
				this.setState({
					left: currentPosition.left,
					top: currentPosition.top
				});
			}
		};

		const onDragEnd = (e) => {
			if (this.dragging) {
				const endPosition = {
					left: e.clientX - deltaX,
					top: e.clientY - deltaY
				};
				const data = { startX: startingPosition.left, startY: startingPosition.top, endX: endPosition.left, endY: endPosition.top, node: target };
				this.props.onDragEnd && this.props.onDragEnd(e, data);
				document.removeEventListener('mousemove', onDrag);
				document.removeEventListener('mouseup', onDragEnd);
				this.dragging = false;
			}
		};

		document.addEventListener('mousemove', onDrag);
		document.addEventListener('mouseup', onDragEnd);
	}

	shortcutHandler(e) {
		if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
			this.setState({
				left: this.state.left + 1
			});
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
			this.setState({
				left: this.state.left + 10
			});
		} else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
			this.setState({
				left: this.state.left - 1
			});
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
			this.setState({
				left: this.state.left - 10
			});
		} else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
			this.setState({
				top: this.state.top - 1
			});
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
			this.setState({
				top: this.state.top - 10
			});
		} else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
			this.setState({
				top: this.state.top + 1
			});
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
			this.setState({
				top: this.state.top + 10
			});
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowRight') {
			this.setState({
				width: this.state.width + 1
			});
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowRight') {
			this.setState({
				width: this.state.width + 10
			});
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowLeft') {
			this.setState({
				width: this.state.width - 1
			});
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowLeft') {
			this.setState({
				width: this.state.width - 10
			});
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowDown') {
			this.setState({
				height: this.state.height + 1
			});
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
			this.setState({
				height: this.state.height + 10
			});
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowUp') {
			this.setState({
				height: this.state.height - 1
			});
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
			this.setState({
				height: this.state.height - 10
			});
		}
	}

	onResizeStart(e) {
		const { target } = e;
		const data = { node: target.parentNode };
		const startingDimensions = target.parentNode.getBoundingClientRect().toJSON();
		this.props.onResizeStart && this.props.onResizeStart(e, data);
		this.resizing = true;


		const onResize = (e) => {
			if (this.resizing) {
				e.stopImmediatePropagation();
				if (target.id === 'br') {
					const currentDimensions = {
						width: e.clientX - startingDimensions.left,
						height: e.clientY - startingDimensions.top
					};

					const data = { currentWidth: currentDimensions.width, currentHeight: currentDimensions.height, node: target.parentNode };
					this.props.onResize && this.props.onResize(e, data);
					this.setState({
						width: currentDimensions.width,
						height: currentDimensions.height
					});
				} else if (target.id === 'bl') {
					const deltaX = startingDimensions.left - e.clientX;
					const deltaY = startingDimensions.top + startingDimensions.height - e.clientY;
					const currentDimensions = {
						width: startingDimensions.width + deltaX,
						height: startingDimensions.height - deltaY
					};

					const currentPosition = {
						top: startingDimensions.top,
						left: startingDimensions.left - deltaX
					};

					const data = { currentWidth: currentDimensions.width, currentHeight: currentDimensions.height, node: target.parentNode };
					this.props.onResize && this.props.onResize(e, data);
					this.setState({
						width: currentDimensions.width,
						height: currentDimensions.height,
						top: currentPosition.top,
						left: currentPosition.left
					});
				} else if (target.id === 'tr') {
					const deltaX = e.clientX - startingDimensions.left;
					const deltaY = startingDimensions.top - e.clientY;
					const currentDimensions = {
						width: deltaX,
						height: startingDimensions.height + deltaY
					};

					const currentPosition = {
						top: startingDimensions.top - deltaY,
						left: startingDimensions.left
					};

					const data = { currentWidth: currentDimensions.width, currentHeight: currentDimensions.height, node: target.parentNode };
					this.props.onResize && this.props.onResize(e, data);
					this.setState({
						width: currentDimensions.width,
						height: currentDimensions.height,
						top: currentPosition.top,
						left: currentPosition.left
					});
				} else if (target.id === 'tl') {
					const deltaX = startingDimensions.left - e.clientX;
					const deltaY = startingDimensions.top - e.clientY;
					const currentDimensions = {
						width: startingDimensions.width + deltaX,
						height: startingDimensions.height + deltaY
					};

					const currentPosition = {
						top: startingDimensions.top - deltaY,
						left: startingDimensions.left - deltaX
					};
					const data = { currentWidth: currentDimensions.width, currentHeight: currentDimensions.height, node: target.parentNode };
					this.props.onResize && this.props.onResize(e, data);
					this.setState({
						width: currentDimensions.width,
						height: currentDimensions.height,
						top: currentPosition.top,
						left: currentPosition.left
					});
				}
			}
		};

		const onResizeEnd = (e) => {
			if (this.resizing) {
				document.removeEventListener('mousemove', onResize);
				document.removeEventListener('mouseup', onResizeEnd);

				this.props.onResizeEnd && this.props.onResizeEnd(e);
				this.resizing = false;
			}
		};

		document.addEventListener('mousemove', onResize);
		document.addEventListener('mouseup', onResizeEnd);
	}

	render() {
		const { id, isSelected } = this.props;
		const boxClassNames = isSelected ? `${styles.box} ${styles.selected}` : styles.box;
		const boxStyles = {
			width: `${this.state.width}px`,
			height: `${this.state.height}px`,
			top: `${this.state.top}px`,
			left: `${this.state.left}px`
		};

		return <div
			className={boxClassNames}
			id={id}
			onClick={this.props.selectBox}
			onMouseDown={this.onDragStart}
			onKeyUp={this.shortcutHandler}
			onKeyDown={this.shortcutHandler}
			ref={this.box}
			style={boxStyles}
			tabIndex="0"
		>
			{
				isSelected ?
					RESIZE_HANDLES.map(handle => {
						const className = `${styles.resizeHandle} ${styles[`resize-${handle}`]}`;
						return <div key={shortid.generate()} className={className} onMouseDown={this.onResizeStart} id={handle} />
					}) :
					null
			}
		</div>;
	}
}

Box.propTypes = {
	defaultPosition: PropTypes.object.isRequired,
	id: PropTypes.string,
	isSelected: PropTypes.bool,
	drag: PropTypes.bool,
	resize: PropTypes.bool,
	rotate: PropTypes.bool,
	keybindings: PropTypes.bool,
	onRotateStart: PropTypes.func,
	onRotate: PropTypes.func,
	onRotateEnd: PropTypes.func,
	onResizeStart: PropTypes.func,
	onResize: PropTypes.func,
	onResizeEnd: PropTypes.func,
	onDragStart: PropTypes.func,
	onDrag: PropTypes.func,
	onDragEnd: PropTypes.func
};

export default Box;