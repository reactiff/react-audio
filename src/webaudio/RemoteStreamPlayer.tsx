import React from 'react';

type RemoteStreamPlayerProps = {
    url?: string
}

// CHECK OUT THIS ARTICLE ABOUT CAPTURING STREAM FROM AUDIO TAG
// https://stackoverflow.com/questions/42336604/can-i-record-the-output-of-an-audio-without-use-of-the-microphone

export default (props: RemoteStreamPlayerProps) => {
    const demoUrl = 'http://us4.internet-radio.com:8266/stream';
    return <audio controls src={props.url || demoUrl} />
}

