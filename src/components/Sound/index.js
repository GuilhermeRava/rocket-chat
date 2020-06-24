import React, { Component } from 'react';

export class Sound extends Component {
	play = () => {
		this.audio.play();
	}

	handleRef = (audio) => {
		this.audio = audio;
	}

	handlePlayProp = () => {
		const { play } = this.props;

		if (play) {
			this.audio.play();
		} else if (!this.audio.ended) {
			this.audio.pause();
			this.audio.currentTime = 0;
		}
	}

	componentDidMount() {
		this.handlePlayProp();
	}

	componentDidUpdate() {
		this.handlePlayProp();
	}

	render = () =>  {
		const { src, onStart, onStop } = this.props;
		return (
			<audio
				ref={this.handleRef}
				src={src}
				onPlay={onStart}
				onEnded={onStop}
				type="audio/mpeg"
			/>
		)
		}
}
