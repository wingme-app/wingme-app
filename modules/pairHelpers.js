var knex = require('../db');

function getPair(dID1, dID2) {
  return knex('pairs')
    .whereIn('dID1', [dID1, dID2])
    .whereIn('dID2', [did1, dID2])
    .then(function(resp) {
      if (resp.length) {
        return resp[0];
      } else {
        console.error('that pair was not found!');
        return false;
      }
    });
}

function getDuoID(uID) {
  return knex('duos')
    .where('status', 'duosCurAcc')
    .where('uID1', uID)
    .orWhere('uID1', uID)
    .select('ID')
    .then(function(resp) {
      if (resp.length) {
        return resp[0].ID;
      } else {
        throw 'couldn\'t find a duoID for clientID: ' + uID;
      }
    });
}

function getAllPairsOf(dID) {
  return knex('pairs')
    .where('dID1', dID)
    .orWhere('dID2', dID)
    .then(function(resp) {
      return resp;
    });
}

function updateStatus(status, dID1, dID2) {
  return knex('pairs')
  .whereIn('dID1', [dID1, dID2])
  .whereIn('dID2', [dID1, dID2])
  .update({ status: status })
}

function insertNewPair(dID1, dID2) {
  return insertInto('pairs', dID1, dID2).then(function() {
    return insertInto('pairsPending', dID1, dID2);
  });
}

function insertInto(table, dID1, dID2) {
  return knex(table).insert({
    dID1: dID1,
    dID2: dID2
  }).then(function() {
    return updateStatus(table, dID1, dID2).then(function() {
      return; // forces query to run
    })
  });
}

function removePairFrom(table, dID1, dID2) {
  return knex(table)
    .whereIn('dID1', [dID1, dID2])
    .whereIn('dID2', [dID1, dID2])
    .del()
    .then(function() {
      return; // forces query to run
    })
}

function movePair(tableFrom, tableTo, dID1, dID2) {
  return removePairFrom(tableFrom, dID1, dID2).then(function() {
    return insertInto(tableTo, dID1, dID2);
  });
}

function getUsersOf(duoIDs) {
  // expects duoIDs to be an array
  // returns duoID, duoImage, firstnames, and lastnames
  return knex('duos as d')
    .whereIn('d.ID', duoIDs)
    .join('users as u1', 'd.uID1', 'u1.ID')
    .join('users as u2', 'd.uID2', 'u2.ID')
    .select('d.ID as duoID',
            'd.imageURL',
            'u1.firstname as u1Firstname',
            'u1.lastname as u1Lastname',
            'u2.firstname as u2Firstname',
            'u2.lastname as u2Lastname')
    .then(function(resp) {
      return resp;
    });
}

function getAllDuos(clientID) {
  return knex('duos')
    .whereNot('uID1', clientID)
    .orWhereNot('uID2', clientID)
    .then(function(resp) {
      duos = resp.map(function(duo) {
        return duo.ID;
      });
      return getUsersOf(duos);
    });
}

module.exports = {
  getAllPairsOf: getAllPairsOf,
  getUsersOf: getUsersOf,
  getAllDuos: getAllDuos,
  getDuoID: getDuoID,
  movePair: movePair,
  insertNewPair: insertNewPair,
}
