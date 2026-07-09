class VideoVisibilityManager {
  constructor() {
    this.currentPlayer = null;
  }

  play(player) {
    if (!player) return;

    // Same player already playing
    if (this.currentPlayer === player) return;

    // Pause previous player
    if (this.currentPlayer) {
      this.currentPlayer.pause();
    }

    this.currentPlayer = player;

    player.play();
  }

  pause(player) {
    if (!player) return;

    player.pause();

    if (this.currentPlayer === player) {
      this.currentPlayer = null;
    }
  }
}

export default new VideoVisibilityManager();