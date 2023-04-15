import { SnakeGame } from "./snake";

window.onload = function(e)
{
   let game_container = document.getElementById('snake-game');
   if (game_container != null) {
      let game = new SnakeGame(game_container);
      game.init();
   }
}
