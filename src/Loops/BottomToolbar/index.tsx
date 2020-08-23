import React, { useRef } from 'react';
import {useState, useEffect, useMemo} from 'react';
import Mpg from '../../mpg/Mpg';
import Inline from '../../shared/Inline';
import { useWindowSize } from '../../hooks/Hooks';

export default (props: any) => {

    return (

        <Mpg.Flex className="toolbar bottom" row justifyContent="center" alignItems="flex-start" wide absolute anchorBottom>


            {/* RESTART */}
            <Mpg.Tag as="button" className="transparent button" grow
                // onClick={} 
                padding={5}
                textAlign="center"
                borderRadius="50%"
                >
                <Mpg.FontAwesomeIcon icon={'fast-backward'} size="2x"/>
            </Mpg.Tag>


            {/* PREV */}
            <Mpg.Tag as="button" className="transparent button" grow
                // onClick={} 
                padding={5}
                textAlign="center"
                borderRadius="50%"
                >
                <Mpg.FontAwesomeIcon icon={'angle-left'} size="2x"/>
            </Mpg.Tag>
                
            {/* PLAY STOP BUTTON */}
            <Mpg.Tag as="button" className="transparent button" grow
                onClick={props.handlePlayStop} 
                padding={5}
                textAlign="center"
                borderRadius="50%">
                {
                    props.playButton
                }
            </Mpg.Tag>

            {/* NEXT */}
            <Mpg.Tag as="button" className="transparent button" grow
                // onClick={} 
                padding={5}
                textAlign="center"
                borderRadius="50%"
                >
                <Mpg.FontAwesomeIcon icon={'angle-right'} size="2x"/>
            </Mpg.Tag>

            {/* REPEAT TOGGLE */}
            <Mpg.Tag as="button" className="transparent button" grow
                // onClick={} 
                padding={5}
                textAlign="center"
                borderRadius="50%"
                >
                <Mpg.div className="repeat-indicator">
                    &#10227;
                </Mpg.div>
            </Mpg.Tag>

        </Mpg.Flex>

    );
}