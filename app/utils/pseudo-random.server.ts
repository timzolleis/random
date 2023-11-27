

export function randomTrue(){
    const minProbability = 0.2;
    const maxProbability = 0.4;
    const probabilityThreshold = Math.random() * (maxProbability - minProbability) + minProbability;
    return Math.random() <= probabilityThreshold;
}