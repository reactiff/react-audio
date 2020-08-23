import FrequencyRange from '../webaudio/generators/FrequencyRange'
import Inline from '../shared/Inline'

export default function generateOscillators(options) {
    
    return new Promise((resolve, reject) => {

        const g = options;
        
        const [minCount, maxCount] = g.count

        const count = Math.round(Math.random() * (maxCount - minCount) + minCount);

        const results = []
        const generator = new FrequencyRange(g.range[0], g.range[1]);


        let frequencies = null;
        
        if(g.harmonicOrdinals && g.harmonicOrdinals.length){
            frequencies = generator.getHarmonicFrequencies(g.harmonicOrdinals);
        }
        else{
            frequencies = generator.getFrequencyDistribution(count, g.distributionCurve, g.useIntegers, g.usePrimes);
        }
        

        for(let i = 0; i < frequencies.length; i++){

            results.push({
                type: g.type,
                frequency: frequencies[i],
                gain: g.gain,
                prime: g.usePrimes
            })
        }
        
        resolve(results);
    });

}


