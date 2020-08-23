import Easings from '../../shared/Easings'

export default class Primes {
    
    numbers: number[] = [];

    from: number;
    to: number;

    constructor(from: number, to: number) {

        this.from = from;
        this.to = to;

        const startNumber = Math.max(from, 2);
        const endNumber = to;

        for(let n = startNumber; n <= endNumber; n++) {
            if(Primes.isPrime(n)){
                this.numbers.push(n);
            }
        }

    }

    static isPrime(n: number) {
        for(let i = 2; i <= Math.sqrt(n); i++) {
            if(n % i === 0) return false; 
            return n > 1;
        }
    }

    getNearestPrime(seed: number) {

        const distances = this.numbers.map(prime => ({ prime: prime, diff: Math.abs(prime - seed)}))
        distances.sort((a, b) => a.diff - b.diff)

        return distances[0].prime

    }

    getFrequencyDistribution(numPoints: number, easing: string, integers: boolean, nearestPrimes: boolean){

        const MIN_SPREAD = 100;

        const randomStart =  Math.random() * ((this.to - this.from)/2) + this.from;
        const adjustedStart = Math.min(randomStart, this.to - MIN_SPREAD);

        const randomEnd =  Math.random() * (this.to - adjustedStart + MIN_SPREAD) + adjustedStart;
        const adjustedEnd = Math.min(randomEnd, this.to);

        const points = Easings.getDistributionCurve(easing, adjustedStart, adjustedEnd, numPoints);

        if(nearestPrimes){
            //this makes them inharmonic
            return points.map(point => this.getNearestPrime(point));
        }
        else if(integers) {
            return points.map(point => Math.round(point));
        }
        else{
            return points
        }
    }

    getHarmonicFrequencies(fundamental: number, ordinals: number[]) {

        const results = []

        for(let i = 2; i <= ordinals.length; i++) {
            results.push(fundamental * ordinals[i]);
        }

        return results;
    }

    tuneFrequencies(frequencies: number[], targetFrequency: number){

        //first sort the frequencies to get the lowest fundamental note
        frequencies.sort((a,b) => a - b);

        //The tuning factor can be expressed as the ratio of target freq to current fundamental
        const tuningFactor = targetFrequency / frequencies[0];

        //Now simply multiply each frequency by the common tuningFactor
        return frequencies.map(f => f * tuningFactor);

    }
}
