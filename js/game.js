// ============ GAME LOGIC ============

var game = null;
var board = null;

// Game state
window.side = null;
window.playerName = '';
window.gameMode = null;
window.player1Name = '';
window.player2Name = '';
window.moveCount = 0;
window.moveHistory = [];
window.lastMove = null;
window.lastSquareTo = null;
window.lastSquareFrom = null;
window.restartRequested = false;
window.restartAccepted = false;

// 3 Rules mode state
window.threeRulesEnabled = false;
window.whitePawnCenter = false;
window.whiteKnightCenter = false;
window.whiteCastling = false;
window.whiteCanChangeOnce = false;
window.whiteHasUsedChange = false;
window.blackPawnCenter = false;
window.blackKnightCenter = false;
window.blackCastling = false;
window.blackCanChangeOnce = false;
window.blackHasUsedChange = false;

// AI game state
window.isAIGame = false;
window.playerColor = 'w';
window.aiColor = 'b';

// Initialize the chess game
function initChessGame() {
  game = new Chess();

  board = ChessBoard('board', {
    draggable: true,
    moveSpeed: 'fast',
    snapbackSpeed: 200,
    snapSpeed: 100,
    position: 'start',
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  });

  updateTurnButton();
}

// Chess board event handlers
function onSnapEnd() {
  board.position(game.fen());
}

function onDragStart(source, piece, position, orientation) {
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

function onDrop(source, target) {
  // Check if it's player's turn in multiplayer mode
  if(window.gameMode === 'multiplayer' && game.turn() !== window.side) {
    return 'snapback';
  }

  // AI game: only allow player to move their pieces
  if(window.isAIGame && game.turn() !== window.playerColor) {
    return 'snapback';
  }

  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  highlight(move);
  updateMoveHistory(move);

  // Handle 3 Rules mode
  if(window.threeRulesEnabled) {
    handleSpecialMove(move);
  }

  // Send move to server in multiplayer mode
  if(window.gameMode === 'multiplayer') {
    sendMove(JSON.stringify(move));
  }

  // Make AI move if it's AI game
  if(window.isAIGame && game.turn() === window.aiColor) {
    setTimeout(makeRandomMove, 500);
  }

  return true;
}

// AI opponent - makes random legal move
function makeRandomMove() {
  var possibleMoves = game.moves();

  if (game.game_over() || possibleMoves.length === 0) return;

  var randomIdx = Math.floor(Math.random() * possibleMoves.length);
  var move = game.move(possibleMoves[randomIdx]);

  board.position(game.fen());
  highlight(move);
  updateMoveHistory(move);

  if(window.threeRulesEnabled) {
    handleSpecialMove(move);
  }
}

// Apply promotion
function applyPromotion(targetSquare, pieceType, color) {
  game.remove(targetSquare);
  game.put({type: pieceType, color: color}, targetSquare);
  board.position(game.fen());
}

// Apply special piece change
function applySpecialChange(specialChange) {
  game.remove(specialChange.square);
  var piece = board.position()[specialChange.square];
  if(piece) {
    var color = piece.color;
    game.put({type: specialChange.piece, color: color}, specialChange.square);
    board.position(game.fen());
  }
}

// Game control functions
function resetGame() {
  game = new Chess();
  board.position('start');
  window.gameMode = null;
  window.player1Name = '';
  window.player2Name = '';
  window.side = null;
  window.lastMove = null;
  window.lastSquareTo = null;
  window.lastSquareFrom = null;
  window.moveCount = 0;
  window.moveHistory = [];
  window.restartRequested = false;
  window.restartAccepted = false;
  resetThreeRulesState();

  $('#join').addClass('hidden');
  $('#username').addClass('hidden');
  $('#names').addClass('hidden');
  $('#turn').addClass('hidden');
  $('#resetBtn').hide();
  $('#restartBtn').hide();
  $('#restartRequest').addClass('hidden');
  $('#moveCounter').html('0');
  $('#moveHistory').html('');
  board.orientation('white');

  showModal('mainMenuModal');
}

function restartGame() {
  if(window.gameMode === 'singleplayer') {
    performRestart();
  } else if(window.gameMode === 'multiplayer') {
    window.restartRequested = true;
    window.restartAccepted = false;
    ws.send(JSON.stringify({restartRequest: true, player: window.playerName}));
    showToast('Restart request sent. Waiting for opponent confirmation...');
  }
}

function performRestart() {
  game = new Chess();
  board.position('start');
  window.lastMove = null;
  window.lastSquareTo = null;
  window.lastSquareFrom = null;
  window.restartRequested = false;
  window.restartAccepted = false;
  window.moveCount = 0;
  window.moveHistory = [];
  resetThreeRulesState();

  $('#moveCounter').html('0');
  $('#moveHistory').html('');
  $('#restartRequest').addClass('hidden');
  updateTurnButton();
}

function acceptRestart() {
  window.restartAccepted = true;
  $('#restartRequest').addClass('hidden');
  ws.send(JSON.stringify({restartAccepted: true, player: window.playerName}));

  if(window.restartRequested && window.restartAccepted) {
    performRestart();
  }
}

function rejectRestart() {
  window.restartRequested = false;
  window.restartAccepted = false;
  $('#restartRequest').addClass('hidden');
  ws.send(JSON.stringify({restartRejected: true, player: window.playerName}));
  showToast('Restart rejected');
}

function flipBoard() {
  board.flip();
}

function resetThreeRulesState() {
  window.whitePawnCenter = false;
  window.whiteKnightCenter = false;
  window.whiteCastling = false;
  window.whiteCanChangeOnce = false;
  window.whiteHasUsedChange = false;
  window.blackPawnCenter = false;
  window.blackKnightCenter = false;
  window.blackCastling = false;
  window.blackCanChangeOnce = false;
  window.blackHasUsedChange = false;
}
