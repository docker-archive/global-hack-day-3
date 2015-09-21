var commandName = 'dogsays';

describe(commandName+" suite",function(){
    
    var scope = require(__dirname+'/../../src/scope.js');
    var CommandConstructor = require(__dirname+'/../../src/Command.js');
    var command = require(__dirname+'/../../src/commands/'+commandName+'/index.js');
    scope.commandName = commandName;

    it('should say WOOF! WOOF!', function(done) {
        scope.args = ['woof','woof'];
        command(CommandConstructor,scope).then(function(bark){
            expect(bark).toMatch(/WOOF! WOOF!/);
            done();
        }).catch(function(err){
            expect('response').toNotBe('an error');
            done();
        });
    },scope.conf.test.timeout);

    it('should produce an error because dogs don`t say meow',function(done){
        scope.args = ['hissss','quack','meow'];
        command(CommandConstructor,scope).then(function(result){
            //	fail because we expected an error
            expect(result).toBe('an error');
            done();
        }).catch(function(result){
            expect(result instanceof Error).toBe(true);
            done();
        });
    },scope.conf.test.timeout);

});
