// ============ 3 RULES MODE LOGIC ============

function isSpecialMove(move) {
  if(window.moveCount >= 10) return false;

  var piece = move.piece;
  var color = move.color;
  var from = move.from;
  var to = move.to;

  // 1. Detect castling
  if(move.flags.indexOf('k') !== -1 || move.flags.indexOf('q') !== -1) {
    return {type: 'castling', piece: piece, from: from, to: to, color: color};
  }

  // 2. Detect pawn to center
  if(piece === 'p' && (to === 'd4' || to === 'e4' || to === 'd5' || to === 'e5')) {
    return {type: 'pawnCenter', piece: piece, from: from, to: to, color: color};
  }

  // 3. Detect knight to center
  if(piece === 'n' && (to === 'c3' || to === 'f3' || to === 'c6' || to === 'f6' ||
                        to === 'd4' || to === 'e4' || to === 'd5' || to === 'e5')) {
    return {type: 'knightCenter', piece: piece, from: from, to: to, color: color};
  }

  return false;
}

function handleSpecialMove(move) {
  var special = isSpecialMove(move);

  if(!special) {
    checkForPieceChangeOpportunity(move);
    return;
  }

  // Register completed conditions by color
  if(special.type === 'castling') {
    if(special.color === 'w') {
      window.whiteCastling = true;
    } else {
      window.blackCastling = true;
    }
  } else if(special.type === 'pawnCenter') {
    if(special.color === 'w') {
      window.whitePawnCenter = true;
    } else {
      window.blackPawnCenter = true;
    }
  } else if(special.type === 'knightCenter') {
    if(special.color === 'w') {
      window.whiteKnightCenter = true;
    } else {
      window.blackKnightCenter = true;
    }
  }

  // Check if all conditions are met for a player
  var allWhiteConditions = window.whitePawnCenter && window.whiteKnightCenter && window.whiteCastling;
  var allBlackConditions = window.blackPawnCenter && window.blackKnightCenter && window.blackCastling;

  if(special.color === 'w' && allWhiteConditions && !window.whiteCanChangeOnce) {
    window.whiteCanChangeOnce = true;
    showToast('White has completed all 3 Rules conditions!', 5000);
  } else if(special.color === 'b' && allBlackConditions && !window.blackCanChangeOnce) {
    window.blackCanChangeOnce = true;
    showToast('Black has completed all 3 Rules conditions!', 5000);
  }
}

function checkForPieceChangeOpportunity(move) {
  var playerColor = move.color;
  var hasAllConditions = false;
  var hasUsedChange = false;

  if(playerColor === 'w') {
    hasAllConditions = window.whitePawnCenter && window.whiteKnightCenter && window.whiteCastling;
    hasUsedChange = window.whiteHasUsedChange;
  } else {
    hasAllConditions = window.blackPawnCenter && window.blackKnightCenter && window.blackCastling;
    hasUsedChange = window.blackHasUsedChange;
  }

  if(hasAllConditions && !hasUsedChange) {
    var choice = prompt('You have completed all conditions!\n\nDo you want to transform a piece?\n1. Type "change" to replace a piece\n2. Leave blank to continue normally', '');

    if(choice && choice.toLowerCase() === 'change') {
      performPieceChange(playerColor);
    }
  }
}

function performPieceChange(playerColor) {
  var square = prompt('Which square has the piece you want to change?\n(example: e2, d4, f3)', '');

  if(square && square.length === 2) {
    var newPiece = prompt('What piece do you want to change it to?\n(Type: q=Queen, r=Rook, b=Bishop, n=Knight, p=Pawn)', '');

    if(newPiece && (newPiece === 'q' || newPiece === 'r' || newPiece === 'b' || newPiece === 'n' || newPiece === 'p')) {
      var piece = game.get(square);
      if(piece && piece.color === playerColor) {
        game.remove(square);
        game.put({type: newPiece, color: piece.color}, square);
        board.position(game.fen());

        var pieceNames = {q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight', p: 'Pawn'};
        showToast('Piece at ' + square + ' transformed to: ' + pieceNames[newPiece], 5000);

        // Mark that this player has used their change
        if(playerColor === 'w') {
          window.whiteHasUsedChange = true;
        } else {
          window.blackHasUsedChange = true;
        }

        // Send the change to server if multiplayer
        if(window.gameMode === 'multiplayer') {
          ws.send(JSON.stringify({
            from: square,
            to: square,
            specialChange: {square: square, piece: newPiece},
            FEN: game.fen()
          }));
        }
      } else {
        showToast('Invalid square or not your piece');
      }
    }
  }
}
