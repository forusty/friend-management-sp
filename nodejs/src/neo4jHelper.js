'use strict';
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://neo4j:7687", neo4j.auth.basic("neo4j", "neo4jsp"));
// const driver = neo4j.driver("bolt://localhost:17687", neo4j.auth.basic("neo4j", "neo4jsp"));

var neo4jHelper = {
    insertNode: function (callback, node) {
        const session = driver.session();
        const resultPromise = session.run(
            'CREATE (a:Person {name: $name, sex: $sex}) RETURN a',
            node
        );

        resultPromise.then(result => {
            session.close();
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            console.log(singleRecord);
            callback(null, node.properties);
            // on application exit:
            driver.close();
        });
    },
    dropDb: function (callback) {
        const session = driver.session();
        const resultPromise = session.run(
            'MATCH (n) DETACH DELETE n'
        );

        resultPromise.then(result => {
            session.close();
            console.log(result);
            // const singleRecord = result.records[0];
            // const node = singleRecord.get(0);
            // console.log(result);
            // callback(null, node);
            // on application exit:
            driver.close();
        });
    }
}

module.exports = neo4jHelper;