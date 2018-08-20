import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { IResponseMessage } from '../../../../src/utils/web/HTTPResponseHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

const dataservice = new DataService();

const createTable = async () => {
    const sqlQuery: ISqlQuery = {
        text: `CREATE TABLE public.test_table("testID" character varying(255) COLLATE pg_catalog."default" NOT NULL, 
            CONSTRAINT test_table_pkey PRIMARY KEY ("testID"))`
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

const deleteTable = async () => {
    const sqlQuery: ISqlQuery = {
        text: `DROP TABLE public.test_table`
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

const insertTestData = async () => {
    const sqlQuery: ISqlQuery = {
        text: `INSERT INTO test_table("testID") VALUES ($1);`,
        values: ['1234']
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

const clearTestData = async () => {
    const sqlQuery: ISqlQuery = {
        text: `DELETE FROM test_table`
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('A DataService', () => {
    after(async () => {
        await deleteTable();
    });

    before(async () => {
        await createTable();
    });
    describe('with a correct query', () => {
        afterEach(async () => {
            await clearTestData();
        });

        beforeEach(async () => {
            await insertTestData();
        });

        it('should return a success message when querying correctly the DB', () => {
            const sqlQuery: ISqlQuery = {
                text: `SELECT * FROM test_table`
            };

            const expectedQueryMessage: IResponseMessage = {
                success: true,
                status: 200,
                message: 'SQL Query completed successful.',
                data: [
                    {
                        testID: '1234'
                    }
                ]
            };

            return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
                expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
                expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
                expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
                expect(result).to.have.property('data').to.be.an('array').to.deep.equal(expectedQueryMessage.data);
            });
        });

        it('should return a success message when inserting correctly into the DB', () => {
            const sqlQuery: ISqlQuery = {
                text: `INSERT INTO test_table("testID") VALUES ($1) RETURNING *`,
                values: ['0000']
            };

            const expectedQueryMessage: IResponseMessage = {
                success: true,
                status: 201,
                message: 'SQL Insert Query completed successful.',
                data: [
                    {
                        testID: '0000'
                    }
                ]
            };

            return dataservice.executeQueryAsPromise(sqlQuery, true).then(result => {
                expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
                expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
                expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
                expect(result).to.have.property('data').to.be.an('array').to.deep.equal(expectedQueryMessage.data);
            });
        });
    });

    describe('with a wrong query', () => {
        beforeEach(async () => {
            await clearTestData();
        });

        it('should return a failed query message when there is no data in the DB', () => {
            const sqlQuery: ISqlQuery = {
                text: `SELECT * FROM test_table`
            };

            const expectedQueryMessage: IResponseMessage = {
                success: false,
                status: 204,
                message: 'SQL Query returned no data from database.'
            };

            return dataservice.executeQueryAsPromise(sqlQuery).then(res => {
                expect(res).to.have.property('success').that.is.equal(expectedQueryMessage.success);
                expect(res).to.have.property('status').that.is.equal(expectedQueryMessage.status);
                expect(res).to.have.property('message').that.is.equal(expectedQueryMessage.message);
            });
        });

        it('should return a failed query message when querying with syntax error', () => {
            const sqlQuery: ISqlQuery = {
                text: `WRONG QUERY`
            };

            const expectedRejectedMessage: IResponseMessage = {
                success: false,
                status: 400,
                message: `SQL Query failed. Reason: syntax_error`
            };

            return dataservice.executeQueryAsPromise(sqlQuery).then().catch(err => {
                expect(err).to.have.property('success').that.is.equal(expectedRejectedMessage.success);
                expect(err).to.have.property('status').that.is.equal(expectedRejectedMessage.status);
                expect(err).to.have.property('message').that.is.equal(expectedRejectedMessage.message);
            });
        });

        it('should return a failed query message when querying not existing table', () => {
            const sqlQuery: ISqlQuery = {
                text: `SELECT * FROM no_table`
            };

            const expectedRejectedMessage: IResponseMessage = {
                success: false,
                status: 400,
                message: `SQL Query failed. Reason: undefined_table`
            };

            return dataservice.executeQueryAsPromise(sqlQuery).then().catch(err => {
                expect(err).to.have.property('success').that.is.equal(expectedRejectedMessage.success);
                expect(err).to.have.property('status').that.is.equal(expectedRejectedMessage.status);
                expect(err).to.have.property('message').that.is.equal(expectedRejectedMessage.message);
            });
        });

        after(async () => {
            await clearTestData();
        });
    })
});