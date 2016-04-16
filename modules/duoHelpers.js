var knex = require('../db');

function getUser(username) {
  console.log('inside of getUser');
  return knex('users')
    .select('ID')
    .where('username', username)
}

// finds a duo in a specific table and returns the primary key (ID)
function findIDIn(table, uID1, uID2) {
  consol.log('inside of findIDIn');
  return knex(table)
    .select('ID')
    .whereIn('uID1', [uID1, uID2])
    .whereIn('uID2', [uID1, uID2])
    .then(function(resp) {
      if (resp.length) {
        return resp[0];
      } else {
        console.error('no user was found!');
      }
    });
}

function getUIDsOf(duoID) {
  console.log('inside of getUIDsOf');
  return knex('duos')
    .where('ID', duoID)
    .select('uID1', 'uID2')
    .then(function(resp) {
      return [resp.uID1, resp.uID2];
    });
}

function getDuo(duoID, uID1, uID2) {
  console.log('inside of getDuo');
  // takes in duoID OR uID1 & uID2.
  if (!duoID) {
    return knex('duos')
      .whereIn('uID1', [uID1, uID2])
      .whereIn('uID2', [uID1, uID2])
  } else {
    return knex('duos')
      .where('ID', duoID);
  }
}

function getDuoFrom(table, uID1, uID2) {
  console.log('inside of getDuoFrom');
  return knex('duos')
    .whereIn('uID1', [uID1, uID2])
    .whereIn('uID2', [uID1, uID2])
}

function getAllDuosOf(uID) {
  console.log('inside of getAllDuosOf');
  return knex('duos as d')
    .where('uID1', uID)
    .orWhere('uID2', uID)
    .join('users as u1', 'd.uID1', 'u1.ID')
    .join('users as u2', 'd.uID2', 'u2.ID')
    .select('d.ID as duoID',
            'd.status as status',
            'u1.ID as u1ID',
            'u1.firstname as u1fn',
            'u1.lastname as u1ln',
            'u2.ID as u2ID',
            'u2.firstname as u2fn',
            'u2.lastname as u2ln');
}

function getAllDuosIn(table, uID, pos) {
  console.log('inside of getAllDuosIn');
  // if position is specified ('uID1' or 'uID2')
  if (pos) {
    var target = (pos === 'uID1') ? 'uID2' : 'uID1';
    return knex(table + ' as d')
      .where(pos, uID)
      .join('users as u', 'd.' + target , 'u.ID')
      .select('u.ID', 'u.firstname', 'u.lastname');

  // otherwise, look for uID in both uID1 and uID2 columns.
  } else {
    return knex(table + ' as d')
      .where('uID1', uID)
      .orWhere('uID2', uID)
      .join('users as u1', 'd.uID1', 'u1.ID')
      .join('users as u2', 'd.uID2', 'u2.ID')
      .select('u1.ID as u1ID',
              'u1.firstname as u1fn',
              'u1.lastname as u1ln',
              'u2.ID as u2ID',
              'u2.firstname as u2fn',
              'u2.lastname as u2ln');
  }
}

function newDuoEntry(uID1, uID2) {
  console.log('inside of newDuoEntry');
  return insertDuoInto('duos', uID1, uID2).then(function() {
    return insertDuoInto('duosPen', uID1, uID2).then(function() {
      console.log('inserted duo into duos and duosPen');
    });
  });
}

function insertDuoInto(table, uID1, uID2) {
  console.log('inside of insertDuoInto');
  return knex(table).insert({
    uID1: uID1,
    uID2: uID2
  }).then(function(resp) {
    console.log('inserted users ' + uID1 + ' ' + uID2 + ' into ' + table + '. entry ID = ' + resp[0]);
    return updateStatus(table, uID1, uID2).then(function() {
      console.log('status updated inside of ' + table + ' for ' + uID1 + ' and ' + uID2);
    })
  });
}

function removeDuoFrom(table, uID1, uID2) {
  console.log('inside of removeDuoFrom');
  return getDuoFrom(table, uID1, uID2)
    .then(function(duo) {
      var ID = duo.ID;
      return knex(table).where('ID', ID).del()
        .then(function(resp) {
          return resp;
        });
    });
}

function moveDuo(tableFrom, tableTo, uID1, uID2) {
  console.log('inside of moveDuo');
  return removeDuoFrom(tableFrom, uID1, uID2)
    .then(function() {
      return insertDuoInto(tableTo, uID1, uID2);
    });
}

function updateStatus(newStatus, uID1, uID2) {
  console.log('inside of updateStatus');
  return getDuo(null, uID1, uID2).then(function(duo) {
    var ID = duo[0].ID;
    return knex('duos').where('ID', ID).update({
      status: newStatus
    }).then(function(resp) {
      return; // forces the query to run.
    });
  });
}

function swapUserIDs(duoID) {
  console.log('duoID = ', duoID);
  return getDuo(duoID).then(function(resp) {
    console.log('resp = ', resp);
    var uID1 = resp[0].uID1;
    var uID2 = resp[0].uID2;
    return knex('duos').where('ID', duoID).update({
      uID1: uID2,
      uID2: uID1
    }).then(function(resp) {
      return; // forces the query to run.
    });
  })
}

function acceptWing(uID1, uID2) {
  return moveDuo('duosPen', 'duosAcc', uID1, uID2);
}

function rejectWing(uID1, uID2) {
  return moveDuo('duosPen', 'duosRej', uID1, uID2);
}

function acceptCurWing(uID1, uID2) {
  return moveDuo('duosCurPen', 'duosCurAcc', uID1, uID2);
}

function rejectCurWing(uID1, uID2) {
  return removeDuoFrom('duosCurPen', uID1, uID2).then(function() {
    return updateStatus('duosAcc', uID1, uID2).then(function() {
      return; // forces query to run.
    });
  });
}

module.exports = {
  getDuo: getDuo,
  getUser: getUser,
  moveDuo: moveDuo,
  removeDuoFrom: removeDuoFrom,
  updateStatus: updateStatus,
  getAllDuosOf: getAllDuosOf,
  newDuoEntry: newDuoEntry,
  acceptWing: acceptWing,
  rejectWing: rejectWing,
  acceptCurWing: acceptCurWing,
  rejectCurWing: rejectCurWing,
  insertDuoInto: insertDuoInto,
  swapUserIDs: swapUserIDs
}
