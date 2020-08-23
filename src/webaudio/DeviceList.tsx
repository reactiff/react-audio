import React, { useEffect, useState } from 'react';
import ui from '../mpg/Mpg';
import Instrument from './Instrument';
import StreamPlayer from './StreamPlayer';
import Analyzer from './Analyzer';

export default (props: any) => {

    const [devices, setDevices] = useState<any>();
    const [deviceId, setDeviceId] = useState<any>();
    
    useEffect(() => {
        if(props.context){
            if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
                throw new Error('This browser is not supported. MsgId: 65536');
            }
            navigator.mediaDevices.enumerateDevices().then(setDevices);
        }
        
    }, [props.context]);
    
    return (
        <div className="device-list">

            {
                deviceId &&
                <Instrument context={props.context} target={props.target}>
                    <Analyzer type="wave" margin={20} />
                    <Analyzer type="bar" margin={20} />
                    <StreamPlayer deviceId={deviceId} />
                </Instrument>
                
            }

            {
                devices &&
                devices.map((d: MediaDeviceInfo, i: number) => (
                    <ui.Flex key={i} row className="solid" marginBottom={1} padding={15}>

                        <ui.Flex column>

                            <ui.Flex row padded alignItems="center">
                                <strong>Media Device</strong>
                                <ui.Button link onClick={() => {
                                    setDeviceId(d.deviceId)
                                }}>Select</ui.Button>
                            </ui.Flex>
                            
                            <ui.div marginLeft={1}>kind: {d.kind}</ui.div>
                            <ui.div marginLeft={1}>id: {d.deviceId}</ui.div>
                        </ui.Flex>

                    </ui.Flex>
                ))
            }
        </div>
    );
}