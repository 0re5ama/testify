import { dateHelper } from '@/helpers';
import chai from 'chai';
import { describe, it } from 'mocha';

chai.should();

describe('Add Days', () => {
    describe('1d, new Date("2023-11-25")', () => {
        it('should return 2023-11-26', (done) => {
            const res = dateHelper.addDate('1d', new Date('2023-11-25'));
            res.should.deep.equal(new Date('2023-11-26'));
            done();
        });
    });
    describe('-1d, new Date("2023-11-25")', () => {
        it('should return 2023-11-24', (done) => {
            const res = dateHelper.addDate('-1d', new Date('2023-11-25'));
            res.should.deep.equal(new Date('2023-11-24'));
            done();
        });
    });
    describe('7d, new Date("2023-11-25")', () => {
        it('should return 2023-12-02', (done) => {
            const res = dateHelper.addDate('7d', new Date('2023-11-25'));
            res.should.deep.equal(new Date('2023-12-02'));
            done();
        });
    });
});

describe('Add Months', () => {
    describe('1m, new Date("2023-11-25")', () => {
        it('should return 2023-12-25', (done) => {
            const res = dateHelper.addDate('1m', new Date('2023-11-25'));
            res.should.deep.equal(new Date('2023-12-25'));
            done();
        });
    });
    describe('-1m, new Date("2023-11-25")', () => {
        it('should return 2023-10-25', (done) => {
            const res = dateHelper.addDate('-1m', new Date('2023-11-25'));
            res.should.deep.equal(new Date('2023-10-25'));
            done();
        });
    });
    describe('7m, new Date("2023-11-25")', () => {
        it('should return 2024-06-25', (done) => {
            const res = dateHelper.addDate('7m', new Date('2023-11-25'));
            res.should.deep.equal(new Date('2024-06-25'));
            done();
        });
    });
});

describe('Add Years', () => {
    describe('1y, new Date("2023-11-25")', () => {
        it('should return 2024-11-25', (done) => {
            const res = dateHelper.addDate('1y', new Date('2023-11-25'));
            res.should.deep.equal(new Date('2024-11-25'));
            done();
        });
    });
    describe('-1y, new Date("2023-11-25")', () => {
        it('should return 2022-11-25', (done) => {
            const res = dateHelper.addDate('-1y', new Date('2023-11-25'));
            res.should.deep.equal(new Date('2022-11-25'));
            done();
        });
    });
});
