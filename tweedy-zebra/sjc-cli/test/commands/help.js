var commandName = 'help';

describe(commandName+" suite",function(){
    
    var scope = require(__dirname+'/../../src/scope.js');
    var CommandConstructor = require(__dirname+'/../../src/Command.js');
    var command = require(__dirname+'/../../src/commands/'+commandName+'/index.js');
    scope.commandName = commandName;

    it('shows general help',function(done){
        scope.args = [];
        command(CommandConstructor,scope).then(function(result){
            expect(result).toMatch(/sjc is a command line utility/);
            done();
        }).catch(function(err){
            //  fail on purpose
            expect('response').toBe('not an error');
            done();
        });
    },scope.conf.test.timeout);

    it('shows help on rot13',function(done){
        scope.args = ['rot13'];
        command(CommandConstructor,scope).then(function(result){
            expect(result).toMatch(/It takes lines of input as unix pipes, and returns those same lines rot13 encoded/);
            done();
        }).catch(function(err){
            expect(err).toBe('a valid result');
            done();
        });
    },scope.conf.test.timeout);

});
