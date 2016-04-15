function movePairToAccepted(targetDuoID, clientDuoID) {
  return knex('pairsAccepted')
    .insert({ dID1: targetDuoID, dID2: clientDuoID })
    .then(function() {
      return knex('pairsPending')
        .where({ dID1: targetDuoID, dID2: clientDuoID})
        .del();
    })
}

function deletePairFromPending(id) {
  return knex('pairsPending')
    .where({ ID: id })
    .del();
}

function insertPairInPP(clientDuoID, targetDuoID) {
  return knex('pairsPending')
    .insert({ dID1: clientDuoID, dID2: targetDuoID });
}

module.exports = {
  movePairToAccepted: movePairToAccepted,
  deletePairFromPending: deletePairFromPending,
  insertPairInPP: insertPairInPP
}
