import { faker } from '@faker-js/faker';
// const { faker } = require('@faker-js/faker');

export function createClient(id, locationId) {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let contactPerson = [firstName, lastName].join` `;
    let email = faker.internet.email(firstName, lastName);
    return {
        id,
        locationId,
        name: faker.company.name(),
        contactPerson,
        contactNumber: faker.number.int({ min: 1e8, max: 1e10 }),
        address: faker.location.streetAddress(true),
        email: email,
        pan: faker.number.int({ min: 1e8, max: 1e9 - 1 }),
        status: true,
    };
}

const clientSeed = () =>  Array(10)
    .fill(0)
    .map((_, i) => createClient(i + 1, faker.helpers.arrayElement([67, 1])));

export default clientSeed;
