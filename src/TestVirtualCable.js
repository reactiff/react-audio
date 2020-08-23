import React from 'react';
export default (props) => {
    

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        

        navigator.mediaDevices.enumerateDevices()
            .then(function(devices) {
                devices.forEach(function(device) {
                    console.log(device.kind + ": " + device.label +
                                " id = " + device.deviceId);
                });
            })

        navigator.mediaDevices.getUserMedia({ audio: { deviceId: myPreferredCameraDeviceId } })
     
           // Success callback
           .then(function(stream) {
      
                debugger;
             
           })
     
           // Error callback
           .catch(function(err) {
              console.log('The following getUserMedia error occured: ' + err);
           }
        );
     } else {
        console.log('getUserMedia not supported on your browser!');
     }


    return null;
}