import bookingStatus from '@/database/enums/booking-status';
// import paymentMode from '@/database/enums/payment-mode';
import serviceType from '@/database/enums/service-type';
import { faker } from '@faker-js/faker';
import unit from '@/database/enums/unit';
// const { faker } = require('@faker-js/faker');

let bookingStatuses = Object.keys(bookingStatus);
let serviceTypes = Object.keys(serviceType);
// let paymentModes = Object.keys(paymentMode);
let units = Object.keys(unit);

export function createItem(booking) {
    let piece = faker.number.int({ min: 1, max: 100 });
    let unit = faker.helpers.arrayElement(units);
    let weight = faker.number.int({ min: 1, max: 100 });
    let rate = faker.number.int({ min: 100, max: 1000 });
    let total =
        unit == 'weight'
            ? weight * rate
            : unit == 'piece'
            ? piece * rate
            : rate;
    return {
        bookingId: booking.id,
        desc: faker.commerce.product(),
        piece,
        weight,
        unit,
        rate,
        total,
    };
}

export function createBooking(client, id) {
    let items = Array(Math.ceil(Math.random() * 10))
        .fill(0)
        .map((_) => createItem({ id }));
    let amt = items.reduce((a, b) => a + b.total, 0);
    let tax = +(amt * 0.13).toFixed(2);
    let stCharge = faker.number.int({ min: 500, max: 5000 });
    let otherCharge = faker.number.int({ min: 500, max: 5000 });
    let totAmt = amt + tax + stCharge + otherCharge;
    console.log(totAmt);
    return {
        id,
        consignmentNo: 230000000 + id,
        clientId: client.id,
        senderName: client.name,
        senderContactNo: client.contactNumber,
        senderEmail: client.email,
        senderPan: client.pan,
        receiverName: faker.person.fullName(),
        receiverContactNo: faker.string.numeric({ length: 10 }),
        receiverAddr: faker.location.streetAddress(),
        receiverPan: faker.string.numeric({ length: 10 }),
        serviceType: faker.helpers.arrayElement(serviceTypes),
        declaredValue: faker.number.int({ min: 500, max: 100000 }),
        refNo: faker.string.numeric({ length: 5 }),
        instruction: faker.lorem.sentence({ min: 4, max: 7 }),
        paymentMode: faker.helpers.arrayElement(['due', 'cod']),
        tax,
        stCharge,
        otherCharge,
        totAmt,
        status: 'booked',
        comment: faker.lorem.sentence({ min: 5, max: 10 }),
        originId: client.locationId,
        destinationId: 68 - client.locationId,
        currentLocationId: client.locationId,
        items,
    };
}

const bookingSeed = (clients) =>
    Array(100)
        .fill(0)
        .map((_, i) => {
            let client = clients[Math.floor(i / 10)];
            let booking = createBooking(client, i + 1);
            return booking;
        });

export default bookingSeed;
