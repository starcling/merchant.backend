import * as chai from 'chai';
import { IResponseMessage } from '../../../../src/utils/web/HTTPResponseHandler';
import { DataServiceEncrypted, ISqlQuery } from '../../../../src/utils/datasource/DataServiceEncrypted';

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const TEST_MNEMONIC = 'test test test test test test test test test test test test test test';

process.env.KEY_DB_HOST = 'localhost';
process.env.KEY_DB_PORT = '3305';
process.env.KEY_DB_USER = 'db_service';
process.env.KEY_DB_PASSWORD = 'db_pass';
process.env.KEY_DB_DATABASE = 'keys';

const dataservice = new DataServiceEncrypted();

const createAccountTable = async () => {
  const sqlQuery: ISqlQuery = {
    text:
      `CREATE TABLE test_account (
          id   INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
          address  VARCHAR(100) UNIQUE                 NOT NULL,
          privateKey     VARCHAR(2000)                    NULL
        )
        ENGINE = INNODB ENCRYPTION='Y';`
  };

  await dataservice.executeQueryAsPromise(sqlQuery);
}

const deleteAccountTable = async () => {
  const sqlQuery: ISqlQuery = {
    text: `DROP TABLE IF EXISTS test_account`
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
}

const insertTestAccountData = async () => {
  const sqlQuery: ISqlQuery = {
    text: `INSERT INTO test_account (address) VALUES (?);`,
    values: ['1234']
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
}

const clearTestAccountData = async () => {
  const sqlQuery: ISqlQuery = {
    text: `DELETE FROM test_account`
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
}

const insertEncryptedAccountData = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'call add_account(?, ?, ?)',
    values: ['test', 'testKey', 'merchantBackendEncrKey']
  }
  await dataservice.executeQueryAsPromise(sqlQuery);
}

const deleteEncryptedAccountData = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'delete from test_account where address=?',
    values: ['test']
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
}
const createMnemonicTable = async () => {
  const sqlQuery: ISqlQuery = {
    text:
      `CREATE TABLE test_mnemonic (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        mnemonic VARCHAR(2000) UNIQUE NOT NULL
      )
        ENGINE = INNODB ENCRYPTION='Y';`
  };

  await dataservice.executeQueryAsPromise(sqlQuery);
}

const deleteMnemonicTable = async () => {
  const sqlQuery: ISqlQuery = {
    text: `DROP TABLE IF EXISTS test_mnemonic`
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
}

const insertTestMnemonicData = async () => {
  const sqlQuery: ISqlQuery = {
    text: `INSERT INTO test_mnemonic (id, mnemonic) VALUES (?, ?);`,
    values: ['mnemonic_test_01', TEST_MNEMONIC]
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
}

const clearTestMnemonicData = async (id) => {
  const sqlQuery: ISqlQuery = {
    text: `DELETE FROM test_mnemonic where id = ?`,
    values: [id]
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
}

const insertEncryptedMnemonicData = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'call add_mnemonic(?, ?, ?)',
    values: ['mnemonic_test_02', TEST_MNEMONIC, 'merchantBackendEncrKey']
  }
  await dataservice.executeQueryAsPromise(sqlQuery);
}

const deleteEncryptedMnemonicData = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'delete from mnemonics WHERE id = ?',
    values: ['mnemonic_test_02']
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('Encrypted Data Service', async () => {
  before(async () => {
    await createAccountTable();
  })

  after(async () => {
    await deleteAccountTable();
  })

  describe('Incorect query', () => {
    it('should fail when the query syntaxt is not correct', () => {
      const sqlQuery: ISqlQuery = {
        text: 'SELECT from account',
        values: []
      }
      const expectedQueryMessage: IResponseMessage = {
        success: false,
        status: 400,
        message: 'SQL Query failed.'
      };

      return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
        expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
        expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
        expect(result).to.have.property('message');
        expect(result.message).to.satisfy(string => string.indexOf(expectedQueryMessage.message) > -1)
      })
    })
  });

  describe('Adding account data in incorrect format', () => {
    afterEach(async () => {
      await clearTestAccountData();
    });

    it('should return success when data is inserted', () => {
      const sqlQuery: ISqlQuery = {
        text: 'insert into test_account address, privateKey  values (?, ?)',
        values: ['test', 'test']
      }
      const expectedQueryMessage: IResponseMessage = {
        success: false,
        status: 400,
        message: 'SQL Query failed.'
      };

      return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
        expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
        expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
        expect(result).to.have.property('message');
        expect(result.message).to.satisfy(string => string.indexOf(expectedQueryMessage.message) > -1)
      })
    })
  });


  describe('Adding account data in correct format', () => {
    afterEach(async () => {
      await clearTestAccountData();
    })
    it('should return success when data is inserted', () => {
      const sqlQuery: ISqlQuery = {
        text: 'insert into test_account (address, privateKey)  values (?, ?)',
        values: ['test', 'test']
      }
      const expectedQueryMessage: IResponseMessage = {
        success: true,
        status: 201,
        message: 'SQL Insert Query completed successful.'
      };

      return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
        expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
        expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
        expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
      })
    })
  })

  describe('Query with no available data', () => {
    it('should return no data', () => {
      const sqlQuery: ISqlQuery = {
        text: 'SELECT * from test_account where address=?',
        values: ['cxcxxcxc']
      }
      const expectedQueryMessage: IResponseMessage = {
        success: false,
        status: 204,
        message: 'SQL Query returned no data from database.'
      };

      return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
        expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
        expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
        expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
      })
    })
  });

  describe('Retreiving existing account data', () => {
    beforeEach(async () => {
      await insertTestAccountData();
    })
    afterEach(async () => {
      await clearTestAccountData();
    })
    it('should return data', () => {
      const sqlQuery: ISqlQuery = {
        text: 'SELECT * from test_account',
        values: []
      }
      const expectedQueryMessage: IResponseMessage = {
        success: true,
        status: 200,
        message: 'SQL Query completed successful.'
      };

      return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
        expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
        expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
        expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
      })
    })
  });

  describe('Retreving non existing account data', () => {
    it('should return no data', () => {
      const sqlQuery: ISqlQuery = {
        text: 'SELECT * from test_account',
        values: []
      }
      const expectedQueryMessage: IResponseMessage = {
        success: false,
        status: 204,
        message: 'SQL Query returned no data from database.'
      };

      return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
        expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
        expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
        expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
      })
    })
  })

  describe('Private key encryption', () => {
    beforeEach(async () => {
      await insertEncryptedAccountData();
    })

    afterEach(async () => {
      await deleteEncryptedAccountData();
    })

    it('should add encrypted private key', () => {
      const sqlQuery: ISqlQuery = {
        text: 'select * from account where address=?',
        values: ['test']
      }
      const expectedQueryMessage: IResponseMessage = {
        success: true,
        status: 200,
        message: 'SQL Query completed successful.'
      };

      return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
        expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
        expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
        expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
        expect(result).to.have.property('data');
        expect(result.data).to.have.property('0');
        expect(result.data['0']).to.have.property('address').that.is.equal('test');
        expect(result.data['0']).to.have.property('privateKey').that.is.not.equal('testKey');
      })
    })

    it('should dencrypt private key', () => {
      const sqlQuery: ISqlQuery = {
        text: 'call get_private_key_from_address(?, ?)',
        values: ['test', 'merchantBackendEncrKey']
      }
      const expectedQueryMessage: IResponseMessage = {
        success: true,
        status: 200,
        message: 'SQL Query completed successful.'
      };

      return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
        expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
        expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
        expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
        expect(result).to.have.property('data');
        expect(result.data).to.have.property('0');
        expect(result.data['0']).to.have.property('@accountKey').that.is.equal('testKey');
      })
    })
  })

  describe('Mnemonic Phrase', async () => {
    before(async () => {
      await createMnemonicTable();
    });

    after(async () => {
      await deleteMnemonicTable();
    });

    describe('Adding mnemonic data in incorrect format', () => {
      afterEach(async () => {
        await clearTestMnemonicData('mnemonic_test_02');
      });

      it('should return success when data is inserted', () => {
        const sqlQuery: ISqlQuery = {
          text: 'insert into test_mnemonic id, mnemonic values (?, ?)',
          values: ['mnemonic_test_02', TEST_MNEMONIC]
        }
        const expectedQueryMessage: IResponseMessage = {
          success: false,
          status: 400,
          message: 'SQL Query failed.'
        };

        return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
          expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
          expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
          expect(result).to.have.property('message');
          expect(result.message).to.satisfy(string => string.indexOf(expectedQueryMessage.message) > -1)
        })
      })
    });

    describe('Adding mnemonic data in correct format', () => {
      afterEach(async () => {
        await clearTestMnemonicData('mnemonic_test_02');
      })
      it('should return success when data is inserted', () => {
        const sqlQuery: ISqlQuery = {
          text: 'insert into test_mnemonic (id, mnemonic) values (?, ?)',
          values: ['mnemonic_test_02', TEST_MNEMONIC]
        }
        const expectedQueryMessage: IResponseMessage = {
          success: true,
          status: 201,
          message: 'SQL Insert Query completed successful.'
        };

        return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
          expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
          expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
          expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
        });
      });
    });

    describe('Retreiving existing mnemonic data', () => {
      beforeEach(async () => {
        await insertTestMnemonicData();
      })
      afterEach(async () => {
        await clearTestMnemonicData('mnemonic_test_01');
      })
      it('should return data', () => {
        const sqlQuery: ISqlQuery = {
          text: 'SELECT * from test_mnemonic',
          values: []
        }
        const expectedQueryMessage: IResponseMessage = {
          success: true,
          status: 200,
          message: 'SQL Query completed successful.'
        };

        return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
          expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
          expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
          expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
        });
      });
    });

    describe('Retreving non existing mnemonic data', () => {
      it('should return no data', () => {
        const sqlQuery: ISqlQuery = {
          text: 'SELECT * from test_mnemonic',
          values: []
        }
        const expectedQueryMessage: IResponseMessage = {
          success: false,
          status: 204,
          message: 'SQL Query returned no data from database.'
        };

        return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
          expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
          expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
          expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
        })
      })
    })

    describe('Mnemonic encryption', () => {
      beforeEach(async () => {
        await insertEncryptedMnemonicData();
      })

      afterEach(async () => {
        await deleteEncryptedMnemonicData();
      })

      it('should add encrypted mnemonic', () => {
        const sqlQuery: ISqlQuery = {
          text: 'select * from mnemonics',
          values: []
        }
        const expectedQueryMessage: IResponseMessage = {
          success: true,
          status: 200,
          message: 'SQL Query completed successful.'
        };

        return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
          expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
          expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
          expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
          expect(result).to.have.property('data');
          expect(result.data).to.have.property('0');
          expect(result.data['0']).to.have.property('mnemonic').that.is.not.equal(TEST_MNEMONIC);
        });
      });

      it('should dencrypt mnemonic key', () => {
        const sqlQuery: ISqlQuery = {
          text: 'call get_decrypted_mnemonic(?, ?)',
          values: ['mnemonic_test_02', 'merchantBackendEncrKey']
        }
        const expectedQueryMessage: IResponseMessage = {
          success: true,
          status: 200,
          message: 'SQL Query completed successful.'
        };

        return dataservice.executeQueryAsPromise(sqlQuery).then(result => {
          expect(result).to.have.property('success').that.is.equal(expectedQueryMessage.success);
          expect(result).to.have.property('status').that.is.equal(expectedQueryMessage.status);
          expect(result).to.have.property('message').that.is.equal(expectedQueryMessage.message);
          expect(result).to.have.property('data');
          expect(result.data).to.have.property('0');
          expect(result.data['0']).to.have.property('@mnemonicKey').that.is.equal(TEST_MNEMONIC);
        });
      });
    });
  });
});

