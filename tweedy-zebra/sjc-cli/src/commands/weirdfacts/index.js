"use strict";

/**
 * An example of a command that uses line buffering to output it's data, so that it can play nice with unix pipes
 * @arg {Number} - The number of weird facts you wish to display
 * @returns {String} - 4 weird facts per second
 * @note: this function has side effects: it console.logs.
 */

var facts = [
    'Russia has a larger surface area than Pluto.',
    'Oxford University is older than the Aztec Empire.',
    'France was still executing people by guillotine when Star Wars: A New Hope hit theatres.',
    'Nintendo was originally a trading card company.',
    'If the sun were the size of a white blood cell then the Milky Way Galaxy would be the size of the United States.',
    'There are more stars in space than there are grains of sand on every beach in the world.',
    'For every human on Earth there are 1.6 million ants.',
    'The total weight of all those ants, however, is about the same as all the humans.',
    'On Jupiter and Saturn it rains diamonds.',
    'Ten percent of all the photos ever taken were taken in the last 12 months.',
    'Shakespeare made up the name “Jessica” for his play Merchant of Venice.',
    'Your chances of being killed by a vending machine are actually twice as large as your chance of being bitten by a shark.',
    'Nowhere in the Humpty Dumpty Nursery Rhyme does it say that Humpty Dumpty is an egg.',
    'Armadillos almost always give birth to quadruplets.',
    'Scotland’s national animal is the unicorn.',
    'There are more fake flamingos in the world than real ones.',
    'John Tyler, the 10th president of the US, was born in 1790. He has a grandson that is alive today.',
    'A strawberry is NOT a berry.',
    'A banana IS a berry.',
    'There is enough water in Lake Superior to cover all of North and South America in one foot of liquid.',
    'An octopus has three hearts.',
    'There are 10 times more bacteria in your body than actual body cells.',
    'New York City is farther south than Rome, Italy',
    'Maine is the closest US state to Africa.'
];

const ms = 250;

var run = function(good,bad) {
    var n = this.args[0] || facts.length;
    n = Number(n);
    if (Number.isNaN(n)) {
        bad(Error('Argument must be a number'));
    } else {
        var showFact = function(fact,i) {
            console.log(fact);
            if (n - i <= 1) {
                good();
            }
        };
        facts.slice(0,n).forEach(function(fact,i) {
            setTimeout(showFact.bind(null,fact,i), i * ms);
        });
    }
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
