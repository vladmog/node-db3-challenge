const knex = require('knex');

const config = require('../knexfile')

const db = knex(config.development)

module.exports = {
    find,
    findSteps,
    findById,
    findSteps,
    add,
    update,
    remove
}


// - `find()`:
//   - Calling find returns a promise that resolves to an array of all schemes in the database.
//   - No steps are included.

    function find(){
        return db('schemes')
    }


// - `findById(id)`:
//   - Expects a scheme `id` as its only parameter.
//   - Resolve to a single scheme object.
//   - On an invalid `id`, resolves to `null`.

    function findById(id){
        return db('schemes')
        .where({ id: id})
        .first()
    }

// - `findSteps(id)`:
//   - Expects a scheme `id`.
//   - Resolves to an array of all correctly ordered step for the given scheme: `[ { id: 17, scheme_name: 'Find the Holy Grail', step_number: 1, instructions: 'quest'}, { id: 18, scheme_name: 'Find the Holy Grail', step_number: 2, instructions: '...and quest'}, etc. ]`.
//   - This array should include the `scheme_name` _not_ the `scheme_id`.

    function findSteps(id){
        return db('schemes')
        .join('steps', 'schemes.id', 'steps.scheme_id')
        .where({scheme_id: id})
        .select('schemes.id', 'schemes.scheme_name', 'steps.step_number', 'steps.instructions')
        .orderBy('step_number')
    }

// - `add(scheme)`:
//   - Expects a scheme object.
//   - Inserts scheme into the database.
//   - Resolves to the newly inserted scheme, including `id`.

    function add(scheme){
        return db('schemes')
        .insert(scheme)
            .then(([id]) => {
                return findById(id)
            })
    }


// - `update(changes, id)`:
//   - Expects a changes object and an `id`.
//   - Updates the scheme with the given id.
//   - Resolves to the newly updated scheme object.

    function update(changes, id){
        return db('schemes')
        .where({id: id})
        .update(changes)
            .then(() => {
                return findById(id)
            })
    }


// - `remove(id)`:
//   - Removes the scheme object with the provided id.
//   - Resolves to the removed scheme
//   - Resolves to `null` on an invalid id.
//   - (Hint: Only worry about removing the `scheme`. The database is configured to automatically remove all associated steps.)

    function remove(id){
        return findById(id)
        .then((scheme) => {
            if (scheme){
                return db('schemes')
                .where({id: id})
                .del()
                .then(() => {
                    return scheme
                })
            } else {
                return null
            }
        }) 
    }
