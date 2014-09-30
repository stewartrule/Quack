(function () {

    'use strict';

    describe('For every object in the agenda array, all properties of the object should contain a date between a min and max date', function () {

        var response = quack.validate(config, {
            agenda: quack.all(
                quack.all(
                    quack.date({
                        min: new Date(2014, 3, 10, 13, 30),
                        max: new Date(2014, 3, 12, 13, 30)
                    })
                )
            )
        });

        console.log(response);

        it('the response should be invalid', function () {
            expect(response.valid).toBe(false);
        });

        it('there should be 5 invalid objects', function () {
            expect(response.errors.agenda.numErrors).toBe(5);
        });

    });

}());