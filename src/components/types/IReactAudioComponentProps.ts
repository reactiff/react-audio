type IReactAudioComponentProps = {
    children?: any

    registerAudioNode: {(source: any): void}
    context?: AudioContext | any
    destination?: AudioDestinationNode | any //AudioContext | any
}

export default IReactAudioComponentProps
  