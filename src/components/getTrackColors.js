export default (trackIndex) => {
    let rgb = null;

    switch(trackIndex){
      case 0:
        rgb = [255,0,0];
        break;
      case 1:
        rgb = [255,255,0];
        break;
      case 2:
        rgb = [0,255,255];
        break;
      case 3:
        rgb = [0,255,0];
        break;
      case 4:
        rgb = [255,0,255];
        break;
      default:
        rgb = [255,255,255];
        break;
    }

    return {
        indicator: {
          default: 'rgba(40, 40, 40, 0.3)',
          active: 'white',
        },
        segment: {
          default: 'rgba(40, 40, 40, 0.3)',
          selected: 'rgba(' + rgb.join(', ') + ', 0.2)',
          active: 'rgba(' + rgb.join(', ') + ', 1)'
        }
      };
  }